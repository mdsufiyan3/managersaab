'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

import { Order } from '../data/orders';
import Image from 'next/image';
import {
  RiHomeLine, RiTBoxLine, RiHistoryLine,
  RiUserLine, RiLogoutBoxLine, RiMoreLine, RiTruckLine,
  RiLineChartLine, RiBarChartBoxLine, RiPieChartLine, RiWalletLine
} from 'react-icons/ri';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line
} from 'recharts';
import { calculateMonthlyRevenue, calculateMonthlyDeliveries } from '../utils/orderCalculations';
import { orders } from '../data/orders'; // Update the import path
import { useCurrency, currencies } from '../contexts/CurrencyContext';
import Sidebar from '../components/Sidebar';
import CustomCursor from '../components/CustomCursor';

const sidebarNavigation = [
  { icon: RiHomeLine, label: 'Home', href: '/home' },
  { icon: RiTBoxLine, label: 'Dashboard', href: '/dashboard' },
   { icon: RiTBoxLine, label: 'Products', href: '/product' },
    { icon: RiTruckLine, label: 'Orders', href: '/order' },
  { icon: RiHistoryLine, label: 'Payment History', href: '/payment' },
  { icon: RiWalletLine, label: 'Wallet', href: '/wallet' },
];

const recentTransactions = [
  {
    id: 'TR001',
    customer: 'John Doe',
    amount: 156.99,
    status: 'Completed',
    date: '2024-01-15'
  },
  {
    id: 'TR002',
    customer: 'Alice Smith',
    amount: 89.50,
    status: 'Processing',
    date: '2024-01-14'
  },
  {
    id: 'TR003',
    customer: 'Robert Johnson',
    amount: 245.75,
    status: 'Completed',
    date: '2024-01-13'
  }
];

const salesData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
];

const demographicData = [
  { name: 'Under 25', value: 400 },
  { name: '25-34', value: 300 },
  { name: '35-44', value: 300 },
  { name: 'Over 45', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const paymentData = [
  { name: 'Jan', success: 982, failed: 18, return: 25 },
  { name: 'Feb', success: 875, failed: 24, return: 32 },
  { name: 'Mar', success: 1098, failed: 22, return: 28 },
  { name: 'Apr', success: 985, failed: 25, return: 35 },
  { name: 'May', success: 1192, failed: 21, return: 30 },
  { name: 'Jun', success: 1270, failed: 23, return: 38 },
  { name: 'Jul', success: 1365, failed: 28, return: 42 },
  { name: 'Aug', success: 1425, failed: 26, return: 35 },
  { name: 'Sep', success: 1528, failed: 24, return: 40 },
  { name: 'Oct', success: 1625, failed: 29, return: 45 },
  { name: 'Nov', success: 1722, failed: 27, return: 38 },
  { name: 'Dec', success: 1865, failed: 32, return: 48 }
];

const sellingProductsData = [
  { name: 'Electronics', value: 35, change: '+12%' },
  { name: 'Fashion', value: 28, change: '+8%' },
  { name: 'Home & Living', value: 22, change: '+15%' },
  { name: 'Books', value: 15, change: '+5%' }
];

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedYear, setSelectedYear] = useState('2024');
  const { currentCurrency, setCurrency, convertAmount } = useCurrency();

  // Filter data based on selected year
  const getYearMultiplier = (year: string) => {
    switch(year) {
      case '2023': return 0.8;
      case '2022': return 0.6;
      case '2021': return 0.4;
      default: return 1;
    }
  };

  const multiplier = getYearMultiplier(selectedYear);
  
  // Adjust data based on selected year
  const adjustedPaymentData = paymentData.map(item => ({
    ...item,
    success: Math.round(item.success * multiplier),
    failed: Math.round(item.failed * multiplier),
    return: Math.round(item.return * multiplier)
  }));

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value);
  };

  const monthlyRevenue = calculateMonthlyRevenue(orders.filter((order: Order) => 
    new Date(order.date).getFullYear() === parseInt(selectedYear) &&
    order.status === 'Delivered'  // Add this condition
  ));

  const hasDataForYear = monthlyRevenue.some(item => item.revenue > 0);

  const adjustedRevenueData = monthlyRevenue.map(item => ({
    ...item,
    revenue: Math.round(item.revenue * getYearMultiplier(selectedYear)),
    prevRevenue: Math.round(item.prevRevenue * getYearMultiplier(selectedYear))
  }));

  const monthlyDeliveries = calculateMonthlyDeliveries(orders.filter((order: Order) => 
    new Date(order.date).getFullYear() === parseInt(selectedYear)
  ));

  const hasDeliveriesForYear = monthlyDeliveries.some(item => item.delivered > 0 || item.returns > 0);

  // Update the total revenue display to only include delivered orders
  const totalRevenue = hasDataForYear ? 
    orders
      .filter((order: Order) => 
        new Date(order.date).getFullYear() === parseInt(selectedYear) &&
        order.status === 'Delivered'
      )
      .reduce((sum, order) => sum + order.amount, 0) * getYearMultiplier(selectedYear)
    : 0;

  const adjustedCourierData = monthlyDeliveries.map(item => ({
    ...item,
    delivered: Math.round(item.delivered * getYearMultiplier(selectedYear)),
    returns: Math.round(item.returns * getYearMultiplier(selectedYear))
  }));

  // Calculate total deliveries and returns for display
  const totalDeliveries = hasDeliveriesForYear ? 
    adjustedCourierData.reduce((sum, item) => sum + item.delivered, 0) : 0;
  const totalReturns = hasDeliveriesForYear ? 
    adjustedCourierData.reduce((sum, item) => sum + item.returns, 0) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-900/20 to-black">
      <CustomCursor />
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="ml-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
              <p className="text-gray-400 text-sm mt-1">Welcome back, John Doe</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Add Currency Selector */}
              <motion.select
                value={currentCurrency.code}
                onChange={(e) => {
                  const selected = currencies.find(c => c.code === e.target.value);
                  if (selected) setCurrency(selected);
                }}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code} className="bg-gray-900">
                    {currency.symbol} {currency.code}
                  </option>
                ))}
              </motion.select>

              <select 
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none"
                value={selectedYear}
                onChange={handleYearChange}
              >
                <option value="2024">Year 2024</option>
                <option value="2023">Year 2023</option>
                <option value="2022">Year 2022</option>
                <option value="2021">Year 2021</option>
              </select>
            </div>
          </div>

          {/* Sales Revenue Analytics */}
          <div className="rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 p-6">
            {hasDataForYear ? (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-white">Sales Revenue</h2>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-3xl font-bold text-white">
                        {convertAmount(totalRevenue)}
                      </p>
                      <span className="px-2 py-1 text-sm text-green-400 bg-green-400/10 rounded-lg">
                        +24.5%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm text-gray-400">Current Year</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500/20"></div>
                      <span className="text-sm text-gray-400">Previous Year</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={adjustedRevenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="prevRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="month" 
                        stroke="#4B5563"
                        tick={{ fill: '#9CA3AF' }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        stroke="#4B5563"
                        tick={false}
                        axisLine={false}
                      />
                      <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#111827',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: '#9CA3AF' }}
                        formatter={(value) => [convertAmount(Number(value)), '']}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#revenueGradient)"
                      />
                      <Area
                        type="monotone"
                        dataKey="prevRevenue"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        strokeOpacity={0.3}
                        fillOpacity={1}
                        fill="url(#prevRevenueGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px]">
                <p className="text-gray-400 text-lg">No revenue data available for {selectedYear}</p>
              </div>
            )}
          </div>

          {/* Selling Products Analytics */}
          <div className="rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Top Selling Products</h2>
                <p className="text-gray-400 text-sm">Product performance by category</p>
              </div>
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white text-sm">
                <option>This Month</option>
                <option>Last Month</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Categories Chart */}
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sellingProductsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sellingProductsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#111827',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Product Categories List */}
              <div className="space-y-4">
                {sellingProductsData.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-white">{product.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400">{product.value}%</span>
                      <span className="text-green-400">{product.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Courier and Payment Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Courier Analytics */}
            <div className="rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 p-6">
              {hasDeliveriesForYear ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-6">
                      <div>
                        <h2 className="text-xl font-bold text-white">Courier Performance</h2>
                        <div className="flex items-center gap-4 mt-2">
                          <p className="text-2xl font-bold text-white">{totalDeliveries}</p>
                          <span className="text-sm text-gray-400">Total Deliveries</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-4 mt-8">
                          <p className="text-2xl font-bold text-orange-400">{totalReturns}</p>
                          <span className="text-sm text-gray-400">Total Returns</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-sm text-gray-400">Delivered</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="text-sm text-gray-400">Returns</span>
                      </div>
                    </div>
                  </div>
                    
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={adjustedCourierData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#4B5563"
                          interval={0}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis 
                          stroke="#4B5563"
                          tick={false}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#111827',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="delivered" fill="#10B981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="returns" fill="#F97316" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px]">
                  <p className="text-gray-400 text-lg">No delivery data available for {selectedYear}</p>
                </div>
              )}
            </div>

            {/* Payment Analytics */}
            <div className="rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Payment Analytics</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-2xl font-bold text-white">98.5%</p>
                    <span className="text-sm text-gray-400">Success Rate</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-400">Success</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm text-gray-400">Failed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-sm text-gray-400">Return</span>
                  </div>
                </div>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={adjustedPaymentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#4B5563"
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      stroke="#4B5563"
                      tick={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#111827',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="success" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="failed" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      dot={{ fill: '#EF4444', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="return" 
                      stroke="#F97316" 
                      strokeWidth={2}
                      dot={{ fill: '#F97316', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Product Performance */}
          <div className="rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Product Performance</h2>
                  <p className="text-gray-400 text-sm">Top selling items</p>
                </div>
              <RiBarChartBoxLine className="text-2xl text-green-400" />
            </div>
            <div className="space-y-4">
              {['Product A', 'Product B', 'Product C'].map((product, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-full bg-white/5 rounded-full h-2 mr-4">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${85 - (index * 20)}%` }}
                    />
                  </div>
                  <span className="text-white text-sm min-w-[100px]">{product}</span>
                  <span className="text-gray-400 text-sm">{85 - (index * 20)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Market Insights */}
          <div className="rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Market Insights</h2>
                <p className="text-gray-400 text-sm">Latest trends and analysis</p>
              </div>
              <RiMoreLine className="text-2xl text-gray-400" />
            </div>
            <div className="space-y-4">
              {[
                { title: 'Market Growth', value: '+12.5%', trend: 'positive' },
                { title: 'Customer Retention', value: '85.2%', trend: 'neutral' },
                { title: 'Average Order Value', value: convertAmount(156.32), trend: 'positive' }
              ].map((insight, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-gray-400">{insight.title}</span>
                  <span className={`font-medium ${
                    insight.trend === 'positive' ? 'text-green-400' : 'text-blue-400'
                  }`}>{insight.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
              <button className="text-gray-400 hover:text-white">
                <RiMoreLine className="text-xl" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-white/10">
                      <th className="pb-4 font-medium">Transaction ID</th>
                      <th className="pb-4 font-medium">Customer</th>
                      <th className="pb-4 font-medium">Amount</th>
                      <th className="pb-4 font-medium">Status</th>
                      <th className="pb-4 font-medium">Date</th>
                    </tr>
                  </thead>
                <tbody>
                  {recentTransactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-white/5 text-white"
                    >
                      <td className="py-4 text-sm">{transaction.id}</td>
                      <td className="py-4">{transaction.customer}</td>
                      <td className="py-4 font-medium">{convertAmount(transaction.amount)}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          transaction.status === 'Completed' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm">{transaction.date}</td>
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
