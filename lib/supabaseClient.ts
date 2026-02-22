import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (_client) return _client;
  const NEXT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const NEXT_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!NEXT_URL || !NEXT_KEY) {
    _client = createClient(NEXT_URL, NEXT_KEY);
  } else {
    _client = createClient(NEXT_URL, NEXT_KEY);
  }
  return _client;
}

export default getSupabaseClient;
