import Link from "next/link";
import { HeaderApp } from "@/components/layout/header-app";
import { CircleScore } from "@/components/ui/circle-score";
import { BottomNav } from "@/components/ui/bottom-nav";

export default function Bilan() {
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
          <CircleScore score={72} label="/100" size={196} />
          <span className="mt-6 rounded-full bg-aliva-pale px-4 py-2 text-sm font-semibold text-aliva">
            ↗ +8 pts vs semaine dernière
          </span>
        </div>

        {/* ── Stats ── */}
        <div
          className="mt-4 grid grid-cols-2 gap-3"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .1s both" }}
        >
          {[
            { icon: "🌙", label: "Sommeil Moy.", value: "7h15", sub: "+15 min", subColor: "text-aliva" },
            { icon: "⚡", label: "Énergie Moy.", value: "8.2", sub2: "/10", sub: "Stable", subColor: "text-ink-soft" },
          ].map((s) => (
            <div key={s.label} className="rounded-[1.25rem] bg-white px-5 py-5">
              <div className="flex items-center gap-1.5 text-ink-soft">
                <span className="text-base">{s.icon}</span>
                <p className="text-[11px] font-medium">{s.label}</p>
              </div>
              <p
                style={{ fontFamily: "var(--font-literata), Georgia, serif" }}
                className="mt-2.5 text-3xl font-light text-ink"
              >
                {s.value}
                {s.sub2 && <span className="text-base text-ink-soft">{s.sub2}</span>}
              </p>
              <p className={`mt-1 text-xs ${s.subColor}`}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Point fort ── */}
        <div
          className="mt-4 flex items-start gap-4 rounded-[1.25rem] bg-aliva-pale/70 px-5 py-5"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .2s both" }}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-aliva text-sm text-cream">
            ★
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-aliva">Point fort</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink">
              La respiration matinale tenue <strong className="font-semibold">5/7 jours</strong>.
              Une belle régularité qui impacte ton stress.
            </p>
          </div>
        </div>

        {/* ── Mot du coach ── */}
        <div
          className="mt-4 rounded-[1.25rem] bg-white px-5 py-6"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .3s both" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-terracotta">
            ✦ Le mot du coach
          </p>
          <p
            style={{ fontFamily: "var(--font-literata), Georgia, serif" }}
            className="mt-4 text-lg font-light italic leading-relaxed text-ink"
          >
            &ldquo;Cette semaine, on garde simple :{" "}
            <span className="not-italic text-terracotta">sommeil d&apos;abord</span>.
            Essaie de couper les écrans 30 min plus tôt.&rdquo;
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
            Voir mon plan semaine 4 →
          </Link>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
