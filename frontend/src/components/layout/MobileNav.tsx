'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaCoins, FaUserFriends, FaUsers, FaUserCog } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MobileNav = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  // Show nav after a slight delay to prevent flash on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 md:hidden z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-around items-center h-16">
        <Link href="/" className={`flex flex-col items-center justify-center w-full h-full ${pathname === '/' ? 'text-yellow-500' : 'text-gray-400'}`}>
          <FaHome className="text-xl mb-1" />
          <span className="text-xs">Home</span>
        </Link>
        
        <Link href="/lottery" className={`flex flex-col items-center justify-center w-full h-full ${pathname === '/lottery' ? 'text-yellow-500' : 'text-gray-400'}`}>
          <FaCoins className="text-xl mb-1" />
          <span className="text-xs">Lottery</span>
        </Link>
        
        <Link href="/duel" className={`flex flex-col items-center justify-center w-full h-full ${pathname === '/duel' ? 'text-yellow-500' : 'text-gray-400'}`}>
          <FaUserFriends className="text-xl mb-1" />
          <span className="text-xs">Duel</span>
        </Link>
        
        <Link href="/quick-draw" className={`flex flex-col items-center justify-center w-full h-full ${pathname === '/quick-draw' ? 'text-yellow-500' : 'text-gray-400'}`}>
          <FaUsers className="text-xl mb-1" />
          <span className="text-xs">Quick Draw</span>
        </Link>
        
        <Link href="/host" className={`flex flex-col items-center justify-center w-full h-full ${pathname === '/host' ? 'text-yellow-500' : 'text-gray-400'}`}>
          <FaUserCog className="text-xl mb-1" />
          <span className="text-xs">Host</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default MobileNav;
