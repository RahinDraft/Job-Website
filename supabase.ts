import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || "https://psgsfithtuluyvgcuxgw.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZ3NmaXRodHVsdXl2Z2N1eGd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2OTA4MzMsImV4cCI6MjA5NTI2NjgzM30.9-nkDJ48loLvStJr22ZlJas6G4aGhRiXz4FFMTA0RNM";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Supabase URL and Key are required. Please set them in your environment variables.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
