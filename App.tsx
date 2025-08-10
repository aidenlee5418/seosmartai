import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "sonner@2.0.3";
import { AuthProvider } from './context/AuthContext';
import { CreditProvider } from './context/CreditContext';
import QueryProvider from './context/QueryProvider';
import { initPostHog } from './utils/posthog';
import PrivateRoute from './routes/PrivateRoute';

import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import History from './pages/History';
import AcceptInvite from './pages/AcceptInvite';
import Projects from './pages/Projects';

export default function App() {
  initPostHog('ph_demo_key');
  return (
    <AuthProvider>
      <QueryProvider>
      <CreditProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/accept" element={<AcceptInvite />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
            <Route path="/dashboard" element={
              <PrivateRoute><Dashboard /></PrivateRoute>
            } />
            <Route path="/history" element={
              <PrivateRoute><History /></PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </CreditProvider>
      </QueryProvider>
    </AuthProvider>
  );
}
