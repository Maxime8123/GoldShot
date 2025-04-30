'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserCog, FaCoins, FaUserFriends, FaUsers, FaLock, FaGlobe, FaArrowRight } from 'react-icons/fa';
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

export default function HostPage() {
  const address = useAddress();
  const [gameType, setGameType] = useState('lottery');
  const [entryAmount, setEntryAmount] = useState(10);
  const [playerLimit, setPlayerLimit] = useState(5);
  const [accessType, setAccessType] = useState('public');
  
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
  
  // Handle entry amount change
  const handleEntryAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setEntryAmount(value === '' ? 0 : parseInt(value));
    }
  };
  
  // Handle create game
  const handleCreateGame = () => {
    if (!address) return;
    
    // This would connect to the smart contract in production
    console.log(`Creating ${gameType} game with entry amount: $${entryAmount}, player limit: ${playerLimit}, access type: ${accessType}`);
  };
  
  // Calculate revenue split
  const calculateRevenueSplit = () => {
    if (gameType === 'lottery') {
      return {
        winner: '50%',
        platform: '25%',
        host: '25%'
      };
    } else {
      return {
        winner: '90%',
        platform: '5%',
        host: '5%'
      };
    }
  };
  
  const revenueSplit = calculateRevenueSplit();
  
  return (
    <div className="py-8">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-white">Host Your </span>
          <span className="text-yellow-500">Own Game</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Create and share your own custom games. Earn a percentage of the prize pool as the host.
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
          <h2 className="text-2xl font-bold mb-6 text-yellow-500">Create a Game</h2>
          
          <div className="mb-8">
            <p className="text-gray-300 mb-6">Select the type of game you want to host, set the entry amount, and choose whether it's public or private.</p>
            
            <div className="mb-6">
              <label className="block text-lg text-white mb-3">Game Type:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  className={`p-4 rounded-lg font-medium transition-all duration-200 ${
                    gameType === 'lottery'
                      ? 'bg-yellow-500 text-gray-900'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                  onClick={() => setGameType('lottery')}
                >
                  <div className="flex flex-col items-center">
                    <FaCoins className="text-2xl mb-2" />
                    <span>Lottery</span>
                  </div>
                </button>
                <button
                  className={`p-4 rounded-lg font-medium transition-all duration-200 ${
                    gameType === 'duel'
                      ? 'bg-yellow-500 text-gray-900'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                  onClick={() => setGameType('duel')}
                >
                  <div className="flex flex-col items-center">
                    <FaUserFriends className="text-2xl mb-2" />
                    <span>Duel</span>
                  </div>
                </button>
                <button
                  className={`p-4 rounded-lg font-medium transition-all duration-200 ${
                    gameType === 'quickdraw'
                      ? 'bg-yellow-500 text-gray-900'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                  onClick={() => setGameType('quickdraw')}
                >
                  <div className="flex flex-col items-center">
                    <FaUsers className="text-2xl mb-2" />
                    <span>Quick Draw</span>
                  </div>
                </button>
              </div>
            </div>
            
            {gameType === 'quickdraw' && (
              <div className="mb-6">
                <label className="block text-lg text-white mb-3">Player Limit:</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className={`p-3 rounded-lg font-medium transition-all duration-200 ${
                      playerLimit === 5
                        ? 'bg-yellow-500 text-gray-900'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                    onClick={() => setPlayerLimit(5)}
                  >
                    5 Players
                  </button>
                  <button
                    className={`p-3 rounded-lg font-medium transition-all duration-200 ${
                      playerLimit === 10
                        ? 'bg-yellow-500 text-gray-900'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                    onClick={() => setPlayerLimit(10)}
                  >
                    10 Players
                  </button>
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-lg text-white mb-2">Entry Amount ($):</label>
              <input
                type="text"
                className="input-field w-full"
                value={entryAmount}
                onChange={handleEntryAmountChange}
                placeholder="Enter entry amount"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-lg text-white mb-3">Access Type:</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  className={`p-3 rounded-lg font-medium transition-all duration-200 ${
                    accessType === 'public'
                      ? 'bg-yellow-500 text-gray-900'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                  onClick={() => setAccessType('public')}
                >
                  <div className="flex items-center justify-center">
                    <FaGlobe className="mr-2" />
                    <span>Public</span>
                  </div>
                </button>
                <button
                  className={`p-3 rounded-lg font-medium transition-all duration-200 ${
                    accessType === 'private'
                      ? 'bg-yellow-500 text-gray-900'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                  onClick={() => setAccessType('private')}
                >
                  <div className="flex items-center justify-center">
                    <FaLock className="mr-2" />
                    <span>Private</span>
                  </div>
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                {accessType === 'public' 
                  ? 'Anyone can join your game.' 
                  : 'Only players you specifically allow can join your game.'}
              </p>
            </div>
            
            <div className="bg-blue-900 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-medium text-yellow-500 mb-3">Revenue Split</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-white">Winner:</span>
                <span className="text-white">{revenueSplit.winner}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-white">Platform:</span>
                <span className="text-white">{revenueSplit.platform}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white">Host (You):</span>
                <span className="text-white">{revenueSplit.host}</span>
              </div>
            </div>
          </div>
          
          {address ? (
            <button 
              className="btn-primary w-full py-3 text-lg"
              onClick={handleCreateGame}
              disabled={entryAmount <= 0}
            >
              Create Game
            </button>
          ) : (
            <div className="text-center">
              <p className="text-gray-300 mb-4">Connect your wallet to host a game</p>
              <ConnectWallet theme="dark" btnTitle="Connect Wallet" />
            </div>
          )}
        </motion.div>
        
        <motion.div 
          className="card p-8"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold mb-6 text-yellow-500">Your Hosted Games</h2>
          
          {address ? (
            <div className="mb-6">
              <p className="text-gray-300 mb-6">Games you've created will appear here. You can manage private games and see your earnings.</p>
              
              {/* This would be populated from the blockchain in production */}
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-900 p-3 rounded-full mr-4">
                        <FaCoins className="text-yellow-500 text-xl" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Lottery Game</p>
                        <p className="text-gray-400 text-sm">Created 2 hours ago • 5 players joined</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-6">
                        <p className="text-yellow-500 font-bold text-xl">$50</p>
                        <p className="text-gray-400 text-sm">Entry Amount</p>
                      </div>
                      <button className="btn-secondary py-2 px-4">
                        Manage
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
                        <p className="text-white font-medium">Duel Game</p>
                        <p className="text-gray-400 text-sm">Created 1 day ago • Completed</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-6">
                        <p className="text-yellow-500 font-bold text-xl">$10</p>
                        <p className="text-gray-400 text-sm">Your Earnings</p>
                      </div>
                      <button className="btn-secondary py-2 px-4">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-300 mb-4">Connect your wallet to see your hosted games</p>
              <ConnectWallet theme="dark" btnTitle="Connect Wallet" />
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
