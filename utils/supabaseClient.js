import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xowemrgweywotmzpjdjl.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvd2Vtcmd3ZXl3b3RtenBqZGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3ODQxMzEsImV4cCI6MjA2NzM2MDEzMX0.jS9G8MjRBRm93Z1SfHVTUwmFSlCjFSWNqddKnlujiyg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 