import Link from "next/link";
import { CircleScore } from "@/components/ui/circle-score";
import { HeaderApp } from "@/components/layout/header-app";

const PISTES = [
  { label: "Énergie",   dots: 2, icon: "⚡", accent: "text-aliva",      bg: "bg-aliva-pale/60"     },
  { label: "Sommeil",   dots: 1, icon: "🌙", accent: "text-aliva",      bg: "bg-aliva-pale/60"     },
  { label: "Stress",    dots: 1, icon: "🌀", accent: "text-terracotta", bg: "bg-terracotta/8"      },
  { label: "Digestion", dots: 3, icon: "🌿", accent: "text-aliva",      bg: "bg-aliva-pale/60"     },
];

function Dots({ filled, accent }: { filled: number; accent: string }) {
  return (
    <span className="flex gap-1.5">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn(
            "h-2 w-2 rounded-full",
            i <= filled ? accent.replace("text-", "bg-") : "bg-black/12",
          )}
        />
      ))}
    </span>
  );
}

function cn(...c: (string | undefined)[]) { return c.filter(Boolean).join(" "); }

export default function Portrait() {
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
            Voilà ce qu&apos;Aliva<br />
            <span className="italic text-aliva">observe.</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Votre première lecture globale, basée sur vos réponses.
          </p>
        </div>

        {/* ── Score — sur fond blanc arrondi ── */}
        <div
          className="mx-5 flex flex-col items-center rounded-[1.5rem] bg-white py-8"
          style={{ animation: "fade-in .6s cubic-bezier(.22,1,.36,1) .1s both" }}
        >
          <CircleScore score={68} label="ÉQUILIBRE" size={200} />
          <p className="mt-4 px-6 text-center text-sm leading-relaxed text-ink-soft">
            Une base solide, avec de belles opportunités d&apos;optimisation.
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

          {/* Liste en une seule carte */}
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

        {/* ── Priorité — bloc couleur plein ── */}
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
            Réguler ton système nerveux.
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
            On commence par des ajustements simples pour abaisser le niveau
            de cortisol en fin de journée.
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
