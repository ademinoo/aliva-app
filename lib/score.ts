// Logique de calcul du score bien-être, partagée entre portrait et tableau-de-bord.

export type ScoreProfile = {
  energie_score:   number | null;
  qualite_sommeil: string | null;
  niveau_stress:   string | null;
  niveau_activite: string | null;
  digestion:       string | null;
};

const SOMMEIL_SCORE: Record<string, number> = {
  "Reposé":                  1.0,
  "Variable":                0.55,
  "Fatigué mais ça passe":   0.45,
  "Épuisé":                  0.15,
};

const STRESS_SCORE: Record<string, number> = {
  "Plutôt bien":              1.0,
  "Je suis souvent tendu":    0.5,
  "Anxiété régulière":        0.3,
  "Ça affecte mon sommeil":   0.2,
  "Ça affecte mes relations": 0.15,
};

const ACTIVITE_SCORE: Record<string, number> = {
  sedentaire: 0.2,
  leger:      0.4,
  modere:     0.6,
  actif:      0.8,
  intensif:   1.0,
};

const DIGESTION_SCORE: Record<string, number> = {
  "Impeccable":              1.0,
  "Ballonnements fréquents": 0.4,
  "Constipation":            0.35,
  "Diarrhées":               0.3,
  "Brûlures d'estomac":      0.35,
};

export function computeScores(p: ScoreProfile) {
  const energie   = p.energie_score   != null ? p.energie_score / 10          : 0.6;
  const sommeil   = SOMMEIL_SCORE[p.qualite_sommeil ?? ""]                     ?? 0.6;
  const stress    = STRESS_SCORE[p.niveau_stress ?? ""]                        ?? 0.5;
  const activite  = ACTIVITE_SCORE[p.niveau_activite ?? ""]                    ?? 0.5;
  const digestion = DIGESTION_SCORE[p.digestion ?? ""]                         ?? 0.7;

  const global = Math.round(
    energie   * 25 +
    sommeil   * 25 +
    stress    * 25 +
    activite  * 15 +
    digestion * 10,
  );

  return { energie, sommeil, stress, activite, digestion, global };
}

export function findPriorityKey(s: ReturnType<typeof computeScores>): string {
  return (
    [
      { key: "energie",   v: s.energie   },
      { key: "sommeil",   v: s.sommeil   },
      { key: "stress",    v: s.stress    },
      { key: "activite",  v: s.activite  },
      { key: "digestion", v: s.digestion },
    ] as const
  ).slice().sort((a, b) => a.v - b.v)[0].key;
}
