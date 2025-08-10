
/**
 * Stripe webhook handler
 * IMPORTANT: In production, verify the signature in 'Stripe-Signature' header with STRIPE_WEBHOOK_SECRET.
 * This version parses the event JSON (assumes it's trusted by Supabase deploy).
 */
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const PLAN_CREDITS: Record<string, { plan: string; credits: number }> = {
  starter: { plan: 'starter', credits: 200 },
  pro: { plan: 'pro', credits: 800 },
  agency: { plan: 'agency', credits: 2500 },
};

export default async (req: Request) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  let event: any = null;
  try {
    event = await req.json();
  } catch (_e) {
    return new Response('Bad payload', { status: 400 });
  }

  const type = event?.type;
  const obj = event?.data?.object || {};

  async function updateUserByEmail(email: string, planKey: string) {
    const { plan, credits } = PLAN_CREDITS[planKey] ?? {};
    if (!plan || !credits) return;

    const { data: authUsers, error: e1 } = await supabase.auth.admin.listUsers({ email });
    if (e1 || !authUsers || !authUsers.users?.length) return;

    const uid = authUsers.users[0].id;
    await supabase.from('users_public').upsert({ id: uid, email, plan }, { onConflict: 'id' });
    // add credits (refill)
    await supabase.rpc('decrement_credits', { uid, delta: -credits }); // negative delta = add
  }

  switch (type) {
    case 'checkout.session.completed': {
      // Map price → plan via metadata or lookup
      const priceId = obj?.amount_total ? obj?.metadata?.price_id : obj?.metadata?.price_id;
      const email = obj?.customer_details?.email || obj?.customer_email;
      const planKey = obj?.metadata?.plan_key || 'starter'; // default fallback
      if (email) await updateUserByEmail(email, planKey);
      break;
    }
    case 'invoice.payment_succeeded': {
      const email = obj?.customer_email || obj?.customer_details?.email;
      const planKey = obj?.lines?.data?.[0]?.metadata?.plan_key || 'starter';
      if (email) await updateUserByEmail(email, planKey);
      break;
    }
    default:
      break;
  }

  return new Response('ok', { status: 200 });
}
