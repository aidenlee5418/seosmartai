
/**
 * Scheduled function: reset monthly credits based on plan
 * Schedule via Supabase's cron: e.g., 0 0 1 * * (1st of month)
 */
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const PLAN_CREDITS: Record<string, number> = {
  free: 20, starter: 200, pro: 800, agency: 2500
};

export default async (_req: Request) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data: rows, error } = await supabase.from('users_public').select('id,plan');
  if (error) return new Response(error.message, { status: 500 });

  for (const u of rows || []) {
    const credits = PLAN_CREDITS[u.plan || 'free'] ?? 20;
    await supabase.from('users_public').update({ credits }).eq('id', u.id);
  }
  return new Response('ok');
}
