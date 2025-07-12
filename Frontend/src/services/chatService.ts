import { ChatRequest, ChatResponse, ApiError, PersonaType } from '../types/ApiTypes';
import { supabase } from '../utils/supabaseClient';

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000/chat';

const fallbackResponse = "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or if this continues, consider reaching out to a mental health professional.";

const emergencyFallback = "I'm concerned about what you're sharing. Please reach out for immediate help: National Suicide Prevention Lifeline: 988, or contact your local emergency services. Your life has value.";

// Extend the ChatResponse type to include auth cases
type EnhancedChatResponse = ChatResponse & {
  requiresAuth?: boolean;
};

export const generateBotResponse = async (
  userMessage: string, 
  persona: PersonaType = 'default',
  messageHistory: Array<{content: string; sender: 'user' | 'bot'; timestamp: string}> = []
): Promise<EnhancedChatResponse> => {
  try {
    // Get the current session
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      throw new Error('Authentication required');
    }

    // Prepare the request payload
    const requestPayload: ChatRequest = {
      message: userMessage,
      timestamp: new Date().toISOString(),
      persona,
      messageHistory: messageHistory.length > 0 ? messageHistory : undefined,
    };

    // Make API call with authorization
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: 'Unknown error',
        message: `HTTP ${response.status}`,
        statusCode: response.status,
      }));
      
      // Handle 401 specifically
      if (response.status === 401) {
        // Attempt to refresh session
        const { data: { session: newSession }, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError || !newSession) {
          return {
            response: "Session expired. Please login again.",
            timestamp: new Date().toISOString(),
            sentiment: 'neutral',
            requiresAuth: true
          };
        }
        
        // Retry with new token
        return generateBotResponse(userMessage, persona, messageHistory);
      }
      
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    
    if (!data.response) {
      throw new Error('No response received from backend');
    }

    return data;

  } catch (error: unknown) {
    console.error('API Error:', error);
    
    // Proper type checking for error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Handle authentication errors differently
    if (errorMessage.includes('Authentication') || errorMessage.includes('Session expired')) {
      return {
        response: "Please login to continue the conversation.",
        timestamp: new Date().toISOString(),
        sentiment: 'neutral',
        requiresAuth: true
      };
    }
    
    const hasCrisisKeyword = ['suicide', 'kill myself', 'end it all', 'not worth living', 'better off dead']
      .some(keyword => userMessage.toLowerCase().includes(keyword.toLowerCase()));
    
    return {
      response: hasCrisisKeyword ? emergencyFallback : fallbackResponse,
      timestamp: new Date().toISOString(),
      sentiment: hasCrisisKeyword ? 'crisis' : 'neutral'
    };
  }
};

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const healthUrl = API_URL.replace('/chat', '/health');
    const response = await fetch(healthUrl, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

export const checkAuthStatus = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};