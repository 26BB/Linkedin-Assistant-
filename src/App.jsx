import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ContentCreator from './pages/ContentCreator';
import Scheduler from './pages/Scheduler';
import Settings from './pages/Settings';
import EngagementAnalytics from './pages/EngagementAnalytics';
import AudienceAnalytics from './pages/AudienceAnalytics';
import LinkedInCallback from './pages/LinkedInCallback';
 fix-linkedin-analytics-pivot-14857105653476600371
 jules-mcp-integration-7117090531316985338
import FloatingChatbot from './components/FloatingChatbot';
 main

import FloatingChatbot from './components/FloatingChatbot';
 main
import { isLinkedInConnected } from './services/linkedinApi';


function App() {
  const [currentPath, setCurrentPath] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [loggedOut, setLoggedOut] = useState(false);

  // Detect LinkedIn OAuth callback (?code=...&state=...)
  const params = new URLSearchParams(window.location.search);
  const isLinkedInCallback = params.has('code') && params.has('state');

  // Apply dark class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogout = () => {
    // Clear all app state from localStorage
    ['ai_provider', 'openai', 'gemini', 'anthropic', 'mistral', 'groq'].forEach((k) => {
      localStorage.removeItem(`ai_key_${k}`);
    });
    localStorage.removeItem('ai_provider');
    setLoggedOut(true);
  };

  if (loggedOut) {
    return (
      <div className="min-h-screen bg-[#fbf9f4] dark:bg-[#0e0e0c] flex items-center justify-center flex-col gap-6">
        <div className="w-16 h-16 bg-anthracite rounded-2xl flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
        </div>
        <div className="text-center">
          <h1 className="font-headline font-extrabold text-2xl text-anthracite dark:text-white">You've been signed out</h1>
          <p className="text-[#5e6058] text-sm mt-2">Your API keys remain stored locally in your browser.</p>
        </div>
        <button
          onClick={() => {
            if (isLinkedInConnected()) {
              setLoggedOut(false);
              setCurrentPath('dashboard');
            } else {
              setLoggedOut(false);
              setCurrentPath('settings');
            }
          }}
          className="px-8 py-3 bg-anthracite text-white rounded-full font-bold text-sm hover:opacity-90 transition-all"
        >
          Sign back in
        </button>
      </div>
    );
  }

  // Show LinkedIn OAuth callback page when redirected back from LinkedIn
  if (isLinkedInCallback) {
    return <LinkedInCallback onDone={(path) => { setCurrentPath(path); window.history.replaceState({}, '', window.location.pathname); }} />;
  }

  return (
    <div className="bg-[#fbf9f4] dark:bg-[#0e0e0c] text-[#31332c] dark:text-white font-body flex min-h-screen transition-colors duration-300">
      <Sidebar currentPath={currentPath} setCurrentPath={setCurrentPath} />

      <div className="ml-64 flex-1 flex flex-col relative w-[calc(100%-16rem)]">
        <Header theme={theme} setTheme={setTheme} onLogout={handleLogout} />

        {currentPath === 'dashboard'  && <Dashboard />}
        {currentPath === 'content'    && <ContentCreator />}
        {currentPath === 'scheduler'  && <Scheduler onNavigate={setCurrentPath} />}
        {currentPath === 'engagement' && <EngagementAnalytics />}
        {currentPath === 'audience'   && <AudienceAnalytics />}
        {currentPath === 'settings'   && (
          <Settings theme={theme} setTheme={setTheme} onLogout={handleLogout} />
        )}
      </div>
      <FloatingChatbot theme={theme} />
    </div>
  );
}

export default App;
// Trigger push
// final push
