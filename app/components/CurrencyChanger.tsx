'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiDollarSign, FiRefreshCw } from 'react-icons/fi';

interface Currency {
  code: string;
  symbol: string;
  rate: number;
  name: string;
}

const currencies: Currency[] = [
  { code: 'USD', symbol: '$', rate: 1, name: 'US Dollar' },
  { code: 'EUR', symbol: '€', rate: 0.85, name: 'Euro' },
  { code: 'GBP', symbol: '£', rate: 0.73, name: 'British Pound' },
  { code: 'JPY', symbol: '¥', rate: 110.32, name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', rate: 1.35, name: 'Australian Dollar' },
];

export default function CurrencyChanger() {
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<Currency>(currencies[0]);
  const [toCurrency, setToCurrency] = useState<Currency>(currencies[1]);
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    if (amount) {
      const conversion = (parseFloat(amount) * toCurrency.rate) / fromCurrency.rate;
      setConvertedAmount(Number(conversion.toFixed(2)));
    }
  }, [amount, fromCurrency, toCurrency]);

  const handleSwapCurrencies = () => {
    setIsConverting(true);
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setTimeout(() => setIsConverting(false), 500);
  };

  return (
    <div className="w-full max-w-md p-6 bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Currency Converter</h2>

      {/* Amount Input */}
      <div className="mb-6">
        <label className="block text-gray-400 text-sm font-medium mb-2">Amount</label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white
                     placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount"
          />
          <FiDollarSign className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Currency Selection */}
      <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center mb-6">
        <select
          value={fromCurrency.code}
          onChange={(e) => setFromCurrency(currencies.find(c => c.code === e.target.value) || currencies[0])}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code} className="bg-gray-900">
              {currency.code} - {currency.name}
            </option>
          ))}
        </select>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSwapCurrencies}
          className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors"
        >
          <motion.div
            animate={{ rotate: isConverting ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <FiRefreshCw className="text-white text-xl" />
          </motion.div>
        </motion.button>

        <select
          value={toCurrency.code}
          onChange={(e) => setToCurrency(currencies.find(c => c.code === e.target.value) || currencies[1])}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code} className="bg-gray-900">
              {currency.code} - {currency.name}
            </option>
          ))}
        </select>
      </div>

      {/* Conversion Result */}
      <AnimatePresence mode="wait">
        {amount && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/5 rounded-lg p-4 text-center"
          >
            <p className="text-gray-400 mb-2">
              {amount} {fromCurrency.code} equals
            </p>
            <motion.p
              key={convertedAmount}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-white"
            >
              {toCurrency.symbol}{convertedAmount} {toCurrency.code}
            </motion.p>
            <p className="text-sm text-gray-500 mt-2">
              1 {fromCurrency.code} = {(toCurrency.rate / fromCurrency.rate).toFixed(4)} {toCurrency.code}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
