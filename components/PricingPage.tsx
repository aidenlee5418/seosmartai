
import React from 'react';
import { PLANS, createCheckoutSession } from '../services/billing';

export function PricingPage() {
  const plans = Object.entries(PLANS).filter(([k]) => k !== 'free');
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Choose your plan</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map(([key, p]) => (
          <div key={key} className="border rounded-2xl p-5">
            <div className="text-lg font-semibold">{p.name}</div>
            <div className="text-3xl font-bold mt-2">${p.price}<span className="text-sm font-normal">/mo</span></div>
            <ul className="text-sm mt-3 space-y-1">
              <li>Credits per month: {p.monthlyCredits}</li>
              <li>Unlimited projects</li>
              <li>Export & Sharing</li>
            </ul>
            <button className="mt-4 w-full px-3 py-2 rounded bg-black text-white"
              onClick={() => createCheckoutSession(key as any)}>
              Get {p.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PricingPage;
