"use client";


import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase/client';

export default function AcceptInvite() {
  const [status, setStatus] = useState<'idle'|'accepting'|'done'|'error'>('idle');

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('invite');
      if (!token) return setStatus('error');
      setStatus('accepting');
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) { window.location.href = '/auth?invite='+token; return; }
      const res = await fetch(`/functions/v1/accept-invite?token=${token}`, { headers: { Authorization: `Bearer ${session.access_token}` } });
      if (!res.ok) return setStatus('error');
      setStatus('done');
      setTimeout(() => window.location.href='/team', 1200);
    })();
  }, []);

  return (
    <div className="p-10 text-center">
      {status==='idle' && <div>Ready.</div>}
      {status==='accepting' && <div>Joining team...</div>}
      {status==='done' && <div>Joined! Redirecting…</div>}
      {status==='error' && <div>Invalid or expired invite.</div>}
    </div>
  );
}
