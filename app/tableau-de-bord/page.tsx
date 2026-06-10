"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HeaderApp } from "@/components/layout/header-app";
import { BottomNav } from "@/components/ui/bottom-nav";
import { CircleScore } from "@/components/ui/circle-score";
import { LeafIcon } from "@/components/ui/leaf-icon";
import { cn } from "@/lib/cn";
import { createClient } from "@/lib/supabase/client";
import { computeScores, findPriorityKey } from "@/lib/score";

type Profile = {
  prenom: string | null;
  energie_score: number | null;
  qualite_sommeil: string | null;
  niveau_stress: string | null;
  niveau_activite: string | null;
  digestion: string | null;
};

type Gamification = {
  streak_actuel: number;
  streak_record: number;
  paliers_atteints: string[];
};

type Action = { id: string; texte: string; detail: string };

const ACTIONS: Record<string, Action[]> = {
  energie: [
    { id: "energie_1", texte: "10 min de lumière naturelle au réveil", detail: "Stoppe la mélatonine et synchronise ton horloge circadienne." },
    { id: "energie_2", texte: "Verre d'eau avant le café",             detail: "La caféine à jeun élève le cortisol — hydrate-toi d'abord." },
    { id: "energie_3", texte: "Petit-déjeuner avant 9h",               detail: "La fenêtre anabolique du matin dure jusqu'à 9h30." },
  ],
  sommeil: [
    { id: "sommeil_1", texte: "Pas d'écran 30 min avant le lit",     detail: "La lumière bleue retarde la mélatonine de 90 min." },
    { id: "sommeil_2", texte: "Chambre à 18-19°C ce soir",           detail: "La baisse de température corporelle déclenche le sommeil." },
    { id: "sommeil_3", texte: "Heure de coucher fixe ce soir",       detail: "La régularité du rythme circadien améliore la qualité dès J3." },
  ],
  stress: [
    { id: "stress_1", texte: "5 min cohérence cardiaque",           detail: "Inspire 5s — expire 5s. −23% de cortisol en 1 semaine." },
    { id: "stress_2", texte: "10 min marche sans téléphone",        detail: "−12% de cortisol, +sérotonine. La nature amplifie l'effet." },
    { id: "stress_3", texte: "3 respirations avant chaque repas",   detail: "Active le parasympathique — digestion et absorption améliorées." },
  ],
  activite: [
    { id: "activite_1", texte: "10 min marche après le déjeuner",     detail: "Réduit la glycémie post-prandiale de 22%. Accessible à tous." },
    { id: "activite_2", texte: "Prendre les escaliers",                detail: "3 étages = 15 kcal et pic de BDNF (protéine neuro-protectrice)." },
    { id: "activite_3", texte: "5 min d'étirements debout",            detail: "Relance la circulation lymphatique stoppée par la position assise." },
  ],
  digestion: [
    { id: "digestion_1", texte: "Mastiquer 20x par bouchée",           detail: "La digestion commence dans la bouche — réduit ballonnements." },
    { id: "digestion_2", texte: "Verre d'eau tiède à jeun",            detail: "Stimule le péristaltisme et le foie dès le réveil." },
    { id: "digestion_3", texte: "Éviter sucres raffinés ce matin",     detail: "Le microbiome intestinal régule l'humeur via l'axe gut-brain." },
  ],
};

const MESSAGES: Record<string, string> = {
  energie:   "L'hydratation matinale réveille ton métabolisme. Un grand verre d'eau avant ton café — le cortisol du réveil augmente les pertes hydriques.",
  sommeil:   "Le sommeil profond (N3) est le seul moment où ton cerveau élimine les déchets neuronaux. Chaque heure avant minuit vaut double.",
  stress:    "Le système nerveux ne distingue pas le stress mental du physique. 5 minutes de cohérence cardiaque abaissent le cortisol autant qu'une séance de yoga.",
  activite:  "10 minutes de marche après les repas réduisent la glycémie de 22% et améliorent l'humeur via l'axe muscle-cerveau.",
  digestion: "90% de la sérotonine est produite dans l'intestin. Ce que tu manges influence ton humeur autant que tes pensées.",
};

const PALIERS = [
  { key: "7j",   seuil: 7,   label: "7 jours",   message: "7 jours d'affilée. L'habitude commence à s'ancrer." },
  { key: "30j",  seuil: 30,  label: "30 jours",  message: "30 jours consécutifs. C'est une vraie transformation." },
  { key: "100j", seuil: 100, label: "100 jours", message: "100 jours. Peu de personnes y arrivent. Tu en fais partie." },
];

function getDateFr() {
  const d = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  return d.charAt(0).toUpperCase() + d.slice(1);
}

function todayIso() {
  return new Date().toISOString().split("T")[0];
}

function yesterdayIso() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export default function TableauDeBord() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [gamification, setGamification] = useState<Gamification | null>(null);
  const [palierMessage, setPalierMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [joursActifs, setJoursActifs] = useState<number | undefined>(undefined);

  // Chargement initial : profil + check-in du jour + gamification
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth"); return; }
      setUserId(user.id);

      const last7Start = new Date();
      last7Start.setDate(last7Start.getDate() - 6);
      const last7Iso = last7Start.toISOString().split("T")[0];

      const [profileRes, checkinRes, gamiRes, last7Res] = await Promise.all([
        supabase
          .from("profiles")
          .select("prenom, energie_score, qualite_sommeil, niveau_stress, niveau_activite, digestion")
          .eq("id", user.id)
          .single(),
        supabase
          .from("checkins")
          .select("actions_cochees")
          .eq("user_id", user.id)
          .eq("date", todayIso())
          .maybeSingle(),
        supabase
          .from("gamification")
          .select("streak_actuel, streak_record, paliers_atteints")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("checkins")
          .select("date")
          .eq("user_id", user.id)
          .gte("date", last7Iso),
      ]);

      // Pas de questionnaire → renvoyer vers l'onboarding
      if (!(profileRes.data as { prenom?: string | null } | null)?.prenom) {
        router.replace("/onboarding");
        return;
      }
      setProfile(profileRes.data);

      if (checkinRes.data?.actions_cochees) {
        setChecked(new Set(checkinRes.data.actions_cochees as string[]));
      }

      if (gamiRes.data) {
        setGamification({
          streak_actuel: gamiRes.data.streak_actuel ?? 0,
          streak_record: gamiRes.data.streak_record ?? 0,
          paliers_atteints: gamiRes.data.paliers_atteints ?? [],
        });
      }

      const uniqueDays = new Set((last7Res.data ?? []).map((r: { date: string }) => r.date));
      setJoursActifs(uniqueDays.size);
    }
    load();
  }, [router]);

  // Persistance du check-in + mise à jour du streak
  const persistCheckin = useCallback(async (nextChecked: Set<string>) => {
    if (!userId) return;
    const supabase = createClient();
    const actionsList = Array.from(nextChecked);

    // Upsert du check-in du jour
    await supabase
      .from("checkins")
      .upsert({ user_id: userId, date: todayIso(), actions_cochees: actionsList }, { onConflict: "user_id,date" });

    // Si au moins 1 action cochée → mettre à jour le streak
    if (actionsList.length === 0) return;

    const { data: gamiData } = await supabase
      .from("gamification")
      .select("streak_actuel, streak_record, paliers_atteints, last_active_date")
      .eq("user_id", userId)
      .maybeSingle();

    const today   = todayIso();
    const yesterday = yesterdayIso();
    const lastDate = gamiData?.last_active_date ?? null;
    const curStreak = gamiData?.streak_actuel ?? 0;
    const curRecord = gamiData?.streak_record ?? 0;
    const curPaliers: string[] = gamiData?.paliers_atteints ?? [];

    let newStreak = curStreak;
    if (lastDate === today) {
      // Déjà compté aujourd'hui, pas de changement
      return;
    } else if (lastDate === yesterday) {
      newStreak = curStreak + 1;
    } else {
      newStreak = 1;
    }

    const newRecord = Math.max(newStreak, curRecord);

    // Vérifier les paliers atteints pour la première fois
    const newPaliers = [...curPaliers];
    let celebration: string | null = null;
    for (const p of PALIERS) {
      if (newStreak >= p.seuil && !curPaliers.includes(p.key)) {
        newPaliers.push(p.key);
        celebration = p.message;
      }
    }

    const scoreBienetre = profile ? computeScores(profile, joursActifs).global : 0;

    await supabase.from("gamification").upsert(
      { user_id: userId, streak_actuel: newStreak, streak_record: newRecord, paliers_atteints: newPaliers, last_active_date: today, score_bienetre: scoreBienetre, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );

    setGamification({ streak_actuel: newStreak, streak_record: newRecord, paliers_atteints: newPaliers });
    if (celebration) setPalierMessage(celebration);
  }, [userId, profile, joursActifs]);

  function toggle(id: string) {
    setChecked((prev) => {
      const isAdding = !prev.has(id);
      const next = new Set(prev);
      isAdding ? next.add(id) : next.delete(id);
      if (isAdding && typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(50);
      }
      persistCheckin(next);
      return next;
    });
  }

  const scores    = profile ? computeScores(profile, joursActifs) : null;
  const priority  = scores ? findPriorityKey(scores) : "stress";
  const actions   = ACTIONS[priority];
  const message   = MESSAGES[priority];
  const prenom    = profile?.prenom ?? null;
  const score     = scores?.global ?? null;
  const done      = actions.filter((a) => checked.has(a.id)).length;
  const total     = actions.length;
  const streak    = gamification?.streak_actuel ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <HeaderApp />

      <main className="flex-1">

        {/* ── Palier célébration ── */}
        {palierMessage && (
          <div
            className="mx-5 mt-4 rounded-[1.25rem] bg-aliva px-5 py-4 text-center"
            style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) both" }}
          >
            <p className="text-sm font-semibold text-cream">🏆 {palierMessage}</p>
            <button
              type="button"
              onClick={() => setPalierMessage(null)}
              className="mt-2 text-xs text-cream/70 underline"
            >
              Fermer
            </button>
          </div>
        )}

        {/* ── 1. Date + prénom ── */}
        <div
          className="px-5 pt-1 pb-4"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) both" }}
        >
          <p className="text-xs tracking-[.14em] text-ink-soft uppercase">{getDateFr()}</p>
          <div className="mt-1 flex items-baseline justify-between gap-4">
            <h1
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              className="text-4xl font-light leading-none text-ink"
            >
              {prenom ? `Bonjour ${prenom}` : "Bonjour"}
            </h1>
            {/* Streak */}
            {streak > 0 && (
              <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-aliva-pale px-3 py-1.5">
                <span className="text-sm">🔥</span>
                <span className="text-xs font-semibold text-aliva">{streak} j</span>
              </div>
            )}
          </div>
        </div>

        {/* ── 2. Score ── */}
        <div
          className="flex justify-center px-5 pb-6"
          style={{ animation: "fade-in .7s cubic-bezier(.22,1,.36,1) .08s both" }}
        >
          {score != null
            ? <CircleScore score={score} label="ÉQUILIBRE" size={180} />
            : <div className="h-[180px] w-[180px] animate-pulse rounded-full bg-black/5" />
          }
        </div>

        {/* ── 3. Actions ── */}
        <div
          className="mx-5 overflow-hidden rounded-[1.25rem] bg-white"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .15s both" }}
        >
          <div className="flex items-baseline justify-between px-5 pt-5 pb-4">
            <h2
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              className="text-xl font-light text-ink"
            >
              {prenom ? `Ton matin, ${prenom}` : "Ton matin"}
            </h2>
            <span className="text-xs tabular-nums text-ink-soft">{done}/{total}</span>
          </div>

          {actions.map((a, i) => {
            const isChecked = checked.has(a.id);
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => toggle(a.id)}
                className={cn(
                  "flex w-full items-center gap-4 px-5 py-4 text-left transition-colors active:bg-black/3",
                  i < actions.length - 1 ? "border-b border-black/5" : "pb-5",
                )}
              >
                <span className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all duration-200",
                  isChecked ? "border-aliva bg-aliva" : "border-black/20",
                )}>
                  {isChecked && (
                    <svg viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2.2"
                      className="h-3 w-3"
                      style={{ animation: "check-pulse .3s cubic-bezier(.22,1,.36,1) both" }}>
                      <path d="M1.5 5.2 L3.8 7.8 L8.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <div>
                  <p className={cn(
                    "text-sm font-medium leading-snug transition-colors duration-200",
                    isChecked ? "text-black/30 line-through" : "text-ink",
                  )}>
                    {a.texte}
                  </p>
                  {!isChecked && (
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{a.detail}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {done === total && done > 0 && (
          <p
            style={{ animation: "fade-up .35s cubic-bezier(.22,1,.36,1) both",
              fontFamily: "var(--font-fraunces), Georgia, serif" }}
            className="px-5 pt-4 text-base font-light italic text-aliva"
          >
            {total} sur {total}. C&apos;est ancré.
          </p>
        )}

        {/* ── 4. Message du jour ── */}
        <div
          className="mx-5 mt-5 rounded-[1.25rem] bg-aliva-pale/60 px-5 py-5"
          style={{ animation: "fade-up .4s cubic-bezier(.22,1,.36,1) .25s both" }}
        >
          <div className="mb-3 flex items-center gap-2">
            <LeafIcon className="h-4 w-4 text-aliva" />
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-aliva">
              Message du jour
            </p>
          </div>
          <p className="text-sm leading-relaxed text-ink">{message}</p>
        </div>

        <div className="h-6" />
      </main>

      <div className="fixed bottom-24 right-5 z-40">
        <Link
          href="/portrait"
          className="flex h-12 items-center gap-2 rounded-full bg-aliva px-5 shadow-md shadow-aliva/25 transition-all active:scale-95 hover:shadow-lg"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <span className="text-[11px] font-bold uppercase tracking-[.14em] text-white">
            Mon portrait
          </span>
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
