
/**
 * Advanced worker using Playwright + Lighthouse
 * Install deps:
 *   npm i @supabase/supabase-js playwright lighthouse chrome-launcher node-fetch
 *   npx playwright install chromium
 */
import { createClient } from '@supabase/supabase-js';
import { chromium } from 'playwright';
import fetch from 'node-fetch';
import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = { logLevel: 'info', output: 'json', onlyCategories: ['performance','seo','best-practices'], port: chrome.port };
  const runnerResult = await lighthouse(url, options);
  await chrome.kill();
  const categories = runnerResult.lhr.categories;
  return {
    performance: categories.performance.score,
    seo: categories.seo.score,
    best: categories['best-practices'].score,
    audits: runnerResult.lhr.audits,
  };
}

async function renderAndExtract(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  const title = await page.title();
  const metaDesc = await page.locator('meta[name="description"]').getAttribute('content').catch(()=>null);
  const h1Count = await page.locator('h1').count();
  const links = await page.locator('a[href]').evaluateAll(els => els.map(e => e.getAttribute('href')));
  await browser.close();
  return { title, metaDesc, h1Count, linkCount: links.length };
}

async function processJob(job) {
  await sb.rpc('set_job_status', { jid: job.id, st: 'processing' });
  try {
    const render = await renderAndExtract(job.url);
    const lh = await runLighthouse(job.url);
    const summary = `LH SEO ${Math.round(lh.seo*100)} · Perf ${Math.round(lh.performance*100)} · h1:${render.h1Count}`;
    const payload = { url: job.url, from: 'pw+lh', render, lighthouse: { ...lh, audits: undefined } };
    await sb.from('results').insert([{ user_id: job.user_id, job_id: job.id, summary, payload }]);
    await sb.rpc('set_job_status', { jid: job.id, st: 'completed' });
  } catch (e) {
    console.error('Job failed', e);
    await sb.rpc('set_job_status', { jid: job.id, st: 'failed' });
  }
}

async function loop() {
  while (true) {
    const { data: jobs } = await sb.from('jobs').select('*').eq('status','queued').limit(1);
    if (!jobs?.length) { await new Promise(r => setTimeout(r, 3000)); continue; }
    await processJob(jobs[0]);
  }
}
loop().catch(console.error);
