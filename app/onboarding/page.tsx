"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LeafIcon } from "@/components/ui/leaf-icon";
import { cn } from "@/lib/cn";

type StepId = "prenom" | "ressenti" | "objectif" | "lever" | "digestion" | "pourquoi";

interface Step {
  id: StepId;
  question: string;
  hint: string;
  type: "choice" | "text";
  choices?: string[];
}

const STEPS: Step[] = [
  {
    id: "prenom",
    question: "Comment tu t'appelles ?",
    hint: "Aliva s'adresse toujours à toi par ton prénom.",
    type: "text",
  },
  {
    id: "ressenti",
    question: "Comment tu te sens en ce moment ?",
    hint: "Ça calibre le ton de chaque message.",
    type: "choice",
    choices: ["À plat", "Correct, ça peut aller", "En forme"],
  },
  {
    id: "objectif",
    question: "Ton objectif principal ?",
    hint: "Un seul à la fois — c'est ce qui fonctionne.",
    type: "choice",
    choices: ["Énergie", "Sommeil", "Stress", "Alimentation"],
  },
  {
    id: "lever",
    question: "Tu te lèves à quelle heure ?",
    hint: "Aliva calcule tes horaires de messages à partir de là.",
    type: "choice",
    choices: ["Avant 6h", "Entre 6h et 7h", "Entre 7h et 8h", "Après 8h"],
  },
  {
    id: "digestion",
    question: "Ta digestion, honnêtement ?",
    hint: "L'axe intestin-cerveau est sous-estimé.",
    type: "choice",
    choices: ["Impeccable", "Ballonnements", "Constipation", "Variable"],
  },
  {
    id: "pourquoi",
    question: "Ton « pourquoi » profond.",
    hint: "La question la plus importante. Aliva y reviendra.",
    type: "text",
  },
];

/* ─── Splash ──────────────────────────────────────────────────── */

function Splash({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream" style={{ animation: "fade-in .5s ease both" }}>
      {/* Fond dégradé chaud en haut */}
      <div
        className="relative flex-1"
        style={{
          background: "linear-gradient(160deg, #c9a87c 0%, #d4b896 40%, #f7f4ef 100%)",
          minHeight: "55vh",
        }}
      >
        {/* Fondu vers crème */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{ background: "linear-gradient(to bottom, transparent, #f7f4ef)" }}
        />
      </div>

      {/* Contenu bas */}
      <div className="flex flex-col items-center px-7 pb-14 text-center" style={{ marginTop: "-2rem" }}>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cream shadow-sm">
          <LeafIcon className="h-7 w-7 text-aliva" />
        </div>

        <p
          style={{ fontFamily: "var(--font-literata), Georgia, serif" }}
          className="mt-4 text-2xl font-light text-aliva"
        >
          Aliva
        </p>

        <h1
          style={{ fontFamily: "var(--font-literata), Georgia, serif" }}
          className="mt-5 text-[1.7rem] font-light leading-snug text-ink"
        >
          Commençons par te connaître.
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Une approche sur-mesure pour ton bien-être préventif,
          inspirée par la nature et la science.
        </p>

        <button
          type="button"
          onClick={onStart}
          className="mt-10 h-[52px] w-full rounded-full bg-terracotta text-sm font-semibold tracking-wide text-cream shadow-sm transition-all hover:bg-terracotta/90 active:scale-[.98]"
        >
          Commencer l&apos;exploration
        </button>

        <Link href="/" className="mt-5 text-xs text-ink-soft underline underline-offset-4">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}

/* ─── Barre de progression ─────────────────────────────────────── */

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1 rounded-full transition-all duration-300",
            i <= current ? "bg-aliva" : "bg-black/12",
            i === current ? "w-6" : "w-1.5",
          )}
        />
      ))}
    </div>
  );
}

/* ─── Questionnaire ────────────────────────────────────────────── */

export default function Onboarding() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<"l" | "r">("l");
  const [answers, setAnswers] = useState<Record<StepId, string>>({
    prenom: "", ressenti: "", objectif: "", lever: "", digestion: "", pourquoi: "",
  });

  if (showSplash) return <Splash onStart={() => setShowSplash(false)} />;

  const step = STEPS[stepIndex];
  const answer = answers[step.id];
  const canContinue = answer.trim() !== "";
  const isLast = stepIndex === STEPS.length - 1;

  function next() {
    if (!canContinue) return;
    if (isLast) { router.push("/portrait"); return; }
    setDirection("l");
    setStepIndex((i) => i + 1);
  }

  function back() {
    if (stepIndex === 0) { setShowSplash(true); return; }
    setDirection("r");
    setStepIndex((i) => i - 1);
  }

  const slideClass = direction === "l"
    ? "[animation:slide-left_.3s_cubic-bezier(.22,1,.36,1)_both]"
    : "[animation:slide-right_.3s_cubic-bezier(.22,1,.36,1)_both]";

  return (
    <div className="flex min-h-screen flex-col bg-cream">

      {/* Header minimal */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <button type="button" onClick={back}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-ink-soft transition-colors hover:bg-black/10 active:scale-90">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <ProgressDots current={stepIndex} total={STEPS.length} />
        <span className="w-9" />{/* Espace symétrie */}
      </div>

      {/* Zone question — animée à chaque étape */}
      <div key={stepIndex} className={cn("flex flex-1 flex-col px-5 pt-6 pb-4", slideClass)}>

        {/* Numéro + hint */}
        <p className="mb-3 text-xs uppercase tracking-[.18em] text-ink-soft">
          {String(stepIndex + 1).padStart(2, "0")} — {step.hint}
        </p>

        {/* Question — grande, aérée */}
        <h1
          style={{ fontFamily: "var(--font-literata), Georgia, serif" }}
          className="mb-10 text-[1.75rem] font-light leading-snug text-ink"
        >
          {step.question}
        </h1>

        {/* Réponses */}
        {step.type === "choice" && step.choices ? (
          <div className="flex flex-col gap-2.5">
            {step.choices.map((c) => {
              const sel = answer === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setAnswers((p) => ({ ...p, [step.id]: c }))}
                  className={cn(
                    "flex items-center gap-4 rounded-[1rem] border px-5 py-4 text-left text-sm font-medium transition-all duration-150 active:scale-[.98]",
                    sel
                      ? "border-aliva bg-aliva text-cream"
                      : "border-black/8 bg-white text-ink hover:border-aliva/30",
                  )}
                >
                  {/* Indicateur sélection */}
                  <span className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150",
                    sel ? "border-cream bg-cream" : "border-black/20",
                  )}>
                    {sel && (
                      <span className="h-1.5 w-1.5 rounded-full bg-aliva" />
                    )}
                  </span>
                  {c}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="relative">
            <input
              type="text"
              className="w-full border-b-2 border-black/15 bg-transparent pb-3 pt-1 text-lg text-ink outline-none transition-colors placeholder-ink-soft/40 focus:border-aliva"
              placeholder={step.id === "prenom" ? "Prénom…" : "Écris ce qui te vient…"}
              value={answer}
              onChange={(e) => setAnswers((p) => ({ ...p, [step.id]: e.target.value }))}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && next()}
            />
          </div>
        )}

        <div className="flex-1" />
      </div>

      {/* Bouton continuer — fixé en bas */}
      <div className="px-5 pb-10 pt-4">
        <button
          type="button"
          onClick={next}
          disabled={!canContinue}
          className={cn(
            "h-[52px] w-full rounded-full text-sm font-semibold tracking-wide transition-all duration-200 active:scale-[.98]",
            canContinue
              ? "bg-terracotta text-cream hover:bg-terracotta/90"
              : "bg-black/8 text-ink-soft cursor-not-allowed",
          )}
        >
          {isLast ? "Voir mon portrait →" : "Continuer →"}
        </button>
      </div>
    </div>
  );
}
