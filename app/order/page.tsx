'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  RiHomeLine, RiTBoxLine, RiHistoryLine,
  RiUserLine, RiLogoutBoxLine, RiSearchLine,
  RiFilter2Line, RiCalendarLine, RiTruckLine,
  RiMapPinLine, RiCheckLine, RiTimeLine,
  RiArrowUpLine, RiArrowDownLine, RiArrowDownSLine,
  RiDownloadLine, RiCloseLine, RiMoreLine
} from 'react-icons/ri';
import { useCurrency } from '../contexts/CurrencyContext';
import Sidebar from '../components/Sidebar';
import CustomCursor from '../components/CustomCursor';

// Sidebar Navigation
const sidebarNavigation = [
  { icon: RiHomeLine, label: 'Home', href: '/home' },
  { icon: RiTBoxLine, label: 'Dashboard', href: '/dashboard' },
  { icon: RiTBoxLine, label: 'Products', href: '/product' },
  { icon: RiTruckLine, label: 'Orders', href: '/order' },
  { icon: RiHistoryLine, label: 'Payment History', href: '/payment' },
];

// Make orders exportable
export const orders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    destination: 'New York, USA',
    date: '2024-01-15',
    status: 'Delivered',
    amount: 1256.99,
    items: 3,
    priority: 'High',
    trackingNumber: 'TRK123456789',
    productName: 'Premium Headphones',
    quantity: 2,
    weight: '1.5 kg',  // Add weight to each order
    customerDetails: {
      name: 'John Doe',
      phone: '+1 (555) 123-4567',
      email: 'john.doe@example.com',
      shippingAddress: {
        country: 'United States',
        state: 'New York',
        city: 'New York City',
        postalCode: '10001',
        streetAddress: '123 Main Street, Apt 4B',
      }
    },
    paymentBreakdown: {
      orderValue: 1256.99,
      courierFee: 45.00,
      gatewayCharge: 25.50,
      aggregatorCharge: 12.75,
      total: 1340.24
    }
  },
  {
    id: 'ORD-002',
    customer: 'Alice Smith',
    destination: 'London, UK',
    date: '2024-01-14',
    status: 'Delivered',
    amount: 2089.50,
    items: 2,
    priority: 'Medium',
    trackingNumber: 'TRK987654321',
    productName: 'Smartphone',
    quantity: 1,
    weight: '0.5 kg',  // Add weight to each order
    customerDetails: {
      name: 'Alice Smith',
      phone: '+44 20 7946 0958',
      email: 'alice.smith@example.com',
      shippingAddress: {
        country: 'United Kingdom',
        state: 'England',
        city: 'London',
        postalCode: 'SW1A 1AA',
        streetAddress: '10 Downing Street',
      }
    },
    paymentBreakdown: {
      orderValue: 2089.50,
      courierFee: 50.00,
      gatewayCharge: 30.00,
      aggregatorCharge: 15.00,
      total: 2184.50
    }
  },
  {
    id: 'ORD-003',
    customer: 'Robert Johnson',
    destination: 'Paris, France',
    date: '2024-01-13',
    status: 'Delivered',
    amount: 1845.75,
    items: 5,
    priority: 'High',
    trackingNumber: 'TRK456789123',
    productName: 'Laptop',
    quantity: 1,
    weight: '2.0 kg',  // Add weight to each order
    customerDetails: {
      name: 'Robert Johnson',
      phone: '+33 1 42 68 53 00',
      email: 'robert.johnson@example.com',
      shippingAddress: {
        country: 'France',
        state: 'Île-de-France',
        city: 'Paris',
        postalCode: '75001',
        streetAddress: '1 Rue de Rivoli',
      }
    },
    paymentBreakdown: {
      orderValue: 1845.75,
      courierFee: 55.00,
      gatewayCharge: 35.00,
      aggregatorCharge: 20.00,
      total: 1955.75
    }
  },
  {
    id: 'ORD-004',
    customer: 'Emma Wilson',
    destination: 'Tokyo, Japan',
    date: '2024-01-12',
    status: 'Delivered',
    amount: 3178.25,
    items: 4,
    priority: 'Medium',
    trackingNumber: 'TRK789123456',
    productName: 'Tablet',
    quantity: 3,
    weight: '1.2 kg',  // Add weight to each order
    customerDetails: {
      name: 'Emma Wilson',
      phone: '+81 3-1234-5678',
      email: 'emma.wilson@example.com',
      shippingAddress: {
        country: 'Japan',
        state: 'Tokyo',
        city: 'Tokyo',
        postalCode: '100-0001',
        streetAddress: '1 Chome-1-2 Otemachi',
      }
    },
    paymentBreakdown: {
      orderValue: 3178.25,
      courierFee: 60.00,
      gatewayCharge: 40.00,
      aggregatorCharge: 25.00,
      total: 3303.25
    }
  },
  {
    id: 'ORD-005',
    customer: 'Michael Brown',
    destination: 'Sydney, Australia',
    date: '2024-01-11',
    status: 'Delivered',
    amount: 2325.00,
    items: 6,
    priority: 'High',
    trackingNumber: 'TRK321654987',
    productName: 'Camera',
    quantity: 2,
    weight: '1.0 kg',  // Add weight to each order
    customerDetails: {
      name: 'Michael Brown',
      phone: '+61 2 1234 5678',
      email: 'michael.brown@example.com',
      shippingAddress: {
        country: 'Australia',
        state: 'New South Wales',
        city: 'Sydney',
        postalCode: '2000',
        streetAddress: '123 George Street',
      }
    },
    paymentBreakdown: {
      orderValue: 2325.00,
      courierFee: 65.00,
      gatewayCharge: 45.00,
      aggregatorCharge: 30.00,
      total: 2465.00
    }
  },
  {
    id: 'ORD-006',
    customer: 'Sarah Parker',
    destination: 'Mumbai, India',
    date: '2024-01-10',
    status: 'Pickup Pending',
    amount: 1275.00,
    items: 2,
    priority: 'Medium',
    trackingNumber: 'TRK789456123',
    productName: 'Smartwatch',
    quantity: 1,
    weight: '0.3 kg',  // Add weight to each order
    customerDetails: {
      name: 'Sarah Parker',
      phone: '+91 22 1234 5678',
      email: 'sarah.parker@example.com',
      shippingAddress: {
        country: 'India',
        state: 'Maharashtra',
        city: 'Mumbai',
        postalCode: '400001',
        streetAddress: '123 Marine Drive',
      }
    },
    paymentBreakdown: {
      orderValue: 1275.00,
      courierFee: 70.00,
      gatewayCharge: 50.00,
      aggregatorCharge: 35.00,
      total: 1430.00
    }
  },
  {
    id: 'ORD-007',
    customer: 'David Wilson',
    destination: 'Berlin, Germany',
    date: '2024-01-09',
    status: 'RTO',
    amount: 890.50,
    items: 1,
    priority: 'Low',
    trackingNumber: 'TRK456123789',
    productName: 'Headphones',
    quantity: 1,
    weight: '0.4 kg',  // Add weight to each order
    customerDetails: {
      name: 'David Wilson',
      phone: '+49 30 1234 5678',
      email: 'david.wilson@example.com',
      shippingAddress: {
        country: 'Germany',
        state: 'Berlin',
        city: 'Berlin',
        postalCode: '10117',
        streetAddress: '123 Unter den Linden',
      }
    },
    paymentBreakdown: {
      orderValue: 890.50,
      courierFee: 75.00,
      gatewayCharge: 55.00,
      aggregatorCharge: 40.00,
      total: 1060.50
    }
  },
  {
    id: 'ORD-008',
    customer: 'Emily Brown',
    destination: 'Chicago, USA',
    date: '2024-01-08',
    status: 'NDR Pending',
    amount: 1950.25,
    items: 3,
    priority: 'High',
    trackingNumber: 'TRK147258369',
    productName: 'Gaming Console',
    quantity: 1,
    weight: '3.0 kg',  // Add weight to each order
    customerDetails: {
      name: 'Emily Brown',
      phone: '+1 (312) 123-4567',
      email: 'emily.brown@example.com',
      shippingAddress: {
        country: 'United States',
        state: 'Illinois',
        city: 'Chicago',
        postalCode: '60601',
        streetAddress: '123 Michigan Avenue',
      }
    },
    paymentBreakdown: {
      orderValue: 1950.25,
      courierFee: 80.00,
      gatewayCharge: 60.00,
      aggregatorCharge: 45.00,
      total: 2135.25
    }
  },
  {
    id: 'ORD-009',
    customer: 'James Miller',
    destination: 'Toronto, Canada',
    date: '2024-01-07',
    status: 'Pickup Pending',
    amount: 745.99,
    items: 2,
    priority: 'Medium',
    trackingNumber: 'TRK369258147',
    productName: 'Bluetooth Speaker',
    quantity: 1,
    weight: '0.6 kg',  // Add weight to each order
    customerDetails: {
      name: 'James Miller',
      phone: '+1 (416) 123-4567',
      email: 'james.miller@example.com',
      shippingAddress: {
        country: 'Canada',
        state: 'Ontario',
        city: 'Toronto',
        postalCode: 'M5H 2N2',
        streetAddress: '123 Queen Street West',
      }
    },
    paymentBreakdown: {
      orderValue: 745.99,
      courierFee: 85.00,
      gatewayCharge: 65.00,
      aggregatorCharge: 50.00,
      total: 945.99
    }
  },
  {
    id: 'ORD-010',
    customer: 'Sofia Rodriguez',
    destination: 'Madrid, Spain',
    date: '2024-01-06',
    status: 'RTO',
    amount: 1125.75,
    items: 4,
    priority: 'High',
    trackingNumber: 'TRK258369147',
    productName: 'E-Reader',
    quantity: 1,
    weight: '0.4 kg',  // Add weight to each order
    customerDetails: {
      name: 'Sofia Rodriguez',
      phone: '+34 91 123 4567',
      email: 'sofia.rodriguez@example.com',
      shippingAddress: {
        country: 'Spain',
        state: 'Madrid',
        city: 'Madrid',
        postalCode: '28001',
        streetAddress: '123 Gran Via',
      }
    },
    paymentBreakdown: {
      orderValue: 1125.75,
      courierFee: 90.00,
      gatewayCharge: 70.00,
      aggregatorCharge: 55.00,
      total: 1340.75
    }
  }
];

// Shipping statistics data
const shippingStats = [
  { label: 'Total Shipments', value: '10', color: 'blue' },
  { label: 'Pickup Pending', value: '2', color: 'yellow' },
  { label: 'In-Transit', value: '0', color: 'purple' },
  { label: 'Delivered', value: '5', color: 'green' },
  { label: 'NDR Pending', value: '1', color: 'orange' },
  { label: 'RTO', value: '2', color: 'red' }
];

export default function OrderPage() {
  // Get today's date
  const today = new Date();
  const currentYear = today.getFullYear().toString();
  const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
  const currentDate = today.getDate().toString().padStart(2, '0');

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeSection, setActiveSection] = useState('order'); // Add this line
  const { convertAmount } = useCurrency();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [showYearOverlay, setShowYearOverlay] = useState(false);
  const [showMonthOverlay, setShowMonthOverlay] = useState(false);
  const [showDateOverlay, setShowDateOverlay] = useState(false);
  const [selectedStatusCard, setSelectedStatusCard] = useState<string | null>(null);

  // Add refs for the select elements
  const yearRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  // Add months array
  const months = [
    { value: 'all', label: 'All Months' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  // Generate dates array
  const dates = ['all', ...Array.from({ length: 31 }, (_, i) => 
    (i + 1).toString().padStart(2, '0')
  )];

  const sidebarWidth = isExpanded ? 'w-48' : 'w-16';
  const contentMargin = isExpanded ? 'ml-48' : 'ml-16';

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.date);
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatusCard 
      ? order.status === selectedStatusCard 
      : filterStatus === 'all' || order.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesYear = selectedYear === 'all' || orderDate.getFullYear().toString() === selectedYear;
    const matchesMonth = selectedMonth === 'all' || (orderDate.getMonth() + 1).toString().padStart(2, '0') === selectedMonth;
    const matchesDate = selectedDate === 'all' || orderDate.getDate().toString().padStart(2, '0') === selectedDate;

    return matchesSearch && matchesStatus && matchesYear && matchesMonth && matchesDate;
  });

  // Add the view details handler
  const handleViewDetails = (order: any) => {
    setSelectedOrderDetails(order);
    setIsOverlayOpen(true);
  };

  // Add this function to calculate shipping stats
  const calculateShippingStats = (filteredOrders: any[]) => {
    const stats = {
      total: filteredOrders.length,
      delivered: 0,
      pickupPending: 0,
      inTransit: 0,
      ndrPending: 0,
      rto: 0
    };

    filteredOrders.forEach(order => {
      switch (order.status) {
        case 'Delivered':
          stats.delivered++;
          break;
        case 'Pickup Pending':
          stats.pickupPending++;
          break;
        case 'In Transit':
          stats.inTransit++;
          break;
        case 'NDR Pending':
          stats.ndrPending++;
          break;
        case 'RTO':
          stats.rto++;
          break;
      }
    });

    return [
      { label: 'Total Shipments', value: stats.total.toString(), color: 'blue' },
      { label: 'Pickup Pending', value: stats.pickupPending.toString(), color: 'yellow' },
      { label: 'In-Transit', value: stats.inTransit.toString(), color: 'purple' },
      { label: 'Delivered', value: stats.delivered.toString(), color: 'green' },
      { label: 'NDR Pending', value: stats.ndrPending.toString(), color: 'orange' },
      { label: 'RTO', value: stats.rto.toString(), color: 'red' }
    ];
  };

  // Add handler for card clicks
  const handleStatusCardClick = (status: string | null) => {
    setSelectedStatusCard(status === selectedStatusCard ? null : status);
    setFilterStatus('all'); // Reset the dropdown filter when cards are clicked
  };

  // Update the getStatusFromLabel function
  const getStatusFromLabel = (label: string): string | null => {
    switch (label) {
      case 'Total Shipments': return null;
      case 'Pickup Pending': return 'Pickup Pending';
      case 'In-Transit': return 'In Transit';
      case 'Delivered': return 'Delivered';
      case 'NDR Pending': return 'NDR Pending';
      case 'RTO': return 'RTO';
      default: return null;
    }
  };

  // Modify the functions that handle year selection
  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    // Reset month and date to 'all' when year changes
    setSelectedMonth('all');
    setSelectedDate('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-900/20 to-black">
      <CustomCursor />
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="ml-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-6 overflow-hidden">
          {/* Header with Search and Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Orders</h1>
              <p className="text-gray-400 text-sm mt-1">Manage and track your orders</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="relative">
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Date Filters */}
              <div className="flex gap-2">
                {/* Year Select */}
                <div 
                  ref={yearRef}
                  className="relative"
                  onMouseEnter={() => setShowYearOverlay(true)}
                  onMouseLeave={() => setShowYearOverlay(false)}
                >
                  <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm cursor-pointer min-w-[100px] flex items-center justify-between">
                    <span>{selectedYear === 'all' ? 'All Years' : selectedYear}</span>
                    <RiArrowDownSLine className={`text-gray-400 transition-transform duration-300 ${showYearOverlay ? 'rotate-180' : ''}`} />
                  </div>
                  <AnimatePresence>
                    {showYearOverlay && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-2 w-full bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg py-1 z-50"
                      >
                        <div 
                          className="px-3 py-2 hover:bg-white/10 cursor-pointer"
                          onClick={() => handleYearSelect('all')}
                        >
                          All Years
                        </div>
                        {['2025', '2024', '2023', '2022', '2021'].map(year => (
                          <div
                            key={year}
                            className="px-3 py-2 hover:bg-white/10 cursor-pointer"
                            onClick={() => handleYearSelect(year)}
                          >
                            {year}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Month Select */}
                <div 
                  ref={monthRef}
                  className="relative"
                  onMouseEnter={() => setShowMonthOverlay(true)}
                  onMouseLeave={() => setShowMonthOverlay(false)}
                >
                  <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm cursor-pointer min-w-[120px] flex items-center justify-between">
                    <span>{selectedMonth === 'all' ? 'All Months' : months.find(m => m.value === selectedMonth)?.label}</span>
                    <RiArrowDownSLine className={`text-gray-400 transition-transform duration-300 ${showMonthOverlay ? 'rotate-180' : ''}`} />
                  </div>
                  <AnimatePresence>
                    {showMonthOverlay && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-2 w-full bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg py-1 z-50 max-h-[300px] overflow-y-auto"
                      >
                        {months.map(month => (
                          <div
                            key={month.value}
                            className="px-3 py-2 hover:bg-white/10 cursor-pointer"
                            onClick={() => setSelectedMonth(month.value)}
                          >
                            {month.label}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Date Select */}
                <div 
                  ref={dateRef}
                  className="relative"
                  onMouseEnter={() => setShowDateOverlay(true)}
                  onMouseLeave={() => setShowDateOverlay(false)}
                >
                  <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm cursor-pointer min-w-[80px] flex items-center justify-between">
                    <span>{selectedDate === 'all' ? 'All Dates' : selectedDate}</span>
                    <RiArrowDownSLine className={`text-gray-400 transition-transform duration-300 ${showDateOverlay ? 'rotate-180' : ''}`} />
                  </div>
                  <AnimatePresence>
                    {showDateOverlay && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-2 w-full bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg py-1 z-50 max-h-[300px] overflow-y-auto"
                      >
                        <div 
                          className="px-3 py-2 hover:bg-white/10 cursor-pointer"
                          onClick={() => setSelectedDate('all')}
                        >
                          All Dates
                        </div>
                        {dates.slice(1).map(date => (
                          <div
                            key={date}
                            className="px-3 py-2 hover:bg-white/10 cursor-pointer"
                            onClick={() => setSelectedDate(date)}
                          >
                            {date}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none min-w-[120px]"
                >
                  <option value="all">All Status</option>
                  <option value="delivered">Delivered</option>
                  <option value="in transit">In Transit</option>
                  <option value="processing">Processing</option>
                </select>
              </div>
            </div>
          </div>

          {/* Shipments Details */}
          <div className="rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Shipments Details</h2>
                <p className="text-gray-400 text-sm">
                  {selectedYear !== 'all' && `Year ${selectedYear}`}
                  {selectedMonth !== 'all' && ` - ${months.find(m => m.value === selectedMonth)?.label}`}
                  {selectedDate !== 'all' && ` - Day ${selectedDate}`}
                  {selectedStatusCard && ` - Filtered by ${selectedStatusCard}`}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {calculateShippingStats(filteredOrders).map((stat, index) => (
                <motion.div 
                  key={index}
                  onClick={() => handleStatusCardClick(getStatusFromLabel(stat.label))}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-lg border transition-all cursor-pointer
                    ${selectedStatusCard === getStatusFromLabel(stat.label)
                      ? 'bg-white/10 border-blue-500'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                >
                  <p className={`text-2xl font-bold mb-2 text-${stat.color}-400`}>
                    {stat.value}
                  </p>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-white/10">
                    <th className="pb-4 font-medium">Order ID</th>
                    <th className="pb-4 font-medium">Customer</th>
                    <th className="pb-4 font-medium">Destination</th>
                    <th className="pb-4 font-medium">Date</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="text-right pb-4 font-medium">Amount</th>
                    <th className="text-center pb-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedOrder(order.id)}
                      className={`border-b border-white/5 transition-colors hover:bg-white/5 ${
                        selectedOrder === order.id ? 'bg-white/5' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="text-white text-sm font-medium">{order.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white text-sm">{order.customer}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm">
                          <RiMapPinLine className="text-gray-400 mr-2" />
                          <span className="text-gray-300">{order.destination}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm">
                          <RiCalendarLine className="text-gray-400 mr-2" />
                          <span className="text-gray-300">{order.date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                          order.status === 'In Transit' ? 'bg-blue-500/20 text-blue-400' :
                          order.status === 'Pickup Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          order.status === 'NDR Pending' ? 'bg-orange-500/20 text-orange-400' :
                          order.status === 'RTO' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-white text-sm font-medium">
                          {convertAmount(order.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(order);
                            }}
                          >
                            View Details
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add Order Details Overlay */}
      <AnimatePresence>
        {isOverlayOpen && selectedOrderDetails && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center"
              onClick={() => setIsOverlayOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto m-4"
                onClick={e => e.stopPropagation()}
              >
                <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-white">Order Details</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <p className="text-sm text-gray-400">Order ID: {selectedOrderDetails.id}</p>
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          selectedOrderDetails.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                          selectedOrderDetails.status === 'In Transit' ? 'bg-blue-500/20 text-blue-400' :
                          selectedOrderDetails.status === 'Pickup Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {selectedOrderDetails.status}
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

                  {/* Content Grid - Updated to include Payment Information */}
                  <div className="grid grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="col-span-1 space-y-6">
                      <div className="bg-white/5 rounded-xl p-6">
                        {/* Order Information section */}
                        <p className="text-sm font-medium text-blue-400 mb-4">Order Information</p>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Order ID</span>
                            <span className="text-white font-medium">{selectedOrderDetails.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Product</span>
                            <span className="text-white font-medium">{selectedOrderDetails.productName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Quantity</span>
                            <span className="text-white font-medium">{selectedOrderDetails.quantity}</span>
                          </div>
                          {/* Add the new weight field */}
                          <div className="flex justify-between">
                            <span className="text-gray-400">Weight</span>
                            <span className="text-white font-medium">{selectedOrderDetails.weight || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Date</span>
                            <span className="text-white font-medium">{selectedOrderDetails.date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Priority</span>
                            <span className="text-white font-medium">{selectedOrderDetails.priority}</span>
                          </div>
                        </div>
                      </div>

                      {/* Add Payment Information section */}
                      <div className="bg-white/5 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm font-medium text-blue-400">Payment Information</p>
                          <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                            <RiMoreLine className="text-gray-400 text-lg" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Order Value</span>
                            <span className="text-white font-medium">
                              {convertAmount(selectedOrderDetails.paymentBreakdown?.orderValue)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Courier Fee</span>
                            <span className="text-white font-medium">
                              {convertAmount(selectedOrderDetails.paymentBreakdown?.courierFee)}
                            </span>
                          </div>
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 font-medium">₹177097.64</span>
                              <button className="px-4 py-1.5 bg-green-500/20 text-green-400 text-sm rounded-lg hover:bg-green-500/30 transition-colors">
                                Confirm Pickup
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Customer Information */}
                    <div className="col-span-1 space-y-6">
                      <div className="bg-white/5 rounded-xl p-6">
                        <p className="text-sm font-medium text-blue-400 mb-4">Customer Information</p>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Name</span>
                            <span className="text-white font-medium">
                              {selectedOrderDetails.customerDetails?.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Phone</span>
                            <span className="text-white font-medium">
                              {selectedOrderDetails.customerDetails?.phone}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Email</span>
                            <span className="text-white font-medium">
                              {selectedOrderDetails.customerDetails?.email}
                            </span>
                          </div>
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <p className="text-sm font-medium text-blue-400 mb-3">Delivery Address</p>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Country</span>
                                <span className="text-white font-medium">
                                  {selectedOrderDetails.customerDetails?.shippingAddress.country}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">State</span>
                                <span className="text-white font-medium">
                                  {selectedOrderDetails.customerDetails?.shippingAddress.state}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">City</span>
                                <span className="text-white font-medium">
                                  {selectedOrderDetails.customerDetails?.shippingAddress.city}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Postal Code</span>
                                <span className="text-white font-medium">
                                  {selectedOrderDetails.customerDetails?.shippingAddress.postalCode}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Address</span>
                                <span className="text-white font-medium text-right">
                                  {selectedOrderDetails.customerDetails?.shippingAddress.streetAddress}
                                </span>
                              </div>
                            </div>
                          </div>
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
                      Download Details
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
