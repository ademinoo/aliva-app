-- Table checkins : suivi quotidien de l'utilisateur
CREATE TABLE IF NOT EXISTS checkins (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date         date NOT NULL DEFAULT CURRENT_DATE,
  energie_matin     text,
  repas_midi        text,
  actions_cochees   text[] DEFAULT '{}',
  photo_repas_url   text,
  macros_estimes    jsonb,
  created_at   timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "checkins_own" ON checkins FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Table gamification : streaks, paliers, score
CREATE TABLE IF NOT EXISTS gamification (
  user_id          uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  streak_actuel    int DEFAULT 0,
  streak_record    int DEFAULT 0,
  score_bienetre   int DEFAULT 0,
  paliers_atteints text[] DEFAULT '{}',
  badges           text[] DEFAULT '{}',
  last_active_date date,
  updated_at       timestamptz DEFAULT now()
);

ALTER TABLE gamification ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gamification_own" ON gamification FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
