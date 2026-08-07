import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

// Stateless anon client for server-side public operations (e.g. inserting a
// quote submission). Subject to RLS: anon may INSERT quotes but not read them.
export function createAnonServerClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}
