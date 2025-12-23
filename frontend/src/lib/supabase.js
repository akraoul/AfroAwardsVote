import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qwcrzqgktaastahajyhl.supabase.co';
const supabaseKey = 'sb_publishable_icTBi0UlgrnInKyHRMFXMA_Gn8rmSke';

export const supabase = createClient(supabaseUrl, supabaseKey);
