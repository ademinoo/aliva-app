"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HeaderApp } from "@/components/layout/header-app";
import { BottomNav } from "@/components/ui/bottom-nav";
import { CircleScore } from "@/components/ui/circle-score";
import { LeafIcon } from "@/components/ui/leaf-icon";
import { cn } from "@/lib/cn";
import { createClient } from "@/lib/supabase/client";

// ─── Score (même logique que /portrait) ────────────────────────────

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

type Profile = {
  prenom: string | null;
  energie_score: number | null;
  qualite_sommeil: string | null;
  niveau_stress: string | null;
  niveau_activite: string | null;
  digestion: string | null;
};

function computeScores(p: Profile) {
  const energie   = p.energie_score  != null ? p.energie_score / 10 : 0.6;
  const sommeil   = SOMMEIL_SCORE[p.qualite_sommeil ?? ""]   ?? 0.6;
  const stress    = STRESS_SCORE[p.niveau_stress ?? ""]      ?? 0.5;
  const activite  = ACTIVITE_SCORE[p.niveau_activite ?? ""]  ?? 0.5;
  const digestion = DIGESTION_SCORE[p.digestion ?? ""]       ?? 0.7;
  const global    = Math.round(energie*25 + sommeil*25 + stress*25 + activite*15 + digestion*10);
  return { energie, sommeil, stress, activite, digestion, global };
}

function findPriority(s: ReturnType<typeof computeScores>) {
  return [
    { key: "energie",   v: s.energie   },
    { key: "sommeil",   v: s.sommeil   },
    { key: "stress",    v: s.stress    },
    { key: "activite",  v: s.activite  },
    { key: "digestion", v: s.digestion },
  ].sort((a, b) => a.v - b.v)[0].key;
}

// ─── Actions & messages par priorité ───────────────────────────────

type Action = { id: number; texte: string; detail: string };

const ACTIONS: Record<string, Action[]> = {
  energie: [
    { id: 1, texte: "10 min de lumière naturelle au réveil", detail: "Stoppe la mélatonine et synchronise ton horloge circadienne." },
    { id: 2, texte: "Verre d'eau avant le café",             detail: "La caféine à jeun élève le cortisol — hydrate-toi d'abord." },
    { id: 3, texte: "Petit-déjeuner avant 9h",               detail: "La fenêtre anabolique du matin dure jusqu'à 9h30." },
  ],
  sommeil: [
    { id: 1, texte: "Pas d'écran 30 min avant le lit",     detail: "La lumière bleue retarde la mélatonine de 90 min." },
    { id: 2, texte: "Chambre à 18-19°C ce soir",           detail: "La baisse de température corporelle déclenche le sommeil." },
    { id: 3, texte: "Heure de coucher fixe ce soir",       detail: "La régularité du rythme circadien améliore la qualité dès J3." },
  ],
  stress: [
    { id: 1, texte: "5 min cohérence cardiaque",           detail: "Inspire 5s — expire 5s. −23% de cortisol en 1 semaine." },
    { id: 2, texte: "10 min marche sans téléphone",        detail: "−12% de cortisol, +sérotonine. La nature amplifie l'effet." },
    { id: 3, texte: "3 respirations avant chaque repas",   detail: "Active le parasympathique — digestion et absorption améliorées." },
  ],
  activite: [
    { id: 1, texte: "10 min marche après le déjeuner",     detail: "Réduit la glycémie post-prandiale de 22%. Accessible à tous." },
    { id: 2, texte: "Prendre les escaliers",                detail: "3 étages = 15 kcal et pic de BDNF (protéine neuro-protectrice)." },
    { id: 3, texte: "5 min d'étirements debout",            detail: "Relance la circulation lymphatique stoppée par la position assise." },
  ],
  digestion: [
    { id: 1, texte: "Mastiquer 20x par bouchée",           detail: "La digestion commence dans la bouche — réduit ballonnements." },
    { id: 2, texte: "Verre d'eau tiède à jeun",            detail: "Stimule le péristaltisme et le foie dès le réveil." },
    { id: 3, texte: "Éviter sucres raffinés ce matin",     detail: "Le microbiome intestinal régule l'humeur via l'axe gut-brain." },
  ],
};

const MESSAGES: Record<string, string> = {
  energie:   "L'hydratation matinale réveille ton métabolisme. Un grand verre d'eau avant ton café — le cortisol du réveil augmente les pertes hydriques.",
  sommeil:   "Le sommeil profond (N3) est le seul moment où ton cerveau élimine les déchets neuronaux. Chaque heure avant minuit vaut double.",
  stress:    "Le système nerveux ne distingue pas le stress mental du physique. 5 minutes de cohérence cardiaque abaissent le cortisol autant qu'une séance de yoga.",
  activite:  "10 minutes de marche après les repas réduisent la glycémie de 22% et améliorent l'humeur via l'axe muscle-cerveau.",
  digestion: "90% de la sérotonine est produite dans l'intestin. Ce que tu manges influence ton humeur autant que tes pensées.",
};

// ─── Date en français ───────────────────────────────────────────────

function getDateFr() {
  const d = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  return d.charAt(0).toUpperCase() + d.slice(1);
}

// ─── Page ───────────────────────────────────────────────────────────

export default function TableauDeBord() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [checked, setChecked] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("prenom, energie_score, qualite_sommeil, niveau_stress, niveau_activite, digestion")
        .eq("id", user.id)
        .single();
      setProfile(data);
    }
    load();
  }, []);

  function toggle(id: number) {
    setChecked((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  const scores   = profile ? computeScores(profile) : null;
  const priority = scores ? findPriority(scores) : "stress";
  const actions  = ACTIONS[priority];
  const message  = MESSAGES[priority];
  const prenom   = profile?.prenom ?? null;
  const score    = scores?.global ?? null;
  const done     = checked.size;
  const total    = actions.length;

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <HeaderApp />

      <main className="flex-1">

        {/* ── 1. Date + prénom ── */}
        <div
          className="px-5 pt-1 pb-6"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) both" }}
        >
          <p className="text-xs tracking-[.14em] text-ink-soft uppercase">{getDateFr()}</p>
          <div className="mt-1 flex items-baseline justify-between gap-4">
            <h1
              style={{ fontFamily: "var(--font-literata), Georgia, serif" }}
              className="text-4xl font-light leading-none text-ink"
            >
              {prenom ? `Bonjour ${prenom}` : "Bonjour"}
            </h1>
          </div>
        </div>

        {/* ── 2. Score ── */}
        <div
          className="flex justify-center px-5 pb-8"
          style={{ animation: "fade-in .7s cubic-bezier(.22,1,.36,1) .08s both" }}
        >
          {score != null
            ? <CircleScore score={score} label="ÉQUILIBRE" size={196} />
            : <div className="h-[196px] w-[196px] animate-pulse rounded-full bg-black/5" />
          }
        </div>

        {/* ── 3. Actions ── */}
        <div
          className="mx-5 overflow-hidden rounded-[1.25rem] bg-white"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .15s both" }}
        >
          <div className="flex items-baseline justify-between px-5 pt-5 pb-4">
            <h2
              style={{ fontFamily: "var(--font-literata), Georgia, serif" }}
              className="text-xl font-light text-ink"
            >
              {prenom ? `Ton matin, ${prenom}` : "Ton matin"}
            </h2>
            <span className="text-xs tabular-nums text-ink-soft">{done}/{total}</span>
          </div>

          {actions.map((a, i) => {
            const isChecked = checked.has(a.id);
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => toggle(a.id)}
                className={cn(
                  "flex w-full items-center gap-4 px-5 py-4 text-left transition-colors active:bg-black/3",
                  i < actions.length - 1 ? "border-b border-black/5" : "pb-5",
                )}
              >
                <span className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all duration-200",
                  isChecked ? "border-aliva bg-aliva" : "border-black/20",
                )}>
                  {isChecked && (
                    <svg viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2.2"
                      className="h-3 w-3"
                      style={{ animation: "check-pulse .3s cubic-bezier(.22,1,.36,1) both" }}>
                      <path d="M1.5 5.2 L3.8 7.8 L8.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <div>
                  <p className={cn(
                    "text-sm font-medium leading-snug transition-colors duration-200",
                    isChecked ? "text-black/30 line-through" : "text-ink",
                  )}>
                    {a.texte}
                  </p>
                  {!isChecked && (
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{a.detail}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {done === total && (
          <p
            style={{ animation: "fade-up .35s cubic-bezier(.22,1,.36,1) both",
              fontFamily: "var(--font-literata), Georgia, serif" }}
            className="px-5 pt-4 text-base font-light italic text-aliva"
          >
            {total} sur {total}. C&apos;est ancré.
          </p>
        )}

        {/* ── 4. Message du jour ── */}
        <div
          className="mx-5 mt-5 rounded-[1.25rem] bg-aliva-pale/60 px-5 py-5"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .25s both" }}
        >
          <div className="mb-3 flex items-center gap-2">
            <LeafIcon className="h-4 w-4 text-aliva" />
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-aliva">
              Message du jour
            </p>
          </div>
          <p className="text-sm leading-relaxed text-ink">{message}</p>
        </div>

        <div className="h-6" />
      </main>

      <div className="fixed bottom-24 right-5 z-40">
        <Link
          href="/portrait"
          className="flex h-12 items-center gap-2 rounded-full bg-aliva px-5 shadow-md shadow-aliva/25 transition-all active:scale-95 hover:shadow-lg"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <span className="text-[11px] font-bold uppercase tracking-[.14em] text-white">
            Mon portrait
          </span>
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
