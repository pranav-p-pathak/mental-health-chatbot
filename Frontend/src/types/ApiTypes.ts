// Types for API communication with your backend

export interface ChatRequest {
  message: string;
  timestamp: string;
  sessionId?: string; // Optional for session tracking
  userId?: string; // Optional for user tracking
  persona?: string; // Persona mode selection
  messageHistory?: Array<{
    content: string;
    sender: 'user' | 'bot';
    timestamp: string;
  }>; // Recent message history for context
}

export interface ChatResponse {
  response: string;
  timestamp: string;
  sessionId?: string;
  sentiment?: 'positive' | 'negative' | 'neutral' | 'crisis';
  confidence?: number;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// Persona types
export type PersonaType = 
  | 'supportive-friend'
  | 'motivational-coach' 
  | 'calm-therapist'
  | 'default';

export interface PersonaOption {
  value: PersonaType;
  label: string;
  description: string;
  icon: string;
}