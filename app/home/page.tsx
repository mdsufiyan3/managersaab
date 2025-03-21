'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { 
  RiTruckLine, RiGlobalLine, RiTimeLine, RiLineChartLine,
  RiMenuLine, RiCloseLine, RiHomeLine, RiTBoxLine, RiHistoryLine,
  RiWalletLine, RiCustomerServiceLine, RiUserLine, RiNotificationLine,
  RiLogoutBoxLine, RiSearchLine, RiPercentLine, RiQuestionLine,
  RiCalendar2Line, RiArrowDownSLine // Remove RiAddLine from imports
} from 'react-icons/ri';
import { useCurrency, currencies } from '../contexts/CurrencyContext';
import { useRouter } from 'next/navigation';
import CustomCursor from '../components/CustomCursor';

// Sidebar Navigation Items
const sidebarNavigation = [
  { icon: RiHomeLine, label: 'Home', href: '#Home' },
  { icon: RiTBoxLine, label: 'Dashboard', href: '/dashboard' }, // Changed from 'Book a Courier'
  { icon: RiTBoxLine, label: 'Products', href: '/product' },
  { icon: RiTruckLine, label: 'Orders', href: '/order' },
  { icon: RiHistoryLine, label: 'Payment History', href: '/payment' },
];

// Update Quick Actions Data with image paths instead of icons
const quickActions = [
  { 
    imagePath: '/icons/das2.png', // Your image path
    label: 'Your Order', 
    color: 'from-purple-500 to-pink-500',
    summary: (orders: any[]) => ({
      lines: [
        `Recent Orders: ${orders.length}`,
        `Active Orders: ${orders.filter(o => o.status === 'In Transit').length}`
      ]
    })
  },
  { 
    imagePath: '/icons/das4.png', // Your image path
    label: 'Your Products', 
    color: 'from-emerald-500 to-teal-500',
    summary: () => ({
      lines: ['Click to view your products']
    })
  },
  { 
    imagePath: '/icons/das3.png', // Your image path
    label: 'Your Pickup', 
    color: 'from-blue-500 to-cyan-500',
    summary: () => ({
      lines: ['Schedule a pickup']
    })
  },
  { 
    imagePath: '/icons/das1.png', // Your image path
    label: 'Payment History', 
    color: 'from-amber-500 to-orange-500',
    summary: () => ({
      lines: [
        'Recent Transactions: 5',
        `Total Spent: ${useCurrency().convertAmount(324.50)}`
      ]
    })
  }
];

// Recent Orders Data
const recentOrders = [
  { id: '#ORD001', date: '2024-01-15', status: 'Delivered', amount: 25.99 },
  { id: '#ORD002', date: '2024-01-14', status: 'In Transit', amount: 34.50 },
  { id: '#ORD003', date: '2024-01-13', status: 'Processing', amount: 19.99 },
];

// Add new data for products and pickups
const productsList = [
  { id: 'PRD001', name: 'Electronics Package', weight: '2.5kg', status: 'Active' },
  { id: 'PRD002', name: 'Fashion Items', weight: '1.2kg', status: 'Draft' },
  { id: 'PRD003', name: 'Documents', weight: '0.5kg', status: 'Active' },
];

const pickupSchedules = [
  { id: 'PKP001', date: '2024-01-20', time: '09:00-12:00', location: 'Office' },
  { id: 'PKP002', date: '2024-01-22', time: '14:00-17:00', location: 'Warehouse' },
  { id: 'PKP003', date: '2024-01-25', time: '10:00-13:00', location: 'Home' },
];

// Add payment history data after other data constants
const paymentHistory = [
  { 
    id: 'PAY001', 
    date: '2024-01-15', 
    method: 'Credit Card',
    type: 'Order Payment',
    amount: 156.99,
    status: 'Completed'
  },
  { 
    id: 'PAY002', 
    date: '2024-01-14', 
    method: 'Wallet',
    type: 'Wallet Top-up',
    amount: 500.00,
    status: 'Completed'
  },
  { 
    id: 'PAY003', 
    date: '2024-01-13', 
    method: 'PayPal',
    type: 'Order Payment',
    amount: 89.50,
    status: 'Processing'
  },
];

const features = [
  {
    icon: RiTruckLine,
    title: "Fast Delivery",
    description: "Express shipping solutions for your time-critical deliveries",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: RiGlobalLine,
    title: "Global Coverage",
    description: "Reaching every corner of the world with reliable service",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: RiTimeLine,
    title: "24/7 Support",
    description: "Round-the-clock assistance for all your shipping needs",
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    icon: RiLineChartLine,
    title: "Real-time Tracking",
    description: "Monitor your shipments with precision tracking technology",
    gradient: "from-orange-500 to-red-500"
  }
];

// Add new constant for header navigation
const headerNavigation = [
  { label: 'Dashboard', href: '#' },
  { label: 'Payment', href: '/payment' },  // Changed from '.#' to '/payment'
  { label: 'Courier', href: '/courier-rates' },
  { label: 'API', href: '/api-docs' },
];

export default function HomePage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('home');
  const [selectedCard, setSelectedCard] = useState('');
  const [showOrders, setShowOrders] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showPickup, setShowPickup] = useState(false);
  // Add new state for payment history
  const [showPayments, setShowPayments] = useState(false);
  const { scrollYProgress } = useScroll();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDashboardMenu, setShowDashboardMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentCurrency, setCurrency, convertAmount } = useCurrency();

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDashboardMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Update header and main content margins based on sidebar state
  const sidebarWidth = isExpanded ? 'w-48' : 'w-16';
  const contentMargin = isExpanded ? 'ml-48' : 'ml-16';

  // Handle mouse enter/leave for the entire sidebar
  const handleMouseEnter = () => setIsExpanded(true);
  const handleMouseLeave = () => setIsExpanded(false);

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Handle card click function
  const handleCardClick = (label: string) => {
    setSelectedCard(label);
    setShowOrders(label === 'Your Order');
    setShowProducts(label === 'Your Products');
    setShowPickup(label === 'Your Pickup');
    setShowPayments(label === 'Payment History');
  };

  // Add navigation handler
  const handleNavigation = (href: string) => {
    if (href.startsWith('/')) {
      router.push(href);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-900/20 to-black">
      <CustomCursor />
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="ml-16 transition-all duration-300">
        <header className={`fixed top-0 ${contentMargin} right-0 bg-black/10 backdrop-blur-lg z-50 border-b border-white/10 transition-all duration-300`}>
          <div className="flex items-center justify-between px-3 py-2">
            {/* Navigation moved to left side */}
            <div className="flex items-center space-x-4">
              {headerNavigation.map((item, index) => (
                <div 
                  key={index} 
                  className="relative"
                  onMouseEnter={() => item.label === 'Dashboard' && setShowDashboardMenu(true)}
                  onMouseLeave={() => item.label === 'Dashboard' && setShowDashboardMenu(false)}
                >
                  <motion.button
                    onClick={() => handleNavigation(item.href)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span>{item.label}</span>
                    {item.label === 'Dashboard' && (
                      <RiArrowDownSLine className={`transition-transform ${showDashboardMenu ? 'rotate-180' : ''}`} />
                    )}
                  </motion.button>

                  {/* Dashboard Dropdown */}
                  {item.label === 'Dashboard' && showDashboardMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 mt-1 w-48 py-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl z-50"
                    >
                      {[
                        { label: 'Products', icon: RiTBoxLine, href: '/product' },
                        { label: 'Orders', icon: RiTruckLine, href: '/order' },
                        { label: 'Payments', icon: RiHistoryLine, href: '/payment' }
                      ].map((item, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ x: 5 }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5"
                          onClick={() => handleNavigation(item.href)}
                        >
                          <item.icon className="text-base" />
                          <span>{item.label}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* Search Bar with Currency Selector */}
            <div className="flex-1 max-w-xl mx-auto px-4 flex items-center gap-4">
              <div className="relative w-full">
                <RiSearchLine className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Track your order or search..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-white/5 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Currency Selector */}
              <motion.select
                value={currentCurrency.code}
                onChange={(e) => {
                  const selected = currencies.find(c => c.code === e.target.value);
                  if (selected) setCurrency(selected);
                }}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code} className="bg-gray-900">
                    {currency.symbol} {currency.code}
                  </option>
                ))}
              </motion.select>
            </div>

            {/* Notification Icon */}
            <div className="flex items-center">
              <button className="relative p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <RiNotificationLine className="text-white text-lg" />
                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {/* Add top padding to account for fixed header */}
        <div className="pt-[60px] p-4 space-y-6">
          {/* Quick Action Cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -3 }}
                onClick={() => handleCardClick(action.label)}
                className={`group relative overflow-hidden rounded-lg bg-black/30 backdrop-blur-sm border cursor-pointer h-[140px]
                  ${selectedCard === action.label ? 'border-blue-500 ring-1 ring-blue-500/50' : 'border-white/10'}
                `}
              >
                <div className="relative p-3">
                  {/* Reduced image size */}
                  <div className="mb-2 transform transition-transform duration-300 group-hover:scale-110">
                    <div className="relative w-8 h-8">
                      <Image
                        src={action.imagePath}
                        alt={action.label}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">{action.label}</h3>
                  
                  {/* Summary text - Smaller size */}
                  {selectedCard === action.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-xs text-gray-300"
                    >
                      <div className="space-y-0.5">
                        {action.summary(recentOrders).lines.map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Conditional Recent Orders Display */}
          {showOrders && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="rounded-2xl bg-black/30 backdrop-blur-sm border border-white/10 p-6 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Recent Orders</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowOrders(false)}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  Close
                </motion.button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-white/10">
                      <th className="pb-4">Order ID</th>
                      <th className="pb-4">Date</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-white/5 text-white cursor-pointer hover:bg-white/5"
                      >
                        <td className="py-4">{order.id}</td>
                        <td className="py-4">{order.date}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                            order.status === 'In Transit' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4">{convertAmount(order.amount)}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Products Display */}
          {showProducts && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="rounded-2xl bg-black/30 backdrop-blur-sm border border-white/10 p-6 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Your Products</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowProducts(false)}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  Close
                </motion.button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-white/10">
                      <th className="pb-4">Product ID</th>
                      <th className="pb-4">Name</th>
                      <th className="pb-4">Weight</th>
                      <th className="pb-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsList.map((product, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-white/5 text-white cursor-pointer hover:bg-white/5"
                      >
                        <td className="py-4">{product.id}</td>
                        <td className="py-4">{product.name}</td>
                        <td className="py-4">{product.weight}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            product.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {product.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Pickup Display */}
          {showPickup && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="rounded-2xl bg-black/30 backdrop-blur-sm border border-white/10 p-6 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Scheduled Pickups</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPickup(false)}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  Close
                </motion.button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-white/10">
                      <th className="pb-4">Pickup ID</th>
                      <th className="pb-4">Date</th>
                      <th className="pb-4">Time</th>
                      <th className="pb-4">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pickupSchedules.map((pickup, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-white/5 text-white cursor-pointer hover:bg-white/5"
                      >
                        <td className="py-4">{pickup.id}</td>
                        <td className="py-4">{pickup.date}</td>
                        <td className="py-4">{pickup.time}</td>
                        <td className="py-4">
                          <span className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-400">
                            {pickup.location}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Payment History Display */}
          {showPayments && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="rounded-2xl bg-black/30 backdrop-blur-sm border border-white/10 p-6 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Payment History</h2>
                  <p className="text-sm text-gray-400">Recent transactions and payments</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPayments(false)}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  Close
                </motion.button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-white/10">
                      <th className="pb-4">Payment ID</th>
                      <th className="pb-4">Date</th>
                      <th className="pb-4">Method</th>
                      <th className="pb-4">Type</th>
                      <th className="pb-4">Amount</th>
                      <th className="pb-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.map((payment, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-white/5 text-white cursor-pointer hover:bg-white/5"
                      >
                        <td className="py-4">{payment.id}</td>
                        <td className="py-4">{payment.date}</td>
                        <td className="py-4">
                          <span className="px-3 py-1 rounded-full text-xs bg-white/5">
                            {payment.method}
                          </span>
                        </td>
                        <td className="py-4">{payment.type}</td>
                        <td className="py-4 font-medium">
                          <span className={payment.type === 'Wallet Top-up' ? 'text-green-400' : 'text-white'}>
                            {convertAmount(payment.amount)}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            payment.status === 'Completed' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
