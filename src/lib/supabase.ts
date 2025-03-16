
import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/types/supabase';

// Use the provided Supabase credentials
const supabaseUrl = "https://cscajnfmhqzcopbecirj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzY2FqbmZtaHF6Y29wYmVjaXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNDc5MzYsImV4cCI6MjA1NzcyMzkzNn0.lV5Sv7nYmdPBq4-1VmXA4IRW0bdeiYW2vH1-TsctuI4";

// Create and export the Supabase client
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
