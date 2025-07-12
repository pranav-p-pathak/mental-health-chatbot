// src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`
    Missing Supabase environment variables!
    Please check your .env file and make sure:
    VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set
  `);
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Automatically refreshes the token when expired
    autoRefreshToken: true,
    // Persists the session in local storage
    persistSession: true,
    // Detects when the session is expired
    detectSessionInUrl: true
  }
});

// Helper function to get the current session
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

// Helper function to get the current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};