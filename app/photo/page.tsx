"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HeaderApp } from "@/components/layout/header-app";
import { BottomNav } from "@/components/ui/bottom-nav";
import { LeafIcon } from "@/components/ui/leaf-icon";
import { createClient } from "@/lib/supabase/client";

export default function PhotoPage() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.replace("/auth");
    }
    checkAuth();
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <HeaderApp />

      <main className="flex flex-1 flex-col items-center justify-center px-5 pb-24 text-center">

        {/* Icône */}
        <div
          className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-aliva-pale"
          style={{ animation: "fade-in .6s cubic-bezier(.22,1,.36,1) both" }}
        >
          <svg
            viewBox="0 0 24 24" fill="none" stroke="#1e5c3a"
            strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
            className="h-9 w-9"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </div>

        {/* Titre */}
        <h1
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            animation: "fade-up .45s cubic-bezier(.22,1,.36,1) .1s both",
          }}
          className="mb-3 text-3xl font-light text-ink"
        >
          Analyse de repas
        </h1>

        {/* Description */}
        <p
          className="max-w-xs text-sm leading-relaxed text-ink-soft"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .2s both" }}
        >
          Prends ton assiette en photo. Aliva estime tes protéines, glucides et lipides
          en quelques secondes — sans saisie manuelle.
        </p>

        {/* Disclaimer estimation */}
        <p
          className="mt-2 text-xs text-ink-soft/60"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .25s both" }}
        >
          Estimation visuelle ±15–20% selon les portions.
        </p>

        {/* Bloc "bientôt disponible" */}
        <div
          className="mt-8 w-full max-w-xs rounded-[1.25rem] bg-aliva-pale/60 px-5 py-5 text-left"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .3s both" }}
        >
          <div className="mb-2 flex items-center gap-2">
            <LeafIcon className="h-4 w-4 text-aliva" />
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-aliva">
              Bientôt disponible
            </p>
          </div>
          <p className="text-sm leading-relaxed text-ink">
            Cette fonctionnalité sera active très prochainement.
            En attendant, décris ton repas directement à Aliva dans le chat.
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/chat"
          className="mt-6 flex h-[52px] w-full max-w-xs items-center justify-center rounded-full bg-terracotta text-sm font-semibold tracking-wide text-cream shadow-sm transition-all hover:bg-terracotta/90 active:scale-[.98]"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .4s both" }}
        >
          Parler à Aliva →
        </Link>

      </main>

      <BottomNav />
    </div>
  );
}
