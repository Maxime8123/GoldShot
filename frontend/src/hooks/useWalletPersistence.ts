'use client';

import { useState, useEffect } from 'react';
import { useAddress } from "@thirdweb-dev/react";
import { persistWalletConnection, clearWalletConnection, wasPreviouslyConnected } from '@/lib/walletUtils';

// Hook for wallet connection persistence
export const useWalletPersistence = () => {
  const address = useAddress();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Persist wallet connection when address changes
  useEffect(() => {
    if (!isInitialized) return;
    
    if (address) {
      persistWalletConnection(address);
    } else {
      clearWalletConnection();
    }
  }, [address, isInitialized]);
  
  // Check for previously connected wallet on mount
  useEffect(() => {
    setIsInitialized(true);
  }, []);
  
  return {
    isPreviouslyConnected: wasPreviouslyConnected(),
    isInitialized
  };
};

export default useWalletPersistence;
