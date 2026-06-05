import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CircleScore } from "@/components/ui/circle-score";
import { HeaderApp } from "@/components/layout/header-app";
import { BottomNav } from "@/components/ui/bottom-nav";
import { computeScores, findPriorityKey } from "@/lib/score";

const SOMMEIL_LABEL: Record<string, string> = {
  "Reposé":                "Bon",
  "Variable":              "Variable",
  "Fatigué mais ça passe": "Moyen",
  "Épuisé":                "Difficile",
};

const PRIORITY_CONSEIL: Record<string, string> = {
  energie:   "Énergie d'abord. Commence par 10 min de lumière naturelle au réveil — ça stoppe la mélatonine et synchronise ton horloge interne.",
  sommeil:   "Sommeil d'abord. Essaie de couper les écrans 30 min plus tôt ce soir — la lumière bleue retarde la mélatonine de 90 min.",
  stress:    "Régulation du système nerveux. 5 min de cohérence cardiaque chaque matin — inspire 5s, expire 5s. −23% de cortisol en 3 semaines.",
  activite:  "Mouvement intégré. 10 min de marche après le déjeuner réduisent la glycémie de 22% et améliorent l'humeur.",
  digestion: "Axe intestin-cerveau. Commence le matin avec un verre d'eau tiède à jeun — stimule le péristaltisme dès le réveil.",
};

export default async function Bilan() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: raw } = await supabase
    .from("profiles")
    .select("prenom, energie_score, qualite_sommeil, niveau_stress, niveau_activite, digestion")
    .eq("id", user.id)
    .maybeSingle();

  const profile = raw ?? {
    prenom: null, energie_score: null, qualite_sommeil: null,
    niveau_stress: null, niveau_activite: null, digestion: null,
  };

  const scores      = computeScores(profile);
  const priorityKey = findPriorityKey(scores);
  const conseil     = PRIORITY_CONSEIL[priorityKey];

  const energieVal  = profile.energie_score != null ? `${profile.energie_score}` : "—";
  const sommeilVal  = SOMMEIL_LABEL[profile.qualite_sommeil ?? ""] ?? "—";

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <HeaderApp backHref="/tableau-de-bord" title="Bilan de ta semaine" />

      <main className="flex-1 px-5">

        {/* ── Score global ── */}
        <div
          className="flex flex-col items-center rounded-[1.5rem] bg-white px-5 py-8"
          style={{ animation: "fade-up .45s cubic-bezier(.22,1,.36,1) both" }}
        >
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[.2em] text-ink-soft">
            Score global
          </p>
          <CircleScore score={scores.global} label="/100" size={196} />
          <p className="mt-4 px-6 text-center text-xs leading-relaxed text-ink-soft">
            Basé sur tes réponses au questionnaire initial.
          </p>
        </div>

        {/* ── Stats ── */}
        <div
          className="mt-4 grid grid-cols-2 gap-3"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .1s both" }}
        >
          <div className="rounded-[1.25rem] bg-white px-5 py-5">
            <div className="flex items-center gap-1.5 text-ink-soft">
              <span className="text-base">⚡</span>
              <p className="text-[11px] font-medium">Énergie</p>
            </div>
            <p
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              className="mt-2.5 text-3xl font-light text-ink"
            >
              {energieVal}
              {profile.energie_score != null && (
                <span className="text-base text-ink-soft">/10</span>
              )}
            </p>
            <p className="mt-1 text-xs text-ink-soft">Score déclaré</p>
          </div>

          <div className="rounded-[1.25rem] bg-white px-5 py-5">
            <div className="flex items-center gap-1.5 text-ink-soft">
              <span className="text-base">🌙</span>
              <p className="text-[11px] font-medium">Sommeil</p>
            </div>
            <p
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              className="mt-2.5 text-2xl font-light text-ink"
            >
              {sommeilVal}
            </p>
            <p className="mt-1 text-xs text-ink-soft">Qualité déclarée</p>
          </div>
        </div>

        {/* ── Priorité de la semaine ── */}
        <div
          className="mt-4 flex items-start gap-4 rounded-[1.25rem] bg-aliva-pale/70 px-5 py-5"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .2s both" }}
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

        {/* ── Suivi hebdo (à venir) ── */}
        <div
          className="mt-4 rounded-[1.25rem] border border-dashed border-black/10 px-5 py-5"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .3s both" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-ink-soft">
            Suivi hebdomadaire
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Tes moyennes de sommeil, d&apos;énergie et tes actions cochées apparaîtront ici après 7 jours d&apos;utilisation.
          </p>
        </div>

        {/* ── CTA ── */}
        <div
          className="mt-8 pb-8"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .4s both" }}
        >
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
