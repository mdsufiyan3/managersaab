'use client';

import { useEffect } from 'react';
import { useCurrency } from '../contexts/CurrencyContext';

export function useSharedCurrency() {
  const { currentCurrency, setCurrency, convertAmount } = useCurrency();

  useEffect(() => {
    // Sync with localStorage on mount
    const saved = localStorage.getItem('selectedCurrency');
    if (saved) {
      const parsedCurrency = JSON.parse(saved);
      setCurrency(parsedCurrency);
    }
  }, []);

  return { currentCurrency, setCurrency, convertAmount };
}
