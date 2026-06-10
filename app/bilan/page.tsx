import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CircleScore } from "@/components/ui/circle-score";
import { HeaderApp } from "@/components/layout/header-app";
import { BottomNav } from "@/components/ui/bottom-nav";
import { computeScores, findPriorityKey } from "@/lib/score";

// ─── Helpers ───────────────────────────────────────────────────────

function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

function dayLabel(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("fr-FR", { weekday: "short" }).slice(0, 3);
}

function todayIso(): string {
  return new Date().toISOString().split("T")[0];
}

const PRIORITY_CONSEIL: Record<string, string> = {
  energie:   "Énergie d'abord. Commence par 10 min de lumière naturelle au réveil — ça stoppe la mélatonine et synchronise ton horloge interne.",
  sommeil:   "Sommeil d'abord. Essaie de couper les écrans 30 min plus tôt ce soir — la lumière bleue retarde la mélatonine de 90 min.",
  stress:    "Régulation du système nerveux. 5 min de cohérence cardiaque chaque matin — inspire 5s, expire 5s. −23% de cortisol en 3 semaines.",
  activite:  "Mouvement intégré. 10 min de marche après le déjeuner réduisent la glycémie de 22% et améliorent l'humeur.",
  digestion: "Axe intestin-cerveau. Commence le matin avec un verre d'eau tiède à jeun — stimule le péristaltisme dès le réveil.",
};

// ─── Page ───────────────────────────────────────────────────────────

export default async function Bilan() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const last7 = getLast7Days();
  const today = todayIso();

  const [profileRes, checkinsRes, gamiRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("prenom, energie_score, qualite_sommeil, niveau_stress, niveau_activite, digestion")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("checkins")
      .select("date, actions_cochees")
      .eq("user_id", user.id)
      .in("date", last7),
    supabase
      .from("gamification")
      .select("streak_actuel, streak_record, paliers_atteints")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  const profile = profileRes.data ?? {
    prenom: null, energie_score: null, qualite_sommeil: null,
    niveau_stress: null, niveau_activite: null, digestion: null,
  };
  const checkins: { date: string; actions_cochees: string[] }[] = (checkinsRes.data ?? []) as { date: string; actions_cochees: string[] }[];
  const gami = gamiRes.data;

  // Construire la map date → nb actions cochées
  const checkinMap: Record<string, number> = {};
  for (const c of checkins) {
    checkinMap[c.date] = (c.actions_cochees ?? []).length;
  }

  // Statistiques semaine
  const totalActionsWeek = Object.values(checkinMap).reduce((a, b) => a + b, 0);
  const joursActifs = Object.values(checkinMap).filter((n) => n > 0).length;

  const scores       = computeScores(profile, joursActifs);
  const priorityKey  = findPriorityKey(scores);
  const conseil      = PRIORITY_CONSEIL[priorityKey];
  const streak       = gami?.streak_actuel ?? 0;
  const streakRecord = gami?.streak_record ?? 0;
  const paliers      = gami?.paliers_atteints ?? [];
  const maxParJour = 3;
  const totalPossible = 7 * maxParJour;
  const pctSemaine = Math.round((totalActionsWeek / totalPossible) * 100);

  const PALIER_LABELS: Record<string, string> = { "7j": "7 jours", "30j": "30 jours", "100j": "100 jours" };

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <HeaderApp backHref="/tableau-de-bord" title="Bilan" />

      <main className="flex-1 px-5 pb-8">

        {/* ── Score global ── */}
        <div
          className="flex flex-col items-center rounded-[1.5rem] bg-white px-5 py-8"
          style={{ animation: "fade-up .45s cubic-bezier(.22,1,.36,1) both" }}
        >
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[.2em] text-ink-soft">
            Score de bien-être
          </p>
          <CircleScore score={scores.global} label="/100" size={180} />
          <p className="mt-4 px-6 text-center text-xs leading-relaxed text-ink-soft">
            Basé sur ton profil initial. Il évolue chaque semaine.
          </p>
        </div>

        {/* ── Streak ── */}
        <div
          className="mt-4 grid grid-cols-2 gap-3"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .1s both" }}
        >
          <div className="rounded-[1.25rem] bg-white px-5 py-5">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🔥</span>
              <p className="text-[11px] font-medium text-ink-soft">Série actuelle</p>
            </div>
            <p
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              className="mt-2.5 text-4xl font-light text-ink"
            >
              {streak}
              <span className="text-base text-ink-soft"> jours</span>
            </p>
          </div>

          <div className="rounded-[1.25rem] bg-white px-5 py-5">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🏆</span>
              <p className="text-[11px] font-medium text-ink-soft">Record</p>
            </div>
            <p
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              className="mt-2.5 text-4xl font-light text-ink"
            >
              {streakRecord}
              <span className="text-base text-ink-soft"> jours</span>
            </p>
          </div>
        </div>

        {/* ── Activité 7 derniers jours ── */}
        <div
          className="mt-4 overflow-hidden rounded-[1.25rem] bg-white px-5 py-5"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .15s both" }}
        >
          <div className="mb-4 flex items-baseline justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-ink-soft">
              7 derniers jours
            </p>
            <span className="text-xs text-ink-soft">
              {joursActifs}/7 jours actifs
            </span>
          </div>

          {/* Barres */}
          <div className="flex items-end justify-between gap-1.5">
            {last7.map((date) => {
              const count = checkinMap[date] ?? 0;
              const isToday = date === today;
              const heightPct = count > 0 ? Math.max(20, (count / maxParJour) * 100) : 8;
              return (
                <div key={date} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="w-full flex items-end" style={{ height: 56 }}>
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        count > 0
                          ? isToday ? "bg-aliva" : "bg-aliva/50"
                          : "bg-black/8"
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className={`text-[10px] font-medium ${isToday ? "text-aliva" : "text-ink-soft/60"}`}>
                    {dayLabel(date)}
                  </span>
                  {count > 0 && (
                    <span className="text-[9px] text-ink-soft/50">{count}/3</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Résumé semaine */}
          <div className="mt-4 flex items-center justify-between rounded-xl bg-aliva-pale/50 px-4 py-3">
            <p className="text-xs text-ink">
              <span className="font-semibold text-aliva">{totalActionsWeek}</span> actions cette semaine
            </p>
            <p className="text-xs font-semibold text-aliva">{pctSemaine}%</p>
          </div>
        </div>

        {/* ── Paliers atteints ── */}
        {paliers.length > 0 && (
          <div
            className="mt-4 overflow-hidden rounded-[1.25rem] bg-white px-5 py-5"
            style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .2s both" }}
          >
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[.18em] text-ink-soft">
              Paliers atteints
            </p>
            <div className="flex gap-2 flex-wrap">
              {paliers.map((p: string) => (
                <span
                  key={p}
                  className="rounded-full bg-aliva px-4 py-1.5 text-xs font-semibold text-cream"
                >
                  🏅 {PALIER_LABELS[p] ?? p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Priorité de la semaine ── */}
        <div
          className="mt-4 flex items-start gap-4 rounded-[1.25rem] bg-aliva-pale/70 px-5 py-5"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .25s both" }}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-aliva text-sm text-cream">
            ★
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-aliva">Priorité cette semaine</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink">
              {conseil}
            </p>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="mt-8" style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .35s both" }}>
          <Link
            href="/tableau-de-bord"
            className="flex h-[52px] items-center justify-center rounded-full bg-terracotta text-sm font-semibold tracking-wide text-cream shadow-sm transition-all hover:bg-terracotta/90 active:scale-[.98]"
          >
            Retour au tableau de bord →
          </Link>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
