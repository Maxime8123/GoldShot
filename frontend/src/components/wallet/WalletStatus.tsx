'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWallet, FaExchangeAlt, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { useAddress, useDisconnect, useNetworkMismatch, useNetwork, ChainId } from '@thirdweb-dev/react';
import { ACTIVE_CHAIN_ID } from '@/lib/constants';
import { useNotifications, NOTIFICATION_TYPES } from '@/lib/notifications';

interface WalletStatusProps {
  requiredChainId: number;
}

const WalletStatus = ({ requiredChainId }: WalletStatusProps) => {
  const address = useAddress();
  const disconnect = useDisconnect();
  const isMismatched = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const { showTransactionNotification } = useNotifications();
  
  const [isVisible, setIsVisible] = useState(false);
  
  // Show wallet status when address changes or network mismatch occurs
  useEffect(() => {
    if (address) {
      setIsVisible(true);
      
      // Hide after 5 seconds if everything is correct
      if (!isMismatched) {
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [address, isMismatched]);
  
  // Handle network switch
  const handleSwitchNetwork = async () => {
    try {
      await switchNetwork?.(requiredChainId);
      showTransactionNotification(
        NOTIFICATION_TYPES.SUCCESS,
        'Network switched successfully'
      );
    } catch (error) {
      console.error('Error switching network:', error);
      showTransactionNotification(
        NOTIFICATION_TYPES.ERROR,
        'Failed to switch network'
      );
    }
  };
  
  // Animation variants
  const statusVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }
  };
  
  if (!address || !isVisible) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-20 right-4 z-50"
        variants={statusVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {isMismatched ? (
          <div className="bg-yellow-900 text-white p-4 rounded-lg shadow-lg max-w-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3 mt-0.5">
                <FaExclamationTriangle className="text-yellow-500 text-xl" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium mb-2">Wrong Network Detected</p>
                <p className="text-xs text-gray-300 mb-3">
                  Please switch to {requiredChainId === 137 ? 'Polygon' : 'Mumbai Testnet'} to use this application.
                </p>
                <div className="flex space-x-2">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 py-1 rounded text-xs font-medium flex items-center"
                    onClick={handleSwitchNetwork}
                  >
                    <FaExchangeAlt className="mr-1" /> Switch Network
                  </button>
                  <button
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium"
                    onClick={() => setIsVisible(false)}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-900 text-white p-4 rounded-lg shadow-lg max-w-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3 mt-0.5">
                <FaCheckCircle className="text-green-500 text-xl" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium mb-2">Wallet Connected</p>
                <p className="text-xs text-gray-300 mb-3">
                  Connected to {requiredChainId === 137 ? 'Polygon' : 'Mumbai Testnet'} network.
                </p>
                <div className="flex space-x-2">
                  <button
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium"
                    onClick={() => setIsVisible(false)}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default WalletStatus;
