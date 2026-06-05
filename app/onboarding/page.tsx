"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";
import { OrbeFeuille } from "@/components/ui/orbe-feuille";

// ─── Types ─────────────────────────────────────────────────────────────────

type QType = "text" | "number" | "choice" | "multi" | "slider" | "time-pair" | "photo" | "acs";

interface BaseQ {
  id: string;
  question: string;
  hint: string;
  optional?: boolean;
}
interface TextQ extends BaseQ { type: "text"; placeholder: string }
interface NumberQ extends BaseQ { type: "number"; unit: string; placeholder: string; min: number; max: number }
interface ChoiceQ extends BaseQ { type: "choice"; choices: string[] }
interface MultiQ extends BaseQ { type: "multi"; choices: string[] }
interface SliderQ extends BaseQ { type: "slider"; min: number; max: number }
interface TimePairQ extends BaseQ { type: "time-pair" }
interface PhotoQ extends BaseQ { type: "photo" }
interface ACSQ extends BaseQ { type: "acs" }

type Question = TextQ | NumberQ | ChoiceQ | MultiQ | SliderQ | TimePairQ | PhotoQ | ACSQ;
type Answers = Record<string, string | string[] | number | null>;

// ─── 30 Questions ──────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  { id: "prenom", type: "text", question: "Comment tu t'appelles ?", hint: "Aliva s'adresse toujours à toi par ton prénom.", placeholder: "Ton prénom…" },
  { id: "age", type: "number", question: "Tu as quel âge ?", hint: "L'âge calibre tes besoins métaboliques.", unit: "ans", placeholder: "30", min: 16, max: 100 },
  { id: "ressenti", type: "text", question: "En une phrase, comment tu te sens en ce moment ?", hint: "Ça calibre le ton dès le départ.", placeholder: "Honnêtement…" },
  { id: "objectif_principal", type: "choice", question: "Ton objectif principal ?", hint: "Un seul à la fois — c'est ce qui fonctionne.", choices: ["Énergie", "Sommeil", "Stress", "Poids", "Alimentation", "Sport", "Reconnexion"] },
  { id: "objectif_sportif", type: "choice", question: "Un objectif sportif précis ?", hint: "Si oui, Aliva adapte ton plan d'entraînement.", choices: ["Marathon", "Trail", "Triathlon", "Musculation", "Sport de combat", "Reprise d'activité", "Pas d'objectif sportif"] },
  { id: "pathologies", type: "multi", question: "Des pathologies diagnostiquées ?", hint: "Indispensable pour adapter chaque conseil en toute sécurité.", choices: ["Diabète", "Hypertension", "Thyroïde", "Cœur", "Digestif chronique", "Anxiété / dépression", "Maladie auto-immune", "Aucune"] },
  { id: "medicaments", type: "choice", question: "Des médicaments réguliers ?", hint: "Pour éviter toute interaction avec les compléments.", choices: ["Non, aucun", "Oui — anticoagulants", "Oui — antidépresseurs", "Oui — autre"] },
  { id: "energie", type: "slider", question: "Ton niveau d'énergie aujourd'hui ?", hint: "Le KPI de référence — mesuré chaque semaine.", min: 1, max: 10 },
  { id: "horaires", type: "time-pair", question: "À quelle heure tu te couches et tu te lèves ?", hint: "Aliva calcule tes horaires de messages à partir de ça." },
  { id: "reveil", type: "choice", question: "Comment tu te réveilles habituellement ?", hint: "Indicateur clé de la qualité du sommeil profond.", choices: ["Reposé", "Fatigué mais ça passe", "Épuisé", "Variable"] },
  { id: "rituels_soir", type: "choice", question: "Tes rituels du soir ?", hint: "Chronobiologie + Ayurveda — le soir conditionne le lendemain.", choices: ["Écrans jusqu'au lit", "Lecture", "Méditation", "Un peu de tout", "Aucun rituel"] },
  { id: "regime", type: "choice", question: "Ton alimentation ?", hint: "La base de toutes les recommandations nutritionnelles.", choices: ["Omnivore", "Flexitarien", "Végétarien", "Végan", "Paléo", "Sans gluten", "Méditerranéen"] },
  { id: "digestion", type: "choice", question: "Ta digestion, honnêtement ?", hint: "L'axe intestin-cerveau influence tout — humeur, énergie, immunité.", choices: ["Impeccable", "Ballonnements fréquents", "Constipation", "Diarrhées", "Brûlures d'estomac"] },
  { id: "regularite_repas", type: "choice", question: "Tes repas sont réguliers ou sautés ?", hint: "Oriente le protocole de jeûne intermittent adapté.", choices: ["Toujours réguliers", "Parfois sautés", "Souvent sautés"] },
  { id: "alcool_cafe_sucre", type: "acs", question: "Alcool, café, sucre — honnêtement ?", hint: "Les 3 inflammatoires majeurs. Sans jugement, c'est pour mieux t'aider." },
  { id: "activite", type: "choice", question: "Combien tu bouges par jour ?", hint: "Pour calibrer tes recommandations de mouvement.", choices: ["Sédentaire (bureau toute la journée)", "Un peu (quelques marches)", "Modéré (30 min / jour)", "Actif (sport régulier)", "Intensif (entraînements fréquents)"] },
  { id: "douleurs", type: "multi", question: "Des douleurs récurrentes ?", hint: "Certaines pratiques sont contre-indiquées selon les zones.", choices: ["Dos", "Nuque", "Genoux", "Hanches", "Maux de tête", "Tensions musculaires", "Aucune"] },
  { id: "effort", type: "choice", question: "Ton corps face à l'effort ?", hint: "Profil Ayurveda Prakriti — ton terrain de récupération.", choices: ["Je récupère bien", "Courbatures longues (2-3 jours)", "Je me blesse facilement"] },
  { id: "stress", type: "choice", question: "Comment tu gères le stress ?", hint: "Calibre les outils de régulation du système nerveux.", choices: ["Plutôt bien", "Je suis souvent tendu", "Anxiété régulière", "Ça affecte mon sommeil", "Ça affecte mes relations"] },
  { id: "emotion", type: "choice", question: "L'émotion la plus présente en toi ces derniers temps ?", hint: "En MTC, les émotions sont reliées aux organes.", choices: ["Anxiété", "Tristesse", "Colère", "Frustration", "Épuisement", "Joie"] },
  { id: "vie_sociale", type: "choice", question: "Ta vie sociale ?", hint: "L'isolement et la sur-sollicitation ont des effets opposés sur le terrain.", choices: ["Trop sollicité", "Équilibrée", "Peu de liens", "Plutôt seul", "Solitude choisie"] },
  { id: "temperature", type: "choice", question: "Tu es plutôt froid ou chaud ?", hint: "Indicateur Dosha Ayurveda — ta constitution de base.", choices: ["Toujours froid", "Facilement chaud", "Je m'adapte"] },
  { id: "dosha", type: "choice", question: "Quelle phrase te ressemble le plus ?", hint: "Pour identifier ta constitution Ayurvédique.", choices: ["Je pense beaucoup, j'ai du mal à m'arrêter (Vata)", "Je m'enflamme vite, je suis déterminé (Pitta)", "Je suis stable mais parfois peu motivé (Kapha)"] },
  { id: "wearable", type: "choice", question: "Tu as une montre connectée ?", hint: "Aliva peut intégrer tes données de sommeil et d'activité.", choices: ["Apple Watch", "Garmin", "Fitbit", "Oura Ring", "Autre montre", "Non"] },
  { id: "poids", type: "number", question: "Ton poids ?", hint: "Calibre les dosages et l'hydratation à ta morphologie.", unit: "kg", placeholder: "70", min: 30, max: 300 },
  { id: "taille", type: "number", question: "Ta taille ?", hint: "Avec le poids, affine l'indicateur métabolique.", unit: "cm", placeholder: "170", min: 100, max: 250 },
  { id: "tour_taille", type: "number", question: "Ton tour de taille ?", hint: "Indicateur cardiométabolique — plus précis que l'IMC.", unit: "cm", placeholder: "80", min: 40, max: 200, optional: true },
  { id: "budget_complements", type: "choice", question: "Ton budget mensuel pour les compléments ?", hint: "Aliva ne dépasse jamais ton budget. Le minimum utile d'abord.", choices: ["Essentiel — 15 à 30€ / mois", "Performance — 40 à 70€ / mois", "Longévité — 80 à 150€ / mois"] },
  { id: "photo_langue", type: "photo", question: "Photo de ta langue", hint: "Indicateur bien-être inspiré de la MTC. Non-invasif, optionnel.", optional: true },
  { id: "pourquoi", type: "text", question: "Ton « pourquoi » profond.", hint: "La question la plus importante. Aliva y reviendra dans les moments difficiles.", placeholder: "Pourquoi tu veux prendre soin de toi aujourd'hui ?" },
];

// ─── DB field mapping ──────────────────────────────────────────────────────

function buildProfilePatch(answers: Answers) {
  const activiteMap: Record<string, string> = {
    "Sédentaire (bureau toute la journée)": "sedentaire",
    "Un peu (quelques marches)": "leger",
    "Modéré (30 min / jour)": "modere",
    "Actif (sport régulier)": "actif",
    "Intensif (entraînements fréquents)": "intensif",
  };

  const horaires = (answers.horaires as string) ?? "";
  const [heureCoucher, heureLever] = horaires.split("|");

  const budgetRaw = (answers.budget_complements as string) ?? "";
  const budgetMap: Record<string, string> = {
    "Essentiel — 15 à 30€ / mois": "essentiel",
    "Performance — 40 à 70€ / mois": "performance",
    "Longévité — 80 à 150€ / mois": "longevite",
  };

  return {
    prenom:            (answers.prenom as string) || null,
    age:               answers.age ? Number(answers.age) : null,
    objectif_principal:(answers.objectif_principal as string) || null,
    objectif_sportif:  (answers.objectif_sportif as string) || null,
    pathologies:       Array.isArray(answers.pathologies) ? answers.pathologies : [],
    medicaments:       (answers.medicaments as string) || null,
    energie_score:     typeof answers.energie === "number" ? answers.energie : null,
    heure_coucher:     heureCoucher?.trim() || null,
    heure_lever:       heureLever?.trim() || null,
    qualite_sommeil:   (answers.reveil as string) || null,
    regime:            (answers.regime as string) || null,
    digestion:         (answers.digestion as string) || null,
    niveau_activite:   activiteMap[answers.activite as string] ?? null,
    douleurs:          Array.isArray(answers.douleurs) ? answers.douleurs : [],
    niveau_stress:     (answers.stress as string) || null,
    emotion:           (answers.emotion as string) || null,
    dosha:             (answers.dosha as string) || null,
    poids_kg:          answers.poids ? parseFloat(answers.poids as string) : null,
    taille_cm:         answers.taille ? parseInt(answers.taille as string) : null,
    tour_taille_cm:    answers.tour_taille ? parseFloat(answers.tour_taille as string) : null,
    budget_complements:budgetMap[budgetRaw] ?? null,
    wearable:          (answers.wearable as string) || null,
    pourquoi_profond:  (answers.pourquoi as string) || null,
    photo_langue_url:  (answers.photo_langue as string) || null,
  };
}

// ─── Splash ────────────────────────────────────────────────────────────────

function Splash({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-cream" style={{ animation: "fade-in .5s ease both" }}>

      {/* Gradient haut */}
      <div
        className="w-full"
        style={{ height: "48vh", background: "linear-gradient(180deg, #cce8d8 0%, #f7f4ef 100%)" }}
      />

      {/* Icône centrée à la jointure — positionnée en absolu, aucun risque de clipping */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-10"
        style={{ top: "calc(48vh - 40px)" }}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream shadow-md">
          <OrbeFeuille className="h-12 w-12 text-aliva" />
        </div>
      </div>

      {/* Contenu bas */}
      <div className="flex flex-col items-center px-7 pb-14 text-center" style={{ paddingTop: "3.5rem" }}>
        <p
          style={{ fontFamily: "var(--font-fraunces), Georgia, serif", letterSpacing: "0.04em" }}
          className="text-2xl font-light text-aliva"
        >
          Aliva
        </p>
        <h1
          style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
          className="mt-4 text-[1.7rem] font-light leading-snug text-ink"
        >
          Commençons par<br /><em className="text-aliva">te connaître.</em>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          30 questions · 5 minutes · Pour un plan qui te ressemble vraiment.
        </p>
        <button
          type="button"
          onClick={onStart}
          className="mt-10 h-[52px] w-full rounded-full bg-terracotta text-sm font-semibold tracking-wide text-cream shadow-sm transition-all hover:bg-terracotta/90 active:scale-[.98]"
        >
          Commencer →
        </button>
        <Link href="/" className="mt-5 text-xs text-ink-soft underline underline-offset-4">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}

// ─── Progress bar ──────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 bg-black/8 rounded-full overflow-hidden">
        <div
          className="h-full bg-aliva rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-ink-soft shrink-0">{pct}%</span>
    </div>
  );
}

// ─── Back arrow ────────────────────────────────────────────────────────────

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-ink-soft transition-colors hover:bg-black/10 active:scale-90"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M19 12H5M12 5l-7 7 7 7" />
      </svg>
    </button>
  );
}

// ─── Choice button ─────────────────────────────────────────────────────────

function ChoiceBtn({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-[1rem] border px-5 py-4 text-left text-sm font-medium transition-all duration-150 active:scale-[.98]",
        selected ? "border-aliva bg-aliva text-cream" : "border-black/8 bg-white text-ink hover:border-aliva/30",
      )}
    >
      <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all", selected ? "border-cream bg-cream" : "border-black/20")}>
        {selected && <span className="h-1.5 w-1.5 rounded-full bg-aliva" />}
      </span>
      {label}
    </button>
  );
}

// ─── ACS question (Alcool/Café/Sucre) ─────────────────────────────────────

const ACS_ITEMS = ["Alcool", "Café", "Sucre"];
const ACS_OPTS = ["Jamais", "Rare", "Modéré", "Excès"];

function ACSQuestion({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const parsed: Record<string, string> = {};
  if (value) {
    try { Object.assign(parsed, JSON.parse(value)); } catch { /* ignore */ }
  }

  function set(item: string, opt: string) {
    const next = { ...parsed, [item]: opt };
    onChange(JSON.stringify(next));
  }

  return (
    <div className="flex flex-col gap-4">
      {ACS_ITEMS.map((item) => (
        <div key={item}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[.12em] text-ink-soft">{item}</p>
          <div className="grid grid-cols-4 gap-2">
            {ACS_OPTS.map((opt) => {
              const sel = parsed[item] === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => set(item, opt)}
                  className={cn(
                    "flex-1 rounded-xl border py-3 text-sm font-medium transition-all active:scale-95",
                    sel ? "border-aliva bg-aliva text-cream" : "border-black/8 bg-white text-ink hover:border-aliva/30",
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Time pair question ────────────────────────────────────────────────────

function sleepDuration(coucher: string, lever: string): string | null {
  if (!coucher || !lever) return null;
  const [ch, cm] = coucher.split(":").map(Number);
  const [lh, lm] = lever.split(":").map(Number);
  let minutes = (lh * 60 + lm) - (ch * 60 + cm);
  if (minutes <= 0) minutes += 24 * 60; // passage minuit
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h de sommeil` : `${h}h${String(m).padStart(2, "0")} de sommeil`;
}

function TimePairQuestion({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const parts = value ? value.split("|") : ["", ""];
  const [coucher, lever] = parts;
  const duree = sleepDuration(coucher, lever);

  function update(field: "coucher" | "lever", v: string) {
    if (field === "coucher") onChange(`${v}|${lever}`);
    else onChange(`${coucher}|${v}`);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4">
        <div className="flex-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[.12em] text-ink-soft">Coucher</p>
          <input
            type="time"
            value={coucher}
            onChange={(e) => update("coucher", e.target.value)}
            className="w-full rounded-xl border border-black/12 bg-white px-4 py-3.5 text-base text-ink outline-none focus:border-aliva"
          />
        </div>
        <div className="flex-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[.12em] text-ink-soft">Lever</p>
          <input
            type="time"
            value={lever}
            onChange={(e) => update("lever", e.target.value)}
            className="w-full rounded-xl border border-black/12 bg-white px-4 py-3.5 text-base text-ink outline-none focus:border-aliva"
          />
        </div>
      </div>
      {duree && (
        <div className="flex items-center gap-2 rounded-xl bg-aliva-pale/60 px-4 py-3" style={{ animation: "fade-in .25s ease both" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#1e5c3a" strokeWidth="1.8" strokeLinecap="round" className="h-4 w-4 shrink-0">
            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
          </svg>
          <p className="text-sm font-medium text-aliva">{duree}</p>
          {(() => {
            const [ch, cm] = coucher.split(":").map(Number);
            const [lh, lm] = lever.split(":").map(Number);
            let mins = (lh * 60 + lm) - (ch * 60 + cm);
            if (mins <= 0) mins += 24 * 60;
            if (mins < 360) return <span className="ml-auto text-xs text-terracotta">En dessous des 6h recommandées</span>;
            if (mins >= 420 && mins <= 540) return <span className="ml-auto text-xs text-aliva">Durée idéale</span>;
            return null;
          })()}
        </div>
      )}
    </div>
  );
}

// ─── Slider question ───────────────────────────────────────────────────────

function SliderQuestion({ value, onChange, min, max }: { value: number | null; onChange: (v: number) => void; min: number; max: number }) {
  const val = value ?? Math.round((min + max) / 2);
  return (
    <div>
      <div className="mb-5 flex items-center justify-center">
        <span style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }} className="text-5xl font-light text-aliva">
          {val}
        </span>
        <span className="ml-2 text-lg text-ink-soft">/ {max}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={val}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer accent-aliva"
        style={{ WebkitAppearance: "none", background: `linear-gradient(to right, #1e5c3a ${((val - min) / (max - min)) * 100}%, #e5e5e5 0%)`, borderRadius: "9999px" }}
      />
      <div className="mt-2 flex justify-between text-xs text-ink-soft">
        <span>Épuisé</span>
        <span>En pleine forme</span>
      </div>
    </div>
  );
}

// ─── Photo question ────────────────────────────────────────────────────────

function PhotoQuestion({ value, onChange, questionId }: { value: string | null; onChange: (v: string) => void; questionId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setUploading(false); return; }

    const ext = file.name.split(".").pop();
    const path = `${user.id}/${questionId}-${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage
      .from("photos-questionnaire")
      .upload(path, file, { upsert: true });

    if (!error && data) {
      const { data: url } = supabase.storage.from("photos-questionnaire").getPublicUrl(data.path);
      onChange(url.publicUrl);
      setPreview(URL.createObjectURL(file));
    }
    setUploading(false);
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        className="flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-black/15 bg-white transition-colors hover:border-aliva/40"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Aperçu" className="h-40 w-full rounded-2xl object-cover" />
        ) : uploading ? (
          <p className="text-sm text-ink-soft">Envoi en cours…</p>
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-aliva-pale">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-aliva">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-ink">Prendre ou choisir une photo</p>
              <p className="mt-0.5 text-xs text-ink-soft">Ouvre l&apos;appareil photo</p>
            </div>
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
      <p className="mt-2 text-center text-xs text-ink-soft">
        Indicateur bien-être inspiré de la MTC — pas un diagnostic médical
      </p>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────

const EMPTY_ANSWERS: Answers = {};

export default function Onboarding() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [saving, setSaving] = useState(false);
  const [dir, setDir] = useState<"l" | "r">("l");

  const q = QUESTIONS[stepIndex];
  const raw = answers[q.id];

  // ─ Validation ─
  function isValid(): boolean {
    if (q.optional) return true;
    if (q.type === "slider") return raw !== null && raw !== undefined;
    if (q.type === "acs") {
      if (!raw) return false;
      try {
        const parsed = JSON.parse(raw as string);
        return ACS_ITEMS.every((item) => parsed[item]);
      } catch { return false; }
    }
    if (q.type === "time-pair") {
      const parts = (raw as string)?.split("|") ?? ["", ""];
      return parts[0].length > 0 && parts[1].length > 0;
    }
    if (q.type === "multi") return Array.isArray(raw) && raw.length > 0;
    if (q.type === "photo") return true; // always skippable
    return typeof raw === "string" ? raw.trim().length > 0 : raw !== null && raw !== undefined;
  }

  function setAnswer(val: Answers[string]) {
    setAnswers((prev) => ({ ...prev, [q.id]: val }));
  }

  // ─ Navigation ─
  async function next() {
    if (!isValid()) return;
    if (stepIndex === QUESTIONS.length - 1) {
      await save();
      return;
    }
    setDir("l");
    setStepIndex((i) => i + 1);
  }

  function back() {
    if (stepIndex === 0) { setShowSplash(true); return; }
    setDir("r");
    setStepIndex((i) => i - 1);
  }

  async function save() {
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const patch = buildProfilePatch(answers);
        await supabase.from("profiles").upsert({ id: user.id, ...patch });
      }
      router.push("/portrait");
    } catch {
      router.push("/portrait");
    }
  }

  const slideClass = dir === "l"
    ? "[animation:slide-left_.28s_cubic-bezier(.22,1,.36,1)_both]"
    : "[animation:slide-right_.28s_cubic-bezier(.22,1,.36,1)_both]";

  async function handleStart() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth?next=/onboarding");
      return;
    }
    setShowSplash(false);
  }

  // ─ Splash ─
  if (showSplash) return <Splash onStart={handleStart} />;

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {/* Header */}
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-center justify-between mb-3">
          <BackBtn onClick={back} />
          <span className="text-xs text-ink-soft">{stepIndex + 1} / {QUESTIONS.length}</span>
          {/* Skip for optional */}
          {q.optional ? (
            <button type="button" onClick={next} className="text-xs text-ink-soft underline underline-offset-4">
              Passer
            </button>
          ) : <span className="w-12" />}
        </div>
        <ProgressBar current={stepIndex} total={QUESTIONS.length} />
      </div>

      {/* Question */}
      <div key={stepIndex} className={cn("flex flex-1 flex-col px-5 pt-5 pb-4", slideClass)}>
        <p className="mb-2 text-xs uppercase tracking-[.16em] text-ink-soft">{q.hint}</p>
        <h1
          style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
          className="mb-8 text-[1.6rem] font-light leading-snug text-ink"
        >
          {q.question}
        </h1>

        {/* Renderers */}
        {q.type === "text" && (
          <textarea
            rows={3}
            className="w-full resize-none rounded-xl border border-black/12 bg-white px-4 py-3.5 text-sm text-ink outline-none transition-colors placeholder-ink-soft/50 focus:border-aliva"
            placeholder={(q as TextQ).placeholder}
            value={(raw as string) ?? ""}
            onChange={(e) => setAnswer(e.target.value)}
            autoFocus
          />
        )}

        {q.type === "number" && (
          <div className="relative flex items-center">
            <input
              type="number"
              min={(q as NumberQ).min}
              max={(q as NumberQ).max}
              className="w-full rounded-xl border border-black/12 bg-white px-4 py-4 text-xl text-ink outline-none transition-colors focus:border-aliva"
              placeholder={(q as NumberQ).placeholder}
              value={(raw as string) ?? ""}
              onChange={(e) => setAnswer(e.target.value)}
              autoFocus
            />
            <span className="absolute right-4 text-sm text-ink-soft">{(q as NumberQ).unit}</span>
          </div>
        )}

        {q.type === "choice" && (
          <div className="flex flex-col gap-2.5">
            {(q as ChoiceQ).choices.map((c) => (
              <ChoiceBtn
                key={c}
                label={c}
                selected={raw === c}
                onClick={() => setAnswer(c)}
              />
            ))}
          </div>
        )}

        {q.type === "multi" && (
          <div className="flex flex-col gap-2.5">
            {(q as MultiQ).choices.map((c) => {
              const sel = Array.isArray(raw) && (raw as string[]).includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    const prev = Array.isArray(raw) ? (raw as string[]) : [];
                    if (c === "Aucune") { setAnswer(sel ? [] : ["Aucune"]); return; }
                    const next = sel ? prev.filter((x) => x !== c) : [...prev.filter((x) => x !== "Aucune"), c];
                    setAnswer(next);
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-[1rem] border px-5 py-4 text-left text-sm font-medium transition-all active:scale-[.98]",
                    sel ? "border-aliva bg-aliva text-cream" : "border-black/8 bg-white text-ink hover:border-aliva/30",
                  )}
                >
                  <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all", sel ? "border-cream bg-cream" : "border-black/20")}>
                    {sel && <span className="text-[10px] font-bold leading-none text-aliva">✓</span>}
                  </span>
                  {c}
                </button>
              );
            })}
          </div>
        )}

        {q.type === "slider" && (
          <SliderQuestion
            value={raw as number | null}
            onChange={(v) => setAnswer(v)}
            min={(q as SliderQ).min}
            max={(q as SliderQ).max}
          />
        )}

        {q.type === "time-pair" && (
          <TimePairQuestion value={(raw as string) ?? ""} onChange={setAnswer} />
        )}

        {q.type === "acs" && (
          <ACSQuestion value={(raw as string) ?? ""} onChange={setAnswer} />
        )}

        {q.type === "photo" && (
          <PhotoQuestion
            value={(raw as string) ?? null}
            onChange={setAnswer}
            questionId={q.id}
          />
        )}

        <div className="flex-1" />
      </div>

      {/* CTA */}
      <div className="px-5 pb-10 pt-3">
        <button
          type="button"
          onClick={next}
          disabled={!isValid() || saving}
          className={cn(
            "h-[52px] w-full rounded-full text-sm font-semibold tracking-wide transition-all duration-200 active:scale-[.98]",
            isValid() && !saving
              ? "bg-terracotta text-cream hover:bg-terracotta/90"
              : "cursor-not-allowed bg-black/8 text-ink-soft",
          )}
        >
          {saving ? "Enregistrement…" : stepIndex === QUESTIONS.length - 1 ? "Voir mon portrait →" : "Continuer →"}
        </button>
      </div>
    </div>
  );
}
