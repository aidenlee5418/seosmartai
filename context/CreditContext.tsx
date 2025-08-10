import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { consumeCredits, getCredits } from '../services/credits';

type CreditContextValue = {
  credits: number;
  refresh: () => Promise<void>;
  tryConsume: (amount?: number) => Promise<boolean>;
  loading: boolean;
};

const CreditContext = createContext<CreditContextValue>({
  credits: 0,
  refresh: async () => {},
  tryConsume: async (_amount=1) => false,
  loading: true,
});

export const CreditProvider = ({ children }: { children: ReactNode }) => {
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const c = await getCredits();
    setCredits(c);
    setLoading(false);
  };

  const tryConsume = async (amount=1) => {
    const ok = await consumeCredits(amount);
    if (ok) await refresh();
    return ok;
  };

  useEffect(() => { refresh(); }, []);

  return (
    <CreditContext.Provider value={{ credits, refresh, tryConsume, loading }}>
      {children}
    </CreditContext.Provider>
  );
};

export const useCredits = () => useContext(CreditContext);
