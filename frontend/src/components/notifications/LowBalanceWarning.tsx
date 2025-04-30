'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaCoins } from 'react-icons/fa';
import { useUSDT } from '@/lib/hooks';

interface LowBalanceWarningProps {
  threshold: number;
  isVisible: boolean;
  onClose: () => void;
  onAddFunds: () => void;
}

const LowBalanceWarning = ({ 
  threshold, 
  isVisible, 
  onClose, 
  onAddFunds 
}: LowBalanceWarningProps) => {
  // Animation variants
  const warningVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-20 right-4 z-50"
          variants={warningVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="bg-red-900 text-white p-4 rounded-lg shadow-lg max-w-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3 mt-0.5">
                <FaExclamationTriangle className="text-yellow-500 text-xl" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium mb-2">Your USDT balance is low</p>
                <p className="text-xs text-gray-300 mb-3">
                  You need at least ${threshold} USDT to participate in games. Add funds to continue playing.
                </p>
                <div className="flex space-x-2">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 py-1 rounded text-xs font-medium flex items-center"
                    onClick={onAddFunds}
                  >
                    <FaCoins className="mr-1" /> Add Funds
                  </button>
                  <button
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium"
                    onClick={onClose}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LowBalanceWarning;
