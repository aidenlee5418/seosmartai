
/**
 * send-invite: creates an invite and emails a magic link
 * Env:
 *  INVITE_MAIL_PROVIDER: 'resend' | 'sendgrid' (optional)
 *  RESEND_KEY / SENDGRID_KEY
 *  APP_ORIGIN: e.g. https://yourapp.com
 */
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export default async (req: Request) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { team_id, email, role='member' } = await req.json();
  if (!team_id || !email) return new Response('Missing params', { status: 400 });

  const { data: inv, error } = await supabase.from('invites').insert([{ team_id, email, role }]).select('*').single();
  if (error) return new Response(error.message, { status: 500 });

  const origin = Deno.env.get('APP_ORIGIN') || 'http://localhost:5173';
  const link = `${origin}/auth?invite=${inv.id}`;

  // Optional: send email (pseudo)
  // const provider = Deno.env.get('INVITE_MAIL_PROVIDER') || 'resend';
  // ... call provider API with `link`

  return new Response(JSON.stringify({ ok:true, link, invite: inv }), { headers: { 'Content-Type': 'application/json' } });
}
