-- Ajout des 7 colonnes manquantes dans la table profiles
-- Ces réponses étaient collectées dans le questionnaire mais non sauvegardées en base.
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS ressenti          text,
  ADD COLUMN IF NOT EXISTS rituels_soir      text,
  ADD COLUMN IF NOT EXISTS regularite_repas  text,
  ADD COLUMN IF NOT EXISTS alcool_cafe_sucre jsonb,
  ADD COLUMN IF NOT EXISTS effort            text,
  ADD COLUMN IF NOT EXISTS vie_sociale       text,
  ADD COLUMN IF NOT EXISTS temperature       text;
