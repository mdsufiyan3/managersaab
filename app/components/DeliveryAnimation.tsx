'use client';

import { motion } from 'framer-motion';
import { 
  RiTBoxLine, RiTruckLine, RiMapPinLine, RiStore2Line, 
  RiHomeLine, RiSvelteLine, RiCloudLine, RiCheckboxCircleLine, 
  RiParentFill 
} from 'react-icons/ri';

export default function DeliveryAnimation() {
  const deliverySteps = [
    { 
      icon: RiParentFill, 
      status: 'Payment confirmed', 
      color: 'bg-purple-500',
      shadowColor: 'rgba(168,85,247,0.5)',
      textColor: 'text-purple-400'
    },
    { 
      icon: RiMapPinLine, 
      status: 'Pickup', 
      color: 'bg-blue-500',
      shadowColor: 'rgba(59,130,246,0.5)',
      textColor: 'text-blue-400'
    },
    { 
      icon: RiTruckLine, 
      status: 'In Transit', 
      color: 'bg-amber-500',
      shadowColor: 'rgba(245,158,11,0.5)',
      textColor: 'text-amber-400'
    },
    { 
      icon: RiCheckboxCircleLine, 
      status: 'Delivered', 
      color: 'bg-emerald-500',
      shadowColor: 'rgba(16,185,129,0.5)',
      textColor: 'text-emerald-400'
    }
  ];

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-b from-transparent to-black/20 rounded-xl backdrop-blur-sm p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Grid */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, #4f46e5 1px, transparent 1px),
                             linear-gradient(to bottom, #4f46e5 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
          animate={{
            x: [-50, 0],
            y: [-50, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
        />

        {/* Floating Clouds */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ x: "-20%", y: 50 + i * 30 }}
            animate={{ x: "120%" }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              delay: i * 2,
            }}
          >
            <RiCloudLine className="text-white/5 text-6xl" />
          </motion.div>
        ))}
      </div>

      {/* Satellite Animation */}
      <motion.div
        className="absolute right-10 top-10"
        animate={{
          y: [0, -10, 0],
          rotate: 360,
        }}
        transition={{
          y: { duration: 2, repeat: Infinity },
          rotate: { duration: 10, repeat: Infinity },
        }}
      >
        <RiSvelteLine className="text-blue-500/50 text-3xl" />
      </motion.div>

      {/* Main Delivery Path */}
      <div className="relative mt-20">
        {/* Curved Path */}
        <svg className="absolute w-full h-[200px]" viewBox="0 0 1000 200">
          <motion.path
            d="M0,100 Q250,180 500,100 T1000,100"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>

        {/* Animated Truck along path */}
        <motion.div
          className="absolute top-[70px]"
          initial={{ x: "-10%" }}
          animate={{ x: "110%" }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            animate={{ 
              y: [-2, 2, -2],
              rotate: [0, -5, 0, 5, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
            }}
            className="relative"
          >
            {/* Truck Shadow */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-black/30 blur-md rounded-full" />
            <RiTruckLine className="text-5xl text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            
            {/* Particle Effects */}
            <motion.div
              className="absolute -right-4 top-1/2 flex gap-1"
              animate={{ x: [-10, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-blue-400/50" />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Buildings */}
        <div className="absolute bottom-0 left-0 flex items-end h-32">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 80 }}
            transition={{ duration: 1 }}
            className="w-16 mx-2 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg relative group"
          >
            <RiStore2Line className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/50 text-2xl" />
          </motion.div>
        </div>

        <div className="absolute bottom-0 right-0 flex items-end h-32">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 60 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-16 mx-2 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg relative group"
          >
            <RiHomeLine className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/50 text-2xl" />
          </motion.div>
        </div>

        {/* Floating Packages */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ x: "90%", y: "50%", opacity: 0, scale: 0 }}
            animate={{
              x: ["90%", "50%", "10%"],
              y: ["50%", "0%", "50%"],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              delay: i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative"
            >
              <RiTBoxLine className="text-3xl text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              {/* Package Glow Effect */}
              <div className="absolute inset-0 bg-emerald-500 filter blur-xl opacity-30 animate-pulse" />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Status Indicators with Enhanced Design */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-12">
        {deliverySteps.map((step, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            {/* Connection Line - Modified to extend full width */}
            {i < deliverySteps.length - 1 && (
              <div className="absolute h-[2px] bg-gradient-to-r from-current to-gray-800 w-[100%] left-[50%] top-[22px] -z-10" />
            )}

            {/* Icon Circle */}
            <motion.div
              className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center relative group`}
              whileHover={{ scale: 1.1 }}
              animate={{ 
                boxShadow: [
                  `0 0 0 ${step.shadowColor}`,
                  `0 0 20px ${step.shadowColor}`,
                  `0 0 0 ${step.shadowColor}`
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Icon */}
              <step.icon className="text-white text-xl" />
              
              {/* Pulse Effect */}
              <motion.div
                className={`absolute inset-0 rounded-full ${step.color} opacity-30`}
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* Status Text */}
            <motion.span 
              className={`mt-3 text-sm font-medium ${step.textColor}`}
              whileHover={{ scale: 1.05 }}
            >
              {step.status}
            </motion.span>

            {/* Progress Dot */}
            <motion.div
              className={`w-2 h-2 rounded-full ${step.color} mt-2`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
