'use client';

import { FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-yellow-500">GoldShot</h3>
            <p className="text-gray-400 mt-2">The premier crypto lottery and gaming platform</p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
              <FaTwitter size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
              <FaDiscord size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
              <FaGithub size={24} />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} GoldShot. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="hover:text-yellow-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-yellow-500 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
