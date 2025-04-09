import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://cyrbjazkmjqcsjebfwte.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5cmJqYXprbWpxY3NqZWJmd3RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxOTQxNjIsImV4cCI6MjA1OTc3MDE2Mn0.-IdF4b_hDfSkQwIsEYZoJMDPry4_6B1ZRv0Y84vNP34";
export const supabase = createClient(supabaseUrl, supabaseKey);
