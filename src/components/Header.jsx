import React, { useState } from 'react';
import { getLinkedInProfile } from '../services/linkedinApi';


const Header = ({ theme, setTheme, onLogout }) => {
    // Initialize state directly with getLinkedInProfile
  // rather than using useEffect to avoid synchronous state updates
  const [profile] = useState(() => getLinkedInProfile());



  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-[#fbf9f4]/80 dark:bg-[#0e0e0c]/80 backdrop-blur-md flex justify-between items-center h-20 px-10 border-b border-[#b1b3a9]/10 dark:border-white/5 transition-colors duration-300">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#5e6058] text-sm group-focus-within:text-anthracite dark:group-focus-within:text-white transition-colors">search</span>
          <input
            className="w-full bg-white dark:bg-white/5 border border-transparent dark:border-white/5 rounded-full py-2.5 pl-12 pr-6 text-sm focus:ring-2 focus:ring-anthracite/10 transition-all font-body shadow-sm outline-none text-anthracite dark:text-white placeholder-[#9e9d99]"
            placeholder="Search analytics or reports..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button className="relative text-[#5e6058] dark:text-[#9e9d99] hover:text-anthracite dark:hover:text-white transition-all hover:scale-110">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#9f403d] rounded-full border-2 border-[#fbf9f4] dark:border-[#0e0e0c]" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme && setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-[#5e6058] dark:text-[#9e9d99] hover:text-anthracite dark:hover:text-white transition-all hover:scale-110"
          title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        <div className="h-8 w-[1px] bg-[#b1b3a9]/30 dark:bg-white/10" />

        {/* User + Logout */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-anthracite dark:text-white leading-none">{profile ? profile.name : 'Alex Rivera'}</p>
            <p className="text-[10px] text-[#5e6058] dark:text-[#9e9d99] mt-1">{profile ? 'LinkedIn User' : 'Editorial Lead'}</p>
          </div>
          <img
            alt="User Profile Avatar"
            className="w-10 h-10 rounded-full border-2 border-white dark:border-white/10 shadow-sm transition-transform hover:scale-105 cursor-pointer"
            src={profile?.picture ? profile.picture : "https://lh3.googleusercontent.com/aida-public/AB6AXuAX9-Oo4HZamUofhsiDujq7gJTywX3_nRYRefBG9dicrD5fv3tts1o15x2aHozHvsB0ryv1sh_DXc1cn86wnkGkDdOys7M4UMqQojO7SW75JQMwrnJFszObP6IYiX1TDTBntiesWJIXYWAp6i7nckIHE0paxrf6kVzDnnvNaxkPcjpr45kFGXbyEqu2Wnsy-UbY7B7yYy11iE2_hup2uGLCf99MfcIcv9SYvV9F6rXUlsZ5cjEyjKsZ68YQ0-js8M_TFZZabqZcfTje"}
          />

          {/* Logout button */}
          <button
            onClick={onLogout}
            title="Sign out"
            className="text-[#5e6058] dark:text-[#9e9d99] hover:text-red-500 dark:hover:text-red-400 transition-all hover:scale-110"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
