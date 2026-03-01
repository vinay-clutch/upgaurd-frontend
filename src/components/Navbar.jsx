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
    <nav className="border-b border-white/10 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center group">
              <i className="fas fa-heartbeat text-indigo-400 text-xl mr-2 group-hover:scale-110 transition-transform" />
              <h1 className="text-xl font-semibold tracking-tight">UpGuard</h1>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {userProfile && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-3 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                >
                  <div className="flex items-center space-x-2 text-sm text-slate-300">
                    <span className="hidden sm:inline-block font-medium">{userProfile.username || userProfile.name}</span>
                    {userProfile.email && (
                      <span className="text-slate-500 text-xs bg-indigo-500/10 px-2 py-0.5 rounded-full flex items-center">
                        <i className="fas fa-bell text-[10px] mr-1" />
                        {userProfile.email}
                      </span>
                    )}
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20">
                    {getUserInitial()}
                  </div>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-72 rounded-xl border border-white/10 bg-slate-900 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
                    <div className="p-4 border-b border-white/10 bg-white/5">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {getUserInitial()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-semibold text-white truncate">{userProfile.username || userProfile.name}</p>
                          <p className="text-xs text-slate-400 truncate">{userProfile.email || 'No notification email'}</p>
                        </div>
                      </div>
                      <Link 
                        to="/profile" 
                        onClick={() => setShowDropdown(false)}
                        className="mt-4 flex items-center space-x-2 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                      >
                        <i className="fas fa-cog" />
                        <span>Account Settings</span>
                      </Link>
                    </div>

                    <div className="p-4">
                      <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-3 tracking-widest">Update Alerts</h4>
                      <form onSubmit={handleUpdateEmail} className="space-y-3">
                        <div className="relative">
                          <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                          <input
                            type="email"
                            placeholder="New alert email..."
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={emailUpdateLoading || !newEmail}
                          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2 rounded-lg text-xs font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/20"
                        >
                          {emailUpdateLoading ? <i className="fas fa-spinner fa-spin" /> : 'Update Email'}
                        </button>
                      </form>
                    </div>

                    {/* Discord Integration */}
                    <div className="p-4 border-t border-white/10">
                      <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-3 tracking-widest">Discord Alerts</h4>
                      {userProfile?.discord_webhook ? (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="text-xs font-semibold text-emerald-400">Discord Connected</span>
                          </div>
                          <button
                            onClick={handleRemoveDiscord}
                            disabled={discordLoading}
                            className="text-xs text-rose-400 hover:text-rose-300 transition-colors font-medium"
                          >
                            {discordLoading ? <i className="fas fa-spinner fa-spin" /> : 'Remove webhook'}
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleConnectDiscord} className="space-y-2">
                          <div className="relative">
                            <i className="fab fa-discord absolute left-3 top-1/2 -translate-y-1/2 text-[#5865F2] text-xs" />
                            <input
                              type="url"
                              placeholder="https://discord.com/api/webhooks/..."
                              value={discordUrl}
                              onChange={(e) => setDiscordUrl(e.target.value)}
                              className="w-full bg-slate-950 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#5865F2]/50 transition-colors"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={discordLoading || !discordUrl}
                            className="w-full py-2 rounded-lg text-xs font-semibold transition-all hover:shadow-lg disabled:opacity-50 text-white"
                            style={{ backgroundColor: '#5865F2' }}
                          >
                            {discordLoading ? <i className="fas fa-spinner fa-spin" /> : 'Connect Discord'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowDiscordHelp(!showDiscordHelp)}
                            className="text-[10px] text-slate-500 hover:text-slate-400 transition-colors"
                          >
                            {showDiscordHelp ? 'Hide instructions' : 'How to get webhook URL?'}
                          </button>
                          {showDiscordHelp && (
                            <ol className="text-[10px] text-slate-500 space-y-0.5 pl-3 list-decimal">
                              <li>Open Discord server settings</li>
                              <li>Integrations → Webhooks</li>
                              <li>New Webhook → Copy URL</li>
                              <li>Paste above and click Connect</li>
                            </ol>
                          )}
                        </form>
                      )}
                      {discordMsg && (
                        <p className={`text-[10px] mt-2 font-medium ${discordMsg.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {discordMsg.text}
                        </p>
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


                    <div className="border-t border-white/10 p-2">
                      <button
                        onClick={logout}
                        className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-sm font-medium"
                      >
                        <i className="fas fa-sign-out-alt w-5" />
                        <span>Logout</span>
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
