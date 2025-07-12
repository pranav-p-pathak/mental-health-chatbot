import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAnonymous: boolean;
}

export const useSupabaseAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAnonymous: false,
  });

  // Sign in anonymously
  const signInAnonymously = async (): Promise<{ user: User | null; error: any }> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping anonymous sign-in');
      return { user: null, error: new Error('Supabase not configured') };
    }

    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) {
        // Check if anonymous auth is disabled
        if (error.message?.includes('Anonymous sign-ins are disabled') || 
            error.message?.includes('anonymous_provider_disabled') ||
            error.code === 'anonymous_provider_disabled') {
          console.warn('Anonymous authentication is disabled in Supabase project');
          return { user: null, error: new Error('ANONYMOUS_DISABLED') };
        }
        console.error('Anonymous sign-in error:', error);
        return { user: null, error };
      }

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Anonymous sign-in failed:', error);
      return { user: null, error };
    }
  };

  // Sign in with email and password
  const signInWithEmail = async (email: string, password: string): Promise<{ user: User | null; error: any }> => {
    if (!isSupabaseConfigured()) {
      return { user: null, error: new Error('Supabase not configured') };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Email sign-in error:', error);
        return { user: null, error };
      }

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Email sign-in failed:', error);
      return { user: null, error };
    }
  };

  // Sign up with email and password
  const signUpWithEmail = async (email: string, password: string): Promise<{ user: User | null; error: any }> => {
    if (!isSupabaseConfigured()) {
      return { user: null, error: new Error('Supabase not configured') };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error('Email sign-up error:', error);
        return { user: null, error };
      }

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Email sign-up failed:', error);
      return { user: null, error };
    }
  };

  // Sign out
  const signOut = async (): Promise<{ error: any }> => {
    if (!isSupabaseConfigured()) {
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Sign out failed:', error);
      return { error };
    }
  };

  // Get current session
  const getCurrentSession = async (): Promise<Session | null> => {
    if (!isSupabaseConfigured()) {
      return null;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Get session failed:', error);
      return null;
    }
  };

  // Initialize auth state and listen for changes
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setAuthState({
        user: null,
        session: null,
        loading: false,
        isAnonymous: false,
      });
      return;
    }

    // Get initial session
    getCurrentSession().then((session) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
        isAnonymous: session?.user?.is_anonymous ?? false,
      });
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          isAnonymous: session?.user?.is_anonymous ?? false,
        });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    ...authState,
    signInAnonymously,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    getCurrentSession,
    isConfigured: isSupabaseConfigured(),
  };
};