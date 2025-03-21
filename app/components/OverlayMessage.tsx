'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { FiX, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

interface OverlayMessageProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
}

export default function OverlayMessage({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  autoClose = true 
}: OverlayMessageProps) {
  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, autoClose]);

  const icons = {
    success: FiCheckCircle,
    error: FiAlertCircle,
    warning: FiAlertCircle
  };

  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500'
  };

  const Icon = icons[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className={`${colors[type]} rounded-lg shadow-lg px-6 py-4 flex items-center gap-3`}>
            <Icon className="text-white text-xl" />
            <p className="text-white">{message}</p>
            <button 
              onClick={onClose}
              className="ml-4 text-white/80 hover:text-white transition-colors"
            >
              <FiX />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
