
/** Supabase Edge Function: analyze-url
 * - Fetches HTML and runs very basic checks
 * - Inserts a result row tied to the authenticated user (from JWT)
 */
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export default async (req: Request) => {
  try {
    const authHeader = req.headers.get('Authorization') || '';
    const jwt = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (!jwt) return new Response('Unauthorized', { status: 401 });

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: { user }, error: userErr } = await supabase.auth.getUser(jwt);
    if (userErr || !user) return new Response('Unauthorized', { status: 401 });

    const { url, type } = await req.json();
    if (!url || !type) return new Response('Missing params', { status: 400 });

    const res = await fetch(url, { redirect: 'follow' });
    const html = await res.text();

    const issues: Array<{id:string; title:string; severity:'low'|'medium'|'high'}> = [];
    if (!/<h1[^>]*>/i.test(html)) issues.push({ id:'h1', title:'Missing H1', severity:'high' });
    if (!/<meta[^>]*name=["']description["'][^>]*>/i.test(html)) issues.push({ id:'meta', title:'Missing meta description', severity:'medium' });
    if (!/<title[^>]*>.*?<\/title>/is.test(html)) issues.push({ id:'title', title:'Missing <title>', severity:'medium' });

    const summary = issues.length ? `${issues.length} issues found` : 'No critical issues found';

    // Optionally create a job record (queued/completed). Here we directly insert result.
    const { data: inserted, error: insErr } = await supabase
      .from('results')
      .insert([{
        user_id: user.id,
        summary,
        payload: { type, url, issues, size: html.length }
      }])
      .select('*')
      .single();

    if (insErr) return new Response(insErr.message, { status: 500 });

    return new Response(JSON.stringify({ ok:true, result: inserted }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(String(e), { status: 500 });
  }
}
