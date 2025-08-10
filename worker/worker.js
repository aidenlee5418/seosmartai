
/* Pseudo worker to process queued jobs */
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function simpleAudit(url) {
  const res = await fetch(url);
  const html = await res.text();
  const hasH1 = /<h1\b/i.test(html);
  return {
    summary: hasH1 ? 'OK' : 'Missing H1',
    payload: { url, from: 'worker', hasH1 }
  };
}

async function loop() {
  while (true) {
    const { data: jobs } = await sb.from('jobs').select('*').eq('status','queued').limit(1);
    if (!jobs || !jobs.length) { await new Promise(r => setTimeout(r, 3000)); continue; }
    const job = jobs[0];
    await sb.rpc('set_job_status', { jid: job.id, st: 'processing' });
    try {
      const result = await simpleAudit(job.url);
      await sb.from('results').insert([{ user_id: job.user_id, job_id: job.id, summary: result.summary, payload: result.payload }]);
      await sb.rpc('set_job_status', { jid: job.id, st: 'completed' });
    } catch (e) {
      await sb.rpc('set_job_status', { jid: job.id, st: 'failed' });
    }
  }
}

loop().catch(console.error);
