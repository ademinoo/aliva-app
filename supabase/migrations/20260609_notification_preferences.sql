-- Préférences de notifications par utilisateur
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id       UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  reveil_actif  BOOLEAN NOT NULL DEFAULT true,
  reveil_heure  TEXT    NOT NULL DEFAULT '07:00',
  coucher_actif BOOLEAN NOT NULL DEFAULT true,
  coucher_heure TEXT    NOT NULL DEFAULT '22:30',
  silence_actif BOOLEAN NOT NULL DEFAULT false,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification_preferences"
  ON notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification_preferences"
  ON notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notification_preferences"
  ON notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);
