// types/database.ts
export type SentimentType = 
  | 'positive' | 'negative' | 'neutral' | 'crisis'
  | 'anxious' | 'angry' | 'sad' | 'happy'
  | 'stressed' | 'overwhelmed' | 'confused' | 'calm'
  | 'hopeful' | 'frustrated' | 'lonely' | 'depressed'
  | 'excited' | 'scared' | 'grateful' | 'insecure' | 'ashamed';

export type PersonaType = 
  | 'calm-therapist' 
  | 'supportive-friend' 
  | 'motivational-coach'
  | string; // Allow for custom personas

export interface Database {
  public: {
    Tables: {
      user_sessions: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          last_active: string;
          ip_address?: string | null;
          user_agent?: string | null;
          expires_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
          last_active?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          expires_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
          last_active?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          expires_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          role: 'user' | 'bot' | 'system';
          sender: 'user' | 'bot';
          timestamp: string;
          persona: PersonaType;
          created_at: string;
          message_id: string | null;
          conversation_id: string | null;
          sentiment: SentimentType | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          role?: 'user' | 'bot' | 'system';
          sender: 'user' | 'bot';
          timestamp?: string;
          persona?: PersonaType;
          created_at?: string;
          message_id?: string | null;
          conversation_id?: string | null;
          sentiment?: SentimentType | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          role?: 'user' | 'bot' | 'system';
          sender?: 'user' | 'bot';
          timestamp?: string;
          persona?: PersonaType;
          created_at?: string;
          message_id?: string | null;
          conversation_id?: string | null;
          sentiment?: SentimentType | null;
        };
      };
      mood_data: {
        Row: {
          id: string;
          user_id: string;
          sentiment: SentimentType;
          message: string;
          timestamp: string;
          created_at: string;
          intensity: number | null; // 1-10 scale
          related_message_id: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          sentiment: SentimentType;
          message: string;
          timestamp?: string;
          created_at?: string;
          intensity?: number | null;
          related_message_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          sentiment?: SentimentType;
          message?: string;
          timestamp?: string;
          created_at?: string;
          intensity?: number | null;
          related_message_id?: string | null;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          selected_persona: PersonaType;
          preferences: {
            theme?: 'light' | 'dark' | 'system';
            text_size?: 'small' | 'medium' | 'large';
            notification_preferences?: {
              email?: boolean;
              push?: boolean;
            };
            accessibility?: {
              high_contrast?: boolean;
              reduced_motion?: boolean;
            };
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          selected_persona?: PersonaType;
          preferences?: {
            theme?: 'light' | 'dark' | 'system';
            text_size?: 'small' | 'medium' | 'large';
            notification_preferences?: {
              email?: boolean;
              push?: boolean;
            };
            accessibility?: {
              high_contrast?: boolean;
              reduced_motion?: boolean;
            };
          };
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          selected_persona?: PersonaType;
          preferences?: {
            theme?: 'light' | 'dark' | 'system';
            text_size?: 'small' | 'medium' | 'large';
            notification_preferences?: {
              email?: boolean;
              push?: boolean;
            };
            accessibility?: {
              high_contrast?: boolean;
              reduced_motion?: boolean;
            };
          };
          created_at?: string;
          updated_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          title: string | null;
          summary: string | null;
          sentiment_trend: SentimentType[] | null;
          is_archived: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
          title?: string | null;
          summary?: string | null;
          sentiment_trend?: SentimentType[] | null;
          is_archived?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string | null;
          summary?: string | null;
          sentiment_trend?: SentimentType[] | null;
          is_archived?: boolean;
        };
      };
    };
    Views: {
      message_with_sentiment: {
        Row: {
          id: string | null;
          content: string | null;
          sentiment: SentimentType | null;
          timestamp: string | null;
        };
      };
    };
    Functions: {
      get_conversation_messages: {
        Args: {
          conversation_id: string;
        };
        Returns: {
          id: string;
          content: string;
          sender: 'user' | 'bot';
          timestamp: string;
        }[];
      };
      get_sentiment_trend: {
        Args: {
          user_id: string;
          days: number;
        };
        Returns: {
          date: string;
          avg_sentiment: string;
          count: number;
        }[];
      };
    };
    Enums: {
      sentiment_category: 'positive' | 'negative' | 'neutral' | 'crisis';
      persona_category: 'therapist' | 'friend' | 'coach' | 'custom';
    };
  };
}