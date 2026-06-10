-- Assure que la table profiles a les politiques RLS pour INSERT + UPDATE + SELECT
-- Sans politique INSERT, le upsert du questionnaire échoue pour les nouveaux comptes.

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- SELECT
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  USING (auth.uid() = id);

-- INSERT (indispensable pour le premier upsert après inscription)
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- UPDATE
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  USING (auth.uid() = id);
