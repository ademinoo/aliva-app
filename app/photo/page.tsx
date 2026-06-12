"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { HeaderApp } from "@/components/layout/header-app";
import { BottomNav } from "@/components/ui/bottom-nav";
import { LeafIcon } from "@/components/ui/leaf-icon";
import { cn } from "@/lib/cn";
import { createClient } from "@/lib/supabase/client";

// ─── Types ───────────────────────────────────────────────────────────

type Meal = {
  id: string;
  nom: string;
  proteines: number;
  glucides: number;
  lipides: number;
  kcal: number;
  photo_url: string | null;
  heure: string;
};

// Estimations indicatives par portion standard (valeurs moyennes, ±15–20%)
const PRESETS: { nom: string; emoji: string; p: number; g: number; l: number }[] = [
  { nom: "Petit-déjeuner équilibré", emoji: "🥣", p: 18, g: 45, l: 14 },
  { nom: "Œufs + avocat",            emoji: "🥑", p: 20, g: 12, l: 28 },
  { nom: "Salade poulet",            emoji: "🥗", p: 35, g: 20, l: 18 },
  { nom: "Poisson + légumes",        emoji: "🐟", p: 32, g: 25, l: 12 },
  { nom: "Pâtes bolognaise",         emoji: "🍝", p: 28, g: 75, l: 22 },
  { nom: "Bowl végétarien",          emoji: "🥦", p: 18, g: 60, l: 16 },
  { nom: "Steak + frites",           emoji: "🥩", p: 38, g: 55, l: 30 },
  { nom: "Fruits + oléagineux",      emoji: "🍎", p: 6,  g: 30, l: 14 },
  { nom: "Smoothie",                 emoji: "🥤", p: 8,  g: 38, l: 4  },
  { nom: "Yaourt grec + miel",       emoji: "🍯", p: 14, g: 22, l: 6  },
];

function kcalOf(p: number, g: number, l: number) {
  return Math.round(p * 4 + g * 4 + l * 9);
}

function nowHHMM() {
  return new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function todayIso() {
  return new Date().toISOString().split("T")[0];
}

// ─── Page ────────────────────────────────────────────────────────────

export default function PhotoPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  // Formulaire d'ajout
  const [form, setForm] = useState(false);
  const [nom, setNom] = useState("");
  const [prot, setProt] = useState("");
  const [gluc, setGluc] = useState("");
  const [lip, setLip] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ─ Chargement du jour ─
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth"); return; }
      setUserId(user.id);

      const { data } = await supabase
        .from("checkins")
        .select("macros_estimes")
        .eq("user_id", user.id)
        .eq("date", todayIso())
        .maybeSingle();

      const stored = data?.macros_estimes;
      if (Array.isArray(stored)) setMeals(stored as Meal[]);
      setLoading(false);
    }
    load();
  }, [router]);

  // ─ Persistance ─
  const persist = useCallback(async (next: Meal[]) => {
    if (!userId) return;
    const supabase = createClient();
    await supabase
      .from("checkins")
      .upsert(
        { user_id: userId, date: todayIso(), macros_estimes: next, photo_repas_url: next[0]?.photo_url ?? null },
        { onConflict: "user_id,date" },
      );
  }, [userId]);

  // ─ Upload photo (optionnel, non bloquant) ─
  async function handleFile(file: File) {
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("prefix", "repas");
      const res = await fetch("/api/upload-photo", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        if (url) setPhotoUrl(url);
      }
    } catch {
      /* upload optionnel — on garde l'aperçu local et on continue */
    }
    setUploading(false);
  }

  function applyPreset(preset: typeof PRESETS[number]) {
    setNom(preset.nom);
    setProt(String(preset.p));
    setGluc(String(preset.g));
    setLip(String(preset.l));
  }

  function resetForm() {
    setNom(""); setProt(""); setGluc(""); setLip("");
    setPhotoUrl(null); setPreview(null); setForm(false);
  }

  async function saveMeal() {
    const p = Number(prot) || 0;
    const g = Number(gluc) || 0;
    const l = Number(lip) || 0;
    if (!nom.trim() || (p === 0 && g === 0 && l === 0)) return;

    setSaving(true);
    const meal: Meal = {
      id: `${Date.now()}`,
      nom: nom.trim(),
      proteines: p, glucides: g, lipides: l,
      kcal: kcalOf(p, g, l),
      photo_url: photoUrl,
      heure: nowHHMM(),
    };
    const next = [...meals, meal];
    setMeals(next);
    await persist(next);
    setSaving(false);
    resetForm();
  }

  async function removeMeal(id: string) {
    const next = meals.filter((m) => m.id !== id);
    setMeals(next);
    await persist(next);
  }

  // ─ Totaux du jour ─
  const totals = meals.reduce(
    (acc, m) => ({
      p: acc.p + m.proteines,
      g: acc.g + m.glucides,
      l: acc.l + m.lipides,
      kcal: acc.kcal + m.kcal,
    }),
    { p: 0, g: 0, l: 0, kcal: 0 },
  );

  const formKcal = kcalOf(Number(prot) || 0, Number(gluc) || 0, Number(lip) || 0);
  const canSave = nom.trim().length > 0 && formKcal > 0;

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <HeaderApp title="Journal de repas" />

      <main className="flex-1 px-5 pb-28">

        {/* ── Totaux du jour ── */}
        <div
          className="mt-2 overflow-hidden rounded-[1.5rem] bg-white px-5 py-6"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) both" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-ink-soft">
            Aujourd&apos;hui
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              className="text-5xl font-light text-aliva"
            >
              {totals.kcal}
            </span>
            <span className="text-sm text-ink-soft">kcal estimées</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: "Protéines", val: totals.p, color: "text-aliva" },
              { label: "Glucides",  val: totals.g, color: "text-terracotta" },
              { label: "Lipides",   val: totals.l, color: "text-gold" },
            ].map((m) => (
              <div key={m.label} className="rounded-xl bg-cream/70 px-3 py-3 text-center">
                <p className={cn("text-xl font-semibold", m.color)}>{m.val}<span className="text-xs font-normal">g</span></p>
                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[.1em] text-ink-soft">{m.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-ink-soft/70">
            Estimation visuelle ±15–20% selon les portions. Accompagnement éducatif — pas un avis nutritionnel médical.
          </p>
        </div>

        {/* ── Liste des repas ── */}
        {loading ? (
          <div className="mt-4 h-24 animate-pulse rounded-[1.25rem] bg-black/5" />
        ) : meals.length > 0 ? (
          <div className="mt-4 flex flex-col gap-3">
            {meals.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 rounded-[1.25rem] bg-white px-4 py-3"
                style={{ animation: "fade-up .35s cubic-bezier(.22,1,.36,1) both" }}
              >
                {m.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.photo_url} alt={m.nom} className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-aliva-pale text-lg">🍽️</div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{m.nom}</p>
                  <p className="text-xs text-ink-soft">
                    {m.heure} · {m.kcal} kcal · P{m.proteines} G{m.glucides} L{m.lipides}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeMeal(m.id)}
                  aria-label="Supprimer ce repas"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-red-50 hover:text-red-500 active:scale-90"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-[1.25rem] bg-aliva-pale/50 px-5 py-5 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center">
              <LeafIcon className="h-6 w-6 text-aliva" />
            </div>
            <p className="text-sm leading-relaxed text-ink">
              Aucun repas enregistré aujourd&apos;hui. Ajoute ton premier repas pour suivre tes apports.
            </p>
          </div>
        )}

        {/* ── Formulaire d'ajout ── */}
        {form ? (
          <div
            className="mt-4 overflow-hidden rounded-[1.5rem] bg-white px-5 py-5"
            style={{ animation: "fade-up .35s cubic-bezier(.22,1,.36,1) both" }}
          >
            {/* Photo optionnelle */}
            <div
              onClick={() => inputRef.current?.click()}
              className="flex min-h-[110px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-black/15 bg-cream/60 transition-colors hover:border-aliva/40"
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Aperçu" className="h-28 w-full rounded-2xl object-cover" />
              ) : uploading ? (
                <p className="text-sm text-ink-soft">Envoi de la photo…</p>
              ) : (
                <>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-aliva-pale">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#1e5c3a" strokeWidth="1.6"
                      strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-ink">Ajouter une photo (optionnel)</p>
                </>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />

            {/* Presets */}
            <p className="mt-5 mb-2 text-[10px] font-bold uppercase tracking-[.16em] text-ink-soft">
              Estimation rapide
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.nom}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-all active:scale-95",
                    nom === preset.nom
                      ? "border-aliva bg-aliva text-cream"
                      : "border-black/10 bg-white text-ink hover:border-aliva/30",
                  )}
                >
                  {preset.emoji} {preset.nom}
                </button>
              ))}
            </div>

            {/* Nom */}
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom du repas…"
              className="mt-4 w-full rounded-xl border border-black/12 bg-cream/60 px-4 py-3 text-sm text-ink outline-none placeholder-ink-soft/50 focus:border-aliva"
            />

            {/* Macros */}
            <div className="mt-3 grid grid-cols-3 gap-3">
              {([
                { label: "Protéines", val: prot, set: setProt },
                { label: "Glucides",  val: gluc, set: setGluc },
                { label: "Lipides",   val: lip,  set: setLip  },
              ] as const).map((f) => (
                <div key={f.label}>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-[.1em] text-ink-soft">
                    {f.label} (g)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={f.val}
                    onChange={(e) => f.set(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-xl border border-black/12 bg-cream/60 px-3 py-2.5 text-base text-ink outline-none focus:border-aliva"
                  />
                </div>
              ))}
            </div>

            <p className="mt-3 text-center text-sm text-ink-soft">
              ≈ <span className="font-semibold text-aliva">{formKcal} kcal</span>
            </p>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 rounded-full border border-black/10 py-3 text-sm font-semibold text-ink-soft transition-colors hover:bg-black/5"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={saveMeal}
                disabled={!canSave || saving}
                className={cn(
                  "flex-1 rounded-full py-3 text-sm font-semibold transition-all active:scale-[.98]",
                  canSave && !saving
                    ? "bg-terracotta text-cream hover:bg-terracotta/90"
                    : "cursor-not-allowed bg-black/8 text-ink-soft",
                )}
              >
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setForm(true)}
            className="mt-4 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-terracotta text-sm font-semibold tracking-wide text-cream shadow-sm transition-all hover:bg-terracotta/90 active:scale-[.98]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Ajouter un repas
          </button>
        )}

      </main>

      <BottomNav />
    </div>
  );
}
