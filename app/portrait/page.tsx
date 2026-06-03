import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CircleScore } from "@/components/ui/circle-score";
import { HeaderApp } from "@/components/layout/header-app";

// ─── Types ─────────────────────────────────────────────────────────

type Profile = {
  prenom: string | null;
  energie_score: number | null;
  qualite_sommeil: string | null;
  niveau_stress: string | null;
  niveau_activite: string | null;
  digestion: string | null;
};

// ─── Score maps (text → 0-1) ────────────────────────────────────────

const SOMMEIL_SCORE: Record<string, number> = {
  "Reposé": 1.0, "Variable": 0.55, "Fatigué mais ça passe": 0.45, "Épuisé": 0.15,
};

const STRESS_SCORE: Record<string, number> = {
  "Plutôt bien": 1.0, "Je suis souvent tendu": 0.5,
  "Anxiété régulière": 0.3, "Ça affecte mon sommeil": 0.2, "Ça affecte mes relations": 0.15,
};

const ACTIVITE_SCORE: Record<string, number> = {
  sedentaire: 0.2, leger: 0.4, modere: 0.6, actif: 0.8, intensif: 1.0,
};

const DIGESTION_SCORE: Record<string, number> = {
  "Impeccable": 1.0, "Ballonnements fréquents": 0.4,
  "Constipation": 0.35, "Diarrhées": 0.3, "Brûlures d'estomac": 0.35,
};

// ─── Score computation ──────────────────────────────────────────────

function computeScores(p: Profile) {
  const energie  = p.energie_score  != null ? p.energie_score / 10 : 0.6;
  const sommeil  = SOMMEIL_SCORE[p.qualite_sommeil ?? ""]  ?? 0.6;
  const stress   = STRESS_SCORE[p.niveau_stress ?? ""]    ?? 0.5;
  const activite = ACTIVITE_SCORE[p.niveau_activite ?? ""] ?? 0.5;
  const digestion = DIGESTION_SCORE[p.digestion ?? ""]    ?? 0.7;

  const global = Math.round(
    energie   * 25 +
    sommeil   * 25 +
    stress    * 25 +
    activite  * 15 +
    digestion * 10,
  );

  return { energie, sommeil, stress, activite, digestion, global };
}

function toDots(s: number) {
  return s >= 0.67 ? 3 : s >= 0.34 ? 2 : 1;
}

function dotStyle(dots: number) {
  if (dots === 3) return { accent: "text-aliva",      bg: "bg-aliva-pale/60" };
  if (dots === 2) return { accent: "text-amber-500",  bg: "bg-amber-50"      };
  return              { accent: "text-terracotta", bg: "bg-terracotta/8"  };
}

// ─── Priority copy ──────────────────────────────────────────────────

const PRIORITIES: Record<string, { titre: string; desc: string }> = {
  energie: {
    titre: "Recharger ton énergie cellulaire.",
    desc: "On commence par des ajustements simples pour soutenir tes mitochondries — lumière matinale, hydratation, et timing des repas.",
  },
  sommeil: {
    titre: "Améliorer la qualité de ton sommeil.",
    desc: "La fenêtre 22h–2h est la plus réparatrice. Quelques rituels du soir peuvent radicalement changer ta récupération.",
  },
  stress: {
    titre: "Réguler ton système nerveux.",
    desc: "On commence par des ajustements simples pour abaisser le niveau de cortisol en fin de journée.",
  },
  activite: {
    titre: "Intégrer le mouvement dans ta journée.",
    desc: "10 minutes de marche après les repas suffisent pour réduire la glycémie et améliorer l'énergie.",
  },
  digestion: {
    titre: "Prendre soin de ton axe intestin-cerveau.",
    desc: "L'intestin produit 90% de ta sérotonine. Des ajustements alimentaires simples changeront ton humeur et ton énergie.",
  },
};

function findPriorityKey(s: ReturnType<typeof computeScores>) {
  return [
    { key: "energie",   v: s.energie   },
    { key: "sommeil",   v: s.sommeil   },
    { key: "stress",    v: s.stress    },
    { key: "activite",  v: s.activite  },
    { key: "digestion", v: s.digestion },
  ].sort((a, b) => a.v - b.v)[0].key;
}

// ─── UI helpers ─────────────────────────────────────────────────────

function Dots({ filled, accent }: { filled: number; accent: string }) {
  return (
    <span className="flex gap-1.5">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full ${
            i <= filled ? accent.replace("text-", "bg-") : "bg-black/12"
          }`}
        />
      ))}
    </span>
  );
}

function cn(...c: (string | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

// ─── Page ───────────────────────────────────────────────────────────

export default async function Portrait() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: raw } = await supabase
    .from("profiles")
    .select("prenom, energie_score, qualite_sommeil, niveau_stress, niveau_activite, digestion")
    .eq("id", user.id)
    .single();

  const profile: Profile = raw ?? {
    prenom: null, energie_score: null, qualite_sommeil: null,
    niveau_stress: null, niveau_activite: null, digestion: null,
  };

  const scores      = computeScores(profile);
  const priorityKey = findPriorityKey(scores);
  const priority    = PRIORITIES[priorityKey];

  const PISTES = [
    { label: "Énergie",   icon: "⚡", dots: toDots(scores.energie),   ...dotStyle(toDots(scores.energie))   },
    { label: "Sommeil",   icon: "🌙", dots: toDots(scores.sommeil),   ...dotStyle(toDots(scores.sommeil))   },
    { label: "Stress",    icon: "🌀", dots: toDots(scores.stress),    ...dotStyle(toDots(scores.stress))    },
    { label: "Digestion", icon: "🌿", dots: toDots(scores.digestion), ...dotStyle(toDots(scores.digestion)) },
  ];

  const prenom = profile.prenom;
  const intro  = scores.global >= 75
    ? "Un bel équilibre global. On affine les derniers points."
    : scores.global >= 50
    ? "Une base solide, avec de belles opportunités d'optimisation."
    : "Plusieurs axes à travailler — chaque action compte double maintenant.";

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <HeaderApp backHref="/onboarding" />

      <main className="flex-1 pb-16">

        {/* ── Titre ── */}
        <div
          className="px-5 pt-2 pb-8"
          style={{ animation: "fade-up .45s cubic-bezier(.22,1,.36,1) both" }}
        >
          <h1
            style={{ fontFamily: "var(--font-literata), Georgia, serif" }}
            className="text-[2rem] font-light leading-snug text-ink"
          >
            {prenom ? `${prenom}, voilà` : "Voilà"} ce qu&apos;Aliva<br />
            <span className="italic text-aliva">observe.</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Ta première lecture globale, basée sur tes réponses.
          </p>
        </div>

        {/* ── Score ── */}
        <div
          className="mx-5 flex flex-col items-center rounded-[1.5rem] bg-white py-8"
          style={{ animation: "fade-in .6s cubic-bezier(.22,1,.36,1) .1s both" }}
        >
          <CircleScore score={scores.global} label="ÉQUILIBRE" size={200} />
          <p className="mt-4 px-6 text-center text-sm leading-relaxed text-ink-soft">
            {intro}
          </p>
        </div>

        {/* ── Pistes d'exploration ── */}
        <div
          className="mt-6 px-5"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .2s both" }}
        >
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[.2em] text-ink-soft">
            Pistes d&apos;exploration
          </p>

          <div className="overflow-hidden rounded-[1.25rem] bg-white">
            {PISTES.map((p, i) => (
              <div
                key={p.label}
                className={cn(
                  "flex items-center justify-between px-5 py-4",
                  i < PISTES.length - 1 ? "border-b border-black/5" : "",
                )}
                style={{ animation: `fade-up .35s cubic-bezier(.22,1,.36,1) ${.25 + i * .06}s both` }}
              >
                <div className="flex items-center gap-3">
                  <span className={cn("flex h-9 w-9 items-center justify-center rounded-full text-base", p.bg)}>
                    {p.icon}
                  </span>
                  <span className="text-sm font-medium text-ink">{p.label}</span>
                </div>
                <Dots filled={p.dots} accent={p.accent} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Priorité ── */}
        <div
          className="mx-5 mt-5 rounded-[1.25rem] bg-aliva-pale/70 px-5 py-6"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .5s both" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-aliva">
            Ta priorité cette semaine
          </p>
          <p
            style={{ fontFamily: "var(--font-literata), Georgia, serif" }}
            className="mt-2 text-[1.4rem] font-light leading-snug text-ink"
          >
            {priority.titre}
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
            {priority.desc}
          </p>
        </div>

        {/* ── CTA ── */}
        <div
          className="mt-8 px-5"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .6s both" }}
        >
          <Link
            href="/tableau-de-bord"
            className="flex h-[52px] items-center justify-center rounded-full bg-terracotta text-sm font-semibold tracking-wide text-cream shadow-sm transition-all hover:bg-terracotta/90 active:scale-[.98]"
          >
            Voir mon premier plan →
          </Link>
        </div>

      </main>
    </div>
  );
}
