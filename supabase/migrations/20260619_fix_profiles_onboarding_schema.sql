-- Corrige le schema utilise par le questionnaire onboarding.
-- Sans ces colonnes, l'upsert final du profil echoue dans PostgREST.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS ressenti text,
  ADD COLUMN IF NOT EXISTS rituels_soir text,
  ADD COLUMN IF NOT EXISTS regularite_repas text,
  ADD COLUMN IF NOT EXISTS alcool_cafe_sucre jsonb,
  ADD COLUMN IF NOT EXISTS effort text,
  ADD COLUMN IF NOT EXISTS vie_sociale text,
  ADD COLUMN IF NOT EXISTS temperature text;

-- Un trigger existant sur profiles tente d'ecrire new.updated_at.
-- La colonne doit donc exister meme si le code ne l'envoie pas directement.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS updated_at timestamptz;

UPDATE public.profiles
SET updated_at = now()
WHERE updated_at IS NULL;

ALTER TABLE public.profiles
  ALTER COLUMN updated_at SET DEFAULT now(),
  ALTER COLUMN updated_at SET NOT NULL;

NOTIFY pgrst, 'reload schema';
