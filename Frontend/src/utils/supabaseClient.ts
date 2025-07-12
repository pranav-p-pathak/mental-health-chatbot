// src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`
    ❌ Missing Supabase environment variables!
    Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file
  `);
}

// Prevent multiple instances in development (Vite HMR)
const _supabase =
  (globalThis as any).supabase ??
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false // set to true only if using magic links or OAuth redirects
    }
  });

if (import.meta.env.DEV) (globalThis as any).supabase = _supabase;

export const supabase = _supabase;

// Helper: get current session
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

// Helper: get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};
