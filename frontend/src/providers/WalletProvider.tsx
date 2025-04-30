'use client';

import { useState, useEffect } from 'react';
import { useAddress, useNetworkMismatch, useNetwork } from "@thirdweb-dev/react";
import { ACTIVE_CHAIN_ID } from '@/lib/constants';
import { useUSDT } from '@/lib/hooks';
import { useNotifications, NOTIFICATION_TYPES } from '@/lib/notifications';
import WalletStatus from '@/components/wallet/WalletStatus';
import LowBalanceWarning from '@/components/notifications/LowBalanceWarning';
import FiatPaymentModal from '@/components/payment/FiatPaymentModal';

// Wallet context provider for global wallet state management
const WalletProvider = ({ children }) => {
  const address = useAddress();
  const isMismatched = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const { balance, formatUSDT, isBalanceLoading, refetchBalance } = useUSDT();
  const { showTransactionNotification } = useNotifications();
  
  // State for low balance warning
  const [showLowBalanceWarning, setShowLowBalanceWarning] = useState(false);
  const [showFiatPaymentModal, setShowFiatPaymentModal] = useState(false);
  
  // Balance threshold for warnings (5 USDT)
  const LOW_BALANCE_THRESHOLD = 5;
  
  // Check for network mismatch on mount and when address changes
  useEffect(() => {
    if (address && isMismatched) {
      showTransactionNotification(
        NOTIFICATION_TYPES.WARNING,
        `Please switch to ${ACTIVE_CHAIN_ID === 137 ? 'Polygon' : 'Mumbai Testnet'} network`
      );
      
      // Auto-switch network after a delay
      const timer = setTimeout(() => {
        handleSwitchNetwork();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [address, isMismatched]);
  
  // Check for low balance when balance changes
  useEffect(() => {
    if (address && !isBalanceLoading && balance) {
      const formattedBalance = parseFloat(formatUSDT(balance));
      if (formattedBalance < LOW_BALANCE_THRESHOLD) {
        setShowLowBalanceWarning(true);
      } else {
        setShowLowBalanceWarning(false);
      }
    }
  }, [address, balance, isBalanceLoading]);
  
  // Handle network switch
  const handleSwitchNetwork = async () => {
    try {
      await switchNetwork?.(ACTIVE_CHAIN_ID);
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
  
  // Handle add funds
  const handleAddFunds = () => {
    setShowFiatPaymentModal(true);
    setShowLowBalanceWarning(false);
  };
  
  // Handle payment success
  const handlePaymentSuccess = () => {
    showTransactionNotification(
      NOTIFICATION_TYPES.SUCCESS,
      'Payment successful! Your funds will be available shortly.'
    );
    
    // Refetch balance after a delay to allow for transaction processing
    setTimeout(() => {
      refetchBalance();
    }, 5000);
  };
  
  return (
    <>
      {children}
      
      {/* Wallet status notification */}
      <WalletStatus requiredChainId={ACTIVE_CHAIN_ID} />
      
      {/* Low balance warning */}
      <LowBalanceWarning
        threshold={LOW_BALANCE_THRESHOLD}
        isVisible={showLowBalanceWarning}
        onClose={() => setShowLowBalanceWarning(false)}
        onAddFunds={handleAddFunds}
      />
      
      {/* Fiat payment modal */}
      <FiatPaymentModal
        isOpen={showFiatPaymentModal}
        onClose={() => setShowFiatPaymentModal(false)}
        lotteryType={0} // Default to daily lottery
        ticketCount={5} // Default to 5 tickets
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default WalletProvider;
