'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RiWalletLine, RiArrowUpLine, RiArrowDownLine, RiHistoryLine } from 'react-icons/ri';
import { useCurrency } from '../contexts/CurrencyContext';
import Sidebar from '../components/Sidebar';
import CustomCursor from '../components/CustomCursor';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

export default function WalletPage() {
  const [balance, setBalance] = useState(1000); // Initial balance
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdrawal'>('deposit');
  const { convertAmount } = useCurrency();
  const [activeSection, setActiveSection] = useState('wallet');

  // Load initial transactions
  useEffect(() => {
    // Simulated initial transactions
    const initialTransactions: Transaction[] = [
      {
        id: 'T1',
        type: 'deposit',
        amount: 500,
        date: '2024-01-15',
        status: 'completed',
        description: 'Initial deposit'
      },
      {
        id: 'T2',
        type: 'withdrawal',
        amount: 200,
        date: '2024-01-14',
        status: 'completed',
        description: 'ATM withdrawal'
      }
    ];
    setTransactions(initialTransactions);
  }, []);

  const handleTransaction = (type: 'deposit' | 'withdrawal') => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (type === 'withdrawal' && numAmount > balance) {
      alert('Insufficient funds');
      return;
    }

    const newTransaction: Transaction = {
      id: `T${Date.now()}`,
      type: type,
      amount: numAmount,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      description: description || `${type} transaction`
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setBalance(prev => type === 'deposit' ? prev + numAmount : prev - numAmount);
    setAmount('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-900/20 to-black">
      <CustomCursor />
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className={`ml-16 transition-all duration-300 p-6`}>
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Wallet Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">My Wallet</h1>
              <p className="text-gray-400">Manage your funds</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center bg-white/5 rounded-xl p-4"
            >
              <RiWalletLine className="text-2xl text-blue-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Current Balance</p>
                <p className="text-xl font-bold text-white">{convertAmount(balance)}</p>
              </div>
            </motion.div>
          </div>

          {/* Transaction Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex space-x-4 mb-6">
                <button
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'deposit'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                  onClick={() => setActiveTab('deposit')}
                >
                  Deposit
                </button>
                <button
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'withdrawal'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                  onClick={() => setActiveTab('withdrawal')}
                >
                  Withdraw
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter description"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 font-medium"
                  onClick={() => handleTransaction(activeTab)}
                >
                  {activeTab === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
                </motion.button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Quick Stats</h3>
                  <RiHistoryLine className="text-gray-400" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center text-green-400 mb-2">
                      <RiArrowUpLine />
                      <span className="text-sm ml-1">Income</span>
                    </div>
                    <p className="text-lg font-medium text-white">
                      {convertAmount(transactions.reduce((sum, t) => 
                        sum + (t.type === 'deposit' ? t.amount : 0), 0
                      ))}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center text-red-400 mb-2">
                      <RiArrowDownLine />
                      <span className="text-sm ml-1">Expenses</span>
                    </div>
                    <p className="text-lg font-medium text-white">
                      {convertAmount(transactions.reduce((sum, t) => 
                        sum + (t.type === 'withdrawal' ? t.amount : 0), 0
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">Transaction History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-white/10">
                    <th className="pb-4 font-medium">Type</th>
                    <th className="pb-4 font-medium">Amount</th>
                    <th className="pb-4 font-medium">Description</th>
                    <th className="pb-4 font-medium">Date</th>
                    <th className="pb-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-b border-white/5"
                    >
                      <td className="py-4">
                        <div className={`flex items-center ${
                          transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'deposit' ? <RiArrowUpLine /> : <RiArrowDownLine />}
                          <span className="ml-2 capitalize">{transaction.type}</span>
                        </div>
                      </td>
                      <td className="py-4 font-medium text-white">
                        {convertAmount(transaction.amount)}
                      </td>
                      <td className="py-4 text-gray-400">{transaction.description}</td>
                      <td className="py-4 text-gray-400">{transaction.date}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          transaction.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
