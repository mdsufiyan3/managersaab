'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  RiHomeLine, RiTBoxLine, RiHistoryLine,
  RiUserLine, RiLogoutBoxLine, RiTruckLine,
  RiWalletLine
} from 'react-icons/ri';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sidebarNavigation = [
  { icon: RiHomeLine, label: 'Home', href: '/home' },
  { icon: RiTBoxLine, label: 'Dashboard', href: '/dashboard' },
  { icon: RiTBoxLine, label: 'Products', href: '/product' },
  { icon: RiTruckLine, label: 'Orders', href: '/order' },
  { icon: RiHistoryLine, label: 'Payment History', href: '/payment' },
  { icon: RiWalletLine, label: 'Wallet', href: '/wallet' },
];

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const sidebarWidth = isExpanded ? 'w-48' : 'w-16';

  const handleProfileClick = () => {
    router.push('/profile');
  };

  return (
    <aside 
      className={`fixed left-0 top-0 bottom-0 ${sidebarWidth} bg-black/30 backdrop-blur-xl border-r border-white/10 z-40 transition-all duration-300`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Brand Logo Section */}
      <div className="flex items-center px-3 h-14 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image
              src="/icons/das1.png"
              alt="Home Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className={`text-white font-bold transition-opacity duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          }`}>
            Home
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="overflow-y-auto h-[calc(100%-3.5rem)]">
        <nav className="px-2 py-2 space-y-2.5">
          {sidebarNavigation.map((item, index) => (
            <>
              <motion.a
                key={index}
                href={item.href}
                whileHover={{ x: 2 }}
                className={`flex items-center space-x-2.5 px-3 py-2 text-xs rounded-lg transition-colors overflow-hidden ${
                  activeSection === item.href.replace('/', '')
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
                onClick={() => onSectionChange(item.href.replace('/', ''))}
              >
                <item.icon className="text-base min-w-[20px]" />
                <span className={`whitespace-nowrap transition-opacity duration-300 ${
                  isExpanded ? 'opacity-100' : 'opacity-0'
                }`}>
                  {item.label}
                </span>
              </motion.a>
              {index === 0 && (
                <div className="mx-2 border-t border-white/10" />
              )}
            </>
          ))}
        </nav>
      </div>

      {/* User Profile - Updated with onClick handler */}
      <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-white/10">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center space-x-2 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 overflow-hidden cursor-pointer"
          onClick={handleProfileClick}
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
  );
}
