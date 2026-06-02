"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [devLink, setDevLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // Essai envoi email normal
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/confirm` },
    });

    if (!error) {
      setSent(true);
      setLoading(false);
      return;
    }

    // Fallback : génération lien direct (dev)
    const res = await fetch("/api/dev-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, secret: "aliva-dev-2026" }),
    });
    const data = await res.json();
    console.log("dev-login response:", data);
    if (data.link) {
      setDevLink(data.link);
    } else {
      setErrorMsg("Erreur : " + (data.error ?? JSON.stringify(data)));
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="#1e5c3a" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" width="40" height="40" className="mx-auto mb-6">
          <path d="M12 15 C9 13 6 9 8 5 C10.5 3.5 13 7 12 11" />
          <path d="M12 15 C15 13 18 9 16 5 C13.5 3.5 11 7 12 11" />
          <path d="M12 11 C11 8 12 5.5 12 5.5 C12 5.5 13 8 12 11" />
          <line x1="12" y1="15" x2="12" y2="20" />
        </svg>

        <h1 className="text-center font-title text-2xl font-light text-ink mb-2">Aliva</h1>
        <p className="text-center text-sm text-ink-soft mb-8">Ton alliée santé</p>

        {sent ? (
          <div className="rounded-card border border-aliva-pale bg-aliva-pale/30 p-6 text-center">
            <p className="text-sm font-medium text-aliva mb-1">Vérifie ta boîte mail</p>
            <p className="text-sm text-ink-soft">
              Lien envoyé à <strong>{email}</strong>.
            </p>
          </div>
        ) : devLink ? (
          <div className="rounded-card border border-aliva-pale bg-aliva-pale/30 p-6 text-center">
            <p className="text-sm font-medium text-aliva mb-3">Clique pour accéder à Aliva</p>
            <a
              href={devLink}
              className="inline-flex h-11 items-center justify-center rounded-pill bg-terracotta px-6 text-sm font-semibold text-cream"
            >
              Se connecter →
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-widest text-ink-soft mb-2">
                Ton adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="prenom@exemple.com"
                className="w-full rounded-card border border-black/10 bg-white/60 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-aliva/30"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="h-12 rounded-pill bg-terracotta text-sm font-semibold text-cream transition-all duration-200 hover:bg-terracotta/90 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Connexion…" : "Accéder à Aliva →"}
            </button>
            {errorMsg && (
              <p className="rounded-card bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-700 text-center">
                {errorMsg}
              </p>
            )}
            <p className="text-center text-xs text-ink-soft">
              Aucun mot de passe. Connexion sécurisée.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
