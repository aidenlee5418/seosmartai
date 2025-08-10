
# SEO Agent Worker (local/server)

This worker polls `jobs` for `queued` items and runs analysis (headless browser, Lighthouse) then writes to `results`.
Use Node.js + Playwright/Lighthouse in a cron/pm2 environment.

## Env
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

## Run
node worker.js
