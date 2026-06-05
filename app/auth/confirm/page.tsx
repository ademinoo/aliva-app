"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ConfirmPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const searchParams = new URLSearchParams(window.location.search);
    const next = searchParams.get("next"); // pas de défaut — on le calcule après

    async function handleAuth() {
      let authed = false;

      // Cas 1 : hash fragment avec access_token (magic link implicit flow)
      const hash = window.location.hash.slice(1);
      if (hash) {
        const p = new URLSearchParams(hash);
        const access_token = p.get("access_token");
        const refresh_token = p.get("refresh_token");
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (!error) authed = true;
        }
      }

      // Cas 2 : code PKCE
      if (!authed) {
        const code = searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error) authed = true;
        }
      }

      // Cas 3 : token_hash (OTP ou PKCE via template email)
      if (!authed) {
        const token_hash = searchParams.get("token_hash");
        const type = searchParams.get("type") as "email" | "magiclink" | null;
        if (token_hash && type) {
          if (token_hash.startsWith("pkce_")) {
            const { error } = await supabase.auth.exchangeCodeForSession(token_hash);
            if (!error) authed = true;
          }
          if (!authed) {
            const { error } = await supabase.auth.verifyOtp({ token_hash, type });
            if (!error) authed = true;
          }
        }
      }

      if (!authed) {
        router.replace("/auth?error=lien-invalide");
        return;
      }

      // Si une destination explicite est passée (ex: ?next=/onboarding), l'utiliser
      if (next) {
        router.replace(next);
        return;
      }

      // Sinon : nouvel utilisateur → onboarding, utilisateur existant → tableau de bord
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth"); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("prenom")
        .eq("id", user.id)
        .maybeSingle();

      router.replace(profile?.prenom ? "/tableau-de-bord" : "/onboarding");
    }

    handleAuth();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <p className="text-sm text-ink-soft">Connexion en cours…</p>
    </div>
  );
}
