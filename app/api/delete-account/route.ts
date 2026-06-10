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

  // Suppression explicite des données (les FK ON DELETE CASCADE couvrent normalement tout,
  // mais on nettoie manuellement pour s'assurer qu'il ne reste rien)
  await Promise.allSettled([
    admin.from("notification_preferences").delete().eq("user_id", user.id),
    admin.from("gamification").delete().eq("user_id", user.id),
    admin.from("checkins").delete().eq("user_id", user.id),
    admin.from("profiles").delete().eq("id", user.id),
  ]);

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return NextResponse.json({ error: "Erreur lors de la suppression du compte" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
