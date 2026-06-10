import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Emails autorisés à accéder à l'admin
const ADMIN_EMAILS = ["allykachmarsky01@hotmail.com"];

type ProfileRow = {
  id: string;
  prenom: string | null;
  age: number | null;
  objectif_principal: string | null;
  created_at: string | null;
};

type CheckinCount = {
  user_id: string;
  count: number;
};

function timeAgo(iso: string | null): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "aujourd'hui";
  if (days === 1) return "hier";
  return `il y a ${days}j`;
}

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");
  if (!ADMIN_EMAILS.includes(user.email ?? "")) redirect("/tableau-de-bord");

  // Récupérer les profils
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, prenom, age, objectif_principal, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  // Récupérer les gamification (pour voir les actifs)
  const { data: gamis } = await supabase
    .from("gamification")
    .select("user_id, streak_actuel, last_active_date");

  // Récupérer le nb de check-ins par user (7 derniers jours)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const { data: recentCheckins } = await supabase
    .from("checkins")
    .select("user_id")
    .gte("date", sevenDaysAgo.toISOString().split("T")[0]);

  // Compter les check-ins par user
  const checkinCounts: Record<string, number> = {};
  for (const c of (recentCheckins ?? [])) {
    checkinCounts[c.user_id] = (checkinCounts[c.user_id] ?? 0) + 1;
  }

  const gamiMap: Record<string, { streak_actuel: number; last_active_date: string | null }> = {};
  for (const g of (gamis ?? [])) {
    gamiMap[g.user_id] = { streak_actuel: g.streak_actuel, last_active_date: g.last_active_date };
  }

  const totalProfiles = (profiles ?? []).length;
  const actifs7j = Object.values(checkinCounts).filter((n) => n > 0).length;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="border-b border-black/8 bg-white px-6 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-ink">Admin Aliva</h1>
            <p className="text-xs text-ink-soft">{user.email}</p>
          </div>
          <a href="/tableau-de-bord" className="text-xs font-medium text-aliva hover:underline">
            → App
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8">

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
          {[
            { label: "Inscrits total",     value: totalProfiles,    icon: "👤" },
            { label: "Actifs 7 derniers jours", value: actifs7j,   icon: "🔥" },
            { label: "Payants",            value: "—",              icon: "💳" },
            { label: "NPS J+30",           value: "—",              icon: "⭐" },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-2xl bg-white px-5 py-5">
              <p className="text-2xl">{kpi.icon}</p>
              <p className="mt-2 text-3xl font-light text-ink">{kpi.value}</p>
              <p className="mt-1 text-xs text-ink-soft">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Table utilisateurs */}
        <div className="overflow-hidden rounded-2xl bg-white">
          <div className="px-6 py-4 border-b border-black/5">
            <h2 className="text-sm font-semibold text-ink">Utilisateurs inscrits</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/5 text-left">
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[.14em] text-ink-soft">Prénom</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[.14em] text-ink-soft">Âge</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[.14em] text-ink-soft">Objectif</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[.14em] text-ink-soft">Inscrit</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[.14em] text-ink-soft">Streak</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[.14em] text-ink-soft">Actions 7j</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[.14em] text-ink-soft">Dernier actif</th>
                </tr>
              </thead>
              <tbody>
                {(profiles as ProfileRow[] ?? []).map((p, i) => {
                  const gami = gamiMap[p.id];
                  const actionsWeek = checkinCounts[p.id] ?? 0;
                  return (
                    <tr
                      key={p.id}
                      className={`border-b border-black/5 last:border-0 ${i % 2 === 0 ? "" : "bg-black/1"}`}
                    >
                      <td className="px-6 py-3.5 font-medium text-ink">{p.prenom ?? "—"}</td>
                      <td className="px-6 py-3.5 text-ink-soft">{p.age ?? "—"}</td>
                      <td className="px-6 py-3.5 text-ink-soft">{p.objectif_principal ?? "—"}</td>
                      <td className="px-6 py-3.5 text-ink-soft">{timeAgo(p.created_at)}</td>
                      <td className="px-6 py-3.5">
                        {gami?.streak_actuel ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-aliva-pale px-2.5 py-0.5 text-xs font-medium text-aliva">
                            🔥 {gami.streak_actuel}j
                          </span>
                        ) : (
                          <span className="text-ink-soft">0</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5">
                        {actionsWeek > 0 ? (
                          <span className="text-sm font-medium text-ink">{actionsWeek}</span>
                        ) : (
                          <span className="text-ink-soft">0</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-ink-soft">
                        {gami?.last_active_date ? timeAgo(gami.last_active_date) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {(profiles ?? []).length === 0 && (
              <div className="px-6 py-12 text-center text-sm text-ink-soft">
                Aucun utilisateur inscrit pour le moment.
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 text-xs text-ink-soft/50 text-center">
          Données en temps réel depuis Supabase · Aliva Admin
        </p>
      </div>
    </div>
  );
}
