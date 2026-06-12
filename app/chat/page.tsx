"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HeaderApp } from "@/components/layout/header-app";
import { BottomNav } from "@/components/ui/bottom-nav";
import { LeafAvatar } from "@/components/ui/leaf-icon";
import { cn } from "@/lib/cn";
import { createClient } from "@/lib/supabase/client";
import { computeScores, findPriorityKey, type ScoreProfile } from "@/lib/score";

interface Msg { id: number; from: "aliva" | "user"; text: string; isLegal?: boolean; }

// ─── Normalisation (sans accents, minuscules) ────────────────────────

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// ─── Base de connaissances ───────────────────────────────────────────

type Entry = { keywords: string[]; answer: string; legal?: string };

const KB: Entry[] = [
  {
    keywords: ["sommeil", "dormir", "dors", "insomnie", "nuit", "coucher", "melatonine", "endormir", "reveille la nuit"],
    answer:
      "Pour mieux dormir, trois leviers fondés : coupe les écrans 30 min avant le lit (la lumière bleue retarde la mélatonine de ~90 min), garde ta chambre à 18–19°C, et fixe une heure de coucher régulière. La régularité du rythme circadien améliore la qualité du sommeil dès la 3e nuit.",
  },
  {
    keywords: ["stress", "anxiete", "anxieux", "angoisse", "tendu", "nerveux", "cortisol", "pression", "panique", "calme"],
    answer:
      "Quand le stress monte : 5 minutes de cohérence cardiaque. Inspire 5 secondes, expire 5 secondes — 6 cycles par minute. Le système nerveux ne distingue pas le stress mental du physique : tu fais baisser le cortisol autant qu'avec une séance de yoga. À refaire chaque matin pour un effet durable (−23% de cortisol en 3 semaines).",
  },
  {
    keywords: ["respiration", "respirer", "souffle", "coherence cardiaque", "365", "breathe"],
    answer:
      "Protocole 365 : 3 fois par jour, 6 respirations par minute, pendant 5 minutes. Inspire 5 secondes par le nez, expire 5 secondes par la bouche. C'est ton outil anti-stress le plus accessible — toujours disponible, partout, gratuitement.",
  },
  {
    keywords: ["energie", "fatigue", "fatigue", "epuise", "coup de barre", "tonus", "vitalite", "motivation basse", "fatigué"],
    answer:
      "Pour ton énergie, commence par le matin : 10 min de lumière naturelle au réveil (ça stoppe la mélatonine résiduelle et synchronise ton horloge interne), un grand verre d'eau avant le café, et un petit-déjeuner avant 9h. Ces 3 gestes calibrent ton énergie pour les 12 heures suivantes.",
  },
  {
    keywords: ["repas", "manger", "midi", "dejeuner", "diner", "alimentation", "nutrition", "glycemie", "assiette", "quoi manger"],
    answer:
      "Une assiette équilibrée : protéines + légumes + une source de bon gras (avocat, huile d'olive, noix). Évite les glucides seuls — la glycémie plonge 2h après et la fatigue s'installe. Astuce : 10 min de marche après le repas réduisent le pic de glycémie de 22%.",
  },
  {
    keywords: ["digestion", "digerer", "ballonnement", "ventre", "intestin", "transit", "constipation", "estomac"],
    answer:
      "Pour ta digestion : mastique 20 fois par bouchée (la digestion commence dans la bouche), commence la journée avec un verre d'eau tiède à jeun pour relancer le péristaltisme, et prends 3 respirations avant chaque repas pour activer le parasympathique. 90% de ta sérotonine est produite dans l'intestin — ça influence aussi ton humeur.",
  },
  {
    keywords: ["sport", "bouger", "marche", "marcher", "exercice", "muscu", "courir", "activite", "mouvement", "entrainement"],
    answer:
      "Le mouvement intégré bat la salle de sport pour la régularité : 10 min de marche après le déjeuner, prendre les escaliers (pic de BDNF, protéine neuro-protectrice), 5 min d'étirements debout pour relancer la circulation. L'idée : bouger souvent plutôt que fort, mais rarement.",
  },
  {
    keywords: ["hydratation", "eau", "boire", "hydrater", "soif"],
    answer:
      "Vise un grand verre d'eau dès le réveil — le cortisol matinal augmente les pertes hydriques. Puis répartis sur la journée plutôt que tout d'un coup. Un repère simple : une urine claire en milieu de journée signe une bonne hydratation.",
  },
  {
    keywords: ["lumiere", "soleil", "matin", "circadien", "chronobiologie", "reveil lumiere"],
    answer:
      "10 minutes de lumière naturelle le matin synchronisent toute ta chronobiologie et stoppent la mélatonine résiduelle. Même par temps gris, l'intensité extérieure est 10 à 50x supérieure à l'éclairage intérieur. C'est le geste le plus sous-estimé pour l'énergie et le sommeil.",
  },
  {
    keywords: ["ecran", "ecrans", "telephone", "lumiere bleue", "scroll"],
    answer:
      "Les écrans le soir retardent ta mélatonine de ~90 min. Coupe-les 30 minutes avant le lit, ou active le mode nuit/lumière chaude après 21h. Remplace le scroll par une lecture ou quelques respirations : ton endormissement sera plus rapide et ton sommeil plus profond.",
  },
  {
    keywords: ["complement", "complements", "magnesium", "vitamine", "omega", "supplement", "d3"],
    answer:
      "Les 3 déficits les plus fréquents à corriger en priorité : Magnésium bisglycinate (stress + sommeil), Vitamine D3+K2 (immunité + os), Oméga-3 (inflammation + cerveau). Commence par le minimum utile avant d'empiler. Le code VIVANT te donne -15% sur ta première commande.",
    legal:
      "En partenariat commercial avec Nutripure. Code VIVANT pour -15% sur ta première commande. Les compléments ne remplacent pas une alimentation équilibrée ni un suivi médical.",
  },
  {
    keywords: ["huile", "huiles", "essentielle", "lavande", "menthe", "aromatherapie", "aroma"],
    answer:
      "Pour le stress : Lavande vraie (Lavandula angustifolia), 2 gouttes en olfaction ou diluées sur les poignets. Pour l'énergie : Menthe poivrée, 1 goutte sur la nuque le matin. Contre-indication : déconseillé pendant la grossesse et chez les enfants de moins de 6 ans.",
    legal:
      "En partenariat avec La Compagnie des Sens. Huiles essentielles tracées, qualité contrôlée. Toujours lire les contre-indications avant utilisation.",
  },
  {
    keywords: ["serie", "streak", "progression", "bilan", "score", "avance"],
    answer:
      "Ta progression est visible dans l'onglet Bilan : score de bien-être, série en cours, record et activité des 7 derniers jours. Continue à cocher tes 3 actions chaque jour — la régularité est tout ce qui compte, plus que la performance d'un seul jour.",
  },
  {
    keywords: ["pourquoi", "abandonner", "lacher", "decourage", "demotive", "envie d arreter", "rechute", "craquer"],
    answer:
      "Pas de souci, on reprend aujourd'hui — un écart n'efface rien. Reviens à ton « pourquoi » profond, celui que tu as noté au départ. Un seul petit geste aujourd'hui suffit à relancer la dynamique. Le progrès n'est jamais une ligne droite.",
  },
  {
    keywords: ["merci", "super", "genial", "parfait", "cool", "top"],
    answer:
      "Avec plaisir. Je suis là quand tu veux — un geste à la fois.",
  },
  {
    keywords: ["bonjour", "salut", "coucou", "hello", "ca va", "comment vas tu"],
    answer:
      "Bonjour ! Comment te sens-tu aujourd'hui ? Dis-moi ce qui te préoccupe — sommeil, stress, énergie, digestion, alimentation — et je te donne le geste juste.",
  },
];

const PRIORITY_REPLY: Record<string, string> = {
  energie:   "Ta priorité du moment, c'est l'énergie. Commence par 10 min de lumière naturelle au réveil et un verre d'eau avant le café — c'est ce qui changera le plus pour toi cette semaine.",
  sommeil:   "Ta priorité du moment, c'est le sommeil. Coupe les écrans 30 min plus tôt ce soir et garde une heure de coucher régulière — la récupération profonde se joue avant minuit.",
  stress:    "Ta priorité du moment, c'est la régulation du stress. 5 min de cohérence cardiaque chaque matin (inspire 5s, expire 5s) — c'est le levier le plus efficace pour ton profil.",
  activite:  "Ta priorité du moment, c'est le mouvement. 10 min de marche après le déjeuner suffisent à réduire ta glycémie et relancer ton énergie — sans salle de sport.",
  digestion: "Ta priorité du moment, c'est ta digestion. Un verre d'eau tiède à jeun le matin et 20 mastications par bouchée — l'axe intestin-cerveau influence ton humeur autant que tes pensées.",
};

function findEntry(input: string): Entry | null {
  const text = normalize(input);
  let best: { entry: Entry; hits: number } | null = null;
  for (const entry of KB) {
    let hits = 0;
    for (const kw of entry.keywords) {
      if (text.includes(kw)) hits++;
    }
    if (hits > 0 && (!best || hits > best.hits)) best = { entry, hits };
  }
  return best?.entry ?? null;
}

// ─── Chips ───────────────────────────────────────────────────────────

const CHIPS = ["Ma priorité", "Conseil repas", "Sommeil", "Stress", "Respiration", "Compléments", "Huiles essentielles"];

const CHIP_QUERY: Record<string, string> = {
  "Conseil repas": "repas",
  "Sommeil": "sommeil",
  "Stress": "stress",
  "Respiration": "respiration",
  "Compléments": "compléments",
  "Huiles essentielles": "huiles essentielles",
};

function buildWelcome(prenom: string | null, priorityKey: string | null): Msg {
  const name = prenom ? ` ${prenom}` : "";
  const tail = priorityKey
    ? ` D'après ton profil, on se concentre sur ${
        { energie: "ton énergie", sommeil: "ton sommeil", stress: "la gestion du stress", activite: "le mouvement", digestion: "ta digestion" }[priorityKey] ?? "ton équilibre"
      }. Pose-moi tes questions quand tu veux.`
    : " Pose-moi tes questions sur le sommeil, le stress, l'énergie, l'alimentation…";
  return {
    id: 1,
    from: "aliva",
    text: `Bonjour${name}.${tail}`,
  };
}

// ─── Page ────────────────────────────────────────────────────────────

export default function Chat() {
  const router = useRouter();
  const [prenom, setPrenom] = useState<string | null>(null);
  const [priorityKey, setPriorityKey] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(2);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth"); return; }
      const { data } = await supabase
        .from("profiles")
        .select("prenom, energie_score, qualite_sommeil, niveau_stress, niveau_activite, digestion")
        .eq("id", user.id)
        .single();

      const nom = (data as { prenom: string | null } | null)?.prenom ?? null;
      let pKey: string | null = null;
      if (data) {
        const scores = computeScores(data as ScoreProfile);
        pKey = findPriorityKey(scores);
      }
      setPrenom(nom);
      setPriorityKey(pKey);
      setMsgs([buildWelcome(nom, pKey)]);
    }
    load();
  }, [router]);

  function respond(query: string) {
    const text = query.trim();
    if (!text) return;

    const newMsgs: Msg[] = [{ id: idRef.current++, from: "user", text }];

    // Intent "priorité"
    if (normalize(text).includes("priorite") || text === "Ma priorité") {
      const key = priorityKey ?? "stress";
      newMsgs.push({ id: idRef.current++, from: "aliva", text: PRIORITY_REPLY[key] ?? PRIORITY_REPLY.stress });
      setMsgs((p) => [...p, ...newMsgs]);
      setInput("");
      return;
    }

    const entry = findEntry(CHIP_QUERY[text] ?? text);
    if (entry) {
      newMsgs.push({ id: idRef.current++, from: "aliva", text: entry.answer });
      if (entry.legal) newMsgs.push({ id: idRef.current++, from: "aliva", text: entry.legal, isLegal: true });
    } else {
      newMsgs.push({
        id: idRef.current++,
        from: "aliva",
        text: `Je peux t'aider sur plusieurs sujets${prenom ? `, ${prenom}` : ""} : sommeil, stress, énergie, alimentation, digestion, mouvement, respiration, compléments ou huiles essentielles. Sur lequel veux-tu un conseil concret ?`,
      });
    }

    setMsgs((p) => [...p, ...newMsgs]);
    setInput("");
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <HeaderApp />

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-52">
        <div className="flex flex-col gap-4">
          {msgs.map((m) => (
            <div
              key={m.id}
              className={cn("flex items-end gap-2.5", m.from === "user" ? "flex-row-reverse" : "flex-row")}
              style={{ animation: "fade-up .3s cubic-bezier(.22,1,.36,1) both" }}
            >
              {m.from === "aliva" && !m.isLegal && (
                <LeafAvatar className="h-8 w-8 shrink-0 mb-0.5" />
              )}
              {m.from === "aliva" && m.isLegal && (
                <div className="h-8 w-8 shrink-0" />
              )}
              <div className={cn(
                "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                m.from === "aliva" && !m.isLegal
                  ? "rounded-bl-sm bg-aliva-pale/80 text-ink"
                  : m.from === "aliva" && m.isLegal
                  ? "rounded-bl-sm border border-black/8 bg-white/60 text-xs text-ink-soft italic"
                  : "rounded-br-sm bg-black/6 text-ink",
              )}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* Zone de saisie */}
      <div className="fixed bottom-16 left-0 right-0 bg-cream/95 backdrop-blur-md pb-2 pt-3 border-t border-black/5">
        <div className="mx-auto max-w-xl px-4">
          {/* Chips */}
          <div className="mb-3 flex flex-wrap gap-2">
            {CHIPS.map((c) => (
              <button key={c} type="button" onClick={() => respond(c)}
                className="rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-xs font-medium text-ink transition-all hover:border-aliva/30 hover:text-aliva active:scale-95">
                {c}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3">
            <input
              type="text"
              placeholder="Écrire à Aliva…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && respond(input)}
              className="flex-1 bg-transparent text-sm text-ink outline-none placeholder-ink-soft/40"
            />
            <button type="button" onClick={() => respond(input)} disabled={!input.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-aliva transition-all disabled:opacity-25 active:scale-90">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" className="h-4 w-4">
                <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <p className="mt-2 text-center text-[10px] text-ink-soft/50">
            Accompagnement éducatif — pas un avis médical
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
