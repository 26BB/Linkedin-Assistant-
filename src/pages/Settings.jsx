import React, { useState, useEffect } from 'react';
import {
  PROVIDERS,
  getApiKey,
  saveApiKey,
  getSelectedProvider,
  saveSelectedProvider,
  testConnection,
} from '../services/aiApi';
import {
  getLinkedInCreds,
  saveLinkedInCreds,
  isLinkedInConnected,
  getLinkedInProfile,
  clearLinkedInToken,
  initiateLinkedInOAuth,
} from '../services/linkedinApi';

// Token quota is stored per-provider in localStorage: `quota_{id}` = { used, limit }
function getQuota(id) {
  try {
    return JSON.parse(localStorage.getItem(`quota_${id}`)) || { used: 0, limit: 100000 };
  } catch {
    return { used: 0, limit: 100000 };
  }
}

function saveQuota(id, quota) {
  localStorage.setItem(`quota_${id}`, JSON.stringify(quota));
}

const Settings = ({ theme, setTheme, onLogout }) => {
  const [selectedProvider, setSelectedProvider] = useState(getSelectedProvider());
  const [keys, setKeys] = useState(() => {
    const initial = {};
    PROVIDERS.forEach((p) => { initial[p.id] = getApiKey(p.id); });
    return initial;
  });
  const [testStatus, setTestStatus] = useState({});
  const [testError, setTestError] = useState({});
  const [saved, setSaved] = useState({});
  const [quotas, setQuotas] = useState(() => {
    const initial = {};
    PROVIDERS.forEach((p) => { initial[p.id] = getQuota(p.id); });
    return initial;
  });
  const [showKey, setShowKey] = useState(false);

  const [mcpUrl, setMcpUrl] = useState(() => localStorage.getItem('mcp_url') || 'http://localhost:8000/mcp');
  const [mcpSaved, setMcpSaved] = useState(false);

  const handleSaveMcpUrl = () => {
    localStorage.setItem('mcp_url', mcpUrl);
    setMcpSaved(true);
    setTimeout(() => setMcpSaved(false), 2000);
  };


  // LinkedIn state
  const [liCreds, setLiCreds] = useState(() => getLinkedInCreds());
  const [liConnected, setLiConnected] = useState(() => isLinkedInConnected());
  const [liProfile, setLiProfile] = useState(() => getLinkedInProfile());
  const [showLiSecret, setShowLiSecret] = useState(false);
  const [liCredsSaved, setLiCredsSaved] = useState(false);

  const handleSaveLiCreds = () => {
    saveLinkedInCreds(liCreds.clientId, liCreds.clientSecret, window.location.origin);
    setLiCredsSaved(true);
    setTimeout(() => setLiCredsSaved(false), 2000);
  };

  const handleConnectLinkedIn = () => {
    saveLinkedInCreds(liCreds.clientId, liCreds.clientSecret, window.location.origin);
    initiateLinkedInOAuth();
  };

  const handleDisconnectLinkedIn = () => {
    clearLinkedInToken();
    setLiConnected(false);
    setLiProfile(null);
  };

  const provider = PROVIDERS.find((p) => p.id === selectedProvider) || PROVIDERS[0];



  const handleProviderSelect = (id) => {
    setSelectedProvider(id);
    saveSelectedProvider(id);
  };

  const handleKeyChange = (value) => {
    setKeys((prev) => ({ ...prev, [selectedProvider]: value }));
    saveApiKey(selectedProvider, value);
  };

  const handleSaveKey = () => {
    saveApiKey(selectedProvider, keys[selectedProvider] || '');
    setSaved((prev) => ({ ...prev, [selectedProvider]: true }));
    setTimeout(() => setSaved((prev) => ({ ...prev, [selectedProvider]: false })), 2000);
  };

  const handleTest = async () => {
    const id = selectedProvider;
    const key = keys[id] || '';
    if (!key.trim()) return;
    setTestStatus((prev) => ({ ...prev, [id]: 'testing' }));
    setTestError((prev) => ({ ...prev, [id]: '' }));
    try {
      await testConnection(id, key);
      setTestStatus((prev) => ({ ...prev, [id]: 'ok' }));
      // Simulate token usage increment on successful test
      setQuotas((prev) => {
        const q = { ...prev[id], used: Math.min(prev[id].used + 150, prev[id].limit) };
        saveQuota(id, q);
        return { ...prev, [id]: q };
      });
    } catch (err) {
      setTestStatus((prev) => ({ ...prev, [id]: 'error' }));
      setTestError((prev) => ({ ...prev, [id]: err.message }));
    }
    setTimeout(() => setTestStatus((prev) => ({ ...prev, [id]: 'idle' })), 5000);
  };

  const status = testStatus[selectedProvider] || 'idle';
  const quota = quotas[selectedProvider] || { used: 0, limit: 100000 };
  const quotaPct = Math.min((quota.used / quota.limit) * 100, 100);
  const quotaColor = quotaPct > 80 ? 'bg-red-500' : quotaPct > 50 ? 'bg-amber-400' : 'bg-[#006499]';

  const handleResetQuota = () => {
    const reset = { used: 0, limit: quota.limit };
    saveQuota(selectedProvider, reset);
    setQuotas((prev) => ({ ...prev, [selectedProvider]: reset }));
  };

  return (
    <div className="pt-28 pb-16 px-10 w-full max-w-3xl">
      <div className="mb-10">
        <h2 className="text-4xl font-headline font-extrabold text-anthracite dark:text-white tracking-tight">Settings</h2>
        <p className="text-[#5e6058] dark:text-[#9e9d99] font-medium mt-2">
          Configure your AI provider. Keys are stored locally in your browser — never shared.
        </p>
      </div>

      {/* ── LinkedIn Connection ── */}
      <section className="mb-8">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#5e6058] dark:text-[#9e9d99] mb-3">
          LinkedIn Connection
        </h3>
        <div className="bg-white dark:bg-[#1e1e1c] rounded-2xl p-6 border border-[#b1b3a9]/10 dark:border-white/5 shadow-sm">
          {liConnected && liProfile ? (
            /* Connected state */
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {liProfile.picture ? (
                  <img src={liProfile.picture} alt={liProfile.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#0077B5] flex items-center justify-center text-white font-bold text-sm">
                    {liProfile.name?.[0] || 'L'}
                  </div>
                )}
                <div>
                  <p className="font-bold text-sm text-anthracite dark:text-white">{liProfile.name}</p>
                  <p className="text-[10px] text-emerald-500 font-bold">✓ Connected</p>
                </div>
              </div>
              <button
                onClick={handleDisconnectLinkedIn}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all"
              >
                Disconnect
              </button>
            </div>
          ) : (
            /* Setup state */
            <>
              <p className="text-xs text-[#5e6058] dark:text-[#9e9d99] mb-4">
                Enter your{' '}
                <a href="https://developer.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#0077B5] hover:underline font-semibold">LinkedIn Developer App</a>
                {' '}credentials to enable auto-posting.
              </p>
              <div className="flex flex-col gap-3 mb-4">
                <div className="bg-[#f5f4ed] dark:bg-[#2a2a28] border border-[#b1b3a9]/10 dark:border-white/5 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-[#5e6058] dark:text-[#9e9d99] uppercase tracking-wider mb-1">Authorized Redirect URI</p>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-[11px] font-mono text-[#0077B5] truncate">{window.location.origin}</code>
                    <button 
                      onClick={() => navigator.clipboard.writeText(window.location.origin).then(() => setLiCredsSaved(true))}
                      className="text-[#5e6058] hover:text-anthracite transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                    </button>
                  </div>
                  <p className="text-[9px] text-[#9e9d99] mt-1.5 leading-tight">
                    Copy this to your LinkedIn App's "Authorized redirect URLs" in the Developer Portal.
                  </p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-500/20 rounded-xl p-3 mb-1">
                  <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">info</span>
                    Required Products
                  </p>
                  <p className="text-[9px] text-amber-800/70 dark:text-amber-400/70 leading-tight">
                    Ensure your LinkedIn App has <strong>"Sign In with LinkedIn using OpenID Connect"</strong> and <strong>"Share on LinkedIn"</strong> products enabled.
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Client ID"

                  value={liCreds.clientId}
                  onChange={(e) => setLiCreds((p) => ({ ...p, clientId: e.target.value }))}
                  className="w-full bg-[#f5f4ed] dark:bg-[#2a2a28] border border-[#b1b3a9]/10 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-mono focus:ring-2 focus:ring-[#0077B5] focus:border-transparent transition-all outline-none text-anthracite dark:text-white placeholder-[#9e9d99]"
                />
                <div className="relative">
                  <input
                    type={showLiSecret ? 'text' : 'password'}
                    placeholder="Client Secret"
                    value={liCreds.clientSecret}
                    onChange={(e) => setLiCreds((p) => ({ ...p, clientSecret: e.target.value }))}
                    className="w-full bg-[#f5f4ed] dark:bg-[#2a2a28] border border-[#b1b3a9]/10 dark:border-white/5 rounded-xl py-3 px-4 pr-12 text-sm font-mono focus:ring-2 focus:ring-[#0077B5] focus:border-transparent transition-all outline-none text-anthracite dark:text-white placeholder-[#9e9d99]"
                  />
                  <button
                    onClick={() => setShowLiSecret((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5e6058] hover:text-anthracite transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">{showLiSecret ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveLiCreds}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    liCredsSaved
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[#e2e3d9] dark:bg-white/10 text-anthracite dark:text-white hover:bg-[#d5d6cc]'
                  }`}
                >
                  {liCredsSaved ? '✓ Saved' : 'Save Credentials'}
                </button>
                <button
                  onClick={handleConnectLinkedIn}
                  disabled={!liCreds.clientId || !liCreds.clientSecret}
                  className="flex-1 px-4 py-2 rounded-xl text-xs font-bold bg-[#0077B5] text-white hover:bg-[#005885] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Connect LinkedIn
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Provider Selector ── */}
      <section className="mb-8">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#5e6058] dark:text-[#9e9d99] mb-3">
          Active AI Provider
        </h3>
        <div className="relative">
          <select
            value={selectedProvider}
            onChange={(e) => handleProviderSelect(e.target.value)}
            className="w-full appearance-none bg-white dark:bg-[#1e1e1c] border border-[#b1b3a9]/20 dark:border-white/10 rounded-2xl py-4 pl-5 pr-12 text-sm font-bold text-anthracite dark:text-white focus:ring-2 focus:ring-anthracite/20 outline-none cursor-pointer transition-all shadow-sm"
          >
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.icon}  {p.name} — {p.model}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#5e6058] pointer-events-none">
            expand_more
          </span>
        </div>
      </section>

      {/* ── API Key Card ── */}
      <section className="mb-8">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#5e6058] dark:text-[#9e9d99] mb-3">
          API Key
        </h3>
        <div className="bg-white dark:bg-[#1e1e1c] rounded-2xl p-6 border border-[#b1b3a9]/10 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{provider.icon}</span>
              <div>
                <p className="font-bold text-anthracite dark:text-white text-sm">{provider.name}</p>
                <p className="text-[10px] text-[#5e6058] font-mono">{provider.model}</p>
              </div>
            </div>
            <a
              href={provider.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-[#006499] hover:underline flex items-center gap-1"
            >
              Get API Key
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>

          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <input
                type={showKey ? 'text' : 'password'}
                value={keys[selectedProvider] || ''}
                onChange={(e) => handleKeyChange(e.target.value)}
                placeholder={provider.keyPlaceholder}
                className="w-full bg-[#f5f4ed] dark:bg-[#2a2a28] border border-[#b1b3a9]/10 dark:border-white/5 rounded-xl py-3 px-4 pr-12 text-sm font-mono focus:ring-2 focus:ring-anthracite focus:border-transparent transition-all outline-none text-anthracite dark:text-white placeholder-[#9e9d99]"
              />
              <button
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5e6058] hover:text-anthracite transition-colors"
              >
                <span className="material-symbols-outlined text-sm">{showKey ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
            <button
              onClick={handleSaveKey}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                saved[selectedProvider]
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#e2e3d9] dark:bg-white/10 text-anthracite dark:text-white hover:bg-[#d5d6cc]'
              }`}
            >
              {saved[selectedProvider] ? '✓ Saved' : 'Save'}
            </button>
            <button
              onClick={handleTest}
              disabled={status === 'testing' || !keys[selectedProvider]}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-40 ${
                status === 'ok'
                  ? 'bg-emerald-500 text-white'
                  : status === 'error'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-anthracite dark:bg-white text-white dark:text-anthracite hover:opacity-90'
              }`}
            >
              {status === 'testing' && (
                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {status === 'ok' ? '✓ Connected' : status === 'error' ? '✗ Failed' : status === 'testing' ? 'Testing…' : 'Test'}
            </button>
          </div>

          {status === 'error' && testError[selectedProvider] && (
            <p className="text-xs text-red-500 font-medium pl-1 mb-2">{testError[selectedProvider]}</p>
          )}

          {/* ── Token Quota Bar ── */}
          <div className="mt-2 pt-5 border-t border-[#b1b3a9]/10 dark:border-white/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#5e6058]">token</span>
                <span className="text-xs font-bold text-[#5e6058] dark:text-[#9e9d99] uppercase tracking-widest">
                  Token Usage
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-anthracite dark:text-white">
                  {quota.used.toLocaleString()} / {quota.limit.toLocaleString()}
                </span>
                <button
                  onClick={handleResetQuota}
                  className="text-[10px] font-bold text-[#5e6058] hover:text-[#006499] transition-colors"
                  title="Reset counter"
                >
                  reset
                </button>
              </div>
            </div>
            <div className="h-2 w-full bg-[#e2e3d9] dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full ${quotaColor} rounded-full transition-all duration-700`}
                style={{ width: `${quotaPct}%` }}
              />
            </div>
            <p className="text-[10px] text-[#5e6058] mt-1.5">
              {quotaPct.toFixed(1)}% of estimated quota used
              {quotaPct > 80 && (
                <span className="ml-2 text-red-500 font-bold">⚠ Near limit</span>
              )}
            </p>
          </div>
        </div>
      </section>


      {/* ── MCP Configuration ── */}
      <section className="mb-8">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#5e6058] dark:text-[#9e9d99] mb-3">
          Local MCP Server (Advanced)
        </h3>
        <div className="bg-white dark:bg-[#1e1e1c] rounded-2xl p-6 border border-[#b1b3a9]/10 dark:border-white/5 shadow-sm">
          <p className="text-[11px] text-[#5e6058] dark:text-[#9e9d99] mb-4">
            Connect to a local LinkedIn MCP Server for real-time analysis and the floating AI chatbot. Run <code className="bg-[#f5f4ed] dark:bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono">uvx linkedin-scraper-mcp --transport streamable-http --host 127.0.0.1 --port 8000 --path /mcp</code> locally.
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={mcpUrl}
              onChange={(e) => setMcpUrl(e.target.value)}
              placeholder="http://localhost:8000/mcp"
              className="flex-1 bg-[#f5f4ed] dark:bg-[#2a2a28] border border-[#b1b3a9]/10 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-mono focus:ring-2 focus:ring-anthracite focus:border-transparent transition-all outline-none text-anthracite dark:text-white placeholder-[#9e9d99]"
            />
            <button
              onClick={handleSaveMcpUrl}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mcpSaved
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#e2e3d9] dark:bg-white/10 text-anthracite dark:text-white hover:bg-[#d5d6cc]'
              }`}
            >
              {mcpSaved ? '✓ Saved' : 'Save'}
            </button>
          </div>
        </div>
      </section>

      {/* ── Appearance ── */}
      <section className="mb-8">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#5e6058] dark:text-[#9e9d99] mb-3">
          Appearance
        </h3>
        <div className="bg-white dark:bg-[#1e1e1c] rounded-2xl p-6 border border-[#b1b3a9]/10 dark:border-white/5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#5e6058]">
              {theme === 'dark' ? 'dark_mode' : 'light_mode'}
            </span>
            <div>
              <p className="font-bold text-anthracite dark:text-white text-sm">Theme</p>
              <p className="text-[10px] text-[#5e6058] dark:text-[#9e9d99]">
                {theme === 'dark' ? 'Dark mode active' : 'Light mode active'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
              theme === 'dark' ? 'bg-anthracite' : 'bg-[#e2e3d9]'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full shadow-sm bg-white transition-transform duration-300 ${
                theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* ── Account ── */}
      <section className="mb-8">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#5e6058] dark:text-[#9e9d99] mb-3">
          Account
        </h3>
        <div className="bg-white dark:bg-[#1e1e1c] rounded-2xl p-6 border border-[#b1b3a9]/10 dark:border-white/5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#5e6058]">logout</span>
            <div>
              <p className="font-bold text-anthracite dark:text-white text-sm">Sign out</p>
              <p className="text-[10px] text-[#5e6058] dark:text-[#9e9d99]">Clear session and return to login</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all"
          >
            Log out
          </button>
        </div>
      </section>

      {/* Privacy note */}
      <div className="p-5 bg-[#f5f4ed] dark:bg-white/5 rounded-2xl border border-[#b1b3a9]/10 dark:border-white/5">
        <p className="text-[#5e6058] dark:text-[#9e9d99] text-xs leading-relaxed">
          <span className="font-bold text-anthracite dark:text-white">🔒 Privacy note:</span> API keys are stored exclusively in your browser's{' '}
          <code className="bg-white dark:bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono">localStorage</code>.
          They are sent directly to your chosen AI provider and nowhere else. This app has no backend.
        </p>
      </div>
    </div>
  );
};

export default Settings;
