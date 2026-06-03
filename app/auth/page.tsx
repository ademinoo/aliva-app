"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Step = "email" | "sent";

export default function AuthPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${location.origin}/auth/confirm`,
      },
    });

    if (otpError) {
      setError("Erreur d'envoi. Réessaie dans quelques secondes.");
    } else {
      setStep("sent");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <svg viewBox="0 0 24 24" fill="none" stroke="#1e5c3a" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" width="40" height="40" className="mx-auto mb-6">
          <path d="M12 15 C9 13 6 9 8 5 C10.5 3.5 13 7 12 11" />
          <path d="M12 15 C15 13 18 9 16 5 C13.5 3.5 11 7 12 11" />
          <path d="M12 11 C11 8 12 5.5 12 5.5 C12 5.5 13 8 12 11" />
          <line x1="12" y1="15" x2="12" y2="20" />
        </svg>

        <h1 className="mb-2 text-center font-title text-2xl font-light text-ink">Aliva</h1>
        <p className="mb-8 text-center text-sm text-ink-soft">Ton alliée santé</p>

        {step === "email" && (
          <form onSubmit={sendLink} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-ink-soft">
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
              {loading ? "Envoi…" : "Recevoir mon lien →"}
            </button>
            {error && (
              <p className="rounded-card border border-red-200 bg-red-50 px-4 py-3 text-center text-xs text-red-700">
                {error}
              </p>
            )}
            <p className="text-center text-xs text-ink-soft">
              Un lien de connexion sera envoyé à ton adresse. Aucun mot de passe.
            </p>
          </form>
        )}

        {step === "sent" && (
          <div className="flex flex-col gap-4 text-center">
            <div className="rounded-card border border-aliva-pale bg-aliva-pale/30 p-6">
              <p className="text-sm font-medium text-aliva">Lien envoyé !</p>
              <p className="mt-2 text-sm text-ink-soft">
                Vérifie ta boîte mail à <span className="font-medium text-ink">{email}</span> et clique sur le lien.
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setStep("email"); setError(null); }}
              className="text-center text-xs text-ink-soft underline underline-offset-4"
            >
              Utiliser une autre adresse
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
