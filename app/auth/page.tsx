"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Step = "email" | "code" | "devlink";

export default function AuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [devLink, setDevLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Étape 1 : envoi du code ────────────────────────────────────
  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });

    if (!otpError) {
      setStep("code");
      setLoading(false);
      return;
    }

    // Fallback dev : génération lien direct
    const res = await fetch("/api/dev-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, secret: "aliva-dev-2026" }),
    });
    const data = await res.json();
    if (data.link) {
      setDevLink(data.link);
      setStep("devlink");
    } else {
      setError("Erreur d'envoi : " + (data.error ?? "inconnue"));
    }
    setLoading(false);
  }

  // ─── Étape 2 : vérification du code ────────────────────────────
  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: "email",
    });

    if (!verifyError) {
      router.replace("/tableau-de-bord");
      return;
    }

    setError("Code incorrect ou expiré. Vérifie ton mail ou recommence.");
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

        {/* ── Étape 1 : email ── */}
        {step === "email" && (
          <form onSubmit={sendCode} className="flex flex-col gap-4">
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
              {loading ? "Envoi…" : "Recevoir mon code →"}
            </button>
            {error && (
              <p className="rounded-card border border-red-200 bg-red-50 px-4 py-3 text-center text-xs text-red-700">
                {error}
              </p>
            )}
            <p className="text-center text-xs text-ink-soft">
              Un code à 6 chiffres sera envoyé à ton adresse. Aucun mot de passe.
            </p>
          </form>
        )}

        {/* ── Étape 2 : code ── */}
        {step === "code" && (
          <form onSubmit={verifyCode} className="flex flex-col gap-4">
            <div className="mb-2 rounded-card border border-aliva-pale bg-aliva-pale/30 p-4 text-center">
              <p className="text-sm font-medium text-aliva">Code envoyé à</p>
              <p className="mt-0.5 text-sm text-ink-soft">{email}</p>
            </div>
            <div>
              <label htmlFor="code" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-ink-soft">
                Code à 6 chiffres
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full rounded-card border border-black/10 bg-white/60 px-4 py-3 text-center text-2xl tracking-[0.3em] text-ink placeholder:text-ink-soft/30 focus:outline-none focus:ring-2 focus:ring-aliva/30"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="h-12 rounded-pill bg-terracotta text-sm font-semibold text-cream transition-all duration-200 hover:bg-terracotta/90 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Vérification…" : "Accéder à Aliva →"}
            </button>
            {error && (
              <p className="rounded-card border border-red-200 bg-red-50 px-4 py-3 text-center text-xs text-red-700">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={() => { setStep("email"); setCode(""); setError(null); }}
              className="text-center text-xs text-ink-soft underline underline-offset-4"
            >
              Renvoyer un code
            </button>
          </form>
        )}

        {/* ── Fallback dev : lien direct ── */}
        {step === "devlink" && devLink && (
          <div className="rounded-card border border-aliva-pale bg-aliva-pale/30 p-6 text-center">
            <p className="mb-3 text-sm font-medium text-aliva">Accès développeur</p>
            <a
              href={devLink}
              className="inline-flex h-11 items-center justify-center rounded-pill bg-terracotta px-6 text-sm font-semibold text-cream"
            >
              Se connecter →
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
