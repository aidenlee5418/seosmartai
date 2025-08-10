/** Create Stripe Checkout Session */
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

export default async (req: Request) => {
  try {
    const body = await req.json().catch(() => ({}));
    const priceId = body.priceId as string;
    const successUrl = body.successUrl || 'http://localhost:5173/dashboard';
    const cancelUrl = body.cancelUrl || 'http://localhost:5173/pricing';
    if (!priceId) return new Response('Missing priceId', { status: 400 });

    const sk = Deno.env.get('STRIPE_SECRET_KEY');
    if (!sk) return new Response('STRIPE_SECRET_KEY not set', { status: 500 });

    const form = new URLSearchParams();
    form.append('mode', 'subscription');
    form.append('line_items[0][price]', priceId);
    form.append('line_items[0][quantity]', '1');
    form.append('success_url', successUrl);
    form.append('cancel_url', cancelUrl);

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sk}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: form.toString(),
    });

    const data = await res.json();
    if (!res.ok) return new Response(JSON.stringify(data), { status: res.status });

    return new Response(JSON.stringify({ url: data.url }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(String(e), { status: 500 });
  }
};