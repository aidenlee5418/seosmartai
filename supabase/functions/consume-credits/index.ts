
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export default async (req: Request) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const authHeader = req.headers.get('Authorization') || '';
  const jwt = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!jwt) return new Response('Unauthorized', { status: 401 });
  const { data: { user }, error } = await supabase.auth.getUser(jwt);
  if (error || !user) return new Response('Unauthorized', { status: 401 });

  const { amount = 1 } = await req.json();
  const { data, error: e1 } = await supabase.rpc('decrement_credits', { uid: user.id, delta: amount });
  if (e1) return new Response(e1.message, { status: 400 });

  return new Response(JSON.stringify({ ok: true, remaining: data }), { headers: { 'Content-Type': 'application/json' } });
}
