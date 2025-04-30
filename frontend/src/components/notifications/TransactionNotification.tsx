'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { useNotifications, NOTIFICATION_TYPES } from '@/lib/notifications';

interface TransactionNotificationProps {
  type: string;
  message: string;
  txHash?: string;
  duration?: number;
  onClose?: () => void;
}

const TransactionNotification = ({ 
  type, 
  message, 
  txHash, 
  duration = 5000,
  onClose 
}: TransactionNotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    if (duration > 0 && type !== 'loading') {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose, type]);
  
  // Get icon based on notification type
  const getIcon = () => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return <FaCheckCircle className="text-green-500 text-xl" />;
      case NOTIFICATION_TYPES.ERROR:
        return <FaTimesCircle className="text-red-500 text-xl" />;
      case NOTIFICATION_TYPES.WARNING:
        return <FaExclamationTriangle className="text-yellow-500 text-xl" />;
      case 'loading':
        return <FaSpinner className="text-blue-500 text-xl animate-spin" />;
      default:
        return null;
    }
  };
  
  // Get background color based on notification type
  const getBackgroundColor = () => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return 'bg-green-900';
      case NOTIFICATION_TYPES.ERROR:
        return 'bg-red-900';
      case NOTIFICATION_TYPES.WARNING:
        return 'bg-yellow-900';
      case 'loading':
        return 'bg-blue-900';
      default:
        return 'bg-gray-800';
    }
  };
  
  // Animation variants
  const notificationVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`${getBackgroundColor()} text-white p-4 rounded-lg shadow-lg max-w-md w-full`}
          variants={notificationVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3 mt-0.5">
              {getIcon()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{message}</p>
              {txHash && (
                <a
                  href={`https://mumbai.polygonscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-300 hover:text-blue-200 underline mt-1 inline-block"
                >
                  View on Explorer
                </a>
              )}
            </div>
            {type !== 'loading' && (
              <button
                className="ml-4 text-white opacity-70 hover:opacity-100"
                onClick={() => {
                  setIsVisible(false);
                  if (onClose) onClose();
                }}
              >
                &times;
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransactionNotification;
