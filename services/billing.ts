import { capture } from '../utils/posthog';

export const PLANS = {
  free: { name:'Free', price: 0, monthlyCredits: 20, stripePriceId: null },
  starter: { name:'Starter', price: 19, monthlyCredits: 200, stripePriceId: 'price_starter_XXXX' },
  pro: { name:'Pro', price: 49, monthlyCredits: 800, stripePriceId: 'price_pro_XXXX' },
  agency: { name:'Agency', price: 99, monthlyCredits: 2500, stripePriceId: 'price_agency_XXXX' },
};

export async function createCheckoutSession(planKey: keyof typeof PLANS) {
  const plan = PLANS[planKey];
  if (!plan.stripePriceId) throw new Error('Plan not purchasable');
  // TODO: call your backend function to create a Stripe checkout session and redirect
}
