import { GoogleGenAI, Type } from "@google/genai";
import { validateUser } from "./utils/auth.js";

export default async function handler(req, res) {
    // CORS Preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // 0. Auth Validation
        await validateUser(req);

        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }

        const { role, jobDescription, questionPlan, blueprint, subsetIndices } = req.body || {};

        if (!role) {
            return res.status(400).json({ error: 'Missing "role" in request body' });
        }

        console.log(`[GenerateQuestions] Role: ${role}, HasPlan: ${!!questionPlan}, Indices: ${JSON.stringify(subsetIndices)}`);

        // Optimization: Filter plan if specific indices requested
        if (questionPlan && Array.isArray(subsetIndices)) {
            const originalLength = questionPlan.questions.length;
            questionPlan.questions = questionPlan.questions.filter((_, idx) => subsetIndices.includes(idx));
            console.log(`[GenerateQuestions] Filtered plan from ${originalLength} to ${questionPlan.questions.length} items.`);
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Server Error: GEMINI_API_KEY is missing");
            return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
        }

        const ai = new GoogleGenAI({ apiKey });

        const readingLevelContext = blueprint?.readingLevel
            ? `
    READING LEVEL:
    - Mode: ${blueprint.readingLevel.mode}
    - Max Sentence Words: ${blueprint.readingLevel.maxSentenceWords}
    - Avoid Jargon: ${blueprint.readingLevel.avoidJargon}
        `
            : `
    IMPORTANT: Adapt the reading level of the questions to the target candidate profile for a ${role}.
    - If the role is entry-level (e.g., Cashier): STRICTLY use a 6th-7th grade reading level.
    - If the role is highly technical/executive: Use appropriate professional terminology but keep phrasing clear.
    - When in doubt: Prioritize simplicity.
        `;

        let promptInfo = "";
        let schema;

        if (questionPlan) {
            // New Flow: Generate Text from Plan
            promptInfo = `
CONVERT THIS PLAN INTO INTERVIEW QUESTIONS.
PLAN:
${JSON.stringify(questionPlan)}

CONSTRAINTS:
- Create exactly ${questionPlan.questions.length} questions.
- Match ids to plan ids.
- Ensure text accurately reflects the "intent" and "competency".
- Keep questions concise.
            `;

            schema = {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        text: { type: Type.STRING },
                        // Pass through metadata
                        competencyId: { type: Type.STRING },
                        type: { type: Type.STRING },
                        difficulty: { type: Type.STRING },
                        intent: { type: Type.STRING }
                    },
                    required: ["id", "text"]
                }
            };

        } else {
            // Legacy / Quick Flow
            promptInfo = jobDescription
                ? `Generate 5 interview questions for a ${role} position based on this job description:\n\n${jobDescription}\n\nQuestions should test skills mentioned in the JD. Return strictly JSON.`
                : `Generate 5 common interview questions for a ${role} position. The questions should be diverse (behavioral, technical, situational). Return strictly JSON.`;

            schema = {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        text: { type: Type.STRING },
                    },
                    required: ["id", "text"],
                },
            };
        }

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `${readingLevelContext}\n\n${promptInfo}`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                },
            });

            const text = response.text;
            if (!text) throw new Error("No text returned from Gemini");

            const questions = JSON.parse(text);

            // If using plan, merge plan metadata if model missed it (safety net)
            if (questionPlan) {
                const finalQuestions = questions.map(q => {
                    const planItem = questionPlan.questions.find(p => p.id === q.id);
                    if (planItem) {
                        return {
                            ...q,
                            competencyId: planItem.competencyId,
                            type: planItem.type,
                            difficulty: planItem.difficulty,
                            intent: planItem.intent
                        };
                    }
                    return q;
                });
                return res.status(200).json(finalQuestions);
            }

            return res.status(200).json(questions);

        } catch (error) {
            console.error("Error generating questions:", error);
            return res.status(500).json({ error: 'Failed to generate questions', details: error.message });
        }
    } catch (error) {
        console.error("Handler Error:", error);
        if (error.message.includes("Authorization") || error.message.includes("Token")) {
            return res.status(401).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
