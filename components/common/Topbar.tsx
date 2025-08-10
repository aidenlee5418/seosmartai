import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCredits } from '../../context/CreditContext';

export default function Topbar() {
  const { signOut } = useAuth();
  const { credits } = useCredits();
  return (
    <div className="w-full border-b flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-semibold">SEO Agent</Link>
        <Link to="/projects" className="text-sm">Projects</Link>
        <Link to="/dashboard" className="text-sm" className="text-sm">Dashboard</Link>
        <Link to="/history" className="text-sm" className="text-sm">History</Link>
        <Link to="/pricing" className="text-sm">Pricing</Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm">Credits: {credits}</span>
        <button className="text-sm px-3 py-1 rounded border" onClick={signOut}>Sign out</button>
      </div>
    </div>
  );
}
