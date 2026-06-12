import Link from "next/link";
import { Container } from "@/components/layout/container";

export default function CGU() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="border-b border-black/5 py-5">
        <Container>
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xs font-semibold uppercase tracking-[.18em] text-aliva">
              ← Retour
            </Link>
            <p className="text-xs text-ink-soft">Un univers VIVUM</p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="max-w-2xl py-12 prose prose-sm text-ink">

          <h1 className="font-title text-3xl font-light text-ink">
            Conditions générales d&apos;utilisation & Politique de confidentialité
          </h1>
          <p className="text-xs text-ink-soft">Version 1.0 — Juin 2026</p>

          <hr className="my-8 border-black/8" />

          <h2 className="text-xl font-semibold text-ink">1. Objet du service</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            Aliva est un service d&apos;accompagnement éducatif au bien-être et à l&apos;hygiène de vie,
            édité par VIVUM. Le service propose des contenus informatifs sur la nutrition, le
            sommeil, l&apos;activité physique et la gestion du stress, basés sur des données
            scientifiques et des traditions ancestrales de santé.
          </p>
          <p className="mt-3 rounded-xl border border-terracotta/20 bg-terracotta/5 px-4 py-3 text-sm font-medium text-terracotta">
            ⚠️ Les recommandations d&apos;Aliva ne constituent pas un avis médical et ne remplacent
            en aucun cas une consultation auprès d&apos;un professionnel de santé qualifié.
            Aliva n&apos;est pas un dispositif médical au sens du règlement MDCG 2025-4.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-ink">2. Conditions d&apos;utilisation</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            L&apos;utilisation du service est réservée aux personnes âgées de 16 ans et plus.
            L&apos;utilisateur s&apos;engage à fournir des informations exactes lors de l&apos;inscription
            et du questionnaire initial. Toute utilisation frauduleuse ou abusive du service
            est interdite.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-ink">3. Données personnelles (RGPD)</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            Aliva collecte et traite les données personnelles suivantes dans le cadre de la
            fourniture du service :
          </p>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li>• <strong className="text-ink">Données d&apos;identité</strong> : prénom, adresse e-mail</li>
            <li>• <strong className="text-ink">Données de santé</strong> : informations sur le sommeil, l&apos;énergie, le stress, l&apos;alimentation, les pathologies déclarées — collectées avec consentement explicite</li>
            <li>• <strong className="text-ink">Données d&apos;usage</strong> : actions cochées, fréquence d&apos;utilisation, check-ins quotidiens</li>
            <li>• <strong className="text-ink">Photos</strong> : photo de langue (optionnelle), photos de repas — stockées de manière sécurisée</li>
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Conformément au RGPD, les données sont hébergées en Europe (Frankfurt, Allemagne)
            via Supabase. Elles ne sont ni vendues, ni transmises à des tiers sans consentement
            explicite, à l&apos;exception des partenaires commerciaux signalés dans l&apos;application
            (Nutripure, La Compagnie des Sens) pour les fonctionnalités de recommandation.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Tu disposes d&apos;un droit d&apos;accès, de rectification, de suppression et de portabilité
            de tes données. Pour exercer ces droits : <strong className="text-ink">contact@aliva.fr</strong>
          </p>

          <h2 className="mt-8 text-xl font-semibold text-ink">4. Données de santé — base légale</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            Les données de santé (pathologies, médicaments, indicateurs physiologiques) sont
            traitées sur la base du consentement explicite de l&apos;utilisateur, donné lors du
            questionnaire initial. Ce consentement peut être retiré à tout moment en supprimant
            son compte.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-ink">5. Partenariats commerciaux</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            Aliva entretient des partenariats commerciaux avec :
          </p>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li>• <strong className="text-ink">Nutripure</strong> — compléments alimentaires. Code VIVANT pour réduction sur première commande.</li>
            <li>• <strong className="text-ink">La Compagnie des Sens</strong> — huiles essentielles et plantes.</li>
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Conformément à la loi DGCCRF, chaque recommandation liée à ces partenaires est
            explicitement signalée comme &quot;recommandation commerciale&quot;. Les recommandations
            restent contextualisées au profil de l&apos;utilisateur et ne sont jamais génériques.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-ink">6. Accès au service</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            L&apos;accès à Aliva est entièrement gratuit. L&apos;ensemble des fonctionnalités
            (questionnaire, score de bien-être, actions quotidiennes, chat, journal de repas,
            bilan hebdomadaire) est accessible sans abonnement, sans carte bancaire et sans
            engagement. L&apos;utilisateur peut supprimer son compte et ses données à tout moment
            depuis ses paramètres.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-ink">7. Limitation de responsabilité</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            VIVUM ne peut être tenu responsable des conséquences d&apos;une utilisation des
            recommandations d&apos;Aliva sans consultation médicale préalable, notamment en présence
            de pathologies diagnostiquées ou de traitements médicamenteux en cours.
            L&apos;utilisateur reste seul juge de l&apos;application des conseils à sa situation personnelle.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-ink">8. Contact</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            Pour toute question relative aux présentes conditions ou à tes données personnelles :<br />
            <strong className="text-ink">VIVUM — contact@aliva.fr</strong>
          </p>

          <hr className="my-8 border-black/8" />

          <p className="text-xs leading-relaxed text-ink-soft/60">
            Ces conditions sont susceptibles d&apos;être modifiées. La version en vigueur est celle
            publiée sur cette page. En continuant à utiliser Aliva, tu acceptes les conditions
            en vigueur.
          </p>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-full bg-aliva px-6 text-sm font-semibold text-cream transition-all hover:bg-aliva/90"
            >
              Retour à l&apos;accueil
            </Link>
          </div>

        </div>
      </Container>
    </div>
  );
}
