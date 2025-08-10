
# SEO Agent – MVP Launch Guide

This repo contains a production-leaning MVP scaffold for an SEO SaaS: routing, auth, credits, analysis edge functions, and pricing.
Follow these steps to launch.

## 1) Install deps
```
npm i react-router-dom @tanstack/react-query stripe
```
(If you use shadcn/ui already, keep it as-is.)

## 2) Supabase setup
- Create a project.
- Set env vars locally:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - For Edge Functions:
    - `SUPABASE_URL`
    - `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
- Run SQL schema:
  - `supabase/sql/01_schema.sql`

## 3) Edge Functions
Functions are in `supabase/functions/*`:
- `analyze-url` – runs a simple analysis (replace with real pipeline)
- `get-credits` – returns current user's credits
- `consume-credits` – decrements credits

Deploy (examples):
```
supabase functions deploy analyze-url
supabase functions deploy get-credits
supabase functions deploy consume-credits
```

## 4) Stripe setup
- Create products/plans and price IDs in Stripe.
- Put SERVER webhook in `supabase/functions/stripe-webhook` (placeholder provided).
- Add public price IDs to `services/billing.ts`.
- In Pricing page, when user selects a plan, call `createCheckoutSession`.

## 5) Run
```
npm run dev
```
Login, go to Dashboard, run an analysis; watch credits change and check History.

## Notes
- Replace all placeholder logic with your real analysis pipeline.
- Use `policies` in `01_schema.sql` to protect data per user.
