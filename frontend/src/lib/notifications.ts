import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

// Types of notifications
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

// Notification service for transaction and balance notifications
export const useNotifications = () => {
  // Show transaction notification
  const showTransactionNotification = (type, message, txHash = null) => {
    let content = message;
    
    if (txHash) {
      // Add link to transaction on block explorer
      const explorerUrl = `https://mumbai.polygonscan.com/tx/${txHash}`;
      // Using string instead of JSX for non-React context
      content = `${message}\n\nView on Explorer: ${explorerUrl}`;
    }
    
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        toast.success(content, { duration: 5000 });
        break;
      case NOTIFICATION_TYPES.ERROR:
        toast.error(content, { duration: 7000 });
        break;
      case NOTIFICATION_TYPES.WARNING:
        toast(content, { 
          icon: '⚠️',
          style: {
            background: '#723b13',
            color: '#fef3c7',
            padding: '16px'
          },
          duration: 5000 
        });
        break;
      case NOTIFICATION_TYPES.INFO:
      default:
        toast(content, { duration: 4000 });
        break;
    }
  };
  
  // Show low balance warning
  const showLowBalanceWarning = (balance, threshold, currency = 'USDT') => {
    if (parseFloat(balance) < threshold) {
      toast(`Low Balance Warning: Your ${currency} balance is low (${balance}). Please add funds to continue playing.`, { 
        icon: '⚠️',
        style: {
          background: '#7f1d1d',
          color: '#fee2e2',
          padding: '16px'
        },
        duration: 7000 
      });
      return true;
    }
    return false;
  };
  
  // Show transaction pending notification
  const showPendingTransaction = (message = 'Transaction pending...') => {
    return toast.loading(message, { duration: Infinity });
  };
  
  // Update or dismiss a pending notification
  const updatePendingTransaction = (toastId, type, message, txHash = null) => {
    let content = message;
    
    if (txHash) {
      // Add link to transaction on block explorer
      const explorerUrl = `https://mumbai.polygonscan.com/tx/${txHash}`;
      // Using string instead of JSX for non-React context
      content = `${message}\n\nView on Explorer: ${explorerUrl}`;
    }
    
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        toast.success(content, { id: toastId, duration: 5000 });
        break;
      case NOTIFICATION_TYPES.ERROR:
        toast.error(content, { id: toastId, duration: 7000 });
        break;
      case NOTIFICATION_TYPES.WARNING:
        toast(content, { 
          id: toastId,
          icon: '⚠️',
          style: {
            background: '#723b13',
            color: '#fef3c7',
            padding: '16px'
          },
          duration: 5000 
        });
        break;
      case NOTIFICATION_TYPES.INFO:
      default:
        toast(content, { id: toastId, duration: 4000 });
        break;
    }
  };
  
  return {
    showTransactionNotification,
    showLowBalanceWarning,
    showPendingTransaction,
    updatePendingTransaction
  };
};
