import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Database } from '../types/Database';
import { Message } from '../types/Message';
import { MoodData } from '../components/MoodTracker';
import { PersonaType } from '../types/ApiTypes';

// Type aliases for easier use
type MessageRow = Database['public']['Tables']['messages']['Row'];
type MessageInsert = Database['public']['Tables']['messages']['Insert'];
type MoodDataRow = Database['public']['Tables']['mood_data']['Row'];
type MoodDataInsert = Database['public']['Tables']['mood_data']['Insert'];
type UserPreferencesRow = Database['public']['Tables']['user_preferences']['Row'];
type UserPreferencesInsert = Database['public']['Tables']['user_preferences']['Insert'];

export class SupabaseService {
  // Check if service is available
  static isAvailable(): boolean {
    return isSupabaseConfigured();
  }

  // Messages
  static async saveMessage(userId: string, message: Message, persona: PersonaType): Promise<boolean> {
    if (!this.isAvailable()) return false;

    try {
      const messageData: MessageInsert = {
        user_id: userId,
        content: message.content,
        sender: message.sender,
        timestamp: message.timestamp.toISOString(),
        persona,
      };

      const { error } = await supabase
        .from('messages')
        .insert(messageData);

      if (error) {
        console.error('Error saving message:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving message:', error);
      return false;
    }
  }

  static async getMessages(userId: string, limit: number = 50): Promise<Message[]> {
    if (!this.isAvailable()) return [];

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      return (data || []).map((row: MessageRow) => ({
        id: row.id,
        content: row.content,
        sender: row.sender,
        timestamp: new Date(row.timestamp),
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  static async clearMessages(userId: string): Promise<boolean> {
    if (!this.isAvailable()) return false;

    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Error clearing messages:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error clearing messages:', error);
      return false;
    }
  }

  // Mood Data
  static async saveMoodData(userId: string, moodData: MoodData): Promise<boolean> {
    if (!this.isAvailable()) return false;

    try {
      const moodInsert: MoodDataInsert = {
        user_id: userId,
        sentiment: moodData.sentiment,
        message: moodData.message,
        timestamp: moodData.timestamp.toISOString(),
      };

      const { error } = await supabase
        .from('mood_data')
        .insert(moodInsert);

      if (error) {
        console.error('Error saving mood data:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving mood data:', error);
      return false;
    }
  }

  static async getMoodHistory(userId: string, limit: number = 100): Promise<MoodData[]> {
    if (!this.isAvailable()) return [];

    try {
      const { data, error } = await supabase
        .from('mood_data')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching mood history:', error);
        return [];
      }

      return (data || []).map((row: MoodDataRow) => ({
        sentiment: row.sentiment,
        timestamp: new Date(row.timestamp),
        message: row.message,
      }));
    } catch (error) {
      console.error('Error fetching mood history:', error);
      return [];
    }
  }

  // User Preferences
  static async saveUserPreferences(
    userId: string, 
    selectedPersona: PersonaType, 
    preferences: Record<string, any> = {}
  ): Promise<boolean> {
    if (!this.isAvailable()) return false;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          selected_persona: selectedPersona,
          preferences,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving user preferences:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving user preferences:', error);
      return false;
    }
  }

  static async getUserPreferences(userId: string): Promise<{
    selectedPersona: PersonaType;
    preferences: Record<string, any>;
  } | null> {
    if (!this.isAvailable()) return null;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        if (error.code === 'PGRST116' || error.code === 'PGRST115') {
          // No preferences found, return defaults
          return {
            selectedPersona: 'default',
            preferences: {},
          };
        }
        console.error('Error fetching user preferences:', error);
        return null;
      }

      // If no data found, return defaults
      if (!data) {
        return {
          selectedPersona: 'default',
          preferences: {},
        };
      }

      return {
        selectedPersona: (data.selected_persona as PersonaType) || 'default',
        preferences: data.preferences || {},
      };
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return null;
    }
  }
}