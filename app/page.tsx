import Link from "next/link";
import { Container } from "@/components/layout/container";
import { HeaderAliva } from "@/components/layout/header-aliva";

// ─── Données ────────────────────────────────────────────────────────────────

const PILIERS = [
  {
    icon: "🔬",
    titre: "Rigoureuse",
    texte: "Chaque conseil est ancré dans la littérature scientifique ou dans une tradition médicale documentée. Jamais de flou, jamais de vague.",
  },
  {
    icon: "🌍",
    titre: "Curieuse du monde",
    texte: "Ayurveda, médecine chinoise, naturopathie occidentale, chronobiologie moderne. 8 traditions médicales croisées pour toi.",
  },
  {
    icon: "🤝",
    titre: "Bienveillante",
    texte: "Elle ne juge pas tes écarts. Elle regarde ce qui est possible aujourd’hui — avec ce que tu as, là où tu en es.",
  },
  {
    icon: "💛",
    titre: "Respectueuse des moyens",
    texte: "3 gammes de budget, 47 protocoles adaptés. Un geste efficace ne coûte pas forcément cher.",
  },
  {
    icon: "🎯",
    titre: "Lucide sur ses limites",
    texte: "Aliva est un outil d’accompagnement éducatif, pas un médecin. Elle te dit quand consulter un professionnel.",
  },
];

const HUIT_GESTES = [
  { icon: "💨", titre: "Respiration", texte: "Cohérence cardiaque, protocoles respiratoires — ton premier outil anti-stress, toujours disponible." },
  { icon: "🥗", titre: "Nutrition", texte: "Ce que tu manges programme ton énergie, ton sommeil et ton humeur sur les 72 heures suivantes." },
  { icon: "🌙", titre: "Sommeil", texte: "La récupération se joue avant le coucher. Lumière, température, rituels — le triptyque fondamental." },
  { icon: "🏃", titre: "Mouvement", texte: "10 min de marche après le repas réduisent la glycémie de 22%. Le mouvement intégré, pas la salle de sport." },
  { icon: "🌿", titre: "Aromathérapie", texte: "47 protocoles issus de 5 000 ans de médecine par les plantes. Tracés, validés, dosés avec précision." },
  { icon: "💊", titre: "Compléments", texte: "Magnésium, Oméga-3, Vitamine D3. Les 3 déficits les plus fréquents — les premiers à corriger." },
  { icon: "🧠", titre: "Cerveau & stress", texte: "Ton système nerveux a une mémoire. On apprend à le recalibrer, pas à l’ignorer ou le masquer." },
  { icon: "☀️", titre: "Lumière & rythme", texte: "10 min de lumière naturelle le matin synchronise toute la chronobiologie — et stoppe la mélatonine résiduelle." },
];

const PARCOURS = [
  {
    num: "01",
    titre: "Cartographie",
    texte: "5 minutes pour qu’Aliva te connaisse. Énergie, sommeil, stress, digestion, mouvement — ton terrain complet, cartographié.",
  },
  {
    num: "02",
    titre: "Première lecture",
    texte: "Ton score de bien-être et une seule priorité. Pas dix conseils à faire. Un geste, celui qui change tout cette semaine.",
  },
  {
    num: "03",
    titre: "Elle t’accompagne",
    texte: "Chaque matin, un conseil personnalisé à ton profil. 3 actions à cocher. Une progression visible en 7 jours.",
  },
  {
    num: "04",
    titre: "Profondeur",
    texte: "Semaine après semaine, Aliva adapte ses recommandations à ton évolution réelle. Plus profond, plus précis.",
  },
];

const BUDGET_PALIERS = [
  {
    range: "15 – 30 €/mois",
    name: "Essentiel",
    desc: "Magnésium bisglycinate, Vitamine D3+K2, 2–3 huiles essentielles de base. Ce palier couvre 80% des besoins courants.",
  },
  {
    range: "40 – 70 €/mois",
    name: "Sportif",
    desc: "Protéines de qualité, Oméga-3 haute concentration, créatine, huiles essentielles de récupération musculaire.",
  },
  {
    range: "80 – 150 €/mois",
    name: "Longévité",
    desc: "Adaptogènes (ashwagandha, rhodiola), NAD+, peptides de collagène marin, protocoles anti-inflammation avancés.",
  },
];

const INCLUS = [
  "Questionnaire initial complet (30 questions)",
  "Score de bien-être personnalisé",
  "3 actions quotidiennes adaptées à ton profil",
  "Chat Aliva en accès libre",
  "Bilan hebdomadaire & suivi de progression",
  "Journal de repas avec estimation des macros",
  "Protocoles personnalisés des 8 gestes",
  "Suivi streak & paliers",
];

const EXPERTS = [
  {
    initiales: "W",
    nom: "William",
    role: "Fondateur & Concepteur",
    bio: "Après une chute en montagne qui a remis en question toute sa santé, William a passé 18 mois à reconstruire son corps. Il a croisé les traditions médicales du monde avec la science moderne pour créer Aliva.",
    color: "bg-aliva",
  },
  {
    initiales: "JL",
    nom: "Dr Johan Leguilloux",
    role: "Neurologue conseil",
    bio: "Spécialiste du système nerveux autonome et de la chronobiologie. Valide les protocoles Aliva liés au sommeil, au stress et à la récupération cérébrale.",
    color: "bg-terracotta",
  },
  {
    initiales: "M",
    nom: "Mélanie K.",
    role: "Sophrologue certifiée RNCP",
    bio: "15 ans de pratique en cabinet. Conçoit les protocoles de respiration et de gestion du stress. Autrice des séquences de cohérence cardiaque d’Aliva.",
    color: "bg-gold",
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-cream">
      <HeaderAliva />

      <main className="flex-1">

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section
          className="pt-10 pb-16"
          style={{ animation: "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
        >
          <Container>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-aliva">
              La santé en profondeur, chaque jour
            </p>
            <h1
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              className="mt-5 text-[2.6rem] font-light leading-[1.15] text-ink sm:text-5xl"
            >
              Ton corps a un capital santé.{" "}
              <span className="italic text-aliva">
                Aliva sait comment l&apos;entretenir.
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              Aliva croise 8 traditions médicales du monde entier avec tes
              données personnelles pour te transmettre, chaque matin, le geste
              juste pour aujourd&apos;hui. Un seul. Pas dix.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/onboarding"
                className="flex h-13 items-center justify-center rounded-full bg-terracotta px-7 text-base font-semibold text-cream transition-all duration-200 hover:bg-terracotta/90 active:scale-[0.98]"
              >
                Faire connaissance →
              </Link>
              <a
                href="#approche"
                className="flex h-13 items-center justify-center rounded-full border border-aliva px-7 text-base font-semibold text-aliva transition-all duration-200 hover:bg-aliva-pale/40 active:scale-[0.98]"
              >
                Découvrir l&apos;approche
              </a>
            </div>

            {/* Social proof */}
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

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { val: "8", label: "traditions médicales" },
                { val: "47", label: "protocoles" },
                { val: "5 000", label: "ans de recul" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-white px-4 py-4 text-center">
                  <p
                    style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
                    className="text-2xl font-light text-aliva"
                  >
                    {s.val}
                  </p>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-[.12em] text-ink-soft">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ══ MESSAGE EXEMPLE ══════════════════════════════════════════════ */}
        <section className="pb-16">
          <Container>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
              Comment elle te parle
            </p>
            <div
              className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white p-5"
              style={{ animation: "notif-appear 0.5s cubic-bezier(0.22,1,0.36,1) 200ms both" }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-aliva">
                Aliva · 7h01
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink">
                Bonjour Thomas. 6h42 de sommeil — ton corps n&apos;a pas eu sa
                dose de récupération profonde. Avant ton café :{" "}
                <strong className="font-medium text-aliva">
                  5 min de cohérence cardiaque
                </strong>
                , inspire 5s / expire 5s. C&apos;est tout pour ce matin.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Pas top", "Bien réveillé", "En forme"].map((r) => (
                  <span
                    key={r}
                    className="rounded-full border border-black/10 px-3 py-1.5 text-xs text-ink-soft"
                  >
                    {r}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-[10px] italic text-ink-soft/60">
                Exemple illustratif — accompagnement éducatif, pas un avis médical.
              </p>
            </div>
          </Container>
        </section>

        {/* ══ CE QUE TU VIS ════════════════════════════════════════════════ */}
        <section className="pb-16">
          <Container>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
              Ce que tu vis peut-être
            </p>
            <h2
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              className="mt-4 text-3xl font-light leading-tight text-ink"
            >
              Ton terrain s&apos;épuise.{" "}
              <span className="italic text-aliva">
                Sans raison apparente.
              </span>
            </h2>
            <div className="mt-8 flex flex-col gap-3">
              {[
                {
                  icon: "⚡",
                  texte: "Tu te lèves fatigué même après 8 heures de sommeil.",
                },
                {
                  icon: "😤",
                  texte: "Le stress s’accumule et tu ne sais pas comment le dissiper durablement.",
                },
                {
                  icon: "🍽️",
                  texte: "Tu manges correctement sur le papier — mais l’énergie ne suit pas.",
                },
                {
                  icon: "🔄",
                  texte: "Tu essaies des choses, ça fonctionne quelques jours, puis tu reprends comme avant.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-[1.25rem] bg-white px-5 py-4"
                  style={{ animation: `fade-up .4s cubic-bezier(.22,1,.36,1) ${i * 60}ms both` }}
                >
                  <span className="mt-0.5 text-xl">{item.icon}</span>
                  <p className="text-sm leading-relaxed text-ink">{item.texte}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[1.25rem] bg-aliva-pale/60 px-5 py-4">
              <p className="text-sm leading-relaxed text-ink">
                <strong className="text-aliva">Aliva ne te donne pas dix conseils.</strong>
                {" "}Elle identifie la priorité de cette semaine — un seul geste,
                le plus efficace pour ton profil — et elle t&apos;accompagne à le tenir.
              </p>
            </div>
          </Container>
        </section>

        {/* ══ VOICI ALIVA ══════════════════════════════════════════════════ */}
        <section id="approche" className="pb-16">
          <Container>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
              Voici Aliva
            </p>
            <h2
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              className="mt-4 text-3xl font-light leading-tight text-ink"
            >
              Une alliée rigoureuse.{" "}
              <span className="italic text-aliva">Cinq piliers.</span>
            </h2>

            <div className="mt-8 flex flex-col gap-4">
              {PILIERS.map((p, i) => (
                <div
                  key={p.titre}
                  className="flex items-start gap-4 rounded-[1.25rem] bg-white px-5 py-5"
                  style={{ animation: `fade-up .4s cubic-bezier(.22,1,.36,1) ${i * 70}ms both` }}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-aliva-pale text-xl">
                    {p.icon}
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{p.titre}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{p.texte}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ══ HUIT GESTES ══════════════════════════════════════════════════ */}
        <section className="pb-16">
          <Container>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
              La méthode
            </p>
            <h2
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              className="mt-4 text-3xl font-light leading-tight text-ink"
            >
              Huit gestes fondés,{" "}
              <span className="italic text-aliva">chaque jour, pour toi.</span>
            </h2>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {HUIT_GESTES.map((g, i) => (
                <div
                  key={g.titre}
                  className="flex flex-col gap-2 rounded-[1.25rem] bg-white px-4 py-4"
                  style={{ animation: `fade-up .4s cubic-bezier(.22,1,.36,1) ${i * 50}ms both` }}
                >
                  <span className="text-2xl">{g.icon}</span>
                  <p className="text-sm font-semibold text-ink">{g.titre}</p>
                  <p className="text-xs leading-relaxed text-ink-soft">{g.texte}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ══ PARCOURS ═════════════════════════════════════════════════════ */}
        <section className="pb-16">
          <Container>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
              Le parcours
            </p>
            <h2
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              className="mt-4 text-3xl font-light leading-tight text-ink"
            >
              Quatre étapes.{" "}
              <span className="italic text-aliva">Un système qui tient.</span>
            </h2>

            <div className="relative mt-8 flex flex-col gap-0">
              {/* Ligne verticale */}
              <div className="absolute left-[22px] top-8 bottom-8 w-[1px] bg-aliva/20" />

              {PARCOURS.map((step, i) => (
                <div
                  key={step.num}
                  className="relative flex items-start gap-5 py-5"
                  style={{ animation: `fade-up .4s cubic-bezier(.22,1,.36,1) ${i * 80}ms both` }}
                >
                  <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-aliva bg-cream text-xs font-bold tracking-[.08em] text-aliva">
                    {step.num}
                  </span>
                  <div className="pt-2">
                    <p className="font-semibold text-ink">{step.titre}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.texte}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Link
                href="/onboarding"
                className="flex h-13 items-center justify-center rounded-full bg-terracotta text-base font-semibold text-cream transition-all duration-200 hover:bg-terracotta/90 active:scale-[0.98]"
              >
                Commencer ma cartographie →
              </Link>
              <p className="mt-3 text-center text-xs text-ink-soft">
                5 minutes · aucune carte bancaire · sans engagement
              </p>
            </div>
          </Container>
        </section>

        {/* ══ HISTOIRE DE WILLIAM ══════════════════════════════════════════ */}
        <section className="pb-16">
          <Container>
            <div className="overflow-hidden rounded-[1.5rem] bg-white">
              <div className="bg-aliva px-6 py-6">
                <p className="text-xs font-semibold uppercase tracking-[.18em] text-cream/70">
                  L&apos;origine
                </p>
                <h2
                  style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
                  className="mt-3 text-2xl font-light leading-tight text-cream"
                >
                  Une chute en montagne.{" "}
                  <span className="italic">
                    Et 18 mois pour reconstruire.
                  </span>
                </h2>
              </div>
              <div className="px-6 py-6">
                <p className="text-sm leading-relaxed text-ink-soft">
                  Après un accident, William s&apos;est retrouvé face à un corps
                  qu&apos;il ne reconnaissait plus. Ni son médecin ni les
                  compléments vendus en pharmacie ne lui donnaient de réponse
                  satisfaisante. Il a commencé à chercher ailleurs — dans les
                  archives scientifiques, dans la médecine ayurvédique, dans la
                  médecine traditionnelle chinoise, dans la naturopathie
                  occidentale.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                  Ce qu&apos;il a trouvé : des protocoles rigoureux, validés sur
                  des millénaires, que personne ne lui avait jamais
                  transmis de façon claire et personnalisée. Aliva est sa
                  réponse à ce vide.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-black/5 pt-6">
                  {[
                    { val: "15 ans", label: "de recherche" },
                    { val: "2", label: "experts partenaires" },
                    { val: "∞", label: "gestes transmis" },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <p
                        style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
                        className="text-2xl font-light text-aliva"
                      >
                        {s.val}
                      </p>
                      <p className="mt-1 text-[10px] font-medium uppercase tracking-[.1em] text-ink-soft">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ══ BUDGET ═══════════════════════════════════════════════════════ */}
        <section className="pb-16">
          <Container>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
              S&apos;adapter à ton budget
            </p>
            <h2
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              className="mt-4 text-3xl font-light leading-tight text-ink"
            >
              Trois gammes.{" "}
              <span className="italic text-aliva">
                Du geste à 5€ au protocole expert.
              </span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Aliva adapte chaque recommandation à ce que tu peux réellement
              investir. Aucun protocole n&apos;est hors de portée.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              {BUDGET_PALIERS.map((b, i) => (
                <div
                  key={b.name}
                  className="flex gap-5 rounded-[1.25rem] bg-white px-5 py-5"
                  style={{ animation: `fade-up .4s cubic-bezier(.22,1,.36,1) ${i * 70}ms both` }}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-aliva-pale">
                    <span
                      style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
                      className="text-sm font-light text-aliva"
                    >
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <p className="font-semibold text-ink">{b.name}</p>
                      <span className="text-xs font-medium text-aliva">{b.range}</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ══ TOUT INCLUS ══════════════════════════════════════════════════ */}
        <section className="pb-16">
          <Container>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
              L&apos;accès
            </p>
            <h2
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              className="mt-4 text-3xl font-light leading-tight text-ink"
            >
              Tout est inclus.{" "}
              <span className="italic text-aliva">Gratuitement.</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Aucune carte bancaire, aucun abonnement. Tu accèdes à
              l&apos;intégralité de l&apos;accompagnement Aliva dès ton inscription.
            </p>

            <div
              className="mt-8 overflow-hidden rounded-[1.5rem] border-2 border-aliva bg-white"
              style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) both" }}
            >
              <div className="bg-aliva px-5 py-1.5">
                <p className="text-[10px] font-bold uppercase tracking-[.18em] text-cream">
                  Accès complet · 0€
                </p>
              </div>
              <div className="px-5 py-6">
                <ul className="space-y-3">
                  {INCLUS.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-ink">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#1e5c3a" strokeWidth="2"
                        className="mt-0.5 h-4 w-4 shrink-0">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/onboarding"
                  className="mt-6 flex h-11 items-center justify-center rounded-full bg-terracotta text-sm font-semibold text-cream transition-all hover:bg-terracotta/90 active:scale-[.98]"
                >
                  Commencer gratuitement →
                </Link>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-ink-soft">
              Sans engagement · Résiliation à tout moment · Données hébergées en Europe
            </p>
          </Container>
        </section>

        {/* ══ EXPERTS ══════════════════════════════════════════════════════ */}
        <section className="pb-16">
          <Container>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
              L&apos;équipe
            </p>
            <h2
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              className="mt-4 text-3xl font-light leading-tight text-ink"
            >
              Des humains derrière chaque protocole.
            </h2>

            <div className="mt-8 flex flex-col gap-4">
              {EXPERTS.map((e, i) => (
                <div
                  key={e.nom}
                  className="flex gap-5 rounded-[1.5rem] bg-white px-5 py-6"
                  style={{ animation: `fade-up .4s cubic-bezier(.22,1,.36,1) ${i * 80}ms both` }}
                >
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${e.color}`}
                  >
                    <span
                      style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
                      className="text-lg font-light text-cream"
                    >
                      {e.initiales}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{e.nom}</p>
                    <p className="text-xs font-medium uppercase tracking-[.1em] text-aliva">
                      {e.role}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{e.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ══ CTA FINAL ════════════════════════════════════════════════════ */}
        <section className="pb-20">
          <Container>
            <div className="overflow-hidden rounded-[1.5rem] bg-ink px-6 py-10 text-center">
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-cream/50">
                La suite commence ici
              </p>
              <h2
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
                className="mt-4 text-3xl font-light leading-tight text-cream"
              >
                Aliva t&apos;attend.{" "}
                <span className="italic text-aliva-pale">
                  Commence par te connaître.
                </span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-cream/60">
                5 minutes. Sans carte bancaire. Sans engagement.
                Le premier geste vers un corps qu&apos;on écoute enfin.
              </p>

              <Link
                href="/onboarding"
                className="mt-8 inline-flex h-13 items-center justify-center rounded-full bg-terracotta px-8 text-base font-semibold text-cream transition-all duration-200 hover:bg-terracotta/90 active:scale-[0.98]"
              >
                Faire ma cartographie →
              </Link>

              <p className="mt-4 text-[10px] text-cream/30">
                Données hébergées en Europe · RGPD · Accompagnement éducatif
              </p>
            </div>
          </Container>
        </section>

      </main>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-black/5 py-8">
        <Container>
          <p className="text-xs leading-relaxed text-ink-soft">
            Aliva propose un accompagnement éducatif au bien-être et à
            l&apos;hygiène de vie. Ses recommandations ne constituent pas un avis
            médical et ne remplacent pas une consultation. Les indicateurs
            proposés sont des pistes à explorer — pas un diagnostic médical.
            Aliva a des partenariats commerciaux avec Nutripure et La Compagnie
            des Sens, signalés sur chaque recommandation concernée.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Link
              href="/cgu"
              className="text-xs uppercase tracking-[0.18em] text-ink-soft underline-offset-4 hover:text-ink hover:underline"
            >
              CGU &amp; Confidentialité
            </Link>
            <span className="text-xs uppercase tracking-[0.18em] text-ink-soft">
              Un univers VIVUM · © 2026 Aliva
            </span>
          </div>
        </Container>
      </footer>
    </div>
  );
}
