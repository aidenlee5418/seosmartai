/** apply-fix: create a GitHub PR (single file) */
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

export default async (req: Request) => {
  try {
    const token = Deno.env.get('GITHUB_TOKEN')!;
    const defaultRepo = Deno.env.get('GITHUB_REPO') || '';
    if (!token) return new Response('Missing GITHUB_TOKEN', { status: 500 });

    const body = await req.json().catch(() => ({}));
    const repo: string = body.repo || defaultRepo;
    const base: string = body.base || 'main';
    const title: string = body.title || 'SEO fix';
    const path: string = body.path;
    const content: string = body.content || '<!-- fix applied -->';
    const branch = `seo-agent-fix-${Date.now()}`;
    if (!repo || !path) return new Response('Missing repo or path', { status: 400 });

    const gh = (u: string, init: RequestInit = {}) =>
      fetch(`https://api.github.com${u}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          ...(init.headers || {})
        }
      });

    const refRes = await gh(`/repos/${repo}/git/ref/heads/${base}`);
    if (!refRes.ok) return new Response(await refRes.text(), { status: 400 });
    const { object: { sha: baseSha } } = await refRes.json();

    const brRes = await gh(`/repos/${repo}/git/refs`, {
      method: 'POST',
      body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: baseSha })
    });
    if (!brRes.ok && brRes.status !== 422)
      return new Response(await brRes.text(), { status: 400 });

    const fileRes = await gh(`/repos/${repo}/contents/${encodeURIComponent(path)}?ref=${base}`);
    const prev = fileRes.ok ? await fileRes.json() : null;

    const putRes = await gh(`/repos/${repo}/contents/${encodeURIComponent(path)}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: title,
        content: btoa(unescape(encodeURIComponent(content))),
        branch,
        sha: prev?.sha || undefined
      })
    });
    if (!putRes.ok)
      return new Response(await putRes.text(), { status: putRes.status });

    const prRes = await gh(`/repos/${repo}/pulls`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        head: branch,
        base,
        body: body.body || 'Automated fix by SEO Agent'
      })
    });
    if (!prRes.ok) return new Response(await prRes.text(), { status: prRes.status });
    const pr = await prRes.json();

    return new Response(JSON.stringify({ ok: true, pr }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(String(e), { status: 500 });
  }
};
