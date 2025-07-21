# 🧠💬 Mental Health Chat App  

A web-based anonymous chat app offering empathetic AI responses, real-time sentiment analysis, and mood tracking—designed to support users' mental well-being.

## 🚀 Features  
- ✅ Anonymous chat with empathetic AI  
- ✅ Real-time sentiment analysis (positive/negative/neutral/crisis)  
- ✅ Persona selection:  
  - Calm Therapist  
  - Supportive Friend  
  - Motivational Coach  
- 🔄 Gemini + Groq LLM fallback for reliability  
- 📈 Mood trend visualization (*coming soon*)  

## 🖥️ Tech Stack  
**Frontend**:  
Vite + React + TypeScript + Tailwind CSS  

**Backend**:  
Node.js + Express  

**AI APIs**:  
Google Gemini + Groq (LLaMA)  

**Database**:  
Supabase (PostgreSQL)  

**Hosting**:  
[Add hosting platform info here]  

## 📦 Installation  

```clone
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
```

## 🚀 Getting Started

### 🛠️ Environment Variables

Make sure to set the following in your `.env` file:

```env
GEMINI_KEY=your_gemini_key
GROQ_KEY=your_groq_key
```

---

### ▶️ Run the App

```bash
npm run dev  # or npm start
```

---

## 📡 API Usage

### 📨 API Request Example

```json
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
```

### 📬 API Response Example

```json
{
  "response": "I'm here for you. Would you like to share more about what's troubling you?",
  "sentiment": "negative",
  "timestamp": "2025-07-04T12:00:01Z"
}
```

---

## 🌟 Features

- 💬 Anonymous chatting
- ❤️ Empathetic AI responses
- 📈 Mood trend analysis
- 🧘 Multiple personas like calm-therapist

---

📌 TODO
Add Gemini fallback to Groq

Markdown formatting for bot replies

Add mood graph visualization

Optional user authentication

🤝 Contributing
Pull requests are welcome!
For major changes, please open an issue first to discuss your ideas.
