import { createClient } from "@supabase/supabase-js";

const url = "https://wrovfmnvhgjkakqxqvfm.supabase.co";
const key = "sb_publishable__7b9MsTZ78y2xP_5bYyshw_pRuZJLHb";

export const isSupabaseConfigured = true;
export const supabase = createClient(url, key);
