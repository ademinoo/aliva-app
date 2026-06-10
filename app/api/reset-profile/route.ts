import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Efface toutes les données questionnaire et check-ins, conserve le compte auth
  await admin.from("gamification").delete().eq("user_id", user.id);
  await admin.from("checkins").delete().eq("user_id", user.id);
  await admin.from("notification_preferences").delete().eq("user_id", user.id);
  await admin.from("profiles").delete().eq("id", user.id);

  return NextResponse.json({ success: true });
}
