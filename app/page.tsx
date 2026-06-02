import Link from "next/link";
import { Container } from "@/components/layout/container";
import { HeaderAliva } from "@/components/layout/header-aliva";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { BottomNav } from "@/components/ui/bottom-nav";

const piliers = [
  {
    titre: "Chaleureuse",
    texte:
      "Une alliée qui s'y connaît, pas un médecin derrière son bureau. On se tutoie, toujours.",
  },
  {
    titre: "Précise",
    texte:
      "Des faits, des chiffres, des sources. Toujours le pourquoi derrière le conseil.",
  },
  {
    titre: "Directe",
    texte:
      "Des phrases courtes, pas de jargon. L'essentiel pour aujourd'hui, rien d'autre.",
  },
  {
    titre: "Ancrée",
    texte:
      "Chaque geste a une racine — scientifique ou ancestrale. Jamais vague, jamais flou.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <HeaderAliva />

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-8 pb-14" style={{ animation: "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both" }}>
          <Container>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-aliva">
              La santé en profondeur, chaque jour
            </p>
            <h1
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              className="mt-5 text-4xl font-light leading-tight text-ink sm:text-5xl"
            >
              Ton corps a un capital santé.{" "}
              <span className="italic text-aliva">
                Aliva sait comment l&apos;entretenir.
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              Aliva croise les sagesses médicales du monde avec tes données
              pour te transmettre, chaque jour, le geste juste pour aujourd&apos;hui.
              Progressivement. Sans jamais te submerger.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/onboarding"
                className="flex h-13 items-center justify-center rounded-pill bg-terracotta px-7 text-base font-semibold text-cream transition-all duration-200 hover:bg-terracotta/90 active:scale-[0.98]"
              >
                Faire connaissance →
              </Link>
              <a
                href="#approche"
                className="flex h-13 items-center justify-center rounded-pill border border-aliva px-7 text-base font-semibold text-aliva transition-all duration-200 hover:bg-aliva-pale/40 active:scale-[0.98]"
              >
                Découvrir l&apos;approche
              </a>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {["S", "M", "T", "A"].map((l) => (
                  <span
                    key={l}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-cream bg-aliva-pale text-xs font-semibold text-aliva"
                  >
                    {l}
                  </span>
                ))}
              </div>
              <p className="text-xs text-ink-soft">
                +200 personnes sur liste d&apos;attente
              </p>
            </div>
          </Container>
        </section>

        {/* Carte notification exemple */}
        <section className="pb-14">
          <Container>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
              Comment elle te parle
            </p>
            <div
              className="rounded-card border border-black/5 bg-white/70 p-5"
              style={{ animation: "notif-appear 0.5s cubic-bezier(0.22,1,0.36,1) 200ms both" }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-aliva">
                Aliva · 7h01
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink">
                Bonjour Thomas. 6h42 de sommeil — ton corps n&apos;a pas eu sa dose de
                récupération profonde. Avant ton café :{" "}
                <strong className="font-medium text-aliva">5 min de cohérence cardiaque</strong>,
                une respiration lente qui apaise le système nerveux. C&apos;est tout
                pour ce matin.
              </p>
              <div className="mt-4 flex gap-2">
                {["Pas top", "Bien réveillé", "En forme"].map((r) => (
                  <span
                    key={r}
                    className="rounded-pill border border-black/10 px-3 py-1.5 text-xs text-ink-soft"
                  >
                    {r}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs italic text-ink-soft">
                Exemple illustratif — à titre informatif, pas un avis médical.
              </p>
            </div>
          </Container>
        </section>

        {/* Approche — 4 piliers */}
        <section id="approche" className="pb-16">
          <Container>
            <h2
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              className="text-3xl font-light leading-tight text-ink"
            >
              Comment Aliva parle —{" "}
              <span className="italic text-aliva">quatre piliers.</span>
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {piliers.map((p, i) => (
                <div
                  key={p.titre}
                  style={{ animation: `fade-up 0.45s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms both` }}
                >
                  <Card tone="soft" className="h-full transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5">
                    <CardTitle>{p.titre}</CardTitle>
                    <CardDescription>{p.texte}</CardDescription>
                  </Card>
                </div>
              ))}
            </div>

            {/* CTA final */}
            <div className="mt-10 text-center">
              <Link
                href="/onboarding"
                className="inline-flex h-13 items-center justify-center rounded-pill bg-terracotta px-8 text-base font-semibold text-cream transition-all duration-200 hover:bg-terracotta/90 active:scale-[0.98]"
              >
                Commencer — c&apos;est gratuit
              </Link>
              <p className="mt-3 text-xs text-ink-soft">
                5 minutes · sans carte bancaire · 99€/an après l&apos;essai
              </p>
            </div>
          </Container>
        </section>
      </main>

      <BottomNav />

      {/* Footer + disclaimer */}
      <footer className="border-t border-black/5 py-8">
        <Container>
          <p className="text-xs leading-relaxed text-ink-soft">
            Aliva propose un accompagnement éducatif au bien-être et à
            l&apos;hygiène de vie. Ses recommandations ne constituent pas un avis
            médical et ne remplacent pas une consultation. Les indicateurs
            proposés sont des pistes à explorer — ce n&apos;est pas un diagnostic
            médical. Aliva a des partenariats commerciaux avec Nutripure et La
            Compagnie des Sens, signalés sur les recommandations concernées.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-ink-soft">
            Un univers VIVUM · © 2026 Aliva
          </p>
        </Container>
      </footer>
    </div>
  );
}
