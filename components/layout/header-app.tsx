import Link from "next/link";
import { HamburgerMenu } from "@/components/ui/hamburger-menu";
import { Container } from "@/components/layout/container";

interface HeaderAppProps {
  /** Si fourni, affiche une flèche retour vers cette URL. Sinon : hamburger. */
  backHref?: string;
  /** Remplace "Aliva" si besoin (ex : "Bilan de ta semaine"). */
  title?: string;
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function BackArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

export function HeaderApp({ backHref, title }: HeaderAppProps) {
  return (
    <header className="py-4">
      <Container className="relative flex items-center justify-between">
        {/* Gauche : retour ou hamburger */}
        {backHref ? (
          <Link
            href={backHref}
            className="text-aliva transition-opacity hover:opacity-70 active:scale-95"
            aria-label="Retour"
          >
            <BackArrow />
          </Link>
        ) : (
          <HamburgerMenu />
        )}

        {/* Centre : titre Aliva */}
        <span
          className="absolute left-1/2 -translate-x-1/2 text-xl font-light text-aliva"
          style={{ fontFamily: "var(--font-literata), Georgia, serif" }}
        >
          {title ?? "Aliva"}
        </span>

        {/* Droite : cloche */}
        <button
          type="button"
          aria-label="Notifications"
          className="text-ink-soft transition-opacity hover:opacity-70"
        >
          <BellIcon />
        </button>
      </Container>
    </header>
  );
}
