"use client";

import { useState } from "react";
import { HeaderApp } from "@/components/layout/header-app";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Toggle } from "@/components/ui/toggle";

export default function Profil() {
  const [reveil,  setReveil]  = useState(true);
  const [coucher, setCoucher] = useState(true);
  const [silence, setSilence] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <HeaderApp />

      <main className="flex-1 px-5">

        {/* Titre */}
        <div
          className="pt-2 pb-7"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) both" }}
        >
          <h1
            style={{ fontFamily: "var(--font-literata), Georgia, serif" }}
            className="text-3xl font-light text-ink"
          >
            Paramètres
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Personnalisez votre expérience Aliva.
          </p>
        </div>

        {/* Notifications */}
        <section
          className="overflow-hidden rounded-[1.25rem] bg-white"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .08s both" }}
        >
          <div className="flex items-center gap-3 border-b border-black/5 px-5 py-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="#1e5c3a" strokeWidth="1.7"
              strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <h2
              style={{ fontFamily: "var(--font-literata), Georgia, serif" }}
              className="text-lg font-light text-ink"
            >
              Notifications
            </h2>
          </div>

          {[
            { label: "Heure de réveil",      sub: "Notifications du matin",  val: "07:00", checked: reveil,  set: setReveil },
            { label: "Heure du coucher",     sub: "Dernier rappel du soir",  val: "22:30", checked: coucher, set: setCoucher },
            { label: "Périodes silencieuses",sub: "Aucune notification",     val: "",      checked: silence, set: setSilence },
          ].map((row, i, arr) => (
            <div
              key={row.label}
              className={`flex items-center justify-between px-5 py-4 ${i < arr.length - 1 ? "border-b border-black/5" : ""}`}
            >
              <div>
                <p className="text-sm font-medium text-ink">{row.label}</p>
                <p className="text-xs text-ink-soft">{row.sub}</p>
              </div>
              <div className="flex items-center gap-3">
                {row.val && (
                  <span className="text-sm font-medium tabular-nums text-ink">{row.val}</span>
                )}
                <Toggle checked={row.checked} onChange={row.set} label={row.label} />
              </div>
            </div>
          ))}
        </section>

        {/* Carte premium */}
        <section
          className="relative mt-5 overflow-hidden rounded-[1.5rem] bg-[#ede8df] px-6 pb-7 pt-6"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .16s both" }}
        >
          {/* Décoration cercle or */}
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gold/20" />
          <div className="absolute -right-4 top-6 h-20 w-20 rounded-full bg-gold/12" />

          <div className="relative">
            <h2
              style={{ fontFamily: "var(--font-literata), Georgia, serif" }}
              className="text-2xl font-light text-ink"
            >
              Aliva Premium
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Débloquez l&apos;analyse détaillée de vos repas et des conseils personnalisés.
            </p>

            {/* Prix */}
            <div className="mt-5 rounded-[1rem] border border-black/8 bg-white/70 py-5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-ink-soft">
                Plan Équilibre
              </p>
              <p
                style={{ fontFamily: "var(--font-literata), Georgia, serif" }}
                className="mt-1 text-5xl font-light text-ink"
              >
                99<span className="text-2xl">€</span>
                <span className="text-lg font-normal text-ink-soft"> / an</span>
              </p>
            </div>

            {/* Features */}
            <ul className="mt-5 flex flex-col gap-2.5">
              {["Essai gratuit de 7 jours", "Garantie satisfait ou remboursé 30j", "Support prioritaire"].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-ink">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#1e5c3a" strokeWidth="2" className="h-4 w-4 shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="mt-6 h-[52px] w-full rounded-full bg-terracotta text-sm font-semibold tracking-wide text-cream shadow-sm transition-all hover:bg-terracotta/90 active:scale-[.98]"
            >
              Commencer l&apos;essai gratuit
            </button>
          </div>
        </section>

        {/* Disclaimer */}
        <p
          className="mt-6 pb-8 text-center text-xs leading-relaxed text-ink-soft/70"
          style={{ animation: "fade-in .5s ease .3s both" }}
        >
          Accompagnement éducatif au bien-être.<br />
          Ce n&apos;est pas un diagnostic médical.
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
