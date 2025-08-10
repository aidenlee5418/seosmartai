"use client";


import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase/client';

export default function Projects() {
  const [items, setItems] = useState<any[]>([]);
  const [domain, setDomain] = useState('');

  const load = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    setItems(data || []);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!domain) return;
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return;
    await supabase.from('projects').insert([{ user_id: user.user.id, domain }]);
    setDomain('');
    load();
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Projects</h1>
      <div className="flex gap-2">
        <input className="border rounded px-2 py-1" placeholder="example.com" value={domain} onChange={e=>setDomain(e.target.value)} />
        <button className="px-3 py-1.5 rounded bg-black text-white" onClick={add}>Add Project</button>
      </div>
      <ul className="list-disc pl-5">
        {items.map(p => <li key={p.id}>{p.domain} — {new Date(p.created_at).toLocaleString()}</li>)}
      </ul>
    </div>
  );
}
