"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const TABS = [
  {
    href: "/tableau-de-bord",
    label: "Aujourd'hui",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
        strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]">
        <rect x="3" y="4" width="18" height="18" rx="2.5" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    href: "/bilan",
    label: "Plan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
        strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  { href: "/photo", label: "Photo", isFab: true },
  {
    href: "/chat",
    label: "Aliva",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
        strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    href: "/profil",
    label: "Profil",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
        strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Espace réservé en bas pour que le contenu ne se cache pas sous la nav */}
      <div className="h-20" />

      <nav className="fixed bottom-0 left-0 right-0 z-50">
        {/* Barre principale */}
        <div className="mx-auto max-w-xl border-t border-black/6 bg-cream/95 backdrop-blur-md">
          <div className="flex items-end justify-around px-1 pt-2 pb-5">
            {TABS.map((tab) => {
              /* FAB photo centré */
              if ("isFab" in tab && tab.isFab) {
                return (
                  <div key="fab" className="relative flex flex-col items-center">
                    {/* Bouton surélevé */}
                    <Link
                      href="/photo"
                      aria-label="Analyser un repas"
                      className="absolute -top-8 flex h-14 w-14 items-center justify-center rounded-full bg-aliva shadow-lg shadow-aliva/30 ring-4 ring-cream transition-all active:scale-95 hover:shadow-xl"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"
                        strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                    </Link>
                    {/* Label sous le FAB (espace) */}
                    <div className="mt-8 text-[10px] font-medium text-ink-soft/60">Photo</div>
                  </div>
                );
              }

              const active = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="flex flex-col items-center gap-1.5 px-3 transition-opacity active:opacity-60"
                >
                  <span className={cn(
                    "transition-colors duration-150",
                    active ? "text-aliva" : "text-ink/30",
                  )}>
                    {tab.icon}
                  </span>
                  <span className={cn(
                    "text-[10px] font-medium tracking-wide transition-colors duration-150",
                    active ? "text-aliva" : "text-ink-soft/60",
                  )}>
                    {tab.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
