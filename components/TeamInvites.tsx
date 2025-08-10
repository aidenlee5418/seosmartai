"use client";


import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase/client';

export default function TeamInvites() {
  const [team, setTeam] = useState<any>(null);
  const [invites, setInvites] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'member'|'admin'>('member');

  const load = async () => {
    const { data: teams } = await supabase.from('teams').select('*').limit(1);
    if (teams?.[0]) {
      setTeam(teams[0]);
      const { data: inv } = await supabase.from('invites').select('*').eq('team_id', teams[0].id).order('created_at', { ascending: false });
      setInvites(inv || []);
    }
  };
  useEffect(() => { load(); }, []);

  const send = async () => {
    if (!team || !email) return;
    const r = await fetch('/functions/v1/send-invite', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ team_id: team.id, email, role }) });
    if (r.ok) { const data = await r.json(); navigator.clipboard.writeText(data.link); alert('Invite sent. Link copied to clipboard'); }
    setEmail('');
    setRole('member');
    load();
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold">Team Invites</h2>
      <div className="flex gap-2">
        <input className="border rounded px-2 py-1" placeholder="user@email.com" value={email} onChange={e=>setEmail(e.target.value)} />
        <select className="border rounded px-2 py-1" value={role} onChange={e=>setRole(e.target.value as any)}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button className="px-3 py-1.5 rounded bg-black text-white" onClick={send}>Send Invite</button>
      </div>
      <ul className="list-disc pl-5 text-sm">
        {invites.map(v => <li key={v.id}>{v.email} — {v.role} — {v.status}</li>)}
      </ul>
    </div>
  );
}
