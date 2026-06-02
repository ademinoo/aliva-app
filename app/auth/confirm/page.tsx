"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ConfirmPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const searchParams = new URLSearchParams(window.location.search);
    const next = searchParams.get("next") ?? "/tableau-de-bord";

    async function handleAuth() {
      // Cas 1 : hash fragment avec access_token (magic link implicit flow)
      const hash = window.location.hash.slice(1);
      if (hash) {
        const p = new URLSearchParams(hash);
        const access_token = p.get("access_token");
        const refresh_token = p.get("refresh_token");
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (!error) { router.replace(next); return; }
        }
      }

      // Cas 2 : code PKCE
      const code = searchParams.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) { router.replace(next); return; }
      }

      // Cas 3 : token_hash OTP
      const token_hash = searchParams.get("token_hash");
      const type = searchParams.get("type") as "email" | "magiclink" | null;
      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({ token_hash, type });
        if (!error) { router.replace(next); return; }
      }

      router.replace("/auth?error=lien-invalide");
    }

    handleAuth();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <p className="text-sm text-ink-soft">Connexion en cours…</p>
    </div>
  );
}
