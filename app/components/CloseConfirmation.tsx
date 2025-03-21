'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';

interface CloseConfirmationProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CloseConfirmation({
  isOpen,
  onConfirm,
  onCancel
}: CloseConfirmationProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onCancel}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50
                     bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-xl 
                     p-6 w-[90%] max-w-md shadow-xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                <FiAlertTriangle className="text-2xl text-amber-500" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">
                Exit Onboarding?
              </h3>
              
              <p className="text-gray-400 mb-6">
                Your progress will not be saved. Are you sure you want to exit?
              </p>

              <div className="flex gap-4 w-full">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-white
                           hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white
                           hover:bg-red-600 transition-colors"
                >
                  Exit
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
