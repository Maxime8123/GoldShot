'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

export default function LotteryPage() {
  const address = useAddress();
  const [activeTab, setActiveTab] = useState('daily');
  
  // Ticket counts for each lottery type
  const [dailyTickets, setDailyTickets] = useState(1);
  const [monthlyTickets, setMonthlyTickets] = useState(1);
  const [yearlyTickets, setYearlyTickets] = useState(1);
  
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
  
  // Handle ticket count changes
  const incrementTickets = (type: 'daily' | 'monthly' | 'yearly') => {
    if (type === 'daily') setDailyTickets(prev => prev + 1);
    if (type === 'monthly') setMonthlyTickets(prev => prev + 1);
    if (type === 'yearly') setYearlyTickets(prev => prev + 1);
  };
  
  const decrementTickets = (type: 'daily' | 'monthly' | 'yearly') => {
    if (type === 'daily' && dailyTickets > 1) setDailyTickets(prev => prev - 1);
    if (type === 'monthly' && monthlyTickets > 1) setMonthlyTickets(prev => prev - 1);
    if (type === 'yearly' && yearlyTickets > 1) setYearlyTickets(prev => prev - 1);
  };
  
  // Calculate costs
  const dailyCost = dailyTickets * 1;
  const monthlyCost = monthlyTickets * 20;
  const yearlyCost = yearlyTickets * 100;
  
  // Handle subscription
  const handleSubscribe = () => {
    if (!address) return;
    
    // This would connect to the smart contract in production
    console.log(`Subscribing to ${activeTab} lottery with ${
      activeTab === 'daily' ? dailyTickets : 
      activeTab === 'monthly' ? monthlyTickets : yearlyTickets
    } tickets`);
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
          <span className="text-yellow-500">Lottery</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Subscribe to our daily, monthly, or yearly lotteries and increase your chances by purchasing multiple tickets.
        </p>
      </motion.div>
      
      {/* Lottery Type Tabs */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex border-b border-gray-700">
          <button 
            className={`flex-1 py-4 text-lg font-medium ${activeTab === 'daily' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('daily')}
          >
            Daily Lottery
          </button>
          <button 
            className={`flex-1 py-4 text-lg font-medium ${activeTab === 'monthly' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('monthly')}
          >
            Monthly Lottery
          </button>
          <button 
            className={`flex-1 py-4 text-lg font-medium ${activeTab === 'yearly' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('yearly')}
          >
            Yearly Lottery
          </button>
        </div>
      </div>
      
      {/* Lottery Content */}
      <motion.div 
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Daily Lottery */}
        {activeTab === 'daily' && (
          <motion.div 
            className="card p-8"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold mb-6 text-yellow-500">Daily Lottery Subscription</h2>
            
            <div className="mb-8">
              <p className="text-gray-300 mb-4">One lottery every day with a new winner drawn daily. Each ticket costs $1.</p>
              
              <div className="bg-gray-800 p-6 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg text-white">Ticket Price:</span>
                  <span className="text-lg text-yellow-500">$1 per ticket</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg text-white">Draw Frequency:</span>
                  <span className="text-lg text-white">Daily (365 draws/year)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg text-white">Prize Split:</span>
                  <span className="text-lg text-white">50% to Winner, 50% to Platform</span>
                </div>
              </div>
              
              <div className="mb-8">
                <label className="block text-lg text-white mb-2">Number of Tickets:</label>
                <div className="flex items-center">
                  <button 
                    className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-l-lg"
                    onClick={() => decrementTickets('daily')}
                  >
                    <FaMinus />
                  </button>
                  <input 
                    type="number" 
                    className="bg-gray-800 text-center text-white text-xl py-2 px-4 w-20 border-0"
                    value={dailyTickets}
                    readOnly
                  />
                  <button 
                    className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-r-lg"
                    onClick={() => incrementTickets('daily')}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-900 p-6 rounded-lg mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg text-white">Daily Cost:</span>
                  <span className="text-xl text-yellow-500">${dailyCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg text-white">Monthly Cost:</span>
                  <span className="text-lg text-white">${(dailyCost * 30).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg text-white">Yearly Cost:</span>
                  <span className="text-lg text-white">${(dailyCost * 365).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {address ? (
              <button 
                className="btn-primary w-full py-3 text-lg"
                onClick={handleSubscribe}
              >
                Subscribe Now
              </button>
            ) : (
              <div className="text-center">
                <p className="text-gray-300 mb-4">Connect your wallet to subscribe</p>
                <ConnectWallet theme="dark" btnTitle="Connect Wallet" />
              </div>
            )}
          </motion.div>
        )}
        
        {/* Monthly Lottery */}
        {activeTab === 'monthly' && (
          <motion.div 
            className="card p-8"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold mb-6 text-yellow-500">Monthly Lottery Subscription</h2>
            
            <div className="mb-8">
              <p className="text-gray-300 mb-4">One lottery every month with a new winner drawn monthly. Each ticket costs $20.</p>
              
              <div className="bg-gray-800 p-6 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg text-white">Ticket Price:</span>
                  <span className="text-lg text-yellow-500">$20 per ticket</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg text-white">Draw Frequency:</span>
                  <span className="text-lg text-white">Monthly (12 draws/year)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg text-white">Prize Split:</span>
                  <span className="text-lg text-white">50% to Winner, 50% to Platform</span>
                </div>
              </div>
              
              <div className="mb-8">
                <label className="block text-lg text-white mb-2">Number of Tickets:</label>
                <div className="flex items-center">
                  <button 
                    className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-l-lg"
                    onClick={() => decrementTickets('monthly')}
                  >
                    <FaMinus />
                  </button>
                  <input 
                    type="number" 
                    className="bg-gray-800 text-center text-white text-xl py-2 px-4 w-20 border-0"
                    value={monthlyTickets}
                    readOnly
                  />
                  <button 
                    className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-r-lg"
                    onClick={() => incrementTickets('monthly')}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-900 p-6 rounded-lg mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg text-white">Monthly Cost:</span>
                  <span className="text-xl text-yellow-500">${monthlyCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg text-white">Yearly Cost:</span>
                  <span className="text-lg text-white">${(monthlyCost * 12).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {address ? (
              <button 
                className="btn-primary w-full py-3 text-lg"
                onClick={handleSubscribe}
              >
                Subscribe Now
              </button>
            ) : (
              <div className="text-center">
                <p className="text-gray-300 mb-4">Connect your wallet to subscribe</p>
                <ConnectWallet theme="dark" btnTitle="Connect Wallet" />
              </div>
            )}
          </motion.div>
        )}
        
        {/* Yearly Lottery */}
        {activeTab === 'yearly' && (
          <motion.div 
            className="card p-8"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold mb-6 text-yellow-500">Yearly Lottery Subscription</h2>
            
            <div className="mb-8">
              <p className="text-gray-300 mb-4">One lottery every year with a new winner drawn annually. Each ticket costs $100.</p>
              
              <div className="bg-gray-800 p-6 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg text-white">Ticket Price:</span>
                  <span className="text-lg text-yellow-500">$100 per ticket</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg text-white">Draw Frequency:</span>
                  <span className="text-lg text-white">Yearly (1 draw/year)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg text-white">Prize Split:</span>
                  <span className="text-lg text-white">50% to Winner, 50% to Platform</span>
                </div>
              </div>
              
              <div className="mb-8">
                <label className="block text-lg text-white mb-2">Number of Tickets:</label>
                <div className="flex items-center">
                  <button 
                    className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-l-lg"
                    onClick={() => decrementTickets('yearly')}
                  >
                    <FaMinus />
                  </button>
                  <input 
                    type="number" 
                    className="bg-gray-800 text-center text-white text-xl py-2 px-4 w-20 border-0"
                    value={yearlyTickets}
                    readOnly
                  />
                  <button 
                    className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-r-lg"
                    onClick={() => incrementTickets('yearly')}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-900 p-6 rounded-lg mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg text-white">Yearly Cost:</span>
                  <span className="text-xl text-yellow-500">${yearlyCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {address ? (
              <button 
                className="btn-primary w-full py-3 text-lg"
                onClick={handleSubscribe}
              >
                Subscribe Now
              </button>
            ) : (
              <div className="text-center">
                <p className="text-gray-300 mb-4">Connect your wallet to subscribe</p>
                <ConnectWallet theme="dark" btnTitle="Connect Wallet" />
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
