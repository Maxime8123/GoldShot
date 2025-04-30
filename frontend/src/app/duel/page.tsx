'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCoins, FaUserFriends, FaArrowRight } from 'react-icons/fa';
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

export default function DuelPage() {
  const address = useAddress();
  const [betAmount, setBetAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  
  // Fixed bet amounts
  const fixedBetAmounts = [10, 20, 50, 100, 200, 500, 1000];
  
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
  
  // Handle bet amount selection
  const handleBetAmountSelect = (amount: number) => {
    setBetAmount(amount);
    setIsCustom(false);
  };
  
  // Handle custom amount change
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setCustomAmount(value);
      if (value !== '') {
        setBetAmount(parseInt(value));
        setIsCustom(true);
      }
    }
  };
  
  // Handle create duel
  const handleCreateDuel = () => {
    if (!address) return;
    
    // This would connect to the smart contract in production
    console.log(`Creating duel with bet amount: $${betAmount}`);
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
          <span className="text-white">Crypto </span>
          <span className="text-yellow-500">Duel</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Challenge another player to a 1v1 duel. Winner takes 90% of the pot.
        </p>
      </motion.div>
      
      <motion.div 
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="card p-8 mb-8"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold mb-6 text-yellow-500">Create a Duel</h2>
          
          <div className="mb-8">
            <p className="text-gray-300 mb-6">Select a bet amount or enter a custom amount. Once created, your duel will be available for another player to join.</p>
            
            <div className="bg-gray-800 p-6 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg text-white">Winner Takes:</span>
                <span className="text-lg text-yellow-500">90% of the pot</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg text-white">Platform Fee:</span>
                <span className="text-lg text-white">10%</span>
              </div>
            </div>
            
            <div className="mb-8">
              <label className="block text-lg text-white mb-4">Select Bet Amount:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                {fixedBetAmounts.map((amount) => (
                  <button
                    key={amount}
                    className={`p-3 rounded-lg font-medium transition-all duration-200 ${
                      betAmount === amount && !isCustom
                        ? 'bg-yellow-500 text-gray-900'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                    onClick={() => handleBetAmountSelect(amount)}
                  >
                    ${amount}
                  </button>
                ))}
                <button
                  className={`p-3 rounded-lg font-medium transition-all duration-200 ${
                    isCustom
                      ? 'bg-yellow-500 text-gray-900'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                  onClick={() => setIsCustom(true)}
                >
                  Custom
                </button>
              </div>
              
              {isCustom && (
                <div className="mb-4">
                  <label className="block text-white mb-2">Enter Custom Amount ($):</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Enter amount"
                  />
                </div>
              )}
            </div>
            
            <div className="bg-blue-900 p-6 rounded-lg mb-8">
              <div className="flex justify-between items-center">
                <span className="text-lg text-white">Your Bet:</span>
                <span className="text-xl text-yellow-500">${betAmount}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-lg text-white">Potential Win:</span>
                <span className="text-lg text-white">${(betAmount * 2 * 0.9).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {address ? (
            <button 
              className="btn-primary w-full py-3 text-lg"
              onClick={handleCreateDuel}
              disabled={betAmount <= 0}
            >
              Create Duel
            </button>
          ) : (
            <div className="text-center">
              <p className="text-gray-300 mb-4">Connect your wallet to create a duel</p>
              <ConnectWallet theme="dark" btnTitle="Connect Wallet" />
            </div>
          )}
        </motion.div>
        
        <motion.div 
          className="card p-8"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold mb-6 text-yellow-500">Open Duels</h2>
          
          <div className="mb-6">
            <p className="text-gray-300 mb-6">Join an existing duel created by another player. Match their bet amount for a chance to win.</p>
            
            {/* This would be populated from the blockchain in production */}
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-900 p-3 rounded-full mr-4">
                      <FaUserFriends className="text-yellow-500 text-xl" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Duel #1</p>
                      <p className="text-gray-400 text-sm">Created 5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-6">
                      <p className="text-yellow-500 font-bold text-xl">$50</p>
                      <p className="text-gray-400 text-sm">Bet Amount</p>
                    </div>
                    <button className="btn-primary py-2 px-4 flex items-center">
                      Join <FaArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-900 p-3 rounded-full mr-4">
                      <FaUserFriends className="text-yellow-500 text-xl" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Duel #2</p>
                      <p className="text-gray-400 text-sm">Created 12 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-6">
                      <p className="text-yellow-500 font-bold text-xl">$100</p>
                      <p className="text-gray-400 text-sm">Bet Amount</p>
                    </div>
                    <button className="btn-primary py-2 px-4 flex items-center">
                      Join <FaArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-900 p-3 rounded-full mr-4">
                      <FaUserFriends className="text-yellow-500 text-xl" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Duel #3</p>
                      <p className="text-gray-400 text-sm">Created 20 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-6">
                      <p className="text-yellow-500 font-bold text-xl">$200</p>
                      <p className="text-gray-400 text-sm">Bet Amount</p>
                    </div>
                    <button className="btn-primary py-2 px-4 flex items-center">
                      Join <FaArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
