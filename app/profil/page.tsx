"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { HeaderApp } from "@/components/layout/header-app";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Toggle } from "@/components/ui/toggle";
import { createClient } from "@/lib/supabase/client";

async function requestNotifPermission(): Promise<boolean> {
  if (typeof Notification === "undefined") return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

type Prefs = {
  reveil_actif: boolean;
  reveil_heure: string;
  coucher_actif: boolean;
  coucher_heure: string;
  silence_actif: boolean;
};

const DEFAULTS: Prefs = {
  reveil_actif: true,
  reveil_heure: "07:00",
  coucher_actif: true,
  coucher_heure: "22:30",
  silence_actif: false,
};

export default function Profil() {
  const router = useRouter();
  const [prefs,       setPrefs]       = useState<Prefs>(DEFAULTS);
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);
  const [notifPerm,   setNotifPerm]   = useState<NotificationPermission | null>(null);
  const [deleteStep,  setDeleteStep]  = useState<"idle" | "confirm">("idle");
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting,    setDeleting]    = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth"); return; }

      const { data } = await supabase
        .from("notification_preferences")
        .select("reveil_actif, reveil_heure, coucher_actif, coucher_heure, silence_actif")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) setPrefs(data as Prefs);
    }
    load();

    if (typeof Notification !== "undefined") {
      setNotifPerm(Notification.permission);
    }
  }, [router]);

  const save = useCallback(async (next: Prefs) => {
    setSaving(true);
    setSaved(false);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("notification_preferences")
      .upsert({ user_id: user.id, ...next, updated_at: new Date().toISOString() });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  async function update<K extends keyof Prefs>(key: K, value: Prefs[K]) {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    save(next);

    // Demander la permission si on active une notification
    if ((key === "reveil_actif" || key === "coucher_actif") && value === true) {
      const granted = await requestNotifPermission();
      setNotifPerm(granted ? "granted" : "denied");
    }
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function deleteAccount() {
    if (deleteInput !== "SUPPRIMER") return;
    setDeleting(true);
    const res = await fetch("/api/delete-account", { method: "POST" });
    if (res.ok) {
      window.location.href = "/";
    } else {
      setDeleting(false);
      setDeleteStep("idle");
      setDeleteInput("");
    }
  }

  async function resetProfile() {
    setDeleting(true);
    const res = await fetch("/api/reset-profile", { method: "POST" });
    if (res.ok) {
      window.location.href = "/onboarding";
    } else {
      setDeleting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <HeaderApp />

      <main className="flex-1 px-5">

        {/* Titre */}
        <div
          className="pt-2 pb-7"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) both" }}
        >
          <h1
            style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
            className="text-3xl font-light text-ink"
          >
            Paramètres
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Personnalise ton expérience Aliva.
          </p>
        </div>

        {/* Bannière permission notifications refusée */}
        {notifPerm === "denied" && (
          <div className="mb-4 rounded-xl border border-terracotta/20 bg-terracotta/8 px-4 py-3 text-xs leading-relaxed text-terracotta">
            <strong>Notifications bloquées par le navigateur.</strong> Pour les réactiver, va dans les paramètres de ton navigateur et autorise les notifications pour ce site.
          </div>
        )}

        {/* Bannière demande permission */}
        {notifPerm === "default" && (prefs.reveil_actif || prefs.coucher_actif) && (
          <button
            type="button"
            onClick={async () => {
              const granted = await requestNotifPermission();
              setNotifPerm(granted ? "granted" : "denied");
            }}
            className="mb-4 w-full rounded-xl bg-aliva-pale/70 px-4 py-3 text-left text-xs font-medium text-aliva transition-all hover:bg-aliva-pale active:scale-[.98]"
          >
            Autoriser les notifications →
          </button>
        )}

        {/* Statut sauvegarde */}
        {(saving || saved) && (
          <div
            className={`mb-4 flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-medium ${
              saved ? "bg-aliva-pale/70 text-aliva" : "bg-black/5 text-ink-soft"
            }`}
            style={{ animation: "fade-up .25s cubic-bezier(.22,1,.36,1) both" }}
          >
            {saved ? "✓ Préférences sauvegardées" : "Sauvegarde…"}
          </div>
        )}

        {/* Notifications */}
        <section
          className="overflow-hidden rounded-[1.25rem] bg-white"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .08s both" }}
        >
          <div className="flex items-center gap-3 border-b border-black/5 px-5 py-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="#1e5c3a" strokeWidth="1.7"
              strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <h2
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              className="text-lg font-light text-ink"
            >
              Notifications
            </h2>
          </div>

          {/* Réveil */}
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-ink">Heure de réveil</p>
              <p className="text-xs text-ink-soft">Notifications du matin</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={prefs.reveil_heure}
                onChange={(e) => update("reveil_heure", e.target.value)}
                disabled={!prefs.reveil_actif}
                className="text-sm font-medium tabular-nums text-ink bg-transparent outline-none disabled:opacity-40"
              />
              <Toggle checked={prefs.reveil_actif} onChange={(v) => update("reveil_actif", v)} label="Réveil" />
            </div>
          </div>

          {/* Coucher */}
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-ink">Heure du coucher</p>
              <p className="text-xs text-ink-soft">Dernier rappel du soir</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={prefs.coucher_heure}
                onChange={(e) => update("coucher_heure", e.target.value)}
                disabled={!prefs.coucher_actif}
                className="text-sm font-medium tabular-nums text-ink bg-transparent outline-none disabled:opacity-40"
              />
              <Toggle checked={prefs.coucher_actif} onChange={(v) => update("coucher_actif", v)} label="Coucher" />
            </div>
          </div>

          {/* Silence */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-ink">Périodes silencieuses</p>
              <p className="text-xs text-ink-soft">Aucune notification pendant les plages définies</p>
            </div>
            <Toggle checked={prefs.silence_actif} onChange={(v) => update("silence_actif", v)} label="Silence" />
          </div>
        </section>

        {/* Carte premium */}
        <section
          className="relative mt-5 overflow-hidden rounded-[1.5rem] bg-[#ede8df] px-6 pb-7 pt-6"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .16s both" }}
        >
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gold/20" />
          <div className="absolute -right-4 top-6 h-20 w-20 rounded-full bg-gold/12" />

          <div className="relative">
            <h2
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              className="text-2xl font-light text-ink"
            >
              Aliva Premium
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Débloquer l&apos;analyse détaillée de tes repas et des conseils encore plus personnalisés.
            </p>

            <div className="mt-5 rounded-[1rem] border border-black/8 bg-white/70 py-5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-ink-soft">
                Plan Équilibre
              </p>
              <p
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
                className="mt-1 text-5xl font-light text-ink"
              >
                99<span className="text-2xl">€</span>
                <span className="text-lg font-normal text-ink-soft"> / an</span>
              </p>
            </div>

            <ul className="mt-5 flex flex-col gap-2.5">
              {["Essai gratuit de 7 jours", "Garantie satisfait ou remboursé 30j", "Support prioritaire"].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-ink">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#1e5c3a" strokeWidth="2" className="h-4 w-4 shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="mt-6 h-[52px] w-full rounded-full bg-terracotta text-sm font-semibold tracking-wide text-cream shadow-sm transition-all hover:bg-terracotta/90 active:scale-[.98]"
            >
              Commencer l&apos;essai gratuit
            </button>
          </div>
        </section>

        {/* Déconnexion */}
        <section
          className="mt-5 overflow-hidden rounded-[1.25rem] bg-white"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .22s both" }}
        >
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-black/3 active:bg-black/5"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.7"
              strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="text-sm font-medium text-red-600">Se déconnecter</span>
          </button>
        </section>

        {/* Zone danger — suppression de compte */}
        <section
          className="mt-5 overflow-hidden rounded-[1.25rem] bg-white"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .28s both" }}
        >
          <div className="border-b border-black/5 px-5 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-red-500">
              Zone danger
            </p>
          </div>

          {deleteStep === "idle" ? (
            <>
            <button
              type="button"
              onClick={resetProfile}
              disabled={deleting}
              className="flex w-full items-center gap-3 border-b border-black/5 px-5 py-4 text-left transition-colors hover:bg-amber-50/50 active:bg-amber-50 disabled:opacity-40"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.7"
                strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <div>
                <p className="text-sm font-medium text-amber-700">Recommencer le questionnaire</p>
                <p className="text-xs text-ink-soft">Efface tes réponses et ton historique, conserve ton compte</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setDeleteStep("confirm")}
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-red-50/50 active:bg-red-50"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.7"
                strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-600">Supprimer mon compte</p>
                <p className="text-xs text-ink-soft">Toutes tes données seront effacées définitivement</p>
              </div>
            </button>
            </>
          ) : (
            <div className="px-5 py-5">
              <p className="text-sm font-medium text-ink">Confirme la suppression</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                Cette action est irréversible. Ton profil, tes check-ins et ton historique seront supprimés définitivement.
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[.14em] text-ink-soft">
                Tape <span className="text-red-500">SUPPRIMER</span> pour confirmer
              </p>
              <input
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder="SUPPRIMER"
                className="mt-2 w-full rounded-xl border border-black/10 bg-cream px-4 py-3 text-sm text-ink outline-none placeholder-ink-soft/40 focus:border-red-300"
              />
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => { setDeleteStep("idle"); setDeleteInput(""); }}
                  className="flex-1 rounded-full border border-black/10 py-2.5 text-xs font-semibold text-ink-soft transition-colors hover:bg-black/5"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={deleteAccount}
                  disabled={deleteInput !== "SUPPRIMER" || deleting}
                  className="flex-1 rounded-full bg-red-600 py-2.5 text-xs font-semibold text-white transition-all disabled:opacity-30 hover:bg-red-700 active:scale-[.98]"
                >
                  {deleting ? "Suppression…" : "Supprimer définitivement"}
                </button>
              </div>
            </div>
          )}
        </section>

        <p
          className="mt-6 pb-8 text-center text-xs leading-relaxed text-ink-soft/70"
          style={{ animation: "fade-in .5s ease .3s both" }}
        >
          Accompagnement éducatif au bien-être.<br />
          Ce n&apos;est pas un diagnostic médical.
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
