
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export default async (req: Request) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const authHeader = req.headers.get('Authorization') || '';
  const jwt = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!jwt) return new Response('Unauthorized', { status: 401 });
  const { data: { user }, error } = await supabase.auth.getUser(jwt);
  if (error || !user) return new Response('Unauthorized', { status: 401 });

  const { data, error: e2 } = await supabase.from('users_public').select('credits').eq('id', user.id).single();
  if (e2) return new Response(e2.message, { status: 500 });

  return new Response(JSON.stringify({ credits: data?.credits ?? 0 }), { headers: { 'Content-Type': 'application/json' } });
}
