import React from 'react';
import { Menu, Search, } from 'lucide-react';
const Header = () => {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 shadow-lg">
      <div className="flex items-center justify-between p-4">
        {/* Left Section */}
        <div className="flex items-center">
          <button
            className="text-slate-300 hover:text-white focus:outline-none md:hidden mr-3 p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
          
          {/* Search Bar */}
          <div className="relative w-64 sm:w-96">
            <input
              type="text"
              placeholder="Search anything...!"
              className="w-full bg-slate-800/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            <div className="absolute left-3 top-3 text-slate-400">
              <Search size={20} />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center cursor-pointer bg-slate-800/50 hover:bg-slate-700/50 rounded-lg p-2 transition-all duration-200 border border-slate-600/50">
            <div className="mr-3 text-right hidden sm:block">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white font-semibold shadow-lg">
              AU
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
