'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWallet, FaExchangeAlt, FaSignOutAlt, FaClipboard, FaCheck } from 'react-icons/fa';
import { useAddress, useDisconnect, useConnectionStatus, ConnectWallet } from "@thirdweb-dev/react";
import { useUSDT } from '@/lib/hooks';
import { truncateAddress } from '@/lib/utils';

interface WalletConnectProps {
  showBalance?: boolean;
}

const WalletConnect = ({ showBalance = true }: WalletConnectProps) => {
  const address = useAddress();
  const disconnect = useDisconnect();
  const connectionStatus = useConnectionStatus();
  const { balance, formatUSDT, isBalanceLoading } = useUSDT();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsDropdownOpen(false);
    };
    
    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);
  
  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [copied]);
  
  // Copy address to clipboard
  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
    }
  };
  
  // Handle disconnect
  const handleDisconnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    disconnect();
    setIsDropdownOpen(false);
  };
  
  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } }
  };
  
  // If not connected, show connect wallet button
  if (!address || connectionStatus !== "connected") {
    return (
      <ConnectWallet 
        theme="dark"
        btnTitle="Connect Wallet"
        modalTitle="Connect Your Wallet"
        modalSize="wide"
        welcomeScreen={{
          title: "GoldShot Platform",
          subtitle: "Connect your wallet to participate in lotteries, duels, and quick draws.",
          img: {
            src: "https://i.imgur.com/JLYeZGg.png",
            width: 150,
            height: 150,
          },
        }}
        modalTitleIconUrl="https://i.imgur.com/JLYeZGg.png"
      />
    );
  }
  
  return (
    <div className="relative">
      <button
        className="btn-secondary flex items-center py-2 px-4"
        onClick={(e) => {
          e.stopPropagation();
          setIsDropdownOpen(!isDropdownOpen);
        }}
      >
        <FaWallet className="mr-2" />
        <span className="hidden sm:inline mr-2">{truncateAddress(address)}</span>
        {showBalance && (
          <span className="bg-blue-900 text-yellow-500 py-1 px-2 rounded text-sm font-medium ml-2">
            {isBalanceLoading ? '...' : `${formatUSDT(balance) || '0'} USDT`}
          </span>
        )}
      </button>
      
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg z-50 overflow-hidden"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-700">
              <p className="text-gray-400 text-sm">Connected Wallet</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-white font-medium">{truncateAddress(address)}</p>
                <button
                  className="text-gray-400 hover:text-white p-1"
                  onClick={copyToClipboard}
                  title="Copy address"
                >
                  {copied ? <FaCheck className="text-green-500" /> : <FaClipboard />}
                </button>
              </div>
            </div>
            
            {showBalance && (
              <div className="p-4 border-b border-gray-700">
                <p className="text-gray-400 text-sm">USDT Balance</p>
                <p className="text-yellow-500 font-medium text-lg">
                  {isBalanceLoading ? 'Loading...' : `${formatUSDT(balance) || '0'} USDT`}
                </p>
              </div>
            )}
            
            <div className="p-4">
              <a
                href="/wallet"
                className="flex items-center text-white hover:text-yellow-500 py-2"
              >
                <FaExchangeAlt className="mr-3" />
                Manage Wallet
              </a>
              <button
                className="flex items-center text-white hover:text-yellow-500 py-2 w-full text-left"
                onClick={handleDisconnect}
              >
                <FaSignOutAlt className="mr-3" />
                Disconnect
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalletConnect;
