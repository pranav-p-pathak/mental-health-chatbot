import React, { useState, useCallback } from 'react';
import { Message } from '../types/Message';
import { PersonaType } from '../types/ApiTypes';
import { generateBotResponse } from '../services/chatService';
import { MoodData } from '../components/MoodTracker';
import { useSupabaseAuth } from './useSupabaseAuth';
import { SupabaseService } from '../services/supabaseService';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>('default');
  const [moodHistory, setMoodHistory] = useState<MoodData[]>([]);
  const { user } = useSupabaseAuth();

  // Load user data when user changes
  React.useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;

      try {
        // Load messages
        const savedMessages = await SupabaseService.getMessages(user.id);
        if (savedMessages.length > 0) {
          setMessages(savedMessages);
        }

        // Load mood history
        const savedMoodHistory = await SupabaseService.getMoodHistory(user.id);
        if (savedMoodHistory.length > 0) {
          setMoodHistory(savedMoodHistory);
        }

        // Load user preferences
        const preferences = await SupabaseService.getUserPreferences(user.id);
        if (preferences) {
          setSelectedPersona(preferences.selectedPersona);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, [user?.id]);
  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Save user message to Supabase if user is authenticated
    if (user?.id) {
      await SupabaseService.saveMessage(user.id, userMessage, selectedPersona);
    }
    
    try {
      // Prepare message history for context (last 5 messages)
      const recentMessages = messages.slice(-5).map(msg => ({
        content: msg.content,
        sender: msg.sender,
        timestamp: msg.timestamp.toISOString()
      }));

      // Generate bot response with persona and message history
      const botResponse = await generateBotResponse(
        content, 
        selectedPersona,
        recentMessages
      );
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse.response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);

      // Save bot message to Supabase if user is authenticated
      if (user?.id) {
        await SupabaseService.saveMessage(user.id, botMessage, selectedPersona);
      }

      // Track mood if sentiment is provided
      if (botResponse.sentiment) {
        const moodData: MoodData = {
          sentiment: botResponse.sentiment,
          timestamp: new Date(),
          message: content
        };
        setMoodHistory(prev => [...prev, moodData]);

        // Save mood data to Supabase if user is authenticated
        if (user?.id) {
          await SupabaseService.saveMoodData(user.id, moodData);
        }
      }
      
    } catch (error) {
      console.error('Error generating bot response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, selectedPersona, user?.id]);

  const clearChat = useCallback(() => {
    // Clear from Supabase if user is authenticated
    if (user?.id) {
      SupabaseService.clearMessages(user.id);
    }
    
    setMessages([]);
    setMoodHistory([]);
  }, [user?.id]);

  const setSelectedPersonaWithSave = useCallback((persona: PersonaType) => {
    setSelectedPersona(persona);
    
    // Save persona preference to Supabase if user is authenticated
    if (user?.id) {
      SupabaseService.saveUserPreferences(user.id, persona);
    }
  }, [user?.id]);

  return {
    messages,
    isTyping,
    selectedPersona,
    moodHistory,
    sendMessage,
    setSelectedPersona: setSelectedPersonaWithSave,
    clearChat,
  };
};