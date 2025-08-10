import { capture } from '../utils/posthog';
import { supabase } from '../utils/supabase/client';

export type AnalysisPayload = {
  url: string;
  type: 'technical' | 'content' | 'eeat' | 'competitor';
};

import { supabase } from '../utils/supabase/client';
export async function callEdge(fn: string, payload: any) {
  // Supabase Edge Functions call
  const res = await fetch(`/functions/v1/${fn}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token ?? ''}` } ,
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function runAnalysis(payload: AnalysisPayload) {
  capture('analysis_started', { type: payload.type });
  return callEdge('analyze-url', payload);
}

export async function getHistory(limit = 20) {
  const { data, error } = await supabase
    .from('results')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}
