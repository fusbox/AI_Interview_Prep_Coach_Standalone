# AI Interview Coach

A robust, voice-activated interview preparation tool designed to help job seekers practice, refine, and master their interview skills.

Built with **React** and powered by **Google's Gemini 2.5 Flash**, this application provides a realistic mock interview experience with real-time, constructive AI feedback on both content and delivery.

## 🚀 Features

* **Role-Specific Question Generation:** Instantly generates relevant interview questions for various roles (e.g., Data Analytics, UX Design, Project Management) using the Gemini API.
* **Voice-First Interface:** Users answer questions verbally, simulating a real interview environment.
* **Real-Time Audio Visualization:** Provides visual feedback during recording to ensure microphone activity.
* **Instant AI Analysis:**
    * **Transcription:** Converts speech to text for self-review.
    * **Content Feedback:** Analyzes answers for clarity, structure (STAR method), and relevance.
    * **Key Term Extraction:** Identifies professional keywords used in the response.
    * **Rating System:** Grades answers as "Strong," "Good," or "Needs Practice."
* **Comprehensive Session Summary:**
    * **Readiness Score:** A visual circular metric indicating overall preparedness.
    * **Performance Breakdown:** High-level stats on strong vs. weak answers.
    * **Detailed Review:** An interactive accordion view to drill down into transcripts and specific feedback for every question.

## 🛠️ Tech Stack

* **Frontend Framework:** React 19
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **AI Integration:** Google GenAI SDK (`@google/genai`)
* **Icons:** Lucide React
* **Language:** TypeScript

## 📦 Installation & Setup

### Prerequisites
* Node.js (v18 or higher)
* A Google Gemini API Key (Get one at [aistudio.google.com](https://aistudio.google.com/))

### Steps

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd ai-interview-coach
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env.local` file in the root directory and add your API keys:
    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    # Optional for natural voice narration (serverless TTS)
    ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
    ELEVENLABS_VOICE_ID=optional_voice_id_override
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    Open your browser to `http://localhost:3000` (or the port shown in your terminal).

## 📖 Usage Guide

1.  **Select a Role:** Choose your target job field (e.g., "Digital Marketing") from the dashboard.
2.  **Answer Questions:** The AI will present a question. Click the microphone icon to record your verbal answer.
3.  **Review Feedback:** Immediately after answering, view your transcript and get specific AI coaching tips.
4.  **Iterate:** Choose to "Retry" the question to apply the feedback immediately, or move to the next one.
5.  **View Summary:** After completing the session, review your "Readiness Score" and a holistic breakdown of your performance.

### 🔊 Natural Voice Narration (Non-Browser TTS)

The app can narrate questions using a high-quality neural voice via a serverless function (not the built‑in browser `speechSynthesis`).

1. Set `ELEVENLABS_API_KEY` (and optionally `ELEVENLABS_VOICE_ID`) in your Vercel project Environment Variables. For local dev also add them to `.env.local`.
2. Deploy (or run locally) – the serverless function at `/api/tts` will proxy secure TTS requests.
3. Click "Play Voice" on a question to fetch and stream the synthesized audio.

If no TTS env vars are set, the narration button will show a loading state then do nothing.

You can swap providers later (e.g. OpenAI, Azure, Google Cloud TTS) by editing `api/tts.ts` and adjusting headers/payload.

## 📂 Project Structure

/src ├── /components # UI components (QuestionCard, AudioVisualizer, Icons, etc.) ├── /services # API logic (geminiService.ts) ├── App.tsx # Main application logic and screen routing ├── types.ts # TypeScript interfaces and constants └── main.tsx # Entry point


## 🛡️ Privacy Note

This application processes audio locally to create a blob, which is then sent securely to the Gemini API for analysis. Audio data is not permanently stored on any server by this application.

## 📄 License

MIT