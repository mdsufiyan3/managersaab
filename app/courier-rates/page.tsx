'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiTruck, FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiPackage, FiArrowLeft, FiMapPin, FiX, FiCheck, FiEdit2, FiTrash2, FiPlus
} from 'react-icons/fi';
import {
  RiHomeLine, RiTBoxLine, RiHistoryLine,
  RiUserLine, RiLogoutBoxLine, RiTruckLine
} from 'react-icons/ri';
import { getUserData } from '../../firebase/auth';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { db } from '../../firebase/config';
import { doc, setDoc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import CustomCursor from '../components/CustomCursor';

// Define types for user data
interface UserData {
  id: string;
  onboardingData?: {
    courierServices?: {
      selectedCouriers: string[];
    };
  };
}

type UserDataFromDB = UserData | { id: string };


// Define types for courier pricing
interface CourierRate {
  weight: string;
  price: number;
  deliveryTime: string;
  distanceRange: string;
}

interface CourierService {
  id: string;
  name: string;
  logo: string; // Add logo property
  rates: CourierRate[];
  features: string[];
}

interface AddressForm {
  name: string;
  phone: string;
  email: string;
  addressLine1: string;
  city: string;
  state: string;
  pinCode: string;
  landmark: string;
}

// Add this interface after other interfaces
interface SavedAddress extends AddressForm {
  id: string;
  label: string;
}

// Sample courier rate data (replace with actual data from your backend)
const courierRatesData: Record<string, CourierService> = {
  fedex: {
    id: 'fedex',
    name: 'FedEx',
    logo: '/image/download.png', // Updated logo path
    rates: [
      { weight: '0-500g', price: 50, deliveryTime: '1-2 days', distanceRange: '0-100km' },
      { weight: '501g-1kg', price: 75, deliveryTime: '1-2 days', distanceRange: '0-100km' },
      { weight: '1-2kg', price: 100, deliveryTime: '1-2 days', distanceRange: '0-100km' },
    ],
    features: ['Real-time Tracking', 'Insurance Coverage', 'Doorstep Delivery']
  },
  dhl: {
    id: 'dhl',
    name: 'DHL',
    logo: '/image/download (1).png',
    rates: [
      { weight: '0-500g', price: 55, deliveryTime: '1-3 days', distanceRange: '0-100km' },
      { weight: '501g-1kg', price: 80, deliveryTime: '1-3 days', distanceRange: '0-100km' },
      { weight: '1-2kg', price: 110, deliveryTime: '1-3 days', distanceRange: '0-100km' },
    ],
    features: ['International Shipping', 'Package Insurance', 'Express Delivery']
  },
  ups: {
    id: 'ups',
    name: 'UPS',
    logo: '/image/download (2).png',
    rates: [
      { weight: '0-500g', price: 45, deliveryTime: '2-3 days', distanceRange: '0-100km' },
      { weight: '501g-1kg', price: 70, deliveryTime: '2-3 days', distanceRange: '0-100km' },
      { weight: '1-2kg', price: 95, deliveryTime: '2-3 days', distanceRange: '0-100km' },
    ],
    features: ['Weekend Delivery', 'Signature Required', 'Commercial Shipping']
  }
};

// Add this to the existing courier data or create new
const availableCouriers: Record<string, CourierService> = {
  bluedart: {
    id: 'bluedart',
    name: 'BlueDart',
    logo: '/image/bluedart.png',
    rates: [
      { weight: '0-500g', price: 52, deliveryTime: '1-2 days', distanceRange: '0-100km' },
      { weight: '501g-1kg', price: 78, deliveryTime: '1-2 days', distanceRange: '0-100km' },
      { weight: '1-2kg', price: 105, deliveryTime: '1-2 days', distanceRange: '0-100km' },
    ],
    features: ['Next Day Delivery', 'Live Tracking', 'Money Back Guarantee']
  },
  delhivery: {
    id: 'delhivery',
    name: 'Delhivery',
    logo: '/image/delhivery.png',
    rates: [
      { weight: '0-500g', price: 48, deliveryTime: '2-4 days', distanceRange: '0-1000km' },
    ],
    features: ['18,000+ pin codes', '48-96 hour delivery', 'Long-distance specialists']
  },
  ecomExpress: {
    id: 'ecomExpress',
    name: 'Ecom Express',
    logo: '/image/ecom.png',
    rates: [
      { weight: '0-500g', price: 45, deliveryTime: '2-3 days', distanceRange: '0-1000km' },
    ],
    features: ['27,000+ pin codes', 'End-to-end services', 'Customizable solutions']
  },
  // Add more couriers similarly...
  blueDart: {
    id: 'blueDart',
    name: 'Blue Dart',
    logo: '/image/bluedart.png',
    rates: [{ weight: '0-500g', price: 52, deliveryTime: '1-2 days', distanceRange: '0-100km' }],
    features: ['35,000+ locations', 'Premium Express', 'Secure Delivery']
  },
  dotzot: {
    id: 'dotzot',
    name: 'Dotzot',
    logo: '/image/dotzot.png',
    rates: [{ weight: '0-500g', price: 47, deliveryTime: '2-3 days', distanceRange: '0-500km' }],
    features: ['9,900+ pin codes', 'E-retail focused', 'Enhanced experience']
  },
  shadowfax: {
    id: 'shadowfax',
    name: 'Shadowfax',
    logo: '/image/shadowfax.png',
    rates: [{ weight: '0-500g', price: 49, deliveryTime: '1-2 days', distanceRange: '0-100km' }],
    features: ['Same-day delivery', 'Reverse logistics', 'Intercity shipping']
  },
  aramex: {
    id: 'aramex',
    name: 'Aramex',
    logo: '/image/aramex.png',
    rates: [{ weight: '0-500g', price: 58, deliveryTime: '2-4 days', distanceRange: 'International' }],
    features: ['54 countries', 'Global network', 'Express delivery']
  },
  xpressbees: {
    id: 'xpressbees',
    name: 'Xpressbees',
    logo: '/image/xpressbees.png',
    rates: [{ weight: '0-500g', price: 46, deliveryTime: '2-3 days', distanceRange: '0-500km' }],
    features: ['Supply chain solutions', 'E-commerce focused', 'Express delivery']
  },
  gati: {
    id: 'gati',
    name: 'Gati',
    logo: '/image/gati.png',
    rates: [{ weight: '0-500g', price: 51, deliveryTime: '2-4 days', distanceRange: '0-1000km' }],
    features: ['Express distribution', 'Supply chain', 'Pan India network']
  },
  dtdc: {
    id: 'dtdc',
    name: 'DTDC',
    logo: '/image/dtdc.png',
    rates: [{ weight: '0-500g', price: 50, deliveryTime: '2-3 days', distanceRange: '0-500km' }],
    features: ['Nationwide coverage', 'Business solutions', 'Express delivery']
  },
  ecomExpressReverse: {
    id: 'ecomExpressReverse',
    name: 'Ecom Express Reverse',
    logo: '/image/ecomreverse.png',
    rates: [{ weight: '0-500g', price: 55, deliveryTime: '24-72 hours', distanceRange: '0-500km' }],
    features: ['24-72 hour pickup', 'Sunday pickup', 'Quick refunds']
  },
  shadowfaxReverse: {
    id: 'shadowfaxReverse',
    name: 'Shadowfax Reverse',
    logo: '/image/shadowfaxreverse.png',
    rates: [{ weight: '0-500g', price: 53, deliveryTime: '1-3 days', distanceRange: '0-500km' }],
    features: ['Reverse logistics', 'Quick pickup', 'Return management']
  },
  wefast: {
    id: 'wefast',
    name: 'WeFast',
    logo: '/image/wefast.png',
    rates: [{ weight: '0-500g', price: 60, deliveryTime: 'Same day', distanceRange: '0-50km' }],
    features: ['Same-day delivery', 'On-demand', 'Urban logistics']
  },
  dunzo: {
    id: 'dunzo',
    name: 'Dunzo',
    logo: '/image/dunzo.png',
    rates: [{ weight: '0-500g', price: 65, deliveryTime: 'Same day', distanceRange: '0-30km' }],
    features: ['Quick delivery', 'Hyperlocal', 'Real-time tracking']
  },
  indiaPost: {
    id: 'indiaPost',
    name: 'India Post',
    logo: '/image/indiapost.png',
    rates: [{ weight: '0-500g', price: 40, deliveryTime: '3-5 days', distanceRange: 'Pan India' }],
    features: ['Nationwide coverage', 'Government trusted', 'Remote area delivery']
  },
  trackon: {
    id: 'trackon',
    name: 'Trackon Couriers',
    logo: '/image/trackon.png',
    rates: [{ weight: '0-500g', price: 49, deliveryTime: '2-4 days', distanceRange: '0-1000km' }],
    features: ['Domestic service', 'Express delivery', 'Business solutions']
  },
  professional: {
    id: 'professional',
    name: 'Professional Couriers',
    logo: '/image/professional.png',
    rates: [{ weight: '0-500g', price: 48, deliveryTime: '2-4 days', distanceRange: '0-500km' }],
    features: ['Wide network', 'Business service', 'International shipping']
  },
  firstFlight: {
    id: 'firstFlight',
    name: 'First Flight Couriers',
    logo: '/image/firstflight.png',
    rates: [{ weight: '0-500g', price: 52, deliveryTime: '2-3 days', distanceRange: '0-500km' }],
    features: ['Domestic service', 'International shipping', 'Express delivery']
  },
  overnite: {
    id: 'overnite',
    name: 'Overnite Express',
    logo: '/image/overnite.png',
    rates: [{ weight: '0-500g', price: 51, deliveryTime: '1-3 days', distanceRange: '0-500km' }],
    features: ['Express service', 'Door-to-door', 'Business solutions']
  },
  shreeMaruti: {
    id: 'shreeMaruti',
    name: 'Shree Maruti Courier',
    logo: '/image/shreemaruti.png',
    rates: [{ weight: '0-500g', price: 47, deliveryTime: '2-4 days', distanceRange: '0-500km' }],
    features: ['Domestic service', 'Cargo solutions', 'Business delivery']
  },
  tirupati: {
    id: 'tirupati',
    name: 'Tirupati Courier',
    logo: '/image/tirupati.png',
    rates: [{ weight: '0-500g', price: 46, deliveryTime: '2-4 days', distanceRange: '0-300km' }],
    features: ['Local network', 'Timely delivery', 'Cost-effective']
  },
  vxpress: {
    id: 'vxpress',
    name: 'V-Xpress',
    logo: '/image/vxpress.png',
    rates: [{ weight: '0-500g', price: 49, deliveryTime: '2-3 days', distanceRange: '0-500km' }],
    features: ['Express cargo', 'Industry solutions', 'National network']
  },
  allcargo: {
    id: 'allcargo',
    name: 'Allcargo Logistics',
    logo: '/image/allcargo.png',
    rates: [{ weight: '0-500g', price: 53, deliveryTime: '2-4 days', distanceRange: '0-1000km' }],
    features: ['Integrated logistics', 'Supply chain', 'Global network']
  },
  safexpress: {
    id: 'safexpress',
    name: 'Safexpress',
    logo: '/image/safexpress.png',
    rates: [{ weight: '0-500g', price: 50, deliveryTime: '2-3 days', distanceRange: '0-500km' }],
    features: ['Supply chain', 'Nationwide network', 'Business solutions']
  }
};

// Add sidebar navigation items
const sidebarNavigation = [
  { icon: RiHomeLine, label: 'Home', href: '/home' },
  { icon: RiTBoxLine, label: 'Dashboard', href: '/dashboard' },
  { icon: RiTBoxLine, label: 'Products', href: '/product' },
  { icon: RiTruckLine, label: 'Orders', href: '/order' },
  { icon: RiHistoryLine, label: 'Payment History', href: '/payment' },
];

export default function CourierRatesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedCouriers, setSelectedCouriers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'weight' | 'price'>('weight');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [pickupAddress, setPickupAddress] = useState<AddressForm>({
    name: '',
    phone: '',
    email: '',
    addressLine1: '',
    city: '',
    state: '',
    pinCode: '',
    landmark: '',
  });
  const [deliveryAddress, setDeliveryAddress] = useState<AddressForm>({
    name: '',
    phone: '',
    email: '',
    addressLine1: '',
    city: '',
    state: '',
    pinCode: '',
    landmark: '',
  });
  type AddressFormType = 'pickup' | 'delivery' | null;
  const [addressFormType, setAddressFormType] = useState<AddressFormType>(null);

  // Add this new state for saved addresses
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([
    {
      id: '1',
      label: 'Home',
      name: 'John Doe',
      phone: '+91 9876543210',
      email: 'john@example.com',
      addressLine1: '123 Home Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400001',
      landmark: 'Near Park'
    }
  ]);

  // Add new state for selected saved address
  const [selectedSavedAddress, setSelectedSavedAddress] = useState<string>('');

  // Add this new state near other state declarations
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const handleAddressClick = (type: 'pickup' | 'delivery') => {
    setAddressFormType(type);
    setShowAddressForm(true);
  };

  // Add these new functions inside the CourierRatesPage component
  const handleEditAddress = (address: SavedAddress) => {
    if (addressFormType === 'pickup') {
      setPickupAddress(address);
      setShowNewAddressForm(true);
    }
  };

  const handleDeleteAddress = (addressId: string) => {
    // Add actual delete logic here
    console.log('Delete address:', addressId);
  };

  const [selectedCourierService, setSelectedCourierService] = useState<string>('');

  const handleCourierSelect = (courierId: string) => {
    // If clicking the already selected courier, deselect it
    if (selectedCourierService === courierId) {
      setSelectedCourierService('');
    } else {
      setSelectedCourierService(courierId);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const userData = await getUserData(user.uid) as UserDataFromDB;
        if ('onboardingData' in userData && userData.onboardingData?.courierServices?.selectedCouriers) {
          setSelectedCouriers(userData.onboardingData.courierServices.selectedCouriers);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Add this effect to fetch saved addresses
  useEffect(() => {
    const fetchUserAddresses = async () => {
      if (!user) return;
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.pickupAddresses) {
            setSavedAddresses(userData.pickupAddresses);
          }
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    // Call fetchUserAddresses when overlay opens
    if (showAddressForm && addressFormType === 'pickup') {
      fetchUserAddresses();
    }
  }, [user, showAddressForm, addressFormType]);

  const filteredCouriers = selectedCouriers
    .map(id => availableCouriers[id] || courierRatesData[id])
    .filter(courier => courier?.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const toggleSort = (field: 'weight' | 'price') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  useEffect(() => {
    // If no courier is selected and we have filtered couriers, select the first one
    if (!selectedCourierService && filteredCouriers.length > 0) {
      setSelectedCourierService(filteredCouriers[0].id);
    }
  }, [filteredCouriers, selectedCourierService]);

  // Add new state for sidebar
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('courier-rates');
  
  // Add sidebar width and content margin
  const sidebarWidth = isExpanded ? 'w-48' : 'w-16';
  const contentMargin = isExpanded ? 'ml-48' : 'ml-16';

  // Add new state for courier overlay
  const [showCourierOverlay, setShowCourierOverlay] = useState(false);
  const [tempSelectedCouriers, setTempSelectedCouriers] = useState<string[]>([]);

  // Add new handlers
  const handleToggleCourier = (courierId: string) => {
    setTempSelectedCouriers(prev => 
      prev.includes(courierId) 
        ? prev.filter(id => id !== courierId)
        : [...prev, courierId]
    );
  };

  // Add this new handler near other handlers
  const handleSelectAllCouriers = () => {
    const allCourierIds = Object.values(availableCouriers).map(courier => courier.id);
    setTempSelectedCouriers(allCourierIds);
  };

  // Modify the handleSaveCouriers function
  const handleSaveCouriers = async () => {
    if (!user) return;
  
    try {
      const userRef = doc(db, 'users', user.uid);
      const updatedSelectedCouriers = [...selectedCouriers];
      
      tempSelectedCouriers.forEach(courierId => {
        if (!updatedSelectedCouriers.includes(courierId)) {
          updatedSelectedCouriers.push(courierId);
        }
      });
  
      // Update user document with selected couriers
      await updateDoc(userRef, {
        selectedCouriers: updatedSelectedCouriers,
        'onboardingData.courierServices.selectedCouriers': updatedSelectedCouriers,
        updatedAt: new Date().toISOString()
      });
  
      // Update local state
      setSelectedCouriers(updatedSelectedCouriers);
      setShowCourierOverlay(false);
  
    } catch (error) {
      console.error('Error saving courier services:', error);
    }
  };

  // Add delete handler function
  const handleDeleteCourier = async (courierId: string) => {
    if (!user) return;
  
    try {
      const userRef = doc(db, 'users', user.uid);
      const updatedSelectedCouriers = selectedCouriers.filter(id => id !== courierId);
  
      // Update user document
      await updateDoc(userRef, {
        selectedCouriers: updatedSelectedCouriers,
        'onboardingData.courierServices.selectedCouriers': updatedSelectedCouriers,
        updatedAt: new Date().toISOString()
      });
  
      // Update local state
      setSelectedCouriers(updatedSelectedCouriers);
    } catch (error) {
      console.error('Error deleting courier:', error);
    }
  };

  // Add new handler for saving address
  const handleSaveAddress = async () => {
    if (!user || !addressFormType) return;
  
    try {
      const userRef = doc(db, 'users', user.uid);
      const addressData = addressFormType === 'pickup' ? pickupAddress : deliveryAddress;
      const addressType = addressFormType === 'pickup' ? 'pickupAddresses' : 'deliveryAddresses';
  
      // Create new address object with id and label
      const newAddress = {
        ...addressData,
        id: Date.now().toString(),
        label: 'New Address' // You can add a field for users to set this
      };
  
      // Get current addresses first
      const userDoc = await getDoc(userRef);
      let currentAddresses = [];
      if (userDoc.exists()) {
        currentAddresses = userDoc.data()[addressType] || [];
      }
  
      // Update with new address
      await updateDoc(userRef, {
        [addressType]: [...currentAddresses, newAddress],
        updatedAt: new Date().toISOString()
      });
  
      // Update local state
      if (addressFormType === 'pickup') {
        setSavedAddresses((prev: SavedAddress[]) => [...prev, newAddress]);
      }
  
      // Reset form and close overlay
      setShowNewAddressForm(false);
      setShowAddressForm(false);
      setAddressFormType(null);
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };
  

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-900/20 to-black">
      <CustomCursor />
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 bottom-0 ${sidebarWidth} bg-black/30 backdrop-blur-xl border-r border-white/10 z-40 transition-all duration-300`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo */}
        <div className="flex items-center px-3 h-14 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8 flex-shrink-0">
              <Image
                src="/icons/das1.png"
                alt="Dashboard Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className={`text-white font-bold transition-opacity duration-300 ${
              isExpanded ? 'opacity-100' : 'opacity-0'
            }`}>
              Dashboard
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-2 py-2 space-y-2.5">
          {sidebarNavigation.map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              whileHover={{ x: 2 }}
              className={`flex items-center space-x-2.5 px-3 py-2 text-xs rounded-lg transition-colors overflow-hidden ${
                activeSection === item.href.slice(1)
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="text-base min-w-[20px]" />
              <span className={`whitespace-nowrap transition-opacity duration-300 ${
                isExpanded ? 'opacity-100' : 'opacity-0'
              }`}>
                {item.label}
              </span>
            </motion.a>
          ))}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-white/10">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-2 p-1.5 rounded-lg bg-white/5 overflow-hidden"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
              <RiUserLine className="text-white text-xs" />
            </div>
            <div className={`flex-1 min-w-0 transition-opacity duration-300 ${
              isExpanded ? 'opacity-100' : 'opacity-0'
            }`}>
              <h3 className="text-xs text-white font-semibold truncate">John Doe</h3>
              <p className="text-[10px] text-gray-400">Admin</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className={`p-1 rounded-lg hover:bg-white/10 transition-opacity duration-300 ${
                isExpanded ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <RiLogoutBoxLine className="text-gray-400 text-xs" />
            </motion.button>
          </motion.div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`${contentMargin} p-6 transition-all duration-300 relative`}>
        {/* Update the Back Button styles */}
        <motion.button
          onClick={() => router.back()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute left-6 top-6 z-50 flex items-center gap-2 px-4 py-2 text-white bg-white/10 
                    rounded-lg hover:bg-white/20 transition-all duration-200"
        >
          <FiArrowLeft className="w-6 h-6" />
          <span className="text-sm font-medium">Back</span>
        </motion.button>

        <div className="max-w-7xl mx-auto pt-20"> {/* Add top padding to avoid overlap */}
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white inline-flex items-center gap-3 justify-center">
              <FiTruck className="text-blue-400" />
              Courier Service Rates
            </h1>
            <p className="text-gray-400 mt-2">
              View and compare rates for your selected courier services
            </p>
          </div>

          {/* Address Selection */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              onClick={() => handleAddressClick('pickup')}
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-white/5 border border-white/10 rounded-xl flex items-start gap-4 hover:bg-white/10 transition-all"
            >
              <div className={`p-3 rounded-lg ${pickupAddress.addressLine1 ? 'bg-green-500' : 'bg-green-500/10'}`}>
                {pickupAddress.addressLine1 ? 
                  <FiCheck className="w-6 h-6 text-white" /> :
                  <FiMapPin className="w-6 h-6 text-green-400" />
                }
              </div>
              <div className="text-left flex-1">
                <h3 className="text-lg font-semibold text-white">Pickup Address</h3>
                {pickupAddress.addressLine1 ? (
                  <p className="text-gray-400 mt-1">
                    {pickupAddress.addressLine1}, {pickupAddress.city}
                  </p>
                ) : (
                  <p className="text-gray-500 mt-1">Click to add pickup address</p>
                )}
              </div>
            </motion.button>

            <motion.button
              onClick={() => handleAddressClick('delivery')}
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-white/5 border border-white/10 rounded-xl flex items-start gap-4 hover:bg-white/10 transition-all"
            >
              <div className={`p-3 rounded-lg ${deliveryAddress.addressLine1 ? 'bg-purple-500' : 'bg-purple-500/10'}`}>
                {deliveryAddress.addressLine1 ? 
                  <FiCheck className="w-6 h-6 text-white" /> :
                  <FiMapPin className="w-6 h-6 text-purple-400" />
                }
              </div>
              <div className="text-left flex-1">
                <h3 className="text-lg font-semibold text-white">Delivery Address</h3>
                {deliveryAddress.addressLine1 ? (
                  <p className="text-gray-400 mt-1">
                    {deliveryAddress.addressLine1}, {deliveryAddress.city}
                  </p>
                ) : (
                  <p className="text-gray-500 mt-1">Click to add delivery address</p>
                )}
              </div>
            </motion.button>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-8 flex gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courier services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white 
                         placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Add this button after the header section */}
          <div className="flex justify-end mb-6">
            <motion.button
              onClick={() => {
                setTempSelectedCouriers(selectedCouriers);
                setShowCourierOverlay(true);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              Add More Couriers
            </motion.button>
          </div>

          {/* Courier Services Grid */}
          <div className="grid grid-cols-1 gap-8">
            {filteredCouriers.map((courier) => (
              <motion.div
                key={courier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
              >
                {/* Courier Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12">
                        <Image
                          src={courier.logo}
                          alt={courier.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-white">{courier.name}</h2>
                        <div className="flex gap-2 mt-2">
                          {courier.features.map((feature, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-300"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCourier(courier.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </motion.button>
                      <button
                        onClick={() => handleCourierSelect(courier.id)}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          selectedCourierService === courier.id
                            ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                            : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        {selectedCourierService === courier.id ? (
                          <span className="flex items-center gap-2">
                            <FiCheck className="w-5 h-5" />
                            Selected
                          </span>
                        ) : (
                          'Select Service'
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Rates Table */}
                <div className="p-6">
                  <table className="w-full">
                    <thead>
                      <tr className="text-gray-400 border-b border-white/10">
                        <th className="pb-4 text-left">
                          <button
                            onClick={() => toggleSort('weight')}
                            className="flex items-center gap-2"
                          >
                            Weight Range
                            {sortField === 'weight' && (
                              sortOrder === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                            )}
                          </button>
                        </th>
                        <th className="pb-4 text-left">
                          <button
                            onClick={() => toggleSort('price')}
                            className="flex items-center gap-2"
                          >
                            Price (₹)
                            {sortField === 'price' && (
                              sortOrder === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                            )}
                          </button>
                        </th>
                        <th className="pb-4 text-left">Delivery Time</th>
                        <th className="pb-4 text-left">Distance Range</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courier.rates
                        .sort((a: CourierRate, b: CourierRate) => {
                          if (sortField === 'weight') {
                            const weightA = parseInt(a.weight.split('-')[0]);
                            const weightB = parseInt(b.weight.split('-')[0]);
                            return sortOrder === 'asc' ? weightA - weightB : weightB - weightA;
                          } else {
                            return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
                          }
                        })
                        .map((rate, index: number) => (
                          <tr
                            key={index}
                            className="border-b border-white/5 text-white"
                          >
                            <td className="py-4">{rate.weight}</td>
                            <td className="py-4">₹{rate.price}</td>
                            <td className="py-4">{rate.deliveryTime}</td>
                            <td className="py-4">{rate.distanceRange}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredCouriers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">
                {searchTerm
                  ? 'No courier services found matching your search.'
                  : 'No courier services selected. Please complete the onboarding process.'}
              </p>
            </div>
          )}
        </div>

        {/* Address Form Overlay */}
        {showAddressForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-b from-gray-800 to-gray-900 border border-white/10 rounded-2xl w-full max-w-lg"
            >
              <div className="sticky top-0 z-10 bg-gradient-to-b from-gray-800 to-gray-800/95 backdrop-blur-sm p-6 border-b border-white/10">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">
                    {addressFormType && `Enter ${addressFormType === 'pickup' ? 'Pickup' : 'Delivery'} Address`}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddressForm(false);
                      setAddressFormType(null);
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <FiX className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(100vh-180px)]">
                {addressFormType === 'pickup' && (
                  <>
                    {/* Saved Addresses Section */}
                    <div className="mb-6 space-y-4">
                      <h3 className="text-lg font-semibold text-white">Saved Addresses</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {savedAddresses.map((address) => (
                          <motion.div
                            key={address.id}
                            className={`p-4 rounded-lg border ${
                              selectedSavedAddress === address.id
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-white/10 bg-white/5'
                            } transition-all relative group`}
                          >
                            <button
                              onClick={() => {
                                setSelectedSavedAddress(address.id);
                                setPickupAddress({
                                  name: address.name,
                                  phone: address.phone,
                                  email: address.email,
                                  addressLine1: address.addressLine1,
                                  city: address.city,
                                  state: address.state,
                                  pinCode: address.pinCode,
                                  landmark: address.landmark,
                                });
                              }}
                              className="w-full text-left"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-white font-medium">{address.label}</h4>
                                  <p className="text-gray-400 text-sm mt-1">{address.addressLine1}</p>
                                  <p className="text-gray-400 text-sm">{address.city}, {address.state}</p>
                                </div>
                                <div className={`w-4 h-4 rounded-full border-2 ${
                                  selectedSavedAddress === address.id
                                    ? 'border-blue-500 bg-blue-500'
                                    : 'border-gray-400'
                                }`} />
                              </div>
                            </button>
                            <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditAddress(address)}
                                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-blue-400 transition-colors"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Only show Add New Address button if less than 3 addresses */}
                    {savedAddresses.length < 3 && (
                      <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <button
                            onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                            className="px-4 py-2 text-blue-400 hover:text-blue-300 bg-gradient-to-b from-gray-800 to-gray-900 rounded-full border border-white/10 hover:border-white/20 transition-all flex items-center gap-2"
                          >
                            {showNewAddressForm ? 'Hide New Address Form' : 'Add New Address'}
                            {showNewAddressForm ? <FiChevronUp /> : <FiChevronDown />}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Form Fields - Only show when it's delivery address or showNewAddressForm is true */}
                {(addressFormType === 'delivery' || showNewAddressForm) && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={addressFormType === 'pickup' ? pickupAddress.name : addressFormType === 'delivery' ? deliveryAddress.name : ''}
                          onChange={(e) => {
                            if (addressFormType === 'pickup') {
                              setPickupAddress({ ...pickupAddress, name: e.target.value });
                            } else if (addressFormType === 'delivery') {
                              setDeliveryAddress({ ...deliveryAddress, name: e.target.value });
                            }
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                                   placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={addressFormType === 'pickup' ? pickupAddress.phone : addressFormType === 'delivery' ? deliveryAddress.phone : ''}
                          onChange={(e) => {
                            if (addressFormType === 'pickup') {
                              setPickupAddress({ ...pickupAddress, phone: e.target.value });
                            } else if (addressFormType === 'delivery') {
                              setDeliveryAddress({ ...deliveryAddress, phone: e.target.value });
                            }
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                                   placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={addressFormType === 'pickup' ? pickupAddress.email : addressFormType === 'delivery' ? deliveryAddress.email : ''}
                        onChange={(e) => {
                          if (addressFormType === 'pickup') {
                            setPickupAddress({ ...pickupAddress, email: e.target.value });
                          } else if (addressFormType === 'delivery') {
                            setDeliveryAddress({ ...deliveryAddress, email: e.target.value });
                          }
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                                 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={addressFormType === 'pickup' ? pickupAddress.addressLine1 : addressFormType === 'delivery' ? deliveryAddress.addressLine1 : ''}
                        onChange={(e) => {
                          if (addressFormType === 'pickup') {
                            setPickupAddress({ ...pickupAddress, addressLine1: e.target.value });
                          } else if (addressFormType === 'delivery') {
                            setDeliveryAddress({ ...deliveryAddress, addressLine1: e.target.value });
                          }
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                                 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Street address"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={addressFormType === 'pickup' ? pickupAddress.city : addressFormType === 'delivery' ? deliveryAddress.city : ''}
                          onChange={(e) => {
                            if (addressFormType === 'pickup') {
                              setPickupAddress({ ...pickupAddress, city: e.target.value });
                            } else if (addressFormType === 'delivery') {
                              setDeliveryAddress({ ...deliveryAddress, city: e.target.value });
                            }
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                                   placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          value={addressFormType === 'pickup' ? pickupAddress.state : addressFormType === 'delivery' ? deliveryAddress.state : ''}
                          onChange={(e) => {
                            if (addressFormType === 'pickup') {
                              setPickupAddress({ ...pickupAddress, state: e.target.value });
                            } else if (addressFormType === 'delivery') {
                              setDeliveryAddress({ ...deliveryAddress, state: e.target.value });
                            }
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                                   placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          PIN Code
                        </label>
                        <input
                          type="text"
                          value={addressFormType === 'pickup' ? pickupAddress.pinCode : addressFormType === 'delivery' ? deliveryAddress.pinCode : ''}
                          onChange={(e) => {
                            if (addressFormType === 'pickup') {
                              setPickupAddress({ ...pickupAddress, pinCode: e.target.value });
                            } else if (addressFormType === 'delivery') {
                              setDeliveryAddress({ ...deliveryAddress, pinCode: e.target.value });
                            }
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                                   placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Landmark
                        </label>
                        <input
                          type="text"
                          value={addressFormType === 'pickup' ? pickupAddress.landmark : addressFormType === 'delivery' ? deliveryAddress.landmark : ''}
                          onChange={(e) => {
                            if (addressFormType === 'pickup') {
                              setPickupAddress({ ...pickupAddress, landmark: e.target.value });
                            } else if (addressFormType === 'delivery') {
                              setDeliveryAddress({ ...deliveryAddress, landmark: e.target.value });
                            }
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                                   placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-gradient-to-b from-gray-800/95 to-gray-800 backdrop-blur-sm p-6 border-t border-white/10">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowAddressForm(false)}
                    className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  {showNewAddressForm ? (
                    <button
                      onClick={handleSaveAddress}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                               transition-colors font-medium flex items-center gap-2"
                    >
                      <span>Save Address</span>
                      <FiCheck className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowAddressForm(false);
                        setAddressFormType(null);
                        setShowNewAddressForm(false);
                      }}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                               transition-colors font-medium flex items-center gap-2"
                    >
                      <span>Done</span>
                      <FiCheck className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}

        {/* Add this overlay before the closing div */}
        {showCourierOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-b from-gray-800 to-gray-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Select Courier Services</h2>
                    <p className="text-sm text-gray-400 mt-1">Choose from our wide range of courier partners</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSelectAllCouriers}
                      className="px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      onClick={handleSaveCouriers}
                      className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <FiPlus className="w-4 h-4" />
                      Add
                    </button>
                    <button
                      onClick={() => setShowCourierOverlay(false)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-all"
                    >
                      <FiX className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courier services..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.values(availableCouriers)
                    .filter(courier => 
                      courier.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((courier) => (
                      <motion.div
                        key={courier.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-lg border cursor-pointer ${
                          tempSelectedCouriers.includes(courier.id)
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-white/10 bg-white/5'
                        }`}
                        onClick={() => handleToggleCourier(courier.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative w-10 h-10 flex-shrink-0">
                            <Image
                              src={courier.logo}
                              alt={courier.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-white font-medium">{courier.name}</h3>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                tempSelectedCouriers.includes(courier.id)
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-400'
                              }`}>
                                {tempSelectedCouriers.includes(courier.id) && (
                                  <FiCheck className="w-3 h-3 text-white" />
                                )}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {courier.features.map((feature, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-white/5 rounded-full text-xs text-gray-400"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>

              <div className="p-6 border-t border-white/10 bg-black/20">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">
                    {tempSelectedCouriers.length} courier{tempSelectedCouriers.length !== 1 ? 's' : ''} selected
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCourierOverlay(false)}
                      className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveCouriers}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                      <FiPlus className="w-4 h-4" />
                      Add Selected
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
