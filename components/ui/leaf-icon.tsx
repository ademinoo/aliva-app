import { cn } from "@/lib/cn";

/**
 * Icône feuille organique — 3 pétales rayonnants + tige.
 * Trait, jamais rempli seul — s'adapte à la couleur du parent via `currentColor`.
 */
export function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.55"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      {/* Pétale gauche */}
      <path d="M12 15 C9 13 6 9 8 5 C10.5 3.5 13 7 12 11" />
      {/* Pétale droit */}
      <path d="M12 15 C15 13 18 9 16 5 C13.5 3.5 11 7 12 11" />
      {/* Pétale central (plus court, donne la profondeur) */}
      <path d="M12 11 C11 8 12 5.5 12 5.5 C12 5.5 13 8 12 11" />
      {/* Tige */}
      <line x1="12" y1="15" x2="12" y2="20" />
    </svg>
  );
}

/** Avatar circulaire pour les messages Aliva dans le chat. */
export function LeafAvatar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-aliva",
        className,
      )}
    >
      <LeafIcon className="h-[45%] w-[45%] text-cream" />
    </span>
  );
}
