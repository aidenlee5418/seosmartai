
# Playwright + Lighthouse Worker

## Install
```
npm i @supabase/supabase-js playwright lighthouse chrome-launcher node-fetch
npx playwright install chromium
```

## Run
```
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node playwright_lighthouse_worker.js
```

## Notes
- Lighthouse requires Chrome; using `chrome-launcher` in headless mode.
- Reduce cost by sampling: run Lighthouse for every Nth job or on-demand.
