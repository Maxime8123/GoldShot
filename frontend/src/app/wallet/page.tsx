'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaWallet, FaExchangeAlt, FaHistory, FaInfoCircle } from 'react-icons/fa';
import { ConnectWallet, useAddress, useBalance } from "@thirdweb-dev/react";
import { Polygon } from "@thirdweb-dev/chains";

export default function WalletPage() {
  const address = useAddress();
  const [activeTab, setActiveTab] = useState('balance');
  const [isApproving, setIsApproving] = useState(false);
  
  // Get native token balance
  const { data: nativeBalance } = useBalance();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };
  
  // Mock transaction history
  const transactions = [
    { id: 1, type: 'Lottery Subscription', amount: 30, date: '2025-04-23', status: 'Completed' },
    { id: 2, type: 'Duel Win', amount: 180, date: '2025-04-22', status: 'Completed' },
    { id: 3, type: 'Quick Draw Entry', amount: -50, date: '2025-04-21', status: 'Completed' },
    { id: 4, type: 'Hosted Game Fee', amount: 25, date: '2025-04-20', status: 'Completed' },
  ];
  
  // Handle approve all contracts
  const handleApproveAll = () => {
    setIsApproving(true);
    
    // This would connect to the smart contract in production
    setTimeout(() => {
      setIsApproving(false);
    }, 2000);
  };
  
  return (
    <div className="py-8">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-white">Your </span>
          <span className="text-yellow-500">Wallet</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Manage your funds, approve contracts, and view transaction history.
        </p>
      </motion.div>
      
      {!address ? (
        <div className="max-w-md mx-auto text-center py-12">
          <FaWallet className="text-yellow-500 text-5xl mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-8">Connect your wallet to view your balance, approve contracts, and manage your funds.</p>
          <ConnectWallet theme="dark" btnTitle="Connect Wallet" />
        </div>
      ) : (
        <>
          {/* Wallet Tabs */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex border-b border-gray-700 overflow-x-auto">
              <button 
                className={`py-4 px-6 text-lg font-medium whitespace-nowrap ${activeTab === 'balance' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('balance')}
              >
                Balance
              </button>
              <button 
                className={`py-4 px-6 text-lg font-medium whitespace-nowrap ${activeTab === 'approve' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('approve')}
              >
                Approve Contracts
              </button>
              <button 
                className={`py-4 px-6 text-lg font-medium whitespace-nowrap ${activeTab === 'history' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('history')}
              >
                Transaction History
              </button>
            </div>
          </div>
          
          <motion.div 
            className="max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Balance Tab */}
            {activeTab === 'balance' && (
              <motion.div 
                className="card p-8"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-bold mb-6 text-yellow-500">Your Balance</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <img src="https://cryptologos.cc/logos/polygon-matic-logo.png" alt="MATIC" className="w-8 h-8 mr-3" />
                        <span className="text-lg text-white">MATIC</span>
                      </div>
                      <span className="text-xl font-bold text-white">
                        {nativeBalance?.displayValue || '0.00'} {nativeBalance?.symbol || 'MATIC'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">Native token on Polygon network</p>
                  </div>
                  
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <img src="https://cryptologos.cc/logos/tether-usdt-logo.png" alt="USDT" className="w-8 h-8 mr-3" />
                        <span className="text-lg text-white">USDT</span>
                      </div>
                      <span className="text-xl font-bold text-white">500.00 USDT</span>
                    </div>
                    <p className="text-gray-400 text-sm">Tether USD on Polygon network</p>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-white mb-4">Add Funds</h3>
                    <p className="text-gray-300 mb-4">Need more USDT for playing games? You can add funds using these methods:</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button className="btn-secondary flex items-center justify-center py-3">
                        <img src="https://cryptologos.cc/logos/moonpay-logo.png" alt="MoonPay" className="w-6 h-6 mr-2" />
                        Buy with MoonPay
                      </button>
                      <button className="btn-secondary flex items-center justify-center py-3">
                        <img src="https://cryptologos.cc/logos/ramp-network-logo.png" alt="Ramp" className="w-6 h-6 mr-2" />
                        Buy with Ramp
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Approve Contracts Tab */}
            {activeTab === 'approve' && (
              <motion.div 
                className="card p-8"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-bold mb-6 text-yellow-500">Approve Contracts</h2>
                
                <div className="bg-gray-800 p-6 rounded-lg mb-6">
                  <div className="flex items-center mb-4">
                    <FaInfoCircle className="text-yellow-500 mr-3 flex-shrink-0" />
                    <p className="text-gray-300">
                      You need to approve the smart contracts to spend your USDT tokens. This is a one-time process for each contract.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-yellow-500 text-xl mr-3">💰</span>
                        <span className="text-white">Lottery Contract</span>
                      </div>
                      <span className="text-green-500">Approved</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-yellow-500 text-xl mr-3">👥</span>
                        <span className="text-white">Duel Contract</span>
                      </div>
                      <span className="text-green-500">Approved</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-yellow-500 text-xl mr-3">👥</span>
                        <span className="text-white">Quick Draw Contract</span>
                      </div>
                      <span className="text-yellow-500">Not Approved</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-yellow-500 text-xl mr-3">⚙️</span>
                        <span className="text-white">Host Contract</span>
                      </div>
                      <span className="text-yellow-500">Not Approved</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  className="btn-primary w-full py-3 text-lg flex items-center justify-center"
                  onClick={handleApproveAll}
                  disabled={isApproving}
                >
                  {isApproving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Approving...
                    </>
                  ) : (
                    'Approve All Contracts'
                  )}
                </button>
              </motion.div>
            )}
            
            {/* Transaction History Tab */}
            {activeTab === 'history' && (
              <motion.div 
                className="card p-8"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-bold mb-6 text-yellow-500">Transaction History</h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-400">Type</th>
                        <th className="text-left py-3 px-4 text-gray-400">Amount</th>
                        <th className="text-left py-3 px-4 text-gray-400">Date</th>
                        <th className="text-left py-3 px-4 text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-gray-800">
                          <td className="py-4 px-4 text-white">{tx.type}</td>
                          <td className={`py-4 px-4 ${tx.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {tx.amount >= 0 ? '+' : ''}{tx.amount} USDT
                          </td>
                          <td className="py-4 px-4 text-gray-300">{tx.date}</td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-1 bg-green-900 text-green-300 rounded-full text-xs">
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {transactions.length === 0 && (
                  <div className="text-center py-8">
                    <FaHistory className="text-gray-600 text-4xl mx-auto mb-4" />
                    <p className="text-gray-400">No transactions found</p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
