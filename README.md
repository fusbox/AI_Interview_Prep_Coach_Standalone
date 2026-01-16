# AI Interview Coach: Ready2Work

**Master your next interview with hyper-realistic AI coaching.**
Ready2Work's Interview Coach is a production-grade interview preparation platform that uses advanced AI to simulate real interview scenarios, analyze your verbal performance, and provide competent, actionable feedback.

![Dashboard Preview](./public/dashboard-preview.png) *(Note: Placeholder for actual screenshot)*

## 🚀 Key Features

### 🧠 Competency-Driven Intelligence
*   **Dynamic Blueprints**: Every session generates a unique "Competency Blueprint" based on the specific Job Role or Description.
*   **Targeted Questioning**: Questions are generated to probe specific skills (e.g., "Conflict Resolution" for PMs, "System Design" for Engineers).
*   **Adaptive Reading Level**: Questions and feedback automatically adapt tone and complexity to match the role (Entry-level vs. Executive).

### 🎙️ Immersive "Glass" Interface
*   **Voice-First Interaction**: Speak your answers naturally. The AI utilizes **Speech-to-Text** to transcribe and analyze your response in real-time.
*   **AI Voice**: Questions are narrated by a lifelike AI voice (Google Gemini Audio) for a true conversational feel.
*   **Premium UI**: Built with a modern, dark-mode "Glassmorphism" aesthetic using Tailwind CSS and Framer Motion.

### 📊 Deep Performance Analysis
Unlike generic tools, Ready2Work provides granular, structured feedback:
*   **Dimension Scoring**: Scores you on specific competencies (e.g., "Technical Depth", "Communication") relevant *only* to the question asked.
*   **Logical Feedback Chain**:
    1.  **Missing Signals**: Identifies key professional concepts you missed.
    2.  **One Big Upgrade**: select the single most critical gap to fix.
    3.  **"Try Saying This"**: Generates a script demonstrating exactly how to fix that upgrade.
*   **Conditional Depth**:
    *   **High Scores (80+)**: Brief validation.
    *   **Mid Scores (60-79)**: Validation + 1 actionable tip.
    *   **Low Scores (<60)**: Detailed remediation advice.

### 📈 Dashboard & History
*   **Session Persistence**: All sessions are saved (Supabase for users, Local Encrypted Storage for guests).
*   **Accordion Insights**: Expand any past session directly from the dashboard to review full transcripts and AI analysis without leaving the page.
*   **Resume Builder**: (Beta) Integrated tools to help you get ready for the application phase.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: [React 19](https://react.dev/) (Vite)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Custom Glass UI System
*   **Animation**: [Framer Motion](https://www.framer.com/motion/)
*   **Icons**: [Lucide React](https://lucide.dev/)

### Backend & AI
*   **AI Model**: [Google Gemini 2.5 Flash](https://deepmind.google/technologies/gemini/) (Multimodal: Audio/Text)
*   **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + GoTrue)
*   **Serverless**: Vercel Serverless Functions (`/api`)

---

## 📦 Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   Gemini API Key (Google AI Studio)
*   Supabase Project (URL + Anon Key)

### Quick Start

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/ai-interview-coach.git
    cd ai-interview-coach
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root based on `.env.example`:
    ```env
    # Supabase (Auth & Data)
    VITE_SUPABASE_URL=https://your-project.supabase.co
    VITE_SUPABASE_ANON_KEY=your-anon-key-here
    
    # Google Gemini AI (Server-side)
    GEMINI_API_KEY=your-gemini-key-here
    ```

4.  **Run Locally**
    ```bash
    npm run dev
    ```
    Visit `http://localhost:5173` to start practicing.

---

## 📂 Project Structure

```
/src
 ├── /api            # Serverless functions (Gemini interaction)
 ├── /components     
 │    ├── /ui/glass  # Custom Glassmorphic Component Library
 │    └── ...
 ├── /pages          # Key Views (Dashboard, Interview, Review)
 ├── /services       # Logic Layers (Storage, Gemini, Audio)
 ├── /types          # Shared TypeScript Interfaces (Blueprints, Analysis)
 └── /utils          # Helpers (Encryption, Auth)
```

## 🔒 Privacy & Security

*   **Audio Privacy**: Raw user audio is processed for transcription and then **immediately discarded**. It is never stored permanently.
*   **Guest Mode**: Guest data is stored in **Local Storage** using AES encryption and never touches the cloud database.
*   **Authenticated Mode**: User data is secured via Supabase Row Level Security (RLS).

## 📄 License
MIT