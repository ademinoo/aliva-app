-- ═══════════════════════════════════════════════════════════════════
-- Bucket de stockage pour le journal de repas (/photo)
-- Public en lecture, écriture limitée au dossier de chaque utilisateur.
-- ═══════════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public)
VALUES ('photos-repas', 'photos-repas', true)
ON CONFLICT (id) DO NOTHING;

-- Lecture publique des images de repas
DROP POLICY IF EXISTS "photos_repas_read" ON storage.objects;
CREATE POLICY "photos_repas_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'photos-repas');

-- Upload : chaque utilisateur dans son propre dossier (préfixe = son uid)
DROP POLICY IF EXISTS "photos_repas_insert" ON storage.objects;
CREATE POLICY "photos_repas_insert" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'photos-repas'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Mise à jour (upsert) de ses propres fichiers
DROP POLICY IF EXISTS "photos_repas_update" ON storage.objects;
CREATE POLICY "photos_repas_update" ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'photos-repas'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Suppression de ses propres fichiers
DROP POLICY IF EXISTS "photos_repas_delete" ON storage.objects;
CREATE POLICY "photos_repas_delete" ON storage.objects FOR DELETE
  USING (
    bucket_id = 'photos-repas'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
