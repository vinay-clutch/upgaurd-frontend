import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';

export const Navbar = () => {
  const { userProfile, logout, updateUserEmail, refreshProfile } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailUpdateLoading, setEmailUpdateLoading] = useState(false);
  const [discordUrl, setDiscordUrl] = useState('');
  const [discordLoading, setDiscordLoading] = useState(false);
  const [discordMsg, setDiscordMsg] = useState(null);

  const [showDiscordHelp, setShowDiscordHelp] = useState(false);
  const [slackUrl, setSlackUrl] = useState('');
  const [slackLoading, setSlackLoading] = useState(false);
  const [slackMsg, setSlackMsg] = useState(null);
  const [showSlackHelp, setShowSlackHelp] = useState(false);
  const dropdownRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!newEmail) return;
    setEmailUpdateLoading(true);
    try {
      await updateUserEmail(newEmail);
      toast.success(`Alert email updated to ${newEmail}`);
      setNewEmail('');
      setShowDropdown(false);
    } catch (error) {
      console.error('Failed to update email:', error);
      toast.error(error.message || 'Failed to update email');
    } finally {
      setEmailUpdateLoading(false);
    }
  };

  const handleConnectDiscord = async (e) => {
    e.preventDefault();
    if (!discordUrl) return;
    setDiscordLoading(true);
    setDiscordMsg(null);
    try {
      await api.updateDiscordWebhook(discordUrl);
      setDiscordMsg({ type: 'success', text: 'Discord connected! Check your channel.' });
      setDiscordUrl('');
      if (refreshProfile) await refreshProfile();
    } catch (error) {
      setDiscordMsg({ type: 'error', text: error.message || 'Failed to connect' });
    } finally {
      setDiscordLoading(false);
    }
  };

  const handleRemoveDiscord = async () => {
    setDiscordLoading(true);
    setDiscordMsg(null);
    try {
      await api.removeDiscordWebhook();
      setDiscordMsg({ type: 'success', text: 'Discord disconnected' });
      if (refreshProfile) await refreshProfile();
    } catch (error) {
      setDiscordMsg({ type: 'error', text: error.message || 'Failed to remove' });
    } finally {
      setDiscordLoading(false);
    }
  };

  const handleConnectSlack = async (e) => {
    e.preventDefault();
    if (!slackUrl) return;
    setSlackLoading(true);
    setSlackMsg(null);
    try {
      await api.updateSlackWebhook(slackUrl);
      setSlackMsg({ type: 'success', text: 'Slack connected! Check your channel.' });
      setSlackUrl('');
      if (refreshProfile) await refreshProfile();
    } catch (error) {
      setSlackMsg({ type: 'error', text: error.message || 'Failed to connect' });
    } finally {
      setSlackLoading(false);
    }
  };

  const handleRemoveSlack = async () => {
    setSlackLoading(true);
    setSlackMsg(null);
    try {
      await api.removeSlackWebhook();
      setSlackMsg({ type: 'success', text: 'Slack disconnected' });
      if (refreshProfile) await refreshProfile();
    } catch (error) {
      setSlackMsg({ type: 'error', text: error.message || 'Failed to remove' });
    } finally {
      setSlackLoading(false);
    }
  };



  const getUserInitial = () => {
    if (userProfile?.username) return userProfile.username.charAt(0).toUpperCase();
    if (userProfile?.name) return userProfile.name.charAt(0).toUpperCase();
    return '?';
  };

  return (
    <nav className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center group">
              <div className="w-8 h-8 mr-3 bg-[#bc2c12]/10 rounded-lg flex items-center justify-center border border-[#bc2c12]/20 group-hover:scale-110 transition-transform">
                <i className="fas fa-shield-alt text-[#bc2c12] text-lg" />
              </div>
              <h1 className="text-xl font-black tracking-tighter text-white">UpGuard</h1>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {userProfile && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-3 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                >
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                    <span className="hidden sm:inline-block hover:text-white transition-colors">{userProfile.username || userProfile.name}</span>
                    {userProfile.email && (
                      <span className="text-[#bc2c12] bg-[#bc2c12]/10 px-2.5 py-1 rounded-full flex items-center border border-[#bc2c12]/20">
                        <i className="fas fa-bell text-[9px] mr-1.5" />
                        Live
                      </span>
                    )}
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#bc2c12] to-[#8a1f0d] flex items-center justify-center text-white font-black text-xs shadow-lg shadow-[#bc2c12]/20 border border-white/10">
                    {getUserInitial()}
                  </div>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-white/10 bg-[#0c0c0e] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in duration-200 overflow-hidden">
                    <div className="p-5 border-b border-white/5 bg-white/[0.02]">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#bc2c12] to-[#8a1f0d] flex items-center justify-center text-white font-black text-lg shadow-lg">
                          {getUserInitial()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-white truncate">{userProfile.username || userProfile.name}</p>
                          <p className="text-xs text-slate-500 truncate font-medium">{userProfile.email || 'Alerts disabled'}</p>
                        </div>
                      </div>
                      <Link 
                        to="/profile" 
                        onClick={() => setShowDropdown(false)}
                        className="mt-4 flex items-center space-x-2 text-[10px] uppercase tracking-widest text-[#bc2c12] hover:text-[#d43216] font-black transition-colors"
                      >
                        <i className="fas fa-sliders-h" />
                        <span>Account Configuration</span>
                      </Link>
                    </div>

                    <div className="p-5">
                      <h4 className="text-[10px] uppercase font-black text-slate-600 mb-4 tracking-widest">Notification Engine</h4>
                      <form onSubmit={handleUpdateEmail} className="space-y-3">
                        <div className="relative">
                          <i className="fas fa-at absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs" />
                          <input
                            type="email"
                            placeholder="Primary alert email..."
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-[#bc2c12]/50 transition-all placeholder:text-slate-700"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={emailUpdateLoading || !newEmail}
                          className="w-full bg-[#bc2c12] hover:bg-[#d43216] disabled:opacity-50 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-[#bc2c12]/20 active:scale-[0.98]"
                        >
                          {emailUpdateLoading ? <i className="fas fa-spinner fa-spin" /> : 'Connect Email'}
                        </button>
                      </form>
                    </div>

                    {/* Discord Integration */}
                    <div className="p-5 border-t border-white/5 bg-slate-900/10">
                      <h4 className="text-[10px] uppercase font-black text-slate-600 mb-4 tracking-widest">Third-Party Channels</h4>
                      {userProfile?.discord_webhook ? (
                        <div className="bg-[#5865F2]/5 border border-[#5865F2]/20 rounded-xl p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <i className="fab fa-discord text-[#5865F2]" />
                              <span className="text-[10px] font-black text-[#5865F2] uppercase tracking-wider">Discord Active</span>
                            </div>
                            <button
                              onClick={handleRemoveDiscord}
                              disabled={discordLoading}
                              className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-400 transition-colors"
                            >
                              {discordLoading ? <i className="fas fa-spinner fa-spin" /> : 'Disconnect'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleConnectDiscord} className="space-y-3">
                          <div className="relative">
                            <i className="fab fa-discord absolute left-4 top-1/2 -translate-y-1/2 text-[#5865F2] text-xs" />
                            <input
                              type="url"
                              placeholder="Discord Webhook URL"
                              value={discordUrl}
                              onChange={(e) => setDiscordUrl(e.target.value)}
                              className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-[10px] font-medium focus:outline-none focus:border-[#5865F2]/40 transition-all placeholder:text-slate-700"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={discordLoading || !discordUrl}
                            className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-[#5865F2]/30 text-[#5865F2] hover:bg-[#5865F2] hover:text-white transition-all disabled:opacity-50"
                          >
                            {discordLoading ? <i className="fas fa-spinner fa-spin" /> : 'Link Discord'}
                          </button>
                        </form>
                      )}
                    </div>

                    {/* Slack Integration */}
                    <div className="p-4 border-t border-white/10">
                      <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-3 tracking-widest">Slack Alerts</h4>
                      {userProfile?.slack_webhook ? (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="text-xs font-semibold text-emerald-400">Slack Connected</span>
                          </div>
                          <button
                            onClick={handleRemoveSlack}
                            disabled={slackLoading}
                            className="text-xs text-rose-400 hover:text-rose-300 transition-colors font-medium"
                          >
                            {slackLoading ? <i className="fas fa-spinner fa-spin" /> : 'Remove webhook'}
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleConnectSlack} className="space-y-2">
                          <div className="relative">
                            <i className="fab fa-slack absolute left-3 top-1/2 -translate-y-1/2 text-[#4A154B] text-xs" />
                            <input
                              type="url"
                              placeholder="https://hooks.slack.com/services/..."
                              value={slackUrl}
                              onChange={(e) => setSlackUrl(e.target.value)}
                              className="w-full bg-slate-950 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#4A154B]/50 transition-colors"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={slackLoading || !slackUrl}
                            className="w-full py-2 rounded-lg text-xs font-semibold transition-all hover:shadow-lg disabled:opacity-50 text-white"
                            style={{ backgroundColor: '#4A154B' }}
                          >
                            {slackLoading ? <i className="fas fa-spinner fa-spin" /> : 'Connect Slack'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowSlackHelp(!showSlackHelp)}
                            className="text-[10px] text-slate-500 hover:text-slate-400 transition-colors"
                          >
                            {showSlackHelp ? 'Hide instructions' : 'How to get Slack webhook?'}
                          </button>
                          {showSlackHelp && (
                            <ol className="text-[10px] text-slate-500 space-y-0.5 pl-3 list-decimal">
                              <li>Go to api.slack.com/apps</li>
                              <li>Create App → From Scratch</li>
                              <li>Incoming Webhooks → Activate</li>
                              <li>Add New Webhook → Copy URL</li>
                            </ol>
                          )}
                        </form>
                      )}
                      {slackMsg && (
                        <p className={`text-[10px] mt-2 font-medium ${slackMsg.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {slackMsg.text}
                        </p>
                      )}
                    </div>


                    <div className="p-2 border-t border-white/5">
                      <button
                        onClick={logout}
                        className="w-full flex items-center justify-center space-x-3 py-3 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 transition-all text-xs font-black uppercase tracking-[0.2em]"
                      >
                        <i className="fas fa-power-off text-[10px]" />
                        <span>System Exit</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
