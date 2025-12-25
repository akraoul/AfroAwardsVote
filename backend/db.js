const { createClient } = require('@supabase/supabase-js');
// We don't have dotenv explicitly installed in package.json dependencies list viewed earlier, 
// but it's good practice. Use it if available, otherwise rely on hardcoded fallback.
// If dotenv is missing, this line might throw. I'll wrap it or skip it since I didn't see it in package.json.
// Checking package.json again... it was NOT in dependencies. 
// I will skip require('dotenv') for now to avoid crashing, assuming env vars might be injected by the host (Railway/Vercel).

const supabaseUrl = process.env.SUPABASE_URL || 'https://gwcrzggktaastahajyhl.supabase.co';
// Ideally this should be the SERVICE_ROLE key for backend. 
// Using the publishable key from frontend config as fallback.
const supabaseKey = process.env.SUPABASE_KEY || 'sb_publishable_icTBi0UlgrnInKyHRMFXMA_Gn8rmSke';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
