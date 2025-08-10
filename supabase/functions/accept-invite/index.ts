/** Accept team invite (token=query) */
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export default async (req: Request): Promise<Response> => {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token') || url.searchParams.get('invite');

    // JWT from Authorization header
    const auth = req.headers.get('Authorization') || '';
    const jwt = auth.startsWith('Bearer ') ? auth.substring(7) : null;

    if (!token || !jwt) {
      return new Response('Bad request', { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get('PROJECT_URL')!,
      Deno.env.get('SERVICE_ROLE_KEY')!
    );

    const { data: userRes, error: userErr } = await supabase.auth.getUser(jwt);
    if (userErr || !userRes?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // find invite by id
    const { data: inv, error } = await supabase
      .from('invites')
      .select('*')
      .eq('id', token)
      .single();

    if (error || !inv || inv.status !== 'pending') {
      return new Response('Invalid invite', { status: 400 });
    }

    // add membership & mark accepted
    await supabase.from('team_members').upsert({
      team_id: inv.team_id,
      user_id: userRes.user.id,
      role: inv.role,
    });

    await supabase
      .from('invites')
      .update({ status: 'accepted' })
      .eq('id', inv.id);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(String(e), { status: 500 });
  }
};
