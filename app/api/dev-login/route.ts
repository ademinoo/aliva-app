import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Route temporaire DEV uniquement — à supprimer avant le lancement
const DEV_SECRET = process.env.DEV_LOGIN_SECRET;

export async function POST(request: Request) {
  // Bloqué si pas de secret configuré ou si secret ne correspond pas
  const { email, secret } = await request.json();
  if (!DEV_SECRET || secret?.trim() !== DEV_SECRET.trim()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: `${new URL(request.url).origin}/auth/confirm` },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const origin = new URL(request.url).origin;
  const token_hash = data.properties?.hashed_token;
  const link = `${origin}/auth/confirm?token_hash=${token_hash}&type=magiclink`;
  return NextResponse.json({ link });
}
