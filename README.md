# Mental Health Chat App 🧠💬

A web-based anonymous chat app with built-in sentiment analysis and empathetic responses, designed to support users' mental well-being.

---

## 🚀 Features

- Anonymous chat with empathetic AI
- Sentiment analysis: positive, negative, neutral, or crisis
- Mood trend visualization (coming soon!)
- Persona options: calm therapist, supportive friend, motivational coach
- Gemini + Groq LLM fallback for reliable responses

---

## 🖥️ Tech Stack

- **Frontend:** Vite + React + TypeScript + Tailwind CSS  
- **Backend:** Node.js + Express  
- **AI APIs:** Gemini (Google) + Groq (LLaMA)  
- **Database:** Supabase (PostgreSQL)  
- **Hosting:** [Add hosting info]

---

## 📦 Installation

git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
Create a .env file with your API keys:
GEMINI_KEY=your_gemini_key
GROQ_KEY=your_groq_key

Then run:
npm run dev   # or npm start
📄 API Structure
POST /chat
Request:

json
{
  "message": "I'm feeling low today.",
  "timestamp": "2025-07-04T12:00:00Z",
  "persona": "calm-therapist",
  "messageHistory": [
    {
      "sender": "user",
      "content": "Hi, I need someone to talk to.",
      "timestamp": "2025-07-04T11:55:00Z"
    }
  ]
}
Response:

json
{
  "response": "I'm here for you. Would you like to share more about what's troubling you?",
  "sentiment": "negative",
  "timestamp": "2025-07-04T12:00:01Z"
}
📌 TODO
 Add Gemini fallback to Groq

 Markdown formatting for bot replies

 Add mood graph

 User authentication (optional)

🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

