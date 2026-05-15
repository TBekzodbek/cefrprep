import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key is missing. Please check your .env or Vercel environment variables.');
}

// Fallback to empty strings if missing, but createClient will throw if URL is not a valid URL
// We use a try-catch to prevent the whole app from becoming a white screen
let supabaseInstance;
try {
    supabaseInstance = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');
} catch (e) {
    console.error('Failed to initialize Supabase client:', e);
    // Provide a dummy object to prevent null pointer exceptions
    supabaseInstance = {
        auth: { getUser: async () => ({ data: { user: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }), signOut: async () => { } },
        from: () => ({ select: () => ({ eq: () => ({ single: () => ({ data: null, error: { code: 'PGRST116' } }) }) }), upsert: async () => ({ error: null }) })
    } as any;
}

export const supabase = supabaseInstance;
