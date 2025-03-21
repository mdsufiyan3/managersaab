'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiUser, FiMail, FiBriefcase, FiMapPin, FiPhone, FiCheck, FiGlobe, FiCode, FiStar, FiTruck, FiPackage, FiBox, FiCreditCard, FiDollarSign, FiHome, FiHash, FiKey, FiX } from 'react-icons/fi';
import { FaWordpress } from 'react-icons/fa';
import { 
  SiWoocommerce, 
  SiShopify, 
  SiMagento, 
  SiWix, 
  SiSquarespace, 
  SiWordpress,
  SiStripe,
  SiPaypal,
  SiSquare
} from 'react-icons/si';
import { IoChevronDown } from 'react-icons/io5';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import OverlayMessage from '../components/OverlayMessage';
import CloseConfirmation from '../components/CloseConfirmation';
import { saveOnboardingData } from '../../firebase/firestore';
import { getUserData } from '../../firebase/auth'; // Change this import
import { useAuth } from '../../hooks/useAuth'; // You'll need to create this hook
import CustomCursor from '../components/CustomCursor';

// Modify countries array to only include India
const countries = [
  { code: 'IN', name: 'India', phoneCode: '+91' },
];

// Add this interface before FormData interface
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
      platform: '' | 'wordpress' | 'custom';
      wordpressProvider: string;
    };
    courierServices?: {
      pickupAddress: string;
      pickupCity: string;
      pickupState: string;
      pickupZip: string;
      selectedCouriers: string[];
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

interface OnboardingDataType {
  currentStep: number;
  personalInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    businessType: string;
    companyName?: string;
  };
  websiteDetails?: {
    websiteUrl: string;
    platform: string;
    wordpressProvider?: string;
  };
  courierServices?: {
    pickupAddress: string;
    pickupCity: string;
    pickupState: string;
    pickupZip: string;
    pickupCountry: string;
    pickupInstructions?: string;
    selectedCouriers: string[];
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
  lastUpdated: Date;
}

interface FormData {
  step: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  address: string;
  city: string;
  country: string;
  phoneNumber: string;
  verificationCode: string;
  isPhoneVerified: boolean;
  businessType: string;
  websiteUrl: string;
  platform: 'wordpress' | 'custom' | '';
  wordpressProvider: string;
  selectedCouriers: string[];
  pickupAddress: string;
  pickupCity: string;
  pickupState: string;
  pickupZip: string;
  pickupCountry: string;
  pickupInstructions: string;
  selectedCountry: string;
  countryCode: string;
  pickupPhoneNumber: string;
  pickupCountryCode: string;
  pickupSelectedCountry: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string; // This will be used for IFSC code
  accountHolderName: string;
  selectedPaymentGateways: string[];
  merchantId: string;
  apiKey: string;
}

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const initialStep = parseInt(searchParams.get('step') || '1');
  const isEditMode = searchParams.get('edit') === 'true';
  
  const router = useRouter();
  const { user } = useAuth(); // Add this hook to get current user

  const [formData, setFormData] = useState<FormData>({
    step: initialStep,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    address: '',
    city: '',
    country: '',
    phoneNumber: '',
    verificationCode: '',
    isPhoneVerified: false,
    businessType: '',
    websiteUrl: '',
    platform: '',
    wordpressProvider: '',
    selectedCouriers: [],
    pickupAddress: '',
    pickupCity: '',
    pickupState: '',
    pickupZip: '',
    pickupCountry: '',
    pickupInstructions: '',
    selectedCountry: 'IN',
    countryCode: '+91',
    pickupPhoneNumber: '',
    pickupCountryCode: '+91',
    pickupSelectedCountry: 'IN',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountHolderName: '',
    selectedPaymentGateways: [],
    merchantId: '',
    apiKey: ''
  });

  const [message, setMessage] = useState<{
    text: string;
    type: 'success' | 'error' | 'warning';
    visible: boolean;
  }>({
    text: '',
    type: 'success',
    visible: false,
  });

  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);

  const showMessage = (text: string, type: 'success' | 'error' | 'warning') => {
    setMessage({ text, type, visible: true });
  };

  const handleClose = () => {
    setShowCloseConfirmation(true);
  };

  const confirmClose = () => {
    router.push('/frontend');
  };

  // Add effect to set pickup phone details when step 3 is loaded
  useEffect(() => {
    if (formData.step === 3 && formData.isPhoneVerified) {
      setFormData(prev => ({
        ...prev,
        pickupPhoneNumber: prev.phoneNumber,
        pickupCountryCode: prev.countryCode,
        pickupSelectedCountry: prev.selectedCountry
      }));
    }
  }, [formData.step]);

  // Add effect to update pickup phone details when step 3 is loaded or phone is verified
  useEffect(() => {
    if ((formData.step === 3 || formData.isPhoneVerified) && formData.phoneNumber) {
      setFormData(prev => ({
        ...prev,
        pickupPhoneNumber: prev.phoneNumber,
        pickupCountryCode: prev.countryCode,
        pickupSelectedCountry: prev.selectedCountry
      }));
    }
  }, [formData.step, formData.isPhoneVerified, formData.phoneNumber]);

  const wordpressProviders = [
    { 
      value: 'woocommerce', 
      label: 'WooCommerce', 
      icon: SiWoocommerce,
      color: 'text-[#96588A]' // WooCommerce purple
    },
    { 
      value: 'shopify', 
      label: 'Shopify', 
      icon: SiShopify,
      color: 'text-[#7AB55C]' // Shopify green
    },
    { 
      value: 'magento', 
      label: 'Magento', 
      icon: SiMagento,
      color: 'text-[#EE672F]' // Magento orange
    },
    { 
      value: 'wix', 
      label: 'Wix', 
      icon: SiWix,
      color: 'text-[#000000]' // Wix black
    },
    { 
      value: 'squarespace', 
      label: 'Squarespace', 
      icon: SiSquarespace,
      color: 'text-[#000000]' // Squarespace black
    },
    { 
      value: 'other', 
      label: 'Other', 
      icon: SiWordpress,
      color: 'text-[#21759B]' // WordPress blue
    }
  ];

  const [showVerificationField, setShowVerificationField] = useState(false);

  const sendVerificationCode = () => {
    // Simulate sending verification code
    setShowVerificationField(true);
    // You would typically make an API call here to send the actual code
  };

  const verifyCode = () => {
    // Simulate code verification
    if (formData.verificationCode.length === 6) {
      setFormData(prev => ({ 
        ...prev, 
        isPhoneVerified: true,
        pickupPhoneNumber: prev.phoneNumber,
        pickupCountryCode: prev.countryCode,
        pickupSelectedCountry: prev.selectedCountry
      }));
    }
  };

  // Business type options
  const businessTypes = [
    { value: 'retail', label: 'Retail' },
    { value: 'wholesale', label: 'Wholesale' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'service', label: 'Service Provider' },
    { value: 'ecommerce', label: 'E-Commerce' },
    { value: 'other', label: 'Other' }
  ];

  const updateFormData = (key: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Add validation function before return statement
  const getRequiredFields = (step: number) => {
    switch (step) {
      case 1:
        return {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          businessType: formData.businessType,
          phoneNumber: formData.phoneNumber,
          isPhoneVerified: formData.isPhoneVerified
        };
      case 2:
        return {
          websiteUrl: formData.websiteUrl,
          platform: formData.platform,
          ...(formData.platform === 'wordpress' ? { wordpressProvider: formData.wordpressProvider } : {})
        };
      case 3:
        return {
          pickupAddress: formData.pickupAddress,
          pickupCity: formData.pickupCity,
          pickupState: formData.pickupState,
          pickupZip: formData.pickupZip
        };
      case 4:
        return {
          accountHolderName: formData.accountHolderName,
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          routingNumber: formData.routingNumber
        };
      default:
        return {};
    }
  };

  // Add effect to handle edit mode initialization
  useEffect(() => {
    const initializeEditMode = async () => {
      if (isEditMode && user) {
        try {
          const userData = await getUserData(user.uid) as FirebaseUser;
          if (userData?.onboardingData?.personalInfo) {
            setFormData(prev => ({
              ...prev,
              firstName: userData?.onboardingData?.personalInfo?.firstName || '',
              lastName: userData?.onboardingData?.personalInfo?.lastName || '',
              email: userData.onboardingData?.personalInfo?.email || '',
              phoneNumber: userData.onboardingData?.personalInfo?.phone || '',
              businessType: userData.onboardingData?.personalInfo?.businessType || '',
              // Add other fields as needed
              isPhoneVerified: true // Assuming phone is already verified
            }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          showMessage('Error loading user data', 'error');
        }
      }
    };

    initializeEditMode();
  }, [user, isEditMode]);

  // Update the edit mode initialization effect
  useEffect(() => {
    const initializeEditMode = async () => {
      if (user) {
        try {
          const userData = await getUserData(user.uid) as FirebaseUser;
          if (userData?.onboardingData) {
            const data = userData.onboardingData;
            
            // Set all form data from saved onboarding data
            setFormData(prev => ({
              ...prev,
              // Personal Info (Step 1)
              firstName: data.personalInfo?.firstName || '',
              lastName: data.personalInfo?.lastName || '',
              email: data.personalInfo?.email || '',
              phoneNumber: data.personalInfo?.phone || '',
              businessType: data.personalInfo?.businessType || '',
              isPhoneVerified: true, // Assuming phone is already verified
              
              // Website Details (Step 2)
              websiteUrl: data.websiteDetails?.websiteUrl || '',
              platform: data.websiteDetails?.platform || '',
              wordpressProvider: data.websiteDetails?.wordpressProvider || '',
              
              // Courier Services (Step 3)
              pickupAddress: data.courierServices?.pickupAddress || '',
              pickupCity: data.courierServices?.pickupCity || '',
              pickupState: data.courierServices?.pickupState || '',
              pickupZip: data.courierServices?.pickupZip || '',
              selectedCouriers: data.courierServices?.selectedCouriers || [],
              
              // Payment Details (Step 4)
              accountHolderName: data.paymentDetails?.bankDetails?.accountHolderName || '',
              bankName: data.paymentDetails?.bankDetails?.bankName || '',
              accountNumber: data.paymentDetails?.bankDetails?.accountNumber || '',
              routingNumber: data.paymentDetails?.bankDetails?.ifscCode || '',
              selectedPaymentGateways: data.paymentDetails?.selectedPaymentGateways || []
            }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          showMessage('Error loading user data', 'error');
        }
      }
    };

    initializeEditMode();
  }, [user]);

  const handleSaveAndNavigate = async (isPartial = false) => {
    if (!user) {
      showMessage('Please sign in to continue', 'error');
      return;
    }
  
    try {
      const onboardingData: OnboardingDataType = {
        currentStep: formData.step,
        lastUpdated: new Date(),
        ...(formData.step >= 1 && {
          personalInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phoneNumber,
            businessType: formData.businessType,
            companyName: formData.companyName
          }
        }),
        ...(formData.step >= 2 && {
          websiteDetails: {
            websiteUrl: formData.websiteUrl,
            platform: formData.platform,
            ...(formData.platform === 'wordpress' && {
              wordpressProvider: formData.wordpressProvider
            })
          }
        }),
        ...(formData.step >= 3 && {
          courierServices: {
            pickupAddress: formData.pickupAddress,
            pickupCity: formData.pickupCity,
            pickupState: formData.pickupState,
            pickupZip: formData.pickupZip,
            pickupCountry: formData.pickupCountry || 'IN',
            pickupInstructions: formData.pickupInstructions,
            selectedCouriers: formData.selectedCouriers
          }
        }),
        ...(formData.step >= 4 && {
          paymentDetails: {
            bankDetails: {
              accountHolderName: formData.accountHolderName,
              bankName: formData.bankName,
              accountNumber: formData.accountNumber,
              ifscCode: formData.routingNumber
            },
            selectedPaymentGateways: formData.selectedPaymentGateways
          }
        })
      };
  
      await saveOnboardingData(user.uid, onboardingData, isPartial);
      
      if (!isPartial) {
        showMessage('Onboarding completed successfully!', 'success');
        setTimeout(() => router.push('/profile'), 1500);
      } else {
        // Don't show message for partial saves to avoid confusion
        setFormData(prev => ({ ...prev, step: prev.step + 1 }));
      }
  
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      showMessage('Failed to save onboarding data. Please try again.', 'error');
    }
  };
  
  // Update the nextStep function
  const nextStep = async (isSkip = false) => {
    if (!isSkip) {
      const requiredFields = getRequiredFields(formData.step);
      const hasEmptyFields = Object.values(requiredFields).some(value => !value);
      
      if (hasEmptyFields) {
        showMessage('Please fill in all required fields', 'error');
        return;
      }
    }
    
    if (formData.step < 4) {
      // Save progress before moving to next step
      await handleSaveAndNavigate(true);
      setFormData(prev => ({ ...prev, step: prev.step + 1 }));
    } else {
      // If it's the last step or skipping the last step
      await handleSaveAndNavigate(isSkip);
    }
  };

  const prevStep = () => {
    setFormData(prev => ({ ...prev, step: prev.step - 1 })); 
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: FiUser },
    { number: 2, title: 'Website Details', icon: FiBriefcase },
    { number: 3, title: 'Courier Services', icon: FiTruck },
    { number: 4, title: 'Payment Setup', icon: FiCreditCard }
  ];

  const courierServices = [
    {
      id: 'fedex',
      name: 'FedEx',
      description: 'Global shipping solutions with tracking',
      icon: FiPackage,
      color: 'from-purple-500 to-blue-500',
      features: ['International Shipping', 'Real-time Tracking', '2-3 Day Delivery']
    },
    {
      id: 'dhl',
      name: 'DHL',
      description: 'Express worldwide delivery services',
      icon: FiTruck,
      color: 'from-yellow-500 to-red-500',
      features: ['Express Delivery', 'Customs Clearance', 'Door-to-Door Service']
    },
    {
      id: 'ups',
      name: 'UPS',
      description: 'Reliable domestic and international shipping',
      icon: FiBox,
      color: 'from-brown-500 to-yellow-500',
      features: ['Ground Shipping', 'Freight Services', 'Supply Chain Solutions']
    }
  ];

  const toggleCourierSelection = (courierId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCouriers: prev.selectedCouriers.includes(courierId)
        ? prev.selectedCouriers.filter(id => id !== courierId)
        : [...prev.selectedCouriers, courierId]
    }));
  };

  // Modify payment gateway options to remove sensitive features
  const paymentGateways = [
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Popular payment gateway with extensive features',
      icon: SiStripe,
      color: 'from-purple-500 to-indigo-500',
      features: ['Multiple Currency Support', 'Real-time Dashboard', 'Secure Transactions']
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Trusted worldwide payment solution',
      icon: SiPaypal,
      color: 'from-blue-500 to-blue-600',
      features: ['Easy Integration', 'Buyer Protection', 'Global Reach']
    },
    {
      id: 'square',
      name: 'Square',
      description: 'Integrated payment and business solutions',
      icon: SiSquare,
      color: 'from-black to-gray-800',
      features: ['Simple Setup', 'Business Tools', 'Reliable Support']
    }
  ];

  // Add payment gateway selection handler
  const togglePaymentGateway = (gatewayId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPaymentGateways: prev.selectedPaymentGateways.includes(gatewayId)
        ? prev.selectedPaymentGateways.filter(id => id !== gatewayId)
        : [...prev.selectedPaymentGateways, gatewayId]
    }));
  };

  // Add a handler for edit mode save
  const handleEditSave = async () => {
    if (!user) {
      showMessage('Please sign in to continue', 'error');
      return;
    }

    try {
      const onboardingData: OnboardingDataType = {
        currentStep: formData.step,
        lastUpdated: new Date(),
        ...(formData.step === 1 && {
          personalInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phoneNumber,
            businessType: formData.businessType,
            companyName: formData.companyName
          }
        }),
        ...(formData.step === 2 && {
          websiteDetails: {
            websiteUrl: formData.websiteUrl,
            platform: formData.platform,
            ...(formData.platform === 'wordpress' && {
              wordpressProvider: formData.wordpressProvider
            })
          }
        }),
        ...(formData.step === 3 && {
          courierServices: {
            pickupAddress: formData.pickupAddress,
            pickupCity: formData.pickupCity,
            pickupState: formData.pickupState,
            pickupZip: formData.pickupZip,
            pickupCountry: formData.pickupCountry || 'IN',
            pickupInstructions: formData.pickupInstructions,
            selectedCouriers: formData.selectedCouriers
          }
        }),
        ...(formData.step === 4 && {
          paymentDetails: {
            bankDetails: {
              accountHolderName: formData.accountHolderName,
              bankName: formData.bankName,
              accountNumber: formData.accountNumber,
              ifscCode: formData.routingNumber
            },
            selectedPaymentGateways: formData.selectedPaymentGateways
          }
        })
      };

      await saveOnboardingData(user.uid, onboardingData, false);
      showMessage('Changes saved successfully!', 'success');
      setTimeout(() => router.push('/profile'), 1500);

    } catch (error) {
      console.error('Error saving changes:', error);
      showMessage('Failed to save changes. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-900/20 to-black">
      <CustomCursor />
      {/* Close Button with updated styling */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClose}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white 
                  transition-all duration-200"
      >
        <FiX className="w-5 h-5" />
      </motion.button>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
          initial={{ width: '0%' }}
          animate={{ width: `${(formData.step / 4) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Steps Indicator */}
        <div className="mb-16">
          <div className="flex justify-center items-center space-x-8">
            {steps.map((step) => (
              <motion.div
                key={step.number}
                className={`flex items-center ${
                  formData.step >= step.number ? 'text-white' : 'text-gray-500'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: step.number * 0.2 }}
              >
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    formData.step >= step.number
                      ? 'bg-gradient-to-r from-blue-500 to-emerald-500'
                      : 'bg-gray-800'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  <step.icon className="w-6 h-6" />
                </motion.div>
                <div className="ml-4">
                  <p className="text-sm font-medium">Step {step.number}</p>
                  <p className="text-lg font-semibold">{step.title}</p>
                </div>
                {step.number < steps.length && (
                  <div className="w-24 h-[2px] ml-8 bg-gray-800">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                      initial={{ width: '0%' }}
                      animate={{ width: formData.step > step.number ? '100%' : '0%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode='wait'>
            {formData.step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Personal Information</h2>
                
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    label="First Name"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    required={true}
                    isError={formData.step === 1 && !formData.firstName}
                  />
                  <FormField
                    label="Last Name"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    required={true}
                    isError={formData.step === 1 && !formData.lastName}
                  />
                </div>

                <FormField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  icon={<FiMail className="text-gray-400" />}
                  required={true}
                  isError={formData.step === 1 && !formData.email}
                />

                {/* Business Type Select */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative"
                >
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Business Type
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => updateFormData('businessType', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                             placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 
                             focus:border-transparent transition-all appearance-none"
                  >
                    <option value="" disabled>Select business type</option>
                    {businessTypes.map((type) => (
                      <option key={type.value} value={type.value} className="bg-gray-900">
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-[41px] pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </motion.div>

                {/* Phone Verification Section */}
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1 flex gap-4">
                      {/* Country Code Select */}
                      <div className="w-32">
                        <label className="block text-gray-400 text-sm font-medium mb-2">
                          Country
                        </label>
                        <div className="relative">
                          <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white">
                            +91 India
                          </div>
                        </div>
                      </div>

                      {/* Phone Number Input */}
                      <div className="flex-1">
                        <FormField
                          label="Phone Number"
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            updateFormData('phoneNumber', value);
                          }}
                          icon={<FiPhone className="text-gray-400" />}
                          prefix={formData.countryCode}
                          required={true}
                          isError={formData.step === 1 && !formData.phoneNumber}
                        />
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={sendVerificationCode}
                      disabled={!formData.phoneNumber || formData.isPhoneVerified}
                      className={`px-4 py-2 rounded-lg font-semibold self-end ${
                        formData.isPhoneVerified
                          ? 'bg-emerald-500/50 text-emerald-200 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {formData.isPhoneVerified ? (
                        <span className="flex items-center">
                          Verified <FiCheck className="ml-2" />
                        </span>
                      ) : (
                        'Send Code'
                      )}
                    </motion.button>
                  </div>

                  {showVerificationField && !formData.isPhoneVerified && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-4"
                    >
                      <div className="flex-1">
                        <FormField
                          label="Verification Code"
                          type="text"
                          value={formData.verificationCode}
                          onChange={(e) => updateFormData('verificationCode', e.target.value)}
                          maxLength={6}
                          required={true}
                          isError={formData.step === 1 && !formData.verificationCode}
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={verifyCode}
                        disabled={formData.verificationCode.length !== 6}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold self-end
                                 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Verify
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {formData.step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Website Details</h2>
                
                {/* Website URL Input */}
                <div className="relative">
                  <label className="flex items-center text-gray-400 text-sm font-medium mb-2">
                    Website URL
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <FiGlobe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="url"
                      value={formData.websiteUrl}
                      onChange={(e) => updateFormData('websiteUrl', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pl-12 text-white 
                               placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 
                               focus:border-transparent transition-all"
                      placeholder="https://your-website.com"
                    />
                  </div>
                </div>

                {/* Platform Selection */}
                <div className="space-y-4">
                  <label className="flex items-center text-gray-400 text-sm font-medium">
                    Select Platform
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* WordPress Card */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateFormData('platform', 'wordpress')}
                      className={`cursor-pointer relative p-6 rounded-xl border-2 transition-all
                        ${formData.platform === 'wordpress' 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${
                          formData.platform === 'wordpress' ? 'bg-blue-500' : 'bg-gray-700'
                        }`}>
                          <FaWordpress className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">WordPress</h3>
                          <p className="text-gray-400 text-sm">
                            Ideal for content-driven websites with easy management
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                          ${formData.platform === 'wordpress' 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-500'}`}
                        >
                          {formData.platform === 'wordpress' && (
                            <FiCheck className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Custom Code Card */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateFormData('platform', 'custom')}
                      className={`cursor-pointer relative p-6 rounded-xl border-2 transition-all
                        ${formData.platform === 'custom' 
                          ? 'border-emerald-500 bg-emerald-500/10' 
                          : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${
                          formData.platform === 'custom' ? 'bg-emerald-500' : 'bg-gray-700'
                        }`}>
                          <FiCode className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">Custom Code</h3>
                          <p className="text-gray-400 text-sm">
                            Full flexibility with custom development solutions
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                          ${formData.platform === 'custom' 
                            ? 'border-emerald-500 bg-emerald-500' 
                            : 'border-gray-500'}`}
                        >
                          {formData.platform === 'custom' && (
                            <FiCheck className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* WordPress Provider Selection */}
                  <AnimatePresence mode="wait">
                    {formData.platform === 'wordpress' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 space-y-4"
                      >
                        <label className="flex items-center text-gray-400 text-sm font-medium">
                          WordPress Provider
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {wordpressProviders.map((provider) => (
                            <motion.button
                              key={provider.value}
                              onClick={() => updateFormData('wordpressProvider', provider.value)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`p-4 rounded-xl border-2 transition-all ${
                                formData.wordpressProvider === provider.value
                                  ? 'border-blue-500 bg-blue-500/10'
                                  : 'border-white/10 bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`text-2xl ${provider.color} transition-colors duration-200
                                  ${formData.wordpressProvider === provider.value ? 'opacity-100' : 'opacity-70'}`}>
                                  <provider.icon />
                                </div>
                                <div className="flex-1 text-left">
                                  <p className="text-white font-medium">{provider.label}</p>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                  ${formData.wordpressProvider === provider.value
                                    ? 'border-blue-500 bg-blue-500'
                                    : 'border-gray-500'
                                  }`}
                                >
                                  {formData.wordpressProvider === provider.value && (
                                    <FiCheck className="w-3 h-3 text-white" />
                                  )}
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>

                        {/* Provider Details */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20"
                        >
                          <div className="flex items-start space-x-3">
                            <FiStar className="text-blue-400 mt-1" />
                            <p className="text-sm text-gray-300">
                              {formData.wordpressProvider
                                ? `Selected ${wordpressProviders.find(p => p.value === formData.wordpressProvider)?.label} 
                                   as your WordPress provider. We'll customize our solutions accordingly.`
                                : 'Select a provider to continue with WordPress setup'}
                            </p>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {formData.step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Courier Service Integration</h2>
                
                {/* Pickup Location Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-xl text-white">
                    <FiMapPin className="text-blue-400" />
                    <h3 className="font-semibold">Pickup Location</h3>
                  </div>
                  
                  <div className="p-6 bg-white/5 rounded-xl border border-white/10 space-y-6">
                    {/* Phone Number Section */}
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-1 flex gap-4">
                          {/* Country Code Select */}
                          <div className="w-32">
                            <label className="block text-gray-400 text-sm font-medium mb-2">
                              Country
                            </label>
                            <div className="relative">
                              <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white">
                                +91 India
                              </div>
                            </div>
                          </div>

                          {/* Phone Number Input - Now Editable */}
                          <div className="flex-1">
                            <FormField
                              label="Phone Number"
                              type="tel"
                              value={formData.pickupPhoneNumber}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                updateFormData('pickupPhoneNumber', value);
                              }}
                              icon={<FiPhone className="text-gray-400" />}
                              prefix={formData.pickupCountryCode}
                              disabled={true} // Make it disabled to show it's using verified number
                              note="Using verified contact number from Step 1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Existing Address Fields */}
                    <FormField
                      label="Street Address"
                      type="text"
                      value={formData.pickupAddress}
                      onChange={(e) => updateFormData('pickupAddress', e.target.value)}
                      icon={<FiMapPin className="text-gray-400" />}
                    />

                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        label="City"
                        type="text"
                        value={formData.pickupCity}
                        onChange={(e) => updateFormData('pickupCity', e.target.value)}
                      />
                      <FormField
                        label="State/Province"
                        type="text"
                        value={formData.pickupState}
                        onChange={(e) => updateFormData('pickupState', e.target.value)}
                      />
                    </div>

                    <FormField
                      label="ZIP/Postal Code"
                      type="text"
                      value={formData.pickupZip}
                      onChange={(e) => updateFormData('pickupZip', e.target.value)}
                    />

                    <div className="space-y-2">
                      <label className="block text-gray-400 text-sm font-medium">
                        Special Instructions
                      </label>
                      <motion.textarea
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        value={formData.pickupInstructions}
                        onChange={(e) => updateFormData('pickupInstructions', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                                 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                 focus:border-transparent transition-all min-h-[100px]"
                        placeholder="Add any special instructions for pickup (e.g., access codes, preferred entrance, etc.)"
                      />
                    </div>
                  </div>
                </div>

                {/* Existing Courier Services Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-xl text-white">
                    <FiTruck className="text-blue-400" />
                    <h3 className="font-semibold">Select Courier Services</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {courierServices.map((courier) => (
                      <motion.div
                        key={courier.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleCourierSelection(courier.id)}
                        className={`cursor-pointer relative p-6 rounded-xl border-2 transition-all
                          ${formData.selectedCouriers.includes(courier.id)
                            ? 'border-blue-500 bg-blue-500/10' 
                            : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`p-4 rounded-lg bg-gradient-to-r ${courier.color}`}>
                            <courier.icon className="w-6 h-6 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-white">{courier.name}</h3>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                ${formData.selectedCouriers.includes(courier.id)
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-500'}`}
                              >
                                {formData.selectedCouriers.includes(courier.id) && (
                                  <FiCheck className="w-3 h-3 text-white" />
                                )}
                              </div>
                            </div>
                            
                            <p className="text-gray-400 mt-2">{courier.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mt-4">
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
                      </motion.div>
                    ))}
                  </div>

                  {formData.selectedCouriers.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20"
                    >
                      <div className="flex items-start space-x-3">
                        <FiTruck className="text-blue-400 mt-1" />
                        <p className="text-sm text-gray-300">
                          Selected {formData.selectedCouriers.length} courier service(s).
                          We'll help you integrate these services into your website.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {formData.step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Payment Integration</h2>
                
                {/* Bank Details Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-xl text-white">
                    <FiDollarSign className="text-blue-400" />
                    <h3 className="font-semibold">Bank Account Details</h3>
                  </div>
                  
                  <div className="p-6 bg-white/5 rounded-xl border border-white/10 space-y-6">
                    <FormField
                      label="Account Holder Name"
                      type="text"
                      value={formData.accountHolderName}
                      onChange={(e) => updateFormData('accountHolderName', e.target.value)}
                      icon={<FiUser className="text-gray-400" />}
                      required={true}
                      isError={formData.step === 4 && !formData.accountHolderName}
                    />

                    <FormField
                      label="Bank Name"
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => updateFormData('bankName', e.target.value)}
                      icon={<FiHome className="text-gray-400" />}
                      required={true}
                      isError={formData.step === 4 && !formData.bankName}
                    />

                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        label="Account Number"
                        type="text"
                        value={formData.accountNumber}
                        onChange={(e) => updateFormData('accountNumber', e.target.value)}
                        icon={<FiHash className="text-gray-400" />}
                        required={true}
                        isError={formData.step === 4 && !formData.accountNumber}
                      />
                      <FormField
                        label="IFSC Code"
                        type="text"
                        value={formData.routingNumber}
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase(); // Convert to uppercase
                          updateFormData('routingNumber', value);
                        }}
                        icon={<FiKey className="text-gray-400" />}
                        maxLength={11} // IFSC codes are 11 characters long
                        required={true}
                        isError={formData.step === 4 && !formData.routingNumber}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Gateway Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-xl text-white">
                    <FiCreditCard className="text-blue-400" />
                    <h3 className="font-semibold">Payment Gateway Integration</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {paymentGateways.map((gateway) => (
                      <motion.div
                        key={gateway.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => togglePaymentGateway(gateway.id)}
                        className={`cursor-pointer relative p-6 rounded-xl border-2 transition-all
                          ${formData.selectedPaymentGateways.includes(gateway.id)
                            ? 'border-blue-500 bg-blue-500/10' 
                            : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`p-4 rounded-lg bg-gradient-to-r ${gateway.color}`}>
                            <gateway.icon className="w-6 h-6 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-white">{gateway.name}</h3>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                ${formData.selectedPaymentGateways.includes(gateway.id)
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-500'}`}
                              >
                                {formData.selectedPaymentGateways.includes(gateway.id) && (
                                  <FiCheck className="w-3 h-3 text-white" />
                                )}
                              </div>
                            </div>
                            
                            <p className="text-gray-400 mt-2">{gateway.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mt-4">
                              {gateway.features.map((feature, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-300"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>

                            {/* Replace the API Credentials Section inside payment gateway map function */}
                            {formData.selectedPaymentGateways.includes(gateway.id) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-6 pt-6 border-t border-white/10"
                              >
                                <p className="text-sm text-blue-400">
                                  Selected for integration. Our team will guide you through the setup process.
                                </p>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 95 }}
              className={`px-8 py-4 rounded-lg font-semibold ${
                formData.step > 1
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'opacity-50 cursor-not-allowed bg-gray-800 text-gray-500'
              }`}
              onClick={isEditMode ? () => router.push('/profile') : prevStep}
              disabled={!isEditMode && formData.step === 1}
            >
              {isEditMode ? 'Cancel' : 'Previous'}
            </motion.button>

            <div className="flex gap-4">
              {!isEditMode && (formData.step === 3 || formData.step === 4) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 text-white hover:bg-white/20 rounded-lg font-semibold"
                  onClick={() => nextStep(true)}
                >
                  Skip this step
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg font-semibold"
                onClick={isEditMode ? handleEditSave : () => nextStep(false)}
              >
                {isEditMode ? (
                  <span className="flex items-center">
                    Save Changes <FiCheck className="ml-2" />
                  </span>
                ) : formData.step === 4 ? (
                  <span className="flex items-center">
                    Complete <FiCheck className="ml-2" />
                  </span>
                ) : (
                  'Next'
                )}
              </motion.button>
            </div>
          </div>

          {/* Add Terms & Privacy Section at the bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center text-sm text-gray-400"
          >
            <p className="mb-2">
              By continuing, you agree to our{' '}
              <Link 
                href="/terms" 
                className="text-blue-400 hover:text-blue-300 underline"
                target="_blank"
              >
                Terms & Conditions
              </Link>
              {' '}and{' '}
              <Link 
                href="/privacy" 
                className="text-blue-400 hover:text-blue-300 underline"
                target="_blank"
              >
                Privacy Policy
              </Link>
            </p>
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Your Company Name. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.1),rgba(16,185,129,0.1))]" />
      </div>

      {/* Overlay Message */}
      <OverlayMessage
        message={message.text}
        type={message.type}
        isVisible={message.visible}
        onClose={() => setMessage(prev => ({ ...prev, visible: false }))}
      />

      {/* Close Confirmation Dialog */}
      <CloseConfirmation
        isOpen={showCloseConfirmation}
        onConfirm={confirmClose}
        onCancel={() => setShowCloseConfirmation(false)}
      />
    </div>
  );
}

// Add this before the FormField component
interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  maxLength?: number;
  prefix?: string;
  disabled?: boolean;
  note?: string;
  required?: boolean;
  isError?: boolean;
}

// Update FormField component
function FormField({ 
  label, 
  type, 
  value, 
  onChange, 
  icon, 
  prefix, 
  maxLength, 
  disabled, 
  note,
  required = false,
  isError = false
}: FormFieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <label className="block text-gray-400 text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {prefix && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {prefix}
          </div>
        )}
        {icon && !prefix && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full bg-white/5 border ${
            isError ? 'border-red-500' : 'border-white/10'
          } rounded-lg px-4 py-3 text-white 
          placeholder-gray-500 focus:outline-none focus:ring-2 ${
            isError ? 'focus:ring-red-500' : 'focus:ring-blue-500'
          } 
          focus:border-transparent transition-all ${prefix ? 'pl-16' : icon ? 'pl-12' : ''}`}
          placeholder={`Enter your ${label.toLowerCase()}`}
          maxLength={maxLength}
          disabled={disabled}
        />
        {isError && (
          <p className="text-red-500 text-xs mt-1">This field is required</p>
        )}
      </div>
      {note && (
        <p className="text-xs text-gray-500 mt-1">{note}</p>
      )}
    </motion.div>
  );
}
