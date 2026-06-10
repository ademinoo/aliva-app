-- ═══════════════════════════════════════════════════════════════════
-- Alignement schéma avec MEA + Schéma Relationnel
-- ═══════════════════════════════════════════════════════════════════

-- ── 1. Colonnes manquantes dans profiles ──────────────────────────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS date_objectif        DATE,
  ADD COLUMN IF NOT EXISTS morphologie          TEXT,
  ADD COLUMN IF NOT EXISTS freins               TEXT[],
  ADD COLUMN IF NOT EXISTS photo_visage_url     TEXT,
  ADD COLUMN IF NOT EXISTS langue_indicateurs   JSONB,
  ADD COLUMN IF NOT EXISTS niveau_progressivite TEXT DEFAULT 'debut';

-- ── 2. Colonnes manquantes dans notification_preferences ──────────
ALTER TABLE notification_preferences
  ADD COLUMN IF NOT EXISTS push_token   TEXT,
  ADD COLUMN IF NOT EXISTS frequence    TEXT NOT NULL DEFAULT '3x',
  ADD COLUMN IF NOT EXISTS quiet_start  TEXT NOT NULL DEFAULT '22:00',
  ADD COLUMN IF NOT EXISTS quiet_end    TEXT NOT NULL DEFAULT '08:00';

-- ── 3. Table subscriptions (Stripe — prêt pour intégration future) ─
CREATE TABLE IF NOT EXISTS subscriptions (
  id                       UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                  UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id       TEXT,
  stripe_subscription_id   TEXT,
  plan                     TEXT        NOT NULL DEFAULT 'decouverte',
  statut                   TEXT        NOT NULL DEFAULT 'actif',
  debut_periode            TIMESTAMPTZ,
  fin_periode              TIMESTAMPTZ,
  created_at               TIMESTAMPTZ DEFAULT now(),
  updated_at               TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_own" ON subscriptions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS subscriptions_user_idx ON subscriptions(user_id);

-- ── 4. Table recommandations (DGCCRF tracking) ────────────────────
CREATE TABLE IF NOT EXISTS recommandations (
  id                   UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id              UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  categorie            TEXT        NOT NULL,
  contenu              TEXT        NOT NULL,
  partenaire           TEXT,
  mention_partenariat  TEXT,
  source_axe           TEXT,
  created_at           TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE recommandations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recommandations_own" ON recommandations FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS recommandations_user_idx ON recommandations(user_id);

-- ── 5. Table user_learnings (mémoire IA comportementale) ──────────
CREATE TABLE IF NOT EXISTS user_learnings (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pattern    TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_learnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_learnings_own" ON user_learnings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS user_learnings_user_idx ON user_learnings(user_id);
