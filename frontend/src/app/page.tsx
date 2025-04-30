'use client';

import { motion } from 'framer-motion';
import { FaCoins, FaUserFriends, FaUsers, FaUserCog } from 'react-icons/fa';
import Link from 'next/link';

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="py-8">
      <motion.div 
        className="text-center mb-16"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="text-white">Crypto </span>
          <span className="text-yellow-500">Lottery</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          A sleek, crypto-native platform for daily lottery subscriptions, 
          high-stakes mini-games, and custom events.
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Lottery Card */}
        <motion.div variants={fadeIn}>
          <Link href="/lottery">
            <div className="card group h-full flex flex-col items-center text-center p-8 cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center mb-4 group-hover:bg-yellow-500 transition-colors duration-300">
                <FaCoins className="text-yellow-500 text-2xl group-hover:text-blue-900" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-yellow-500">Lottery</h3>
              <p className="text-gray-400">
                Daily, monthly, and yearly subscription-based lotteries with multiple ticket options.
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Duel Card */}
        <motion.div variants={fadeIn}>
          <Link href="/duel">
            <div className="card group h-full flex flex-col items-center text-center p-8 cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center mb-4 group-hover:bg-yellow-500 transition-colors duration-300">
                <FaUserFriends className="text-yellow-500 text-2xl group-hover:text-blue-900" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-yellow-500">Duel</h3>
              <p className="text-gray-400">
                1v1 instant win games with fixed bet amounts and 90% winner payout.
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Quick Draw Card */}
        <motion.div variants={fadeIn}>
          <Link href="/quick-draw">
            <div className="card group h-full flex flex-col items-center text-center p-8 cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center mb-4 group-hover:bg-yellow-500 transition-colors duration-300">
                <FaUsers className="text-yellow-500 text-2xl group-hover:text-blue-900" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-yellow-500">Quick Draw</h3>
              <p className="text-gray-400">
                5 or 10-player free-for-all games with equal stakes and one winner.
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Host Card */}
        <motion.div variants={fadeIn}>
          <Link href="/host">
            <div className="card group h-full flex flex-col items-center text-center p-8 cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center mb-4 group-hover:bg-yellow-500 transition-colors duration-300">
                <FaUserCog className="text-yellow-500 text-2xl group-hover:text-blue-900" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-yellow-500">Host</h3>
              <p className="text-gray-400">
                Create and share your own custom games with revenue sharing.
              </p>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div 
        className="mt-16 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h2 className="text-2xl font-bold mb-4 text-yellow-500">Powered by USDT on Polygon</h2>
        <p className="text-gray-300 max-w-3xl mx-auto">
          Connect your wallet to start playing or subscribe to our daily, monthly, or yearly lotteries.
        </p>
        <button className="btn-primary mt-6">
          Get Started
        </button>
      </motion.div>
    </div>
  );
}
