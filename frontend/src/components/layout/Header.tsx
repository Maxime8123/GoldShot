'use client';

import { ConnectWallet } from "@thirdweb-dev/react";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-yellow-500">
            GoldShot
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/lottery" className="text-white hover:text-yellow-500 transition-colors">
              Lottery
            </Link>
            <Link href="/duel" className="text-white hover:text-yellow-500 transition-colors">
              Duel
            </Link>
            <Link href="/quick-draw" className="text-white hover:text-yellow-500 transition-colors">
              Quick Draw
            </Link>
            <Link href="/host" className="text-white hover:text-yellow-500 transition-colors">
              Host
            </Link>
            <ConnectWallet 
              theme="dark"
              btnTitle="Connect Wallet"
              className="ml-4"
            />
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col space-y-4 pb-4">
            <Link 
              href="/lottery" 
              className="text-white hover:text-yellow-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Lottery
            </Link>
            <Link 
              href="/duel" 
              className="text-white hover:text-yellow-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Duel
            </Link>
            <Link 
              href="/quick-draw" 
              className="text-white hover:text-yellow-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Quick Draw
            </Link>
            <Link 
              href="/host" 
              className="text-white hover:text-yellow-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Host
            </Link>
            <div className="pt-2">
              <ConnectWallet 
                theme="dark"
                btnTitle="Connect Wallet"
              />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
