'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiUser, FiBriefcase, FiCreditCard, FiTruck, FiLock, FiBell, FiCode, FiLifeBuoy, FiEdit, FiPhone } from 'react-icons/fi';
import { useRouter } from 'next/navigation'; // Add this import
import FormField from '../components/FormField';
import DeliveryAnimation from '../components/DeliveryAnimation';
import { useAuth } from '../../hooks/useAuth';
import { getUserData } from '../../firebase/auth';
import CustomCursor from '../components/CustomCursor';

interface Section {
  id: string;
  title: string;
  icon: JSX.Element;
  content: JSX.Element;
}

interface OnboardingData {
  personalInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    businessType: string;
  };
  websiteDetails?: {
    websiteUrl: string;
    platform: string;
    wordpressProvider: string;
  };
  courierServices?: {
    pickupAddress: string;
    pickupCity: string;
    pickupState: string;
    pickupZip: string;
    selectedCouriers?: string[];
    pickupPhoneNumber?: string; // Add this line
  };
  paymentDetails?: {
    bankDetails: {
      accountHolderName: string;
      bankName: string;
      accountNumber: string;
      ifscCode: string;
    };
    selectedPaymentGateways: string[];
  };
  // ...other onboarding data sections
}

interface FirebaseUser {
  id: string;
  onboardingData?: {
    personalInfo?: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      businessType: string;
    };
    websiteDetails?: {
      websiteUrl: string;
      platform: string;
      wordpressProvider: string;
    };
    courierServices?: {
      pickupAddress: string;
      pickupCity: string;
      pickupState: string;
      pickupZip: string;
      selectedCouriers?: string[];
      pickupPhoneNumber?: string; // Add this line
    };
    paymentDetails?: {
      bankDetails: {
        accountHolderName: string;
        bankName: string;
        accountNumber: string;
        ifscCode: string;
      };
      selectedPaymentGateways: string[];
    };
    currentStep: number;
    lastUpdated: Date;
  };
}

export default function ProfilePage() {
  const router = useRouter(); // Add this line
  const [activeSection, setActiveSection] = useState<string>('basic');
  const [isOnline, setIsOnline] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const { user } = useAuth();
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string>('/hilla1.jpg');

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userData = await getUserData(user.uid) as FirebaseUser;
          setOnboardingData(userData?.onboardingData || null);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleEditSection = (section: string) => {
    if (section === 'basic') {
      router.push('/onboarding?step=1&edit=true');
    } else if (section === 'website') {
      router.push('/onboarding?step=2&edit=true');
    } else if (section === 'courier') {
      router.push('/onboarding?step=3&edit=true');
    } else if (section === 'payment') {
      router.push('/onboarding?step=4&edit=true');
    }
    // Add other section handling as needed
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
      // Here you would typically upload the file to your server/storage
      // and update the user's profile with the new avatar URL
    }
  };

  const sections: Section[] = [
    {
      id: 'basic',
      title: 'Basic Information',
      icon: <FiUser className="text-xl" />,
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden">
                  <img 
                    src={avatarUrl}
                    alt={`${onboardingData?.personalInfo?.firstName}'s avatar`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 cursor-pointer">
                  <FiUser size={14} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">
                  {onboardingData?.personalInfo?.firstName} {onboardingData?.personalInfo?.lastName}
                </h3>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEditSection('basic')}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white
                       transition-all duration-200 flex items-center space-x-2"
            >
              <FiEdit className="w-4 h-4" />
              <span className="text-sm">Edit</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="First Name"
              value={onboardingData?.personalInfo?.firstName || ''}
              icon={<FiUser />}
              type="text"
              onChange={() => {}}
              disabled={true}
            />
            <FormField
              label="Last Name"
              value={onboardingData?.personalInfo?.lastName || ''}
              icon={<FiUser />}
              type="text"
              onChange={() => {}}
              disabled={true}
            />
            <FormField
              label="Email"
              value={onboardingData?.personalInfo?.email || ''}
              icon={<FiUser />}
              type="email"
              onChange={() => {}}
              disabled={true}
            />
            <FormField
              label="Phone"
              value={onboardingData?.personalInfo?.phone || ''}
              icon={<FiUser />}
              type="tel"
              onChange={() => {}}
              disabled={true}
            />
            <FormField
              label="Business Type"
              value={onboardingData?.personalInfo?.businessType || ''}
              icon={<FiBriefcase />}
              type="text"
              onChange={() => {}}
              disabled={true}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : !onboardingData?.personalInfo ? (
            <div className="text-center py-4">
              <p className="text-gray-400">No onboarding information available.</p>
              <button 
                onClick={() => router.push('/onboarding')}
                className="mt-2 text-blue-500 hover:text-blue-400"
              >
                Complete Onboarding
              </button>
            </div>
          ) : null}
        </div>
      )
    },
    {
      id: 'business',
      title: 'Business Details',
      icon: <FiBriefcase className="text-xl" />,
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold mb-1">Website Information</h3>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEditSection('website')}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white
                       transition-all duration-200 flex items-center space-x-2"
            >
              <FiEdit className="w-4 h-4" />
              <span className="text-sm">Edit</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Website URL"
              value={onboardingData?.websiteDetails?.websiteUrl || ''}
              icon={<FiCode />}
              type="url"
              onChange={() => {}}
              disabled={true}
            />
            <FormField
              label="Platform"
              value={onboardingData?.websiteDetails?.platform || ''}
              icon={<FiBriefcase />}
              type="text"
              onChange={() => {}}
              disabled={true}
            />
          </div>

          {onboardingData?.websiteDetails?.platform === 'wordpress' && (
            <div className="bg-white/5 rounded-xl p-6">
              <h4 className="font-semibold mb-4">WordPress Details</h4>
              <FormField
                label="WordPress Provider"
                value={onboardingData?.websiteDetails?.wordpressProvider || ''}
                icon={<FiCode />}
                type="text"
                onChange={() => {}}
                disabled={true}
              />
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : !onboardingData?.websiteDetails ? (
            <div className="text-center py-4">
              <p className="text-gray-400">No website information available.</p>
              <button 
                onClick={() => router.push('/onboarding?step=2')}
                className="mt-2 text-blue-500 hover:text-blue-400"
              >
                Complete Website Details
              </button>
            </div>
          ) : null}
        </div>
      )
    },
    {
      id: 'payment',
      title: 'Payment Gateway',
      icon: <FiCreditCard className="text-xl" />,
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold mb-1">Payment Information</h3>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEditSection('payment')}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white
                       transition-all duration-200 flex items-center space-x-2"
            >
              <FiEdit className="w-4 h-4" />
              <span className="text-sm">Edit</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Bank Details Section */}
            <div className="bg-white/5 rounded-xl p-6">
              <h4 className="font-semibold mb-4">Bank Account Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Account Holder Name"
                  value={onboardingData?.paymentDetails?.bankDetails?.accountHolderName || ''}
                  icon={<FiUser />}
                  type="text"
                  onChange={() => {}}
                  disabled={true}
                />
                <FormField
                  label="Bank Name"
                  value={onboardingData?.paymentDetails?.bankDetails?.bankName || ''}
                  icon={<FiCreditCard />}
                  type="text"
                  onChange={() => {}}
                  disabled={true}
                />
                <FormField
                  label="Account Number"
                  value={onboardingData?.paymentDetails?.bankDetails?.accountNumber || ''}
                  icon={<FiCreditCard />}
                  type="text"
                  onChange={() => {}}
                  disabled={true}
                />
                <FormField
                  label="IFSC Code"
                  value={onboardingData?.paymentDetails?.bankDetails?.ifscCode || ''}
                  icon={<FiCreditCard />}
                  type="text"
                  onChange={() => {}}
                  disabled={true}
                />
              </div>
            </div>

            {/* Payment Gateways Section */}
            <div className="bg-white/5 rounded-xl p-6">
              <h4 className="font-semibold mb-4">Integrated Payment Gateways</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {onboardingData?.paymentDetails?.selectedPaymentGateways ? (
                  onboardingData.paymentDetails.selectedPaymentGateways.map((gateway) => (
                    <div key={gateway} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{gateway}</h4>
                        <div className="w-12 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                          <span className="text-xs text-green-500">Active</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">Integration complete</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-4">
                    <p className="text-gray-400">No payment gateways integrated</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : !onboardingData?.paymentDetails ? (
            <div className="text-center py-4">
              <p className="text-gray-400">No payment information available.</p>
              <button 
                onClick={() => router.push('/onboarding?step=4')}
                className="mt-2 text-blue-500 hover:text-blue-400"
              >
                Complete Payment Details
              </button>
            </div>
          ) : null}
        </div>
      )
    },
    {
      id: 'courier',
      title: 'Courier Service',
      icon: <FiTruck className="text-xl" />,
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold mb-1">Courier Information</h3>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEditSection('courier')}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white
                       transition-all duration-200 flex items-center space-x-2"
            >
              <FiEdit className="w-4 h-4" />
              <span className="text-sm">Edit</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-xl p-6">
              <h4 className="font-semibold mb-4">Pickup Address</h4>
              <div className="space-y-4">
                <FormField
                  label="Phone Number"
                  value={onboardingData?.courierServices?.pickupPhoneNumber || ''}
                  icon={<FiPhone />}
                  type="tel"
                  onChange={() => {}}
                  disabled={true}
                />
                <FormField
                  label="Address"
                  value={onboardingData?.courierServices?.pickupAddress || ''}
                  icon={<FiTruck />}
                  type="text"
                  onChange={() => {}}
                  disabled={true}
                />
                <FormField
                  label="City"
                  value={onboardingData?.courierServices?.pickupCity || ''}
                  icon={<FiTruck />}
                  type="text"
                  onChange={() => {}}
                  disabled={true}
                />
                <FormField
                  label="State"
                  value={onboardingData?.courierServices?.pickupState || ''}
                  icon={<FiTruck />}
                  type="text"
                  onChange={() => {}}
                  disabled={true}
                />
                <FormField
                  label="ZIP Code"
                  value={onboardingData?.courierServices?.pickupZip || ''}
                  icon={<FiTruck />}
                  type="text"
                  onChange={() => {}}
                  disabled={true}
                />
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <h4 className="font-semibold mb-4">Selected Courier Partners</h4>
              <div className="space-y-4">
                {onboardingData?.courierServices?.selectedCouriers ? (
                  onboardingData.courierServices.selectedCouriers.map((courier) => (
                    <div key={courier} className="flex items-center justify-between">
                      <span>{courier}</span>
                      <div className="w-12 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                        <span className="text-xs text-green-500">Active</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No courier partners selected</p>
                )}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : !onboardingData?.courierServices ? (
            <div className="text-center py-4">
              <p className="text-gray-400">No courier service information available.</p>
              <button 
                onClick={() => router.push('/onboarding?step=3')}
                className="mt-2 text-blue-500 hover:text-blue-400"
              >
                Complete Courier Details
              </button>
            </div>
          ) : null}
        </div>
      )
    },
    // Add remaining sections (Security, Notifications, API, Support) with similar structure
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-900/20 to-black">
      <CustomCursor />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/20 backdrop-blur-xl rounded-xl p-4 h-fit lg:sticky lg:top-8"
          >
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">RollPay</h1>
              <p className="text-sm text-gray-400">Merchant Dashboard</p>
            </div>

            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
                    ${activeSection === section.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  {section.icon}
                  <span>{section.title}</span>
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Main Content */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/20 backdrop-blur-xl rounded-xl p-6"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">
                {sections.find(s => s.id === activeSection)?.title}
              </h2>
            </div>
            {sections.find(s => s.id === activeSection)?.content}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
