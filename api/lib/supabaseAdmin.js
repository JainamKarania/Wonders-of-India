import { createClient } from "@supabase/supabase-js";

// Secret key (sb_secret_...) — Supabase's current name for what used to be
// the service_role key. Full access, bypasses Row Level Security. This
// must only ever be used server-side (inside api/ handlers), never
// imported into anything that ships to the browser.
const supabaseUrl = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !secretKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SECRET_KEY — check your Vercel/local env."
  );
}

export const supabaseAdmin = createClient(supabaseUrl, secretKey);

// Verifies the Authorization: Bearer <token> header on an incoming API
// request and returns the authenticated user, or null if invalid/missing.
// Use this at the top of any protected api/ handler.
export async function getUserFromRequest(req) {
  const authHeader = req.headers.authorization ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error) return null;

  return data.user;
}