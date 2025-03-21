'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Currency {
  code: string;
  symbol: string;
  rate: number;
}

interface CurrencyContextType {
  currentCurrency: Currency;
  setCurrency: (currency: Currency) => void;
  convertAmount: (amount: number) => string;
}

const currencies: Currency[] = [
  { code: 'INR', symbol: '₹', rate: 82.94 }, // Make INR first in the list
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'EUR', symbol: '€', rate: 0.85 },
  { code: 'GBP', symbol: '£', rate: 0.73 },
  { code: 'JPY', symbol: '¥', rate: 110.32 },
  { code: 'AUD', symbol: 'A$', rate: 1.35 },
];

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Store selected currency in localStorage to persist across page navigation
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedCurrency');
      return saved ? JSON.parse(saved) : currencies[0];
    }
    return currencies[0];
  });

  const setCurrency = (currency: Currency) => {
    setCurrentCurrency(currency);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedCurrency', JSON.stringify(currency));
    }
  };

  const convertAmount = (amount: number): string => {
    const converted = amount * currentCurrency.rate;
    return `${currentCurrency.symbol}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currentCurrency, setCurrency, convertAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

export { currencies };
