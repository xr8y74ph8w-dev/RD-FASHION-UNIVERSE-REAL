import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anon) console.warn('Supabase env vars are missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local');

export const supabase = createClient(url || 'https://placeholder.supabase.co', anon || 'placeholder-anon-key', {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});
