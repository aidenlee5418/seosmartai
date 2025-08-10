
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export default async (req: Request) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const auth = req.headers.get('Authorization') || '';
  const jwt = auth.startsWith('Bearer ') ? auth.substring(7) : null;
  if (!jwt) return new Response('Unauthorized', { status: 401 });

  const { data: { user } } = await supabase.auth.getUser(jwt);
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { url, type = 'technical', project_id = null } = await req.json();
  if (!url) return new Response('Missing url', { status: 400 });

  const { data: job, error } = await supabase.from('jobs').insert([{
    user_id: user.id,
    type, url,
    status: 'queued'
  }]).select('*').single();

  if (error) return new Response(error.message, { status: 500 });
  return new Response(JSON.stringify({ ok:true, job }), { headers: { 'Content-Type': 'application/json' } });
}
