import React from 'react';
import { Heart, Crown, HelpCircle } from 'lucide-react';
import UserStatus from './UserStatus';

interface HeaderProps {
  onUpgradeClick: () => void;
  onResourcesClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onUpgradeClick, onResourcesClick }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-1.5 sm:p-2 rounded-full">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Mental Health Chat</h1>
              <div className="hidden xs:block">
                <UserStatus />
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onResourcesClick}
              className="
                flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm
                text-gray-600 hover:text-gray-800 hover:bg-gray-100
                rounded-lg transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-200
              "
              aria-label="Mental health resources"
            >
              <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Resources</span>
            </button>
            
            <button
              onClick={onUpgradeClick}
              className="
                flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium
                bg-gradient-to-r from-purple-500 to-blue-500 text-white
                rounded-lg hover:from-purple-600 hover:to-blue-600
                transition-all duration-200 transform hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-purple-200
                shadow-sm
              "
            >
              <Crown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Upgrade</span>
            </button>
          </div>
        </div>
        
        {/* Mobile user status */}
        <div className="xs:hidden mt-2 flex justify-center">
          <UserStatus />
        </div>
      </div>
    </header>
  );
};

export default Header;