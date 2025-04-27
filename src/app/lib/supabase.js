import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cbpzbbjczpxfwmffalbf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNicHpiYmpjenB4ZndtZmZhbGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3MzI1ODcsImV4cCI6MjA2MTMwODU4N30.7eIxWePocxFo39NpNABuIE0BDuNJNMYqIxELJtxIFu4';
export const supabase = createClient(supabaseUrl, supabaseKey);

// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;
// export const supabase = createClient(supabaseUrl, supabaseKey);