"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";

type Mode = "login" | "signup";

function safeNextParam() {
  if (typeof window === "undefined") return null;
  const next = new URLSearchParams(window.location.search).get("next");
  if (!next || !next.startsWith("/") || next.startsWith("//")) return null;
  return next;
}

function authMessage(message?: string) {
  if (!message) return "Une erreur est survenue. Réessaie dans quelques secondes.";

  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Email ou mot de passe incorrect.";
  if (m.includes("email not confirmed")) return "Ton compte doit encore être confirmé.";
  if (m.includes("user already registered") || m.includes("already been registered")) {
    return "Un compte existe déjà avec cet email. Connecte-toi plutôt.";
  }
  if (m.includes("password")) return "Le mot de passe doit contenir au moins 6 caractères.";
  if (m.includes("rate limit")) return "Trop de tentatives. Attends une minute avant de réessayer.";
  return "Impossible de continuer pour le moment. Réessaie dans quelques secondes.";
}

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) router.replace("/tableau-de-bord");
    }
    checkAuth();
  }, [router]);

  async function goAfterAuth() {
    const next = safeNextParam();
    if (next) {
      router.replace(next);
      return;
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/auth");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("prenom")
      .eq("id", user.id)
      .maybeSingle();

    router.replace(profile?.prenom ? "/tableau-de-bord" : "/onboarding");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    const cleanEmail = email.trim().toLowerCase();
    if (password.length < 6) {
      setError("Choisis un mot de passe d'au moins 6 caractères.");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    if (mode === "signup") {
      if (password !== confirmPassword) {
        setError("Les deux mots de passe ne correspondent pas.");
        setLoading(false);
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/confirm`,
        },
      });

      if (signUpError) {
        setError(authMessage(signUpError.message));
        setLoading(false);
        return;
      }

      if (!data.session) {
        setNotice("Compte créé. Si une confirmation email est encore active, elle sera demandée avant la première connexion.");
        setMode("login");
        setPassword("");
        setConfirmPassword("");
        setLoading(false);
        return;
      }

      await goAfterAuth();
      return;
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (loginError) {
      setError(authMessage(loginError.message));
      setLoading(false);
      return;
    }

    await goAfterAuth();
  }

  async function resetPassword() {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError("Entre ton email avant de demander un nouveau mot de passe.");
      return;
    }

    setLoading(true);
    setError(null);
    setNotice(null);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${location.origin}/auth/confirm`,
    });

    if (resetError) setError(authMessage(resetError.message));
    else setNotice("Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé.");
    setLoading(false);
  }

  const isSignup = mode === "signup";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 py-10">
      <div className="w-full max-w-sm">
        <Link href="/" aria-label="Retour à l'accueil" className="mx-auto mb-6 flex w-fit text-aliva">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" width="40" height="40">
            <path d="M12 15 C9 13 6 9 8 5 C10.5 3.5 13 7 12 11" />
            <path d="M12 15 C15 13 18 9 16 5 C13.5 3.5 11 7 12 11" />
            <path d="M12 11 C11 8 12 5.5 12 5.5 C12 5.5 13 8 12 11" />
            <line x1="12" y1="15" x2="12" y2="20" />
          </svg>
        </Link>

        <h1 className="mb-2 text-center font-title text-2xl font-light text-ink">Aliva</h1>
        <p className="mb-8 text-center text-sm text-ink-soft">Ton alliée santé</p>

        <div className="mb-5 grid grid-cols-2 rounded-full bg-black/5 p-1">
          {([
            { key: "login", label: "Connexion" },
            { key: "signup", label: "Créer un compte" },
          ] as { key: Mode; label: string }[]).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setMode(item.key);
                setError(null);
                setNotice(null);
              }}
              className={cn(
                "h-10 rounded-full text-xs font-semibold transition-all",
                mode === item.key ? "bg-white text-aliva shadow-sm" : "text-ink-soft",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-ink-soft">
              Adresse e-mail
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="prenom@exemple.com"
              className="w-full rounded-card border border-black/10 bg-white/70 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-aliva/30"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-ink-soft">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={isSignup ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6 caractères minimum"
              className="w-full rounded-card border border-black/10 bg-white/70 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-aliva/30"
            />
          </div>

          {isSignup && (
            <div>
              <label htmlFor="confirm-password" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-ink-soft">
                Confirmer le mot de passe
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Répète ton mot de passe"
                className="w-full rounded-card border border-black/10 bg-white/70 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-aliva/30"
              />
            </div>
          )}

          {error && (
            <p className="rounded-card border border-red-200 bg-red-50 px-4 py-3 text-center text-xs text-red-700">
              {error}
            </p>
          )}

          {notice && (
            <p className="rounded-card border border-aliva-pale bg-aliva-pale/30 px-4 py-3 text-center text-xs text-aliva">
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-12 rounded-pill bg-terracotta text-sm font-semibold text-cream transition-all duration-200 hover:bg-terracotta/90 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Patiente..." : isSignup ? "Créer mon compte" : "Me connecter"}
          </button>
        </form>

        {!isSignup && (
          <button
            type="button"
            onClick={resetPassword}
            disabled={loading}
            className="mt-5 w-full text-center text-xs text-ink-soft underline underline-offset-4 transition-colors hover:text-ink disabled:opacity-40"
          >
            Mot de passe oublié
          </button>
        )}

        <p className="mt-6 text-center text-xs leading-relaxed text-ink-soft">
          En continuant, tu acceptes les{" "}
          <Link href="/cgu" className="underline underline-offset-4">CGU & confidentialité</Link>.
        </p>
      </div>
    </div>
  );
}
