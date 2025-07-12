import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable anonymous sign-ins
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'https://xmzphvjkmhfarmodguxy.supabase.co' && 
    supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtenBodmprbWhmYXJtb2RndXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NTk4NjAsImV4cCI6MjA2NzUzNTg2MH0.4gxS4FZqOrdxAzhZD_qP41w_UQyqJ7r8bKB4leYA_DQ');
};

// Helper function to test Supabase connection
export const testSupabaseConnection = async (): Promise<boolean> => {
  // Pick any table that always exists (e.g. 'messages')
  const { error } = await supabase
    .from('messages')           // 👈 change this to a real table/view
    .select('id')               // lightweight column list
    .limit(1);

  if (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
  return true;
};
