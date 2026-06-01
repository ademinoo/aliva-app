import { cn } from "@/lib/cn";

/**
 * Logo Aliva — l'orbe-feuille.
 * L'anneau (technologie), la feuille (nature), le point en orbite (intelligence active).
 * L'anneau n'est pas tout à fait fermé : le souffle, l'humain.
 */
export function OrbeFeuille({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <path d="M24 6 a18 18 0 1 1 -6 1.05" strokeLinecap="round" />
      <circle cx="32" cy="8" r="2.4" fill="currentColor" stroke="none" />
      <path d="M24 15 C29 21 29 27 24 33 C19 27 19 21 24 15 Z" strokeLinejoin="round" />
      <path d="M24 17 V31" strokeLinecap="round" />
    </svg>
  );
}
