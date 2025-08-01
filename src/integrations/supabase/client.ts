// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jdeluoyeoyscoprsvcer.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkZWx1b3llb3lzY29wcnN2Y2VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MDA3MjcsImV4cCI6MjA2OTI3NjcyN30.j6VNfZkke3F0nJma_yxDp7g9ysIi2THoQrj1uC7GcN4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});