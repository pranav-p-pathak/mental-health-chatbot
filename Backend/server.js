const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 API keys
require('dotenv').config();

const GEMINI_KEYS = process.env.GEMINI_KEYS.split(',');
const GROQ_KEY = process.env.GROQ_KEY;
// 🔐 Supabase setup
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

// 🧠 Persona styles
const personaPrompts = {
  'calm-therapist': 'You are a calm, empathetic therapist. Provide supportive and non-judgmental responses.',
  'supportive-friend': 'You are a friendly, caring companion. Respond in a warm, comforting tone.',
  'motivational-coach': 'You are a motivational coach. Encourage and uplift the user with energetic positivity.',
};

// ✅ JWT middleware
function verifySupabaseToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const payload = jwt.verify(token, SUPABASE_JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

// ✅ Supabase message storage
async function storeMessage(userId, role, content, timestamp, persona = null, sender = null, message_id = null, conversation_id = null) {
  const payload = {
    user_id: userId,
    role,
    content,
    timestamp,
    persona,
    sender,
    message_id,
    conversation_id
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) console.error('❌ Failed to store message:', await res.text());
}


// ✅ Supabase history fetch
async function fetchRecentMessages(userId, limit = 10) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/messages?user_id=eq.${userId}&order=timestamp.desc&limit=${limit}`, {
    headers: {
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
    }
  });
  const data = await res.json();
  return data.reverse(); // Chronological order
}

// 🔁 Gemini call
async function tryGeminiAPI(payload) {
  for (const key of GEMINI_KEYS) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) return await res.json();
      console.warn(`⚠️ Gemini key failed (${key}):`, await res.text());
    } catch (err) {
      console.error(`❌ Gemini key error (${key}):`, err.message);
    }
  }
  throw new Error('All Gemini API keys failed');
}

// 🧠 Groq fallback
async function callGroqAPI(prompt) {
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: false
      })
    });

    if (!res.ok) throw new Error(`Groq API failed: ${res.statusText}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || 'Groq did not return a response.';
  } catch (err) {
    console.error('Groq API error:', err.message);
    return 'Sorry, something went wrong with Groq.';
  }
}

// ✨ Clean bot reply
function cleanBotReply(text) {
  return text.replace(/^Bot:\s*/i, '').replace(/\*([^*]+)\*/g, '**$1**').trim();
}

// 📩 Chat route (now secured)
app.post('/chat', verifySupabaseToken, async (req, res) => {
  const userId = req.user.sub;
  const { message, timestamp, persona } = req.body;

  const personaInstruction = personaPrompts[persona] || personaPrompts['calm-therapist'];

  // 🔁 Fetch last 10 messages from Supabase
  const messageHistory = await fetchRecentMessages(userId);
  const chatHistoryText = messageHistory.map(msg =>
    `${msg.role === 'user' ? 'User' : 'Bot'}: ${msg.content}`
  ).join('\n');

  const finalPrompt = `${personaInstruction}\n${chatHistoryText}\nUser: ${message}`;

  let sentiment = 'neutral';
  let botReply = 'Sorry, something went wrong.';
  let rawGeminiOutput = {};

  try {
    // 1. Sentiment
   const sentimentPrompt = `
Analyze the emotional tone of the following message and respond in this exact format:

Sentiment: <one-word-lowercase-sentiment>

Only use ONE of the following words: 
positive, negative, neutral, anxious, angry, sad, happy, stressed, overwhelmed, confused, calm, hopeful, frustrated, lonely, depressed, excited, scared, grateful, insecure, ashamed, crisis

Message: "${message}"

Your answer:
`;


    const sentimentData = await tryGeminiAPI({
      contents: [{ parts: [{ text: sentimentPrompt }] }]
    });
    console.log('🔍 Sentiment response:', sentimentData);

   const sentimentRaw = sentimentData?.candidates?.[0]?.content?.parts?.[0]?.text || 'neutral';

// Use regex to extract the word after "Sentiment:"
const match = sentimentRaw.match(/sentiment:\s*(\w+)/i);
sentiment = match ? match[1].toLowerCase() : 'neutral';

    // 2. Gemini reply
    const responseData = await tryGeminiAPI({
      contents: [{ parts: [{ text: finalPrompt }] }]
    });

    botReply = responseData?.candidates?.[0]?.content?.parts?.[0]?.text || botReply;
    rawGeminiOutput = {
      sentimentRaw,
      botReplyRaw: responseData
    };

    console.log('✅ Gemini succeeded');
  } catch (err) {
    console.warn('🔁 Gemini failed. Falling back to Groq...');
    botReply = await callGroqAPI(finalPrompt);
    rawGeminiOutput = { fallbackUsed: 'Groq' };
  }

  const cleanedReply = cleanBotReply(botReply);
  const botTimestamp = new Date().toISOString();

// Add these right after the sentiment detection
const conversation_id = uuidv4(); // new conversation for this chat
const userMessageId = uuidv4();
const botMessageId = uuidv4();

// Then update the storeMessage calls (replace the existing ones):
await storeMessage(userId, 'user', message, timestamp, persona, 'user', userMessageId, conversation_id);
await storeMessage(userId, 'bot', cleanedReply, botTimestamp, persona, 'bot', botMessageId, conversation_id);


  res.send({
    response: cleanedReply,
    timestamp: botTimestamp,
    sentiment,
    rawGeminiOutput
  });
});

app.delete('/clear-messages', verifySupabaseToken, async (req, res) => {
  const userId = req.user.sub;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/messages?user_id=eq.${userId}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({ error: 'Failed to delete messages', details: errorText });
    }

    res.status(200).json({ message: 'Messages deleted' });
  } catch (err) {
    console.error('❌ Deletion failed:', err.message);
    res.status(500).json({ error: 'Deletion failed' });
  }
});


app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));
