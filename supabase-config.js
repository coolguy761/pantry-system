// Supabase configuration
// NOTE: Replace with your actual Supabase project URL and anon key
const SUPABASE_URL = 'https://your-project-ref.supabase.co';
const SUPABASE_ANON_KEY = 'public-anon-key';
window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
