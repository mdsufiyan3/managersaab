'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  FaSearch, FaUser, FaGlobe, FaTruck, FaBox, FaClock, 
  FaMoneyBillWave, FaStar, FaShieldAlt, FaComments,
  FaMapMarkerAlt, FaCalendarAlt, FaWeightHanging,
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn
} from 'react-icons/fa';
import ImagePoster from './components/ImagePoster';
import VerticalDrivenScroll from './components/VerticalDrivenScroll';
import DeliveryAnimation from './components/DeliveryAnimation';
import HorizontalScrollGallery from './components/HorizontalScrollGallery';
import Bubbles from './components/Bubbles';
import CustomCursor from './components/CustomCursor';

// Navigation Items
const navItems = ['Home', 'Services', 'Pricing', 'Track Order', 'Support'];

// Courier Services Data
const courierServices = [
  {
    name: "Express Courier",
    logo: "/courier1.png",
    deliveryTime: "1-2 days",
    price: "$25.99",
    type: "Express",
    rating: 4.8
  },
  // ... Add more courier services
];

// Features Data
const features = [
  {
    icon: FaClock,
    title: "Instant Quotes",
    description: "Get real-time pricing from multiple carriers"
  },
  {
    icon: FaTruck,
    title: "Multiple Carriers",
    description: "Compare services from leading courier companies"
  },
  // ... Add more features
];

const heroImages = [
  '/images/courier1.jpg',
  '/images/courier2.jpg',
  '/images/courier3.jpg'
];

export default function CourierPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-900/20 to-black">
      <CustomCursor />
      <Bubbles /> {/* Add this line after the opening div */}
      
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950">
        {/* Animated background elements */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-blue-950/50" /> {/* Added dark blue overlay */}
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-pink-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-white/10 rounded-full animate-pulse-slow"></div>
          <div className="absolute top-1/3 right-1/4 w-32 h-32 border border-white/5 rounded-full animate-pulse-slow animation-delay-1000"></div>
          
          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-[10%] w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg rotate-12 animate-float-slow"></div>
          <div className="absolute bottom-32 right-[15%] w-16 h-16 bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 rounded-full animate-float-slow animation-delay-2000"></div>
          <div className="absolute top-1/2 left-[80%] w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-md rotate-45 animate-float-slow animation-delay-1500"></div>
          
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left content - Flipping Card */}
            <div className="w-full lg:w-1/2 order-2 lg:order-2">
              <div className="relative perspective-1200 h-[400px]">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative w-full h-full preserve-3d"
                >
                  {/* Flipping Card */}
                  <motion.div
                    className="absolute inset-0 w-full h-full preserve-3d"
                    animate={{ 
                      rotateY: [0, 90, 90, 180, 180, 270, 270, 360],
                    }}
                    transition={{ 
                      duration: 16, // Adjusted duration for smoother rotation
                      repeat: Infinity,
                      ease: "linear",
                      times: [0, 0.2, 0.25, 0.45, 0.5, 0.7, 0.75, 1], // Adjusted timing for 4 panels
                    }}
                  >
                    {[
                      "/20f2cb7fc8af471a9a1abd18dd6a3371.webp",
                      "/52af1aba864e4c1698bbbc33f5bbbd79.webp",
                      "/11758be325784ce5a7ac54df9abc4202.webp",
                      "/27e8d66c924747a28615155a9bd16466.webp"
                    ].map((image, index) => (
                      <motion.div
                        key={index}
                        className="absolute inset-0 w-full h-full backface-hidden"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: `rotateY(${index * 90}deg) translateZ(250px)` // Changed from 60 to 90 degrees
                        }}
                      >
                        <div className="relative w-full h-full bg-gradient-to-br from-blue-600/90 to-cyan-600/90 rounded-xl overflow-hidden">
                          {/* Image */}
                          <div className="absolute inset-0">
                            <Image
                              src={image}
                              alt={`Slide ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
                          </div>

                          {/* Content Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-xl font-bold text-white mb-1">
                              {index === 0 ? "Logistics for the Digital Era" : `Feature ${index + 1}`}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <motion.div
                                className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                              <span className="text-cyan-400 text-xs">Active</span>
                            </div>
                          </div>

                          {/* Glowing Effect */}
                          <motion.div
                            className="absolute inset-0 opacity-0"
                            animate={{
                              opacity: [0, 0.2, 0],
                              transition: {
                                duration: 2,
                                repeat: Infinity,
                                delay: index * 0.5
                              }
                            }}
                            style={{
                              background: "radial-gradient(circle at center, rgba(56, 189, 248, 0.3) 0%, transparent 70%)"
                            }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Reflection Effect */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent transform-gpu" />
                </motion.div>

                {/* Control Panel */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white text-sm font-medium"
                  >
                    View Details
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium"
                  >
                    Learn More
                  </motion.button>
                </div>
              </div>
            </div>
            
            {/* Right content - Text and CTA */}
            <div className="w-full lg:w-1/2 order-1 lg:order-1 text-center lg:text-right">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-6">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-blue-300 text-sm font-medium">Next-Gen Logistics</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight"> {/* Modified text sizes here */}
                Logistics for the <span className="relative">
                  <span className="relative z-10">Digital Era</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-50 z-0"></span>
                </span>
              </h1>
              
              <p className="text-lg text-white/80 mb-8 max-w-xl ml-auto"> {/* Also reduced paragraph text size */}
                Experience the future of shipping with AI-powered logistics and real-time tracking solutions.
              </p>
              
              {/* Rest of the content remains the same */}
            </div>
          </div>
        </div>
        
        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-16" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white" />
          </svg>
        </div>
      </section>

      <section className="relative min-h-screen pt-20">
        {/* Removed header section */}
        {/* Removed heading section */}

        {/* Existing Hero Content */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            className="absolute inset-0 grid grid-cols-3 gap-2 p-2"
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -100, opacity: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: 0.3,
                  transition: { delay: i * 0.1, duration: 0.8 }
                }}
                className="h-32 bg-blue-500/10 rounded-lg backdrop-blur-sm"
              />
            ))}
          </motion.div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center pt-20">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block"
              >
                <span className="px-4 py-2 bg-blue-500/10 rounded-full text-blue-400 text-sm font-semibold mb-6 inline-block">
                  #1 Courier Service Aggregator
                </span>
              </motion.div>

              <motion.h1 
                className="text-4xl md:text-6xl font-bold leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Ship <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Smarter</span>
                <br />
                Deliver <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Faster</span>
              </motion.h1>

              <motion.p
                className="text-xl text-gray-300 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Compare prices and book services from the world's leading courier companies.
                Save time and money with our instant quote comparison.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                >
                  Get Started
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all backdrop-blur-sm"
                >
                  Learn More
                </motion.button>
              </motion.div>

              {/* Statistics */}
              <motion.div
                className="grid grid-cols-3 gap-4 mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                {[
                  { number: "50K+", label: "Active Users" },
                  { number: "100+", label: "Courier Partners" },
                  { number: "99%", label: "Success Rate" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <motion.h3
                      className="text-3xl font-bold text-blue-400"
                      whileHover={{ scale: 1.1 }}
                    >
                      {stat.number}
                    </motion.h3>
                    <p className="text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Add the animation above the form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <DeliveryAnimation />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6"
              >
                <form className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Pickup Location</label>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          className="w-full pl-10 pr-4 py-3 bg-white/5 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter pickup address"
                        />
                      </div>
                    </div>
                    {/* Add more form fields similarly */}
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-emerald-600 transition-all"
                  >
                    Get Quotes
                  </button>
                </form>
              </motion.div>
            </motion.div>
            </div>
          </div>
  
        </section>
  
          {/* Floating Elements */}
          <motion.div
          animate={{ 
            y: [0, -20, 0],
            transition: { 
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut"
            }
          }}
          className="absolute right-10 top-40 w-20 h-20 bg-blue-500/20 rounded-full backdrop-blur-lg"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            transition: { 
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut"
            }
          }}
          className="absolute left-10 bottom-40 w-16 h-16 bg-emerald-500/20 rounded-full backdrop-blur-lg"
        />

      {/* Replacing the old hero section with a new unique design */}
      {/* New Section with Hero Content */}
      <style global jsx>{`
        body {
            font-family: 'Inter', sans-serif;
        }
        
        /* Existing styles... */
        
        /* New styles for 3D cube */
        .perspective-1000 {
            perspective: 1000px;
        }
        .preserve-3d {
            transform-style: preserve-3d;
        }
        .cube-face {
            backface-visibility: hidden;
        }
        .translate-z-[200px] {
            transform: translateZ(200px);
        }
        .translate-z-[-200px] {
            transform: translateZ(-200px);
        }
        .rotate-y-90 {
            transform: rotateY(90deg);
        }
        .rotate-y-[-90deg] {
            transform: rotateY(-90deg);
        }
        .rotate-y-180 {
            transform: rotateY(180deg);
        }
        
        /* Animation keyframes */
        @keyframes rotateSlow {
            0% { transform: rotateY(0) rotateX(0); }
            25% { transform: rotateY(90deg) rotateX(10deg); }
            50% { transform: rotateY(180deg) rotateX(0); }
            75% { transform: rotateY(270deg) rotateX(-10deg); }
            100% { transform: rotateY(360deg) rotateX(0); }
        }
        
        @keyframes floatSlow {
            0% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-20px) rotate(5deg); }
            100% { transform: translateY(0) rotate(0); }
        }
        
        @keyframes pulseSlow {
            0% { opacity: 0.3; transform: scale(0.95); }
            50% { opacity: 0.5; transform: scale(1); }
            100% { opacity: 0.3; transform: scale(0.95); }
        }
        
        .animate-rotate-slow {
            animation: rotateSlow 20s infinite linear;
        }
        
        .animate-float-slow {
            animation: floatSlow 6s infinite ease-in-out;
        }
        
        .animate-pulse-slow {
            animation: pulseSlow 4s infinite ease-in-out;
        }
        
        .animation-delay-1000 {
            animation-delay: 1s;
        }
        
        .animation-delay-1500 {
            animation-delay: 1.5s;
        }
        
        .animation-delay-2000 {
            animation-delay: 2s;
        }
        
        /* Pause animation on hover */
        .scene:hover .cube {
            animation-play-state: paused;
        }
        
        /* Existing styles... */

        .bg-grid-blue\/10 {
          background-image: linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      
        @keyframes grid-flow {
          0% { background-position: 0 0; }
          100% { background-position: 20px 20px; }
        }
      
        .animate-grid-flow {
          animation: grid-flow 2s linear infinite;
        }
      
        .perspective-1200 {
          perspective: 1200px;
        }
      `}</style>

      

      {/* Service Showcase Section */}
      <section className="relative min-h-screen py-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Services</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Explore our comprehensive delivery solutions
          </p>
        </motion.div>

        <VerticalDrivenScroll />
      </section>

      {/* Move HorizontalScrollGallery here, right after Services section */}
      <section className="relative pb-0"> {/* Changed from className="relative" */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 pt-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Global Network</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Explore our worldwide logistics infrastructure and capabilities
          </p>
        </motion.div>
        <HorizontalScrollGallery />
      </section>

      {/* Our Services & Solutions Portfolio Section */}
      <section className="relative pt-0"> {/* Changed from className="relative min-h-screen py-20" */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Services</span> & Solutions
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Comprehensive logistics solutions for your business needs
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4">
          {[
            {
              title: "International Air Freight",
              description: "Fast and reliable air freight services across the globe. We ensure your cargo reaches its destination safely and on time.",
              features: ["Door-to-door delivery", "Express services available", "Real-time tracking"],
              image: "/27e8d66c924747a28615155a9bd16466.webp",
              gradient: "from-blue-500 to-indigo-500"
            },
            {
              title: "Ocean Freight Solutions",
              description: "Cost-effective ocean freight services for your large shipments. FCL and LCL options available.",
              features: ["Container shipping", "Port-to-port service", "Customs clearance"],
              image: "/images/ocean-freight.jpg",
              gradient: "from-emerald-500 to-teal-500"
            },
            {
              title: "Ground Transportation",
              description: "Efficient ground transportation network covering major routes. Perfect for domestic shipments.",
              features: ["Nationwide coverage", "Same-day delivery", "Temperature-controlled"],
              image: "/images/ground-transport.jpg",
              gradient: "from-purple-500 to-pink-500"
            },
            {
              title: "Express Courier Services",
              description: "Ultra-fast delivery solutions for time-critical shipments. Perfect for urgent documents and packages.",
              features: ["Same-day delivery", "Priority handling", "Live tracking"],
              image: "/images/express-courier.jpg",
              gradient: "from-pink-500 to-rose-500"
            },
            {
              title: "Payment Gateway Integration",
              description: "Seamless integration with multiple payment gateways to provide your customers with diverse payment options.",
              features: ["Multiple gateway support", "Secure transactions", "Real-time processing"],
              image: "/images/payment-gateway.jpg",
              gradient: "from-violet-500 to-purple-500"
            },
            {
              title: "Global Payment Solutions",
              description: "Accept payments from anywhere in the world with our comprehensive international payment processing system.",
              features: ["Multi-currency support", "Cross-border transactions", "Competitive rates"],
              image: "/images/global-payment.jpg",
              gradient: "from-fuchsia-500 to-pink-500"
            },
            {
              title: "Smart Payment Routing",
              description: "Intelligent payment routing system that automatically selects the most optimal payment gateway for each transaction.",
              features: ["Dynamic routing", "Failure protection", "Cost optimization"],
              image: "/images/smart-routing.jpg",
              gradient: "from-rose-500 to-red-500"
            }
          ].map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 items-center mb-32`}
            >
              {/* Content */}
              <div className="flex-1 space-y-6">
                <motion.h3
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-3xl font-bold text-white"
                >
                  {service.title}
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-gray-300 text-lg"
                >
                  {service.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="space-y-4"
                >
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                        className={`w-5 h-5 rounded-full bg-gradient-to-r ${service.gradient} flex items-center justify-center`}
                      >
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className={`px-8 py-4 bg-gradient-to-r ${service.gradient} text-white rounded-lg font-semibold mt-8`}
                >
                  Learn More
                </motion.button>
              </div>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="flex-1 relative"
              >
                <div className="relative h-[400px] w-full rounded-2xl overflow-hidden group">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-30 mix-blend-overlay`} />
                  
                  {/* Floating Elements */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      background: [
                        `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
                        `radial-gradient(circle at 70% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
                      ],
                    }}
                    transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                  />
                </div>

                {/* Decorative Elements */}
                <motion.div
                  className={`absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-r ${service.gradient} rounded-full blur-3xl opacity-30`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4-Image Blog Template Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Updates</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Stay informed about our latest services and industry insights
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Revolutionizing Global Logistics",
                description: "Discover how AI-powered solutions are transforming the shipping industry",
                image: "/27e8d66c924747a28615155a9bd16466.webp",
                category: "Technology",
                readTime: "5 min read",
                gradient: "from-blue-500 to-indigo-500"
              },
              {
                title: "Sustainable Shipping Solutions",
                description: "Exploring eco-friendly alternatives in modern logistics",
                image: "/27e8d66c924747a28615155a9bd16466.webp",
                category: "Sustainability",
                readTime: "4 min read",
                gradient: "from-emerald-500 to-green-500"
              },
              {
                title: "Supply Chain Innovation",
                description: "Breaking down the latest trends in supply chain management",
                image: "/27e8d66c924747a28615155a9bd16466.webp",
                category: "Innovation",
                readTime: "6 min read",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                title: "Future of Last-Mile Delivery",
                description: "How autonomous vehicles are reshaping local deliveries",
                image: "/27e8d66c924747a28615155a9bd16466.webp",
                category: "Future Tech",
                readTime: "7 min read",
                gradient: "from-orange-500 to-red-500"
              }
            ].map((blog, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative h-[300px] rounded-2xl overflow-hidden">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${blog.gradient} opacity-60 mix-blend-overlay`} />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white">
                        {blog.category}
                      </span>
                      <span className="text-gray-300 text-sm">
                        {blog.readTime}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-300">
                      {blog.description}
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 inline-flex items-center text-white group-hover:text-blue-400 transition-colors"
                    >
                      Read More
                      <svg
                        className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </motion.button>
                  </div>
                </div>

                {/* Hover Effects */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                  whileHover={{
                    boxShadow: `0 0 30px rgba(59,130,246,0.5)`
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
            >
              View All Articles
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Big Image Poster Section */}
      <section className="relative min-h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.2, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <Image
            src="/27e8d66c924747a28615155a9bd16466.webp"
            alt="Logistics Network"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 py-32 min-h-screen flex items-center">
          <motion.div
            className="max-w-2xl"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <span className="px-4 py-2 bg-blue-500/10 rounded-full text-blue-400 text-sm font-semibold mb-6 inline-block">
              Global Logistics Solutions
            </span>
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              Transform Your 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                {" "}Shipping Experience
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of businesses that trust us with their global logistics needs.
              Experience seamless shipping across borders with our innovative solutions.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg font-semibold"
              >
                Get Started Today
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 text-white rounded-lg font-semibold backdrop-blur-sm"
              >
                Contact Sales
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16">
              {[
                { value: "2M+", label: "Deliveries" },
                { value: "150+", label: "Countries" },
                { value: "24/7", label: "Support" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background: 'linear-gradient(to top, rgb(0,0,0), transparent)'
          }}
        />
      </section>
      
      {/* Footer Section */}
      <footer className="relative bg-gradient-to-t from-black to-black/50 backdrop-blur-lg pt-32 pb-10 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <motion.div
            className="absolute h-[1000px] w-[1000px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
              top: "-20%",
              left: "-20%"
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute h-[800px] w-[800px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)",
              bottom: "-10%",
              right: "-10%"
            }}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        {/* Add footer content here */}

        <div className="max-w-7xl mx-auto px-4 relative">
          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            {/* Company Info */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  CourierHub
                </h3>
                <p className="text-gray-400 mt-4 leading-relaxed">
                  Revolutionizing global logistics with innovative shipping solutions for the modern world.
                </p>
              </motion.div>

              {/* Social Links */}
              <motion.div 
                className="flex space-x-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {[FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ y: -4, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/10 to-emerald-500/10 
                             backdrop-blur-sm flex items-center justify-center hover:from-blue-500 hover:to-emerald-500 
                             transition-all duration-300 group"
                  >
                    <Icon className="text-gray-400 text-xl group-hover:text-white transition-colors" />
                  </motion.button>
                ))}
              </motion.div>
            </div>

            {/* Quick Links */}
            <div className="lg:pl-8">
              <h4 className="text-lg font-semibold text-white mb-8 relative">
                Quick Links
                <motion.span 
                  className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-emerald-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: 48 }}
                  transition={{ duration: 0.8 }}
                />
              </h4>
              <ul className="space-y-4">
                {['About Us', 'Services', 'Track Package', 'Support', 'Blog'].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center"
                  >
                    <motion.span
                      className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 mr-3"
                      whileHover={{ scale: 1.5 }}
                    />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-8 relative">
                Contact Info
                <motion.span 
                  className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-emerald-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: 48 }}
                  transition={{ duration: 0.8 }}
                />
              </h4>
              <ul className="space-y-6">
                {[
                  { icon: FaMapMarkerAlt, text: "123 Shipping Street, Logistics City", color: "from-blue-500 to-indigo-500" },
                  { icon: FaUser, text: "+1 234 567 8900", color: "from-indigo-500 to-purple-500" },
                  { icon: FaWeightHanging, text: "support@courierhub.com", color: "from-purple-500 to-pink-500" }
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex items-center group cursor-pointer"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mr-4`}
                    >
                      <item.icon className="text-white text-lg" />
                    </motion.div>
                    <span className="text-gray-400 group-hover:text-white transition-colors">
                      {item.text}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-8 relative">
                Newsletter
                <motion.span 
                  className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-emerald-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: 48 }}
                  transition={{ duration: 0.8 }}
                />
              </h4>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                <p className="text-gray-400">
                  Subscribe to receive future updates
                </p>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3 bg-white/5 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-2 top-2 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-md font-semibold text-sm"
                  >
                    Join
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-gray-400"
              >
                © 2024 CourierHub. All rights reserved.
              </motion.p>
              <div className="flex flex-wrap justify-center gap-6">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    whileHover={{ color: '#60A5FA', y: -2 }}
                    className="text-gray-400 hover:text-white transition-all"
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
