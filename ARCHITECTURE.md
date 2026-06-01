# Architecture — Aliva

## Objectif

Ce document décrit l'organisation technique du projet Aliva.

L'objectif est de garder une structure claire, maintenable et mobile-first pour la V1.

## Structure du projet

```txt
aliva-app/
│
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   │
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   │
│   ├── onboarding/
│   │   ├── page.tsx
│   │   ├── questionnaire/
│   │   ├── langue/
│   │   └── result/
│   │
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── today/
│   │   ├── plan/
│   │   └── meal/
│   │
│   ├── chat/
│   │   └── page.tsx
│   │
│   ├── pricing/
│   │   └── page.tsx
│   │
│   └── legal/
│       ├── privacy/
│       ├── terms/
│       └── disclaimers/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── landing/
│   ├── onboarding/
│   ├── dashboard/
│   └── chat/
│
├── lib/
│   ├── supabase/
│   ├── stripe/
│   ├── claude/
│   ├── posthog/
│   └── utils.ts
│
├── types/
│   ├── profile.ts
│   ├── plan.ts
│   └── subscription.ts
│
├── public/
│   ├── logo.svg
│   └── icons/
│
├── README.md
├── ROADMAP_V1.md
├── BACKLOG.md
├── PRODUCT_RULES.md
└── ARCHITECTURE.md
