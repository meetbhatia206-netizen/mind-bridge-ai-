# Serenity - AI for Social Good Mental Wellness Assistant

**Serenity** is an AI-powered emotional wellness and mental support chatbot built on top of a premium, calming UI. It provides a safe, interactive, and comforting space for users to explore their feelings, handle student burnout, anxiety, sleep problems, and overthinking.

This project was built focusing on **AI for Social Good**, providing lightweight, local, and accessible mental wellness guidance.

## How Gemini CLI was used in development workflow

This project was developed leveraging Gemini CLI powered workflow assistance as required by the competition guidelines. The AI workflow was integral in structuring the conversational guidance and generating the chatbot's empathetic logic.

*   **Prompt Engineering:** Used advanced prompt techniques to craft the human-like, supportive responses for the chatbot UI, ensuring the tone was consistently empathetic.
*   **Conversational AI Flow Generation:** The Gemini CLI assisted in designing decision-based conversation logic. For example, branching the flow for "Student Burnout" to ask specifically about exams, sleep, and emotional exhaustion.
*   **AI-assisted Guidance Structure:** The structure of the final "Smart Wellness Guide" was generated using AI, pulling best practices for stress management, sleep hygiene, and emotional support, transforming raw user inputs into a caring, actionable mentor-like guide using the Live Gemini API.
*   **Open-source AI workflow structure:** Integrated an open-source friendly, local Node.js backend that securely interfaces with the Gemini API.

## Setup Instructions

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

1.  Navigate to the `backend` directory in your terminal:
    \`\`\`bash
    cd backend
    \`\`\`
2.  Install the required dependencies:
    \`\`\`bash
    npm install
    \`\`\`
3.  Ensure your Gemini API key is set in `summaryGenerator.js` or in your `.env`.

## Local Run Instructions

1.  Start the backend server:
    \`\`\`bash
    cd backend
    npm run dev
    # or
    node server.js
    \`\`\`
    The server will run on \`http://localhost:3000\`.
2.  Open the frontend interface:
    Simply double-click the \`index.html\` file located in the \`frontend/\` directory to open it in your default web browser. Click any of the support cards to interact with the AI assistant.

## Features

*   **Interactive Chatbot:** A smooth, floating AI chat assistant integrated into a premium UI.
*   **Smart AI Flow:** Decision-based conversation logic that adapts to the user's specific mental wellness needs.
*   **Complex Term Explanation:** Automatically explains psychological terms (e.g., Burnout, Panic Attack) before asking related questions.
*   **Human-Like Responses:** Supportive, conversational tone that validates the user's feelings.
*   **Smart Wellness Guide:** Generates a structured, personalized guide with actionable tips at the end of the conversation via the Gemini API.
