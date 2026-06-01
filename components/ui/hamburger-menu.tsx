"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LeafIcon } from "@/components/ui/leaf-icon";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  {
    href: "/tableau-de-bord",
    label: "Aujourd'hui",
    sub: "Tes actions du jour",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    href: "/bilan",
    label: "Bilan semaine",
    sub: "Score et progression",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    href: "/chat",
    label: "Parler à Aliva",
    sub: "Conversation libre",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    href: "/portrait",
    label: "Mon portrait santé",
    sub: "Ta lecture initiale",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    href: "/profil",
    label: "Paramètres",
    sub: "Notifications et abonnement",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Ferme le drawer à chaque changement de page
  useEffect(() => { setOpen(false); }, [pathname]);

  // Empêche le scroll du body quand le drawer est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Bouton hamburger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu"
        className="text-ink-soft transition-opacity hover:opacity-70 active:scale-95"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
          strokeLinecap="round" className="h-5 w-5">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay sombre */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm transition-all duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-cream shadow-xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header du drawer */}
        <div className="flex items-center justify-between border-b border-black/5 px-5 py-5">
          <Link href="/" className="flex items-center gap-2 text-aliva">
            <LeafIcon className="h-6 w-6" />
            <span
              style={{ fontFamily: "var(--font-literata), Georgia, serif" }}
              className="text-xl font-light tracking-[0.02em]"
            >
              Aliva
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-black/5"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" className="h-4 w-4">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Profil utilisateur (mock) */}
        <div className="flex items-center gap-3 border-b border-black/5 px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-aliva-pale text-base font-semibold text-aliva">
            T
          </div>
          <div>
            <p className="text-sm font-medium text-ink">Thomas</p>
            <p className="text-xs text-ink-soft">Équilibre · semaine 3</p>
          </div>
        </div>

        {/* Liens de navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link, i) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-150 active:scale-[0.98]",
                    active
                      ? "bg-aliva text-cream"
                      : "text-ink hover:bg-black/5",
                  )}
                  style={{ animation: open ? `fade-up 0.35s cubic-bezier(0.22,1,0.36,1) ${i * 50}ms both` : undefined }}
                >
                  <span className={active ? "text-cream" : "text-ink-soft"}>
                    {link.icon}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{link.label}</p>
                    <p className={cn("text-xs", active ? "text-cream/70" : "text-ink-soft")}>
                      {link.sub}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Séparateur */}
          <div className="my-4 border-t border-black/5" />

          {/* Lien landing */}
          <Link
            href="/"
            className="flex items-center gap-4 rounded-xl px-4 py-3 text-ink-soft transition-colors hover:bg-black/5 active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <div>
              <p className="text-sm font-medium text-ink">Accueil</p>
              <p className="text-xs text-ink-soft">Page de présentation</p>
            </div>
          </Link>
        </nav>

        {/* Pied du drawer */}
        <div className="border-t border-black/5 px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">Un univers VIVUM</p>
            <span className="rounded-pill bg-aliva-pale px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-aliva">
              V1
            </span>
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-ink-soft/70">
            Accompagnement éducatif au bien-être. Ce n&apos;est pas un diagnostic médical.
          </p>
        </div>
      </aside>
    </>
  );
}
