import Link from "next/link";
import { Container } from "@/components/layout/container";
import { OrbeFeuille } from "@/components/ui/orbe-feuille";

export function HeaderAliva() {
  return (
    <header className="py-5">
      <Container className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-aliva transition-opacity hover:opacity-75"
        >
          <OrbeFeuille className="h-7 w-7" />
          <span
            style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
            className="text-xl tracking-[0.04em] font-light"
          >
            Aliva
          </span>
        </Link>
        <span className="text-xs uppercase tracking-[0.18em] text-ink-soft">
          Un univers VIVUM
        </span>
      </Container>
    </header>
  );
}
