'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCreditCard, FaWallet, FaTimes, FaArrowRight, FaInfoCircle } from 'react-icons/fa';
import { useFiatPayment } from '@/lib/fiatPayment';
import { PROVIDER_TYPES } from '@/lib/fiatPayment';

interface FiatPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lotteryType: number;
  ticketCount: number;
  onSuccess: () => void;
}

const FiatPaymentModal = ({ isOpen, onClose, lotteryType, ticketCount, onSuccess }: FiatPaymentModalProps) => {
  const { preferredProvider, calculateSubscriptionCost, openCheckout, calculateBundleOptions } = useFiatPayment();
  const [selectedBundle, setSelectedBundle] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get bundle options
  const bundleOptions = calculateBundleOptions(lotteryType, ticketCount);
  
  // Get subscription costs
  const costs = calculateSubscriptionCost(lotteryType, ticketCount);
  
  // Reset selected bundle when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedBundle(0);
      setIsProcessing(false);
    }
  }, [isOpen]);
  
  // Handle checkout
  const handleCheckout = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Open checkout in new window
      openCheckout(bundleOptions[selectedBundle].amount, window.location.href);
      
      // Close modal after a delay
      setTimeout(() => {
        setIsProcessing(false);
        onClose();
        onSuccess();
      }, 1000);
    }, 1500);
  };
  
  // Modal animation variants
  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.2 } }
  };
  
  // Get provider logo
  const getProviderLogo = () => {
    if (preferredProvider === PROVIDER_TYPES.MOONPAY) {
      return 'https://www.moonpay.com/assets/logo-full-color.svg';
    } else {
      return 'https://ramp.network/assets/ramp-logo-blue.svg';
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
      <AnimatePresence>
        <motion.div
          className="bg-gray-900 rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <div className="bg-blue-900 px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Add Funds</h3>
            <button 
              className="text-gray-300 hover:text-white"
              onClick={onClose}
              disabled={isProcessing}
            >
              <FaTimes />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <FaInfoCircle className="text-yellow-500 mr-3 flex-shrink-0" />
                <p className="text-gray-300">
                  Purchase USDT directly with your credit card or bank account to participate in the lottery.
                </p>
              </div>
              
              {preferredProvider && (
                <div className="bg-gray-800 p-4 rounded-lg mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-white mb-1">Preferred Provider:</p>
                    <p className="text-gray-400 text-sm">Based on your location</p>
                  </div>
                  <img 
                    src={getProviderLogo()} 
                    alt={preferredProvider === PROVIDER_TYPES.MOONPAY ? 'MoonPay' : 'Ramp'} 
                    className="h-8"
                  />
                </div>
              )}
              
              <div className="mb-6">
                <h4 className="text-lg font-medium text-yellow-500 mb-3">Select Payment Bundle</h4>
                <div className="space-y-3">
                  {bundleOptions.map((option, index) => (
                    <button
                      key={index}
                      className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                        selectedBundle === index
                          ? 'bg-blue-800 border border-yellow-500'
                          : 'bg-gray-800 border border-transparent hover:border-gray-600'
                      }`}
                      onClick={() => setSelectedBundle(index)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-medium">{option.name}</p>
                          <p className="text-gray-400 text-sm">{option.description}</p>
                        </div>
                        <p className="text-yellow-500 font-bold">${option.amount.toFixed(2)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <h4 className="text-lg font-medium text-white mb-2">Payment Summary</h4>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-300">Bundle:</p>
                  <p className="text-white">{bundleOptions[selectedBundle].name}</p>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-300">Amount:</p>
                  <p className="text-yellow-500 font-bold">${bundleOptions[selectedBundle].amount.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-300">Payment Method:</p>
                  <p className="text-white">Credit Card / Bank Transfer</p>
                </div>
              </div>
            </div>
            
            <button
              className="btn-primary w-full py-3 text-lg flex items-center justify-center"
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Proceed to Checkout <FaArrowRight className="ml-2" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FiatPaymentModal;
