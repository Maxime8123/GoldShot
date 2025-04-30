'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaArrowRight } from 'react-icons/fa';
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

export default function QuickDrawPage() {
  const address = useAddress();
  const [gameType, setGameType] = useState('five');
  const [betAmount, setBetAmount] = useState(10);
  
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
  
  // Handle bet amount change
  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setBetAmount(value === '' ? 0 : parseInt(value));
    }
  };
  
  // Handle join game
  const handleJoinGame = () => {
    if (!address) return;
    
    // This would connect to the smart contract in production
    console.log(`Joining ${gameType === 'five' ? '5' : '10'}-player game with bet amount: $${betAmount}`);
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
          <span className="text-white">Quick </span>
          <span className="text-yellow-500">Draw</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Join a 5 or 10-player game where one random winner takes 90% of the pot.
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
          <h2 className="text-2xl font-bold mb-6 text-yellow-500">Join a Quick Draw Game</h2>
          
          <div className="mb-8">
            <p className="text-gray-300 mb-6">Select the number of players and your bet amount. You'll be matched with other players, and one random winner will be selected.</p>
            
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
            
            <div className="mb-6">
              <label className="block text-lg text-white mb-3">Game Type:</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  className={`p-4 rounded-lg font-medium transition-all duration-200 ${
                    gameType === 'five'
                      ? 'bg-yellow-500 text-gray-900'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                  onClick={() => setGameType('five')}
                >
                  <div className="flex flex-col items-center">
                    <FaUsers className="text-2xl mb-2" />
                    <span>5 Players</span>
                  </div>
                </button>
                <button
                  className={`p-4 rounded-lg font-medium transition-all duration-200 ${
                    gameType === 'ten'
                      ? 'bg-yellow-500 text-gray-900'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                  onClick={() => setGameType('ten')}
                >
                  <div className="flex flex-col items-center">
                    <FaUsers className="text-2xl mb-2" />
                    <span>10 Players</span>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-lg text-white mb-2">Bet Amount ($):</label>
              <input
                type="text"
                className="input-field w-full"
                value={betAmount}
                onChange={handleBetAmountChange}
                placeholder="Enter bet amount"
              />
            </div>
            
            <div className="bg-blue-900 p-6 rounded-lg mb-8">
              <div className="flex justify-between items-center">
                <span className="text-lg text-white">Your Bet:</span>
                <span className="text-xl text-yellow-500">${betAmount}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-lg text-white">Potential Win:</span>
                <span className="text-lg text-white">
                  ${(betAmount * (gameType === 'five' ? 5 : 10) * 0.9).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-lg text-white">Win Chance:</span>
                <span className="text-lg text-white">
                  {gameType === 'five' ? '20%' : '10%'}
                </span>
              </div>
            </div>
          </div>
          
          {address ? (
            <button 
              className="btn-primary w-full py-3 text-lg"
              onClick={handleJoinGame}
              disabled={betAmount <= 0}
            >
              Join Game
            </button>
          ) : (
            <div className="text-center">
              <p className="text-gray-300 mb-4">Connect your wallet to join a game</p>
              <ConnectWallet theme="dark" btnTitle="Connect Wallet" />
            </div>
          )}
        </motion.div>
        
        <motion.div 
          className="card p-8"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold mb-6 text-yellow-500">Active Games</h2>
          
          <div className="mb-6">
            <p className="text-gray-300 mb-6">These games are currently looking for players. Join one that matches your preferred bet amount.</p>
            
            {/* This would be populated from the blockchain in production */}
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-900 p-3 rounded-full mr-4">
                      <FaUsers className="text-yellow-500 text-xl" />
                    </div>
                    <div>
                      <p className="text-white font-medium">5-Player Game</p>
                      <p className="text-gray-400 text-sm">3/5 players joined</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-6">
                      <p className="text-yellow-500 font-bold text-xl">$25</p>
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
                      <FaUsers className="text-yellow-500 text-xl" />
                    </div>
                    <div>
                      <p className="text-white font-medium">10-Player Game</p>
                      <p className="text-gray-400 text-sm">6/10 players joined</p>
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
                      <FaUsers className="text-yellow-500 text-xl" />
                    </div>
                    <div>
                      <p className="text-white font-medium">5-Player Game</p>
                      <p className="text-gray-400 text-sm">2/5 players joined</p>
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
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
