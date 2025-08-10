
# SEO Agent – End-to-End Verification Playbook

This is a hands-on checklist to validate each feature locally or in a staging Supabase project.
Tick items as you go. Expected results are listed.

---

## 0) Prereqs
- Node 18+
- Supabase CLI
- Stripe test account (Keys)
- GitHub test repo you own (for PR tests)

## 1) Env Setup
Create `.env` (frontend) and set:
- VITE_SUPABASE_URL=...
- VITE_SUPABASE_ANON_KEY=...

For Edge Functions (Supabase Project Settings → Functions → Secrets):
- SUPABASE_URL=...
- SUPABASE_SERVICE_ROLE_KEY=...
- STRIPE_SECRET_KEY=sk_test_...
- STRIPE_WEBHOOK_SECRET=whsec_...
- GITHUB_TOKEN=ghp_...
- GITHUB_REPO=<owner>/<repo>
- APP_ORIGIN=http://localhost:5173
- INVITE_MAIL_PROVIDER=resend (optional)
- RESEND_KEY=... (optional)
- SENDGRID_KEY=... (optional)

✅ **Expected**: Frontend boots, Edge functions can read env via `Deno.env.get`.

---

## 2) DB Schema
Run in Supabase SQL Editor, in order:
- `supabase/sql/01_schema.sql`
- `supabase/sql/02_functions.sql`
- `supabase/sql/03_teams.sql`
- `supabase/sql/04_invites_jobs.sql`

✅ **Expected**: Tables/Policies/Functions created without error.

---

## 3) Deploy Edge Functions
Deploy all used functions:
```
supabase functions deploy analyze-url
supabase functions deploy get-credits
supabase functions deploy consume-credits
supabase functions deploy enqueue-analysis
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
supabase functions deploy monthly-credit-reset
supabase functions deploy send-invite
supabase functions deploy accept-invite
supabase functions deploy apply-fix
```
✅ **Expected**: Each deploy completes OK.

---

## 4) Frontend Smoke Test
```
npm i
npm i react-router-dom @tanstack/react-query stripe
npm run dev
```
- Open `http://localhost:5173`
- Sign up / login (Supabase Email auth or Magic link)
- Navigate:
  - `/dashboard` shows Dashboard + Extras + Fixes panel
  - `/projects` can add a domain
  - `/pricing` shows plans

✅ **Expected**: No console errors; Topbar shows Credits; PostHog stub logs `[PH]` events.

---

## 5) Analysis Flow (Direct)
- From Dashboard, click **Run Demo Analysis**
- Go to **History**; confirm latest result appears (summary + timestamp)
- Click **Export Markdown** (should download `reports.md`)
- Try **Pro PDF** by calling `openReportPDFPro(payload)` in console with a `payload` from History (includes issues/scoreHistory).

✅ **Expected**: Result row inserted; exports work; PDF shows KPI, sparkline, severity chart.

---

## 6) Credits
- Before: note Credits value in Topbar
- Trigger **consume-credits** by running Demo Analysis again
- Watch Credits decrease

✅ **Expected**: Credits decrement by 1 per analysis.

---

## 7) Stripe Checkout (Test)
- Set Stripe test **price IDs** in `services/billing.ts`
- Go to **Pricing** and click a plan → redirects to Stripe test Checkout
- Complete payment with test card `4242 4242 4242 4242`
- Configure Stripe Webhook to your `stripe-webhook` endpoint (Supabase URL)

✅ **Expected**: After checkout, webhook updates `users_public.plan` and **adds credits**; refresh, Credits increase.

---

## 8) Monthly Credits Reset (Scheduled)
- Manually invoke `monthly-credit-reset` in the Supabase dashboard or via CLI:
```
supabase functions invoke monthly-credit-reset
```
✅ **Expected**: `users_public.credits` set to plan defaults.

---

## 9) Queue + Worker
- Deploy/Run worker locally:
```
cd worker
npm i @supabase/supabase-js node-fetch
node worker.js
```
- Invoke queue:
```
supabase functions invoke enqueue-analysis --data '{"url":"https://example.com", "type":"technical"}'
```
- Watch worker logs update job → result → completed

✅ **Expected**: `jobs.status` progresses: queued → processing → completed; `results` saved.

*Advanced*: Use `playwright_lighthouse_worker.js` (install deps per README).

---

## 10) Fix Suggestions → GitHub PR
- In console:
```
window.__SEO_AGENT_REPO__ = '<owner>/<repo>';
window.__SEO_AGENT_PATH__ = 'index.html';
```
- Open **Dashboard** → **Fix Suggestions** → click **Apply fix** on one suggestion
- Check GitHub repo PRs

✅ **Expected**: PR opened with change; for **multi-file**, call Edge function `apply-fix` with `changes[]` array in body.

---

## 11) Team Invites
- Go **Team** page → **Team Invites**
- Send invite to your email
- Check console/Supabase logs (email API may be stubbed)
- Copy magic link (auto-copied) → open in browser
- If not logged in, login; then `/accept?invite=<id>` auto-joins team

✅ **Expected**: `invites.status` becomes `accepted`; new row in `team_members`.

---

## 12) Notion Export (Optional)
- Obtain `NOTION_TOKEN` and `databaseId`
- In console:
```
import { exportToNotion } from '/utils/notion.ts';
exportToNotion('<token>','<db-id>','SEO Report','Hello from SEO Agent');
```
✅ **Expected**: New page created in Notion DB.

---

## 13) PostHog Events
- In console, ensure `[PH]` logs appear for:
  - `analysis_started`
  - `export_markdown`
  - `checkout_redirect`
  - `fix_applied`

✅ **Expected**: Events printed; replace with real `posthog-js` to send to PostHog.

---

## Troubleshooting Quick Tips
- **401/Unauthorized**: Check auth header in frontend `callEdge()` (session token) and function secrets.
- **CORS**: Use Supabase function URL or reverse proxy with allowed origins.
- **Stripe webhook**: Confirm **whsec** matches; check signature verification errors.
- **GitHub PR**: Confirm token scopes (`repo`), repo name, base branch exists, file paths valid.
- **Worker**: Service key must be **service role** (not anon).

---

## Sign-off Criteria
- [ ] User can login, see Credits, create Project
- [ ] Run analysis → results visible + exports work
- [ ] Credits decrement + Stripe payment adds credits
- [ ] Queue + Worker completes job and saves result
- [ ] FixPanel creates GitHub PR
- [ ] Invite → accept → team member added
- [ ] Scheduled credits reset works (manual invoke ok)
- [ ] PostHog events captured
