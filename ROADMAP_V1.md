# Roadmap V1 — Aliva

## Objectif général

Sortir une PWA mobile-first testable en 4 semaines.

La V1 doit permettre de valider le produit auprès de premiers utilisateurs, sans chercher à tout construire dès le départ.

## Objectif utilisateur

Un utilisateur doit pouvoir :

1. Arriver sur la landing page.
2. Comprendre la promesse d'Aliva.
3. Créer un compte.
4. Remplir sa cartographie initiale.
5. Ajouter une photo de langue optionnelle.
6. Obtenir une première lecture de son profil.
7. Recevoir un premier plan personnalisé.
8. Accéder à son tableau de bord quotidien.
9. Cocher 3 actions maximum.
10. Parler à Aliva.
11. Photographier un repas.
12. Découvrir l'offre Équilibre.

## KPI de validation

- 30 inscrits
- 5 payants minimum en bêta
- Conversion landing → inscription supérieure à 4 %
- Rétention J+30 supérieure à 60 %
- NPS J+30 supérieur à 40

## Stack V1

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Claude API
- Stripe Checkout
- Resend
- PostHog
- Vercel

## Sprint 1 — Fondation

Objectif : avoir une base propre, déployée, avec landing et authentification.

### Tâches

- Initialiser le projet Next.js.
- Installer Tailwind CSS.
- Créer le design system Aliva.
- Créer les variables de couleurs.
- Créer les composants UI de base.
- Créer la landing page.
- Créer l'authentification Supabase.
- Créer les premières routes.
- Déployer sur Vercel.

### Livrable attendu

À la fin du sprint 1, un utilisateur doit pouvoir :
- ouvrir la landing,
- cliquer sur “Faire connaissance”,
- créer un compte,
- arriver au début du questionnaire.

## Sprint 2 — Questionnaire & IA

Objectif : générer un premier profil utilisateur.

### Tâches

- Créer le questionnaire multi-étapes.
- Sauvegarder les réponses dans Supabase.
- Ajouter l'upload photo langue optionnel.
- Créer la page “Première lecture”.
- Connecter Claude API.
- Générer un premier plan personnalisé.
- Ajouter les disclaimers obligatoires.

### Livrable attendu

À la fin du sprint 2, un utilisateur doit pouvoir obtenir son premier plan personnalisé.

## Sprint 3 — Tableau de bord & engagement

Objectif : rendre l'app utilisable au quotidien.

### Tâches

- Créer le tableau de bord quotidien.
- Afficher le score bien-être.
- Afficher la série actuelle.
- Ajouter 3 actions quotidiennes maximum.
- Rendre les actions cochables.
- Créer le bouton “Parler à Aliva”.
- Créer le chat IA.
- Créer l'analyse photo repas simple.
- Ajouter une gamification douce.

### Livrable attendu

À la fin du sprint 3, l'utilisateur peut utiliser Aliva chaque jour.

## Sprint 4 — Paiement, tracking & bêta

Objectif : préparer le lancement bêta.

### Tâches

- Ajouter Stripe Checkout.
- Créer l'offre Équilibre à 99€/an.
- Ajouter l'essai gratuit 7 jours.
- Ajouter PostHog.
- Ajouter les emails Resend.
- Créer les pages légales provisoires.
- Tester sur mobile.
- Corriger les bugs.
- Préparer la bêta.

### Livrable attendu

À la fin du sprint 4, Aliva est testable par des vrais utilisateurs.

## Hors scope V1

Ces éléments sont repoussés en V2 ou V3 :

- Application native iOS/Android.
- Experts humains.
- Marketplace d'experts.
- Module cosmétique complet.
- Préparation sportive avancée.
- Connexion Oura, Garmin, Whoop.
- Prise de sang.
- B2B.
- Séjours Aliva.
- IA prédictive avancée.
