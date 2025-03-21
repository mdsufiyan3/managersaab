'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Image from 'next/image';
import { useState } from 'react';
import { 
  RiVisaLine, RiMastercardFill, RiPaypalLine,
  RiWalletLine, RiAddLine, RiHistoryLine,
  RiSecurePaymentLine, RiBankCardLine, RiMoneyDollarCircleLine,
  RiHomeLine, RiTBoxLine, RiTruckLine, RiCustomerServiceLine,
  RiUserLine, RiLogoutBoxLine, RiDownloadLine, RiCloseLine
} from 'react-icons/ri';
import { useCurrency } from '../contexts/CurrencyContext';
import CustomCursor from '../components/CustomCursor';

// Add sidebar navigation items
const sidebarNavigation = [
  { icon: RiHomeLine, label: 'Home', href: '/home' },
  { icon: RiTBoxLine, label: 'Dashboard', href: '/dashboard' },
  { icon: RiTBoxLine, label: 'Products', href: '/product' },
  { icon: RiTruckLine, label: 'Orders', href: '/order' },
  { icon: RiHistoryLine, label: 'Payment History', href: '/payment' },
];

const transactions = [
  {
    id: 'TRX001',
    type: 'Payment',
    amount: -156.99,
    date: '2024-01-15',
    description: 'Express Delivery',
    status: 'Completed',
    icon: RiSecurePaymentLine,
  },
  {
    id: 'TRX002',
    type: 'Top-up',
    amount: 500.00,
    date: '2024-01-14',
    description: 'Wallet Top-up',
    status: 'Completed',
    icon: RiMoneyDollarCircleLine,
  },
  {
    id: 'TRX003',
    type: 'Payment',
    amount: -89.50,
    date: '2024-01-13',
    description: 'Standard Shipping',
    status: 'Processing',
    icon: RiSecurePaymentLine,
  },
];

// Add payment summary data
const paymentSummary = {
  orderId: 'ORD-2024-001',
  customerName: 'John Doe',
  transactionDate: new Date().toLocaleString(),
  paymentMethod: 'Credit Card',
  cardNumber: '**** **** **** 4242',
  status: 'Completed',
  amount: 156.99,
  currency: 'USD',
  billingAddress: '123 Main St, New York, NY 10001',
  email: 'john.doe@example.com'
};

// Add payment table data
const paymentTableData = [
  {
    id: 'PAY-001',
    orderId: 'ORD-2024-001',
    customerName: 'John Doe',
    date: '2024-01-15 14:30:25',
    method: 'Credit Card',
    amount: 156.99,
    status: 'Completed',
    email: 'john.doe@example.com'
  },
  {
    id: 'PAY-002',
    orderId: 'ORD-2024-002',
    customerName: 'Alice Smith',
    date: '2024-01-14 09:15:00',
    method: 'PayPal',
    amount: 89.50,
    status: 'Processing',
    email: 'alice.s@example.com'
  },
  {
    id: 'PAY-003',
    orderId: 'ORD-2024-003',
    customerName: 'Robert Johnson',
    date: '2024-01-13 16:45:12',
    method: 'Wallet',
    amount: 245.75,
    status: 'Completed',
    email: 'robert.j@example.com'
  },
  {
    id: 'PAY-004',
    orderId: 'ORD-2024-004',
    customerName: 'Emma Wilson',
    date: '2024-01-13 11:20:33',
    method: 'Credit Card',
    amount: 178.25,
    status: 'Failed',
    email: 'emma.w@example.com'
  }
];

export default function PaymentPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('payment');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const { convertAmount } = useCurrency();

  // Handle sidebar expansion
  const handleMouseEnter = () => setIsExpanded(true);
  const handleMouseLeave = () => setIsExpanded(false);

  // Update sidebar width and content margin based on sidebar state
  const sidebarWidth = isExpanded ? 'w-48' : 'w-16';
  const contentMargin = isExpanded ? 'ml-48' : 'ml-16';

  // Add handler for view details button
  const handleViewDetails = (payment: any) => {
    setSelectedPayment(payment);
    setIsOverlayOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-900/20 to-black">
      <CustomCursor />
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="ml-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Transactions History</h1>
            <p className="text-gray-400">View your recent transactions and payment history</p>
          </div>

          {/* Payment Summary Section - New Addition */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Summary Card */}
            <div className="lg:col-span-2 rounded-2xl bg-black/30 backdrop-blur-sm border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Payment Summary</h3>
                  <p className="text-sm text-gray-400 mt-1">Transaction details and status</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  paymentSummary.status === 'Completed' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {paymentSummary.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Order ID</p>
                    <p className="text-white font-medium">{paymentSummary.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Transaction Date</p>
                    <p className="text-white font-medium">{paymentSummary.transactionDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Payment Method</p>
                    <p className="text-white font-medium">{paymentSummary.paymentMethod}</p>
                    <p className="text-sm text-gray-500">{paymentSummary.cardNumber}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Customer Name</p>
                    <p className="text-white font-medium">{paymentSummary.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white font-medium">{paymentSummary.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Billing Address</p>
                    <p className="text-white font-medium">{paymentSummary.billingAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount Summary Card */}
            <div className="lg:col-span-1 rounded-2xl bg-black/30 backdrop-blur-sm border border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Amount Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white font-medium">
                    ${paymentSummary.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-400">Tax</span>
                  <span className="text-white font-medium">
                    ${(paymentSummary.amount * 0.1).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-lg text-white font-bold">Total</span>
                  <span className="text-lg text-white font-bold">
                    ${(paymentSummary.amount * 1.1).toFixed(2)}
                  </span>
                </div>
                <button className="w-full mt-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2">
                  <RiDownloadLine className="text-lg" />
                  <span>Download Receipt</span>
                </button>
              </div>
            </div>
          </div>

          {/* Payment Table Section */}
          <div className="rounded-2xl bg-black/30 backdrop-blur-sm border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Payment Table</h3>
                <p className="text-sm text-gray-400 mt-1">Detailed payment transactions</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm transition-colors">
                  Filter
                </button>
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm transition-colors flex items-center gap-2">
                  <RiDownloadLine />
                  Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-white/10">
                    <th className="pb-4 font-medium">Payment ID</th>
                    <th className="pb-4 font-medium">Order ID</th>
                    <th className="pb-4 font-medium">Customer</th>
                    <th className="pb-4 font-medium">Date & Time</th>
                    <th className="pb-4 font-medium">Method</th>
                    <th className="pb-4 font-medium">Amount</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentTableData.map((payment, index) => (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-white/5 text-white"
                    >
                      <td className="py-4 text-sm">{payment.id}</td>
                      <td className="py-4 text-sm">{payment.orderId}</td>
                      <td className="py-4">
                        <div>
                          <p className="text-sm font-medium">{payment.customerName}</p>
                          <p className="text-xs text-gray-400">{payment.email}</p>
                        </div>
                      </td>
                      <td className="py-4 text-sm">{payment.date}</td>
                      <td className="py-4">
                        <span className="px-3 py-1 text-xs rounded-full bg-white/5">
                          {payment.method}
                        </span>
                      </td>
                      <td className="py-4 text-sm font-medium">
                        {convertAmount(payment.amount)}
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          payment.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                          payment.status === 'Processing' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <button 
                          onClick={() => handleViewDetails(payment)}
                          className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing 4 of 25 entries
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm transition-colors">
                  Previous
                </button>
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add Payment Details Overlay */}
        <AnimatePresence>
          {isOverlayOpen && selectedPayment && (
            <>
              {/* Backdrop with centered flex container */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center"
                onClick={() => setIsOverlayOpen(false)}
              >
                {/* Modal Container */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto m-4"
                  onClick={e => e.stopPropagation()}
                >
                  {/* Modal Content */}
                  <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {/* Header with new styling */}
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-white">Payment Details</h3>
                        <div className="flex items-center gap-3 mt-2">
                          <p className="text-sm text-gray-400">Transaction ID: {selectedPayment.id}</p>
                          <span className={`px-3 py-1 text-xs rounded-full ${
                            selectedPayment.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                            selectedPayment.status === 'Processing' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {selectedPayment.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsOverlayOpen(false)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <RiCloseLine className="text-gray-400 text-2xl" />
                      </button>
                    </div>

                    {/* Enhanced Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Left Column */}
                      <div className="space-y-6">
                        <div className="bg-white/5 rounded-xl p-6">
                          <p className="text-sm font-medium text-blue-400 mb-4">Order Information</p>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Order ID</span>
                              <span className="text-white font-medium">{selectedPayment.orderId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Date & Time</span>
                              <span className="text-white font-medium">{selectedPayment.date}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Method</span>
                              <span className="text-white font-medium">{selectedPayment.method}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-6">
                          <p className="text-sm font-medium text-blue-400 mb-4">Payment Information</p>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Amount</span>
                              <span className="text-white text-lg font-medium">
                                {convertAmount(selectedPayment?.amount || 0)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Tax</span>
                              <span className="text-white font-medium">
                                ${(selectedPayment.amount * 0.1).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-white/10">
                              <span className="text-gray-200 font-medium">Total</span>
                              <span className="text-white font-medium">
                                ${(selectedPayment.amount * 1.1).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        <div className="bg-white/5 rounded-xl p-6">
                          <p className="text-sm font-medium text-blue-400 mb-4">Customer Information</p>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Name</span>
                              <span className="text-white font-medium">{selectedPayment.customerName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Email</span>
                              <span className="text-white font-medium">{selectedPayment.email}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-6">
                          <p className="text-sm font-medium text-blue-400 mb-4">Transaction Details</p>
                          <div className="bg-black/50 rounded-lg p-4">
                            <pre className="text-xs text-gray-400 whitespace-pre-wrap">
                              {JSON.stringify(selectedPayment, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
                      <button
                        onClick={() => setIsOverlayOpen(false)}
                        className="px-6 py-2.5 text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        Close
                      </button>
                      <button className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors flex items-center gap-2">
                        <RiDownloadLine className="text-lg" />
                        Download Receipt
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
