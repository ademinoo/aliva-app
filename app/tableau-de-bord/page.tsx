"use client";

import { useState } from "react";
import Link from "next/link";
import { HeaderApp } from "@/components/layout/header-app";
import { BottomNav } from "@/components/ui/bottom-nav";
import { CircleScore } from "@/components/ui/circle-score";
import { LeafIcon } from "@/components/ui/leaf-icon";
import { cn } from "@/lib/cn";

const ACTIONS = [
  { id: 1, texte: "5 min cohérence cardiaque", detail: "Inspire 5s — expire 5s, avant ton café." },
  { id: 2, texte: "Petit-déjeuner avant 9h",  detail: "Ton jeûne se termine à 8h30." },
  { id: 3, texte: "10 min marche douce",       detail: "−12% de cortisol en 20 min." },
];

export default function TableauDeBord() {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggle(id: number) {
    setChecked((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  const done = checked.size;
  const total = ACTIONS.length;

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <HeaderApp />

      <main className="flex-1">

        {/* ── 1. Accroche : date + prénom + streak ── */}
        <div
          className="px-5 pt-1 pb-6"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) both" }}
        >
          <p className="text-xs tracking-[.14em] text-ink-soft uppercase">Dimanche 1 Juin</p>
          <div className="mt-1 flex items-baseline justify-between gap-4">
            <h1
              style={{ fontFamily: "var(--font-literata), Georgia, serif" }}
              className="text-4xl font-light leading-none text-ink"
            >
              Bonjour Thomas
            </h1>
            <span className="shrink-0 rounded-full bg-aliva-pale px-3 py-1 text-xs font-bold uppercase tracking-[.1em] text-aliva">
              🔥 5 jours
            </span>
          </div>
        </div>

        {/* ── 2. Score — élément dominant ── */}
        <div
          className="flex justify-center px-5 pb-8"
          style={{ animation: "fade-in .7s cubic-bezier(.22,1,.36,1) .08s both" }}
        >
          <CircleScore score={68} label="ÉQUILIBRE" size={196} />
        </div>

        {/* ── 3. Actions du matin — lignes sur fond blanc ── */}
        <div
          className="mx-5 overflow-hidden rounded-[1.25rem] bg-white"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .15s both" }}
        >
          {/* Titre section */}
          <div className="flex items-baseline justify-between px-5 pt-5 pb-4">
            <h2
              style={{ fontFamily: "var(--font-literata), Georgia, serif" }}
              className="text-xl font-light text-ink"
            >
              Ton matin, Thomas
            </h2>
            <span className="text-xs tabular-nums text-ink-soft">{done}/{total}</span>
          </div>

          {/* Lignes — pas de cartes individuelles */}
          {ACTIONS.map((a, i) => {
            const isChecked = checked.has(a.id);
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => toggle(a.id)}
                className={cn(
                  "flex w-full items-center gap-4 px-5 py-4 text-left transition-colors active:bg-black/3",
                  i < ACTIONS.length - 1 ? "border-b border-black/5" : "pb-5",
                )}
              >
                {/* Case carrée — comme dans les maquettes */}
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

                <span className={cn(
                  "text-sm font-medium leading-snug transition-colors duration-200",
                  isChecked ? "text-black/30 line-through" : "text-ink",
                )}>
                  {a.texte}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback toutes cases cochées */}
        {checked.size === total && (
          <p
            style={{ animation: "fade-up .35s cubic-bezier(.22,1,.36,1) both",
              fontFamily: "var(--font-literata), Georgia, serif" }}
            className="px-5 pt-4 text-base font-light italic text-aliva"
          >
            3 sur 3. C&apos;est ancré.
          </p>
        )}

        {/* ── 4. Message d'Aliva — bloc de couleur, pas une carte blanche ── */}
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
          <p className="text-sm leading-relaxed text-ink">
            L&apos;hydratation matinale réveille ton métabolisme. Un grand verre d&apos;eau
            avant ton café — le cortisol du réveil augmente les pertes hydriques.
          </p>
        </div>

        {/* ── 5. Lien bilan — minimal, sans boîte ── */}
        <Link
          href="/bilan"
          className="mx-5 mt-5 flex items-center justify-between py-1 active:opacity-60"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .32s both" }}
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-ink-soft">
              Bilan semaine 3
            </p>
            <p
              style={{ fontFamily: "var(--font-literata), Georgia, serif" }}
              className="mt-0.5 text-lg font-light text-ink"
            >
              72 / 100 &mdash; +8 pts
            </p>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="h-4 w-4 text-ink-soft">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <div className="h-6" />
      </main>

      {/* FAB Analyser — discret, contextuel */}
      <div className="fixed bottom-24 right-5 z-40">
        <Link
          href="/photo"
          className="flex h-12 items-center gap-2 rounded-full bg-aliva px-5 shadow-md shadow-aliva/25 transition-all active:scale-95 hover:shadow-lg"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <span className="text-[11px] font-bold uppercase tracking-[.14em] text-white">
            Analyser
          </span>
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
