"use client";

import { useState, useRef, useEffect } from "react";
import { HeaderApp } from "@/components/layout/header-app";
import { BottomNav } from "@/components/ui/bottom-nav";
import { LeafAvatar } from "@/components/ui/leaf-icon";
import { cn } from "@/lib/cn";

interface Msg { id: number; from: "aliva" | "user"; text: string; }

const INIT: Msg[] = [
  { id: 1, from: "aliva", text: "Alors on ne rajoute rien. Ton corps demande de la marge. Aujourd'hui : 10 minutes dehors, sans objectif. C'est suffisant." },
  { id: 2, from: "user",  text: "Je me sens un peu fatigué ce matin, je pensais sauter ma séance." },
  { id: 3, from: "aliva", text: "C'est noté. Prends le temps qu'il te faut." },
];

const REPLIES: Record<string, string> = {
  "Je veux un conseil repas": "Pour ce midi : protéines + légumes + une poignée de noix. Évite les glucides seuls — la glycémie plonge 2h après et la fatigue s'installe.",
  "Je veux respirer": "Protocole 365. Inspire 5 secondes par le nez, expire 5 secondes par la bouche. 6 cycles par minute, 5 minutes. C'est tout.",
  "J'ai une question": "Je t'écoute. Pose-la — je te répondrai avec ce que je sais de ton profil.",
};

const CHIPS = Object.keys(REPLIES);

export default function Chat() {
  const [msgs, setMsgs] = useState<Msg[]>(INIT);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(INIT.length + 1);

  function send(text: string) {
    if (!text.trim()) return;
    const reply = REPLIES[text.trim()] ?? "C'est noté, Thomas. On y reviendra.";
    setMsgs((p) => [
      ...p,
      { id: idRef.current++, from: "user",  text: text.trim() },
      { id: idRef.current++, from: "aliva", text: reply },
    ]);
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
              {m.from === "aliva" && (
                <LeafAvatar className="h-8 w-8 shrink-0 mb-0.5" />
              )}
              <div className={cn(
                "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                m.from === "aliva"
                  ? "rounded-bl-sm bg-aliva-pale/80 text-ink"
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
                className="rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-xs font-medium text-ink-soft transition-all hover:border-aliva/30 hover:text-aliva active:scale-95">
                {c}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3">
            <input
              type="text"
              placeholder="Répondre à Aliva…"
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
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
