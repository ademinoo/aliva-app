"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HeaderApp } from "@/components/layout/header-app";
import { BottomNav } from "@/components/ui/bottom-nav";
import { LeafAvatar } from "@/components/ui/leaf-icon";
import { cn } from "@/lib/cn";
import { createClient } from "@/lib/supabase/client";

interface Msg { id: number; from: "aliva" | "user"; text: string; isLegal?: boolean; }

function buildWelcome(prenom: string | null): Msg {
  const name = prenom ? `${prenom}` : "";
  return {
    id: 1,
    from: "aliva",
    text: name
      ? `Bonjour ${name}. Ton corps demande de la marge aujourd'hui. 10 minutes dehors, sans objectif. C'est suffisant.`
      : "Bonjour. Ton corps demande de la marge aujourd'hui. 10 minutes dehors, sans objectif. C'est suffisant.",
  };
}

// Réponses aux chips rapides
const REPLIES: Record<string, string | { text: string; legal?: string }> = {
  "Conseil repas": "Pour ce midi : protéines + légumes + une poignée de noix. Évite les glucides seuls — la glycémie plonge 2h après et la fatigue s'installe.",
  "Respiration": "Protocole 365. Inspire 5 secondes par le nez, expire 5 secondes par la bouche. 6 cycles par minute, 5 minutes. C'est tout.",
  "Compléments": {
    text: "Pour la récupération et l'énergie quotidienne, trois compléments scientifiquement validés : Magnésium Bisglycinate (stress + sommeil), Vitamine D3+K2 (immunité + os), Oméga-3 (inflammation + cerveau). Le code VIVANT te donne -15% sur ta première commande.",
    legal: "En partenariat commercial avec Nutripure. Code VIVANT pour -15% sur ta première commande. Les compléments ne remplacent pas une alimentation équilibrée ni un suivi médical.",
  },
  "Huiles essentielles": {
    text: "Pour le stress : Lavande vraie (Lavandula angustifolia) — 2 gouttes en olfaction ou diluées sur les poignets. Pour l'énergie : Menthe poivrée — 1 goutte sur la nuque le matin. Contre-indication : déconseillé en cas de grossesse et chez les enfants de moins de 6 ans.",
    legal: "En partenariat avec La Compagnie des Sens. Huiles essentielles tracées, qualité contrôlée. Toujours lire les contre-indications avant utilisation.",
  },
  "Ma série": "Je vois ta progression dans l'onglet Bilan. Continue à cocher tes 3 actions chaque jour — la régularité est tout ce qui compte.",
  "J'ai une question": "Je t'écoute. Pose-la — je te répondrai avec ce que je sais de ton profil.",
};

const CHIPS = Object.keys(REPLIES);

export default function Chat() {
  const router = useRouter();
  const [prenom, setPrenom] = useState<string | null>(null);
  const [msgs, setMsgs]     = useState<Msg[]>([]);
  const [input, setInput]   = useState("");
  const bottomRef           = useRef<HTMLDivElement>(null);
  const idRef               = useRef(2);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth"); return; }
      const { data } = await supabase
        .from("profiles")
        .select("prenom")
        .eq("id", user.id)
        .single();
      const nom = (data as { prenom: string | null } | null)?.prenom ?? null;
      setPrenom(nom);
      setMsgs([buildWelcome(nom)]);
    }
    load();
  }, [router]);

  function send(text: string) {
    if (!text.trim()) return;
    const replyDef = REPLIES[text.trim()];
    let replyText: string;
    let legalText: string | undefined;

    if (typeof replyDef === "object" && replyDef !== null) {
      replyText = replyDef.text;
      legalText = replyDef.legal;
    } else {
      replyText = replyDef ?? `C'est noté${prenom ? `, ${prenom}` : ""}. On y reviendra.`;
    }

    const newMsgs: Msg[] = [
      { id: idRef.current++, from: "user",  text: text.trim() },
      { id: idRef.current++, from: "aliva", text: replyText },
    ];
    if (legalText) {
      newMsgs.push({ id: idRef.current++, from: "aliva", text: legalText, isLegal: true });
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
              <button key={c} type="button" onClick={() => send(c)}
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
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              className="flex-1 bg-transparent text-sm text-ink outline-none placeholder-ink-soft/40"
            />
            <button type="button" onClick={() => send(input)} disabled={!input.trim()}
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
