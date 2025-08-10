import { callEdge } from './api';

export async function getCredits(): Promise<number> {
  try {
    const data = await callEdge('get-credits', {});
    return data.credits ?? 0;
  } catch (_e) {
    return 0;
  }
}

export async function consumeCredits(amount=1): Promise<boolean> {
  try {
    const data = await callEdge('consume-credits', { amount });
    return !!data.ok;
  } catch (_e) {
    return false;
  }
}
