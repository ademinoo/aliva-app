import Link from "next/link";
import { Container } from "@/components/layout/container";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-5">
      <Container>
        <div className="text-center">
          <p
            style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
            className="text-[6rem] font-light leading-none text-aliva/15"
          >
            404
          </p>
          <h1
            style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
            className="mt-4 text-2xl font-light text-ink"
          >
            Cette page n&apos;existe pas.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Tu t&apos;es peut-être perdu en chemin.<br />
            Aliva t&apos;attend à l&apos;accueil.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-full bg-terracotta px-7 text-sm font-semibold text-cream transition-all hover:bg-terracotta/90 active:scale-[.98]"
            >
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/tableau-de-bord"
              className="inline-flex h-12 items-center justify-center rounded-full border border-aliva px-7 text-sm font-semibold text-aliva transition-all hover:bg-aliva-pale/40 active:scale-[.98]"
            >
              Mon tableau de bord
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
