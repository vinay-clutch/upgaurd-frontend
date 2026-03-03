import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Navbar } from '../components/Navbar';
import { toast } from 'react-hot-toast';

export const Profile = () => {
    const { userProfile, refreshProfile, updateUserEmail } = useAuth();
    const [email, setEmail] = useState(userProfile?.email || '');
    const [discordUrl, setDiscordUrl] = useState(userProfile?.discord_webhook || '');
    const [slackUrl, setSlackUrl] = useState(userProfile?.slack_webhook || '');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('account');

    useEffect(() => {
        document.title = 'Profile | UpGuard';
        if (userProfile) {
            setEmail(userProfile.email || '');
            setDiscordUrl(userProfile.discord_webhook || '');
            setSlackUrl(userProfile.slack_webhook || '');
        }
    }, [userProfile]);

    const handleUpdateEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateUserEmail(email);
            toast.success('Notification email updated!');
            await refreshProfile();
        } catch (error) {
            toast.error(error.message || 'Failed to update email');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateDiscord = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (discordUrl) {
                await api.updateDiscordWebhook(discordUrl);
                toast.success('Discord webhook updated!');
            } else {
                await api.removeDiscordWebhook();
                toast.success('Discord webhook removed!');
            }
            await refreshProfile();
        } catch (error) {
            toast.error(error.message || 'Failed to update Discord');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSlack = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (slackUrl) {
                await api.updateSlackWebhook(slackUrl);
                toast.success('Slack webhook updated!');
            } else {
                await api.removeSlackWebhook();
                toast.success('Slack webhook removed!');
            }
            await refreshProfile();
        } catch (error) {
            toast.error(error.message || 'Failed to update Slack');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Navbar />
            
            <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 space-y-2">
                        <button 
                            onClick={() => setActiveTab('account')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'account' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <i className="fas fa-user-circle w-5" />
                            <span>Account Details</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('notifications')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'notifications' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <i className="fas fa-bell w-5" />
                            <span>Notifications</span>
                        </button>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 space-y-8">
                        
                        {activeTab === 'account' && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                                
                                <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-8 backdrop-blur-sm space-y-8">
                                    <div className="flex items-center space-x-6">
                                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold shadow-xl shadow-indigo-500/10">
                                            {userProfile?.username?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{userProfile?.username || 'User Profile'}</h3>
                                            <p className="text-slate-400 text-sm">Account ID: {userProfile?.id || '...'}</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/5 pt-8">
                                        <form onSubmit={handleUpdateEmail} className="max-w-md space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Notification Email</label>
                                                <div className="relative">
                                                    <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                                    <input 
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                                                        placeholder="Enter alert email..."
                                                    />
                                                </div>
                                                <p className="mt-2 text-xs text-slate-500">We'll send incident alerts and weekly reports to this address.</p>
                                            </div>
                                            <button 
                                                type="submit"
                                                disabled={loading}
                                                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-indigo-500/20"
                                            >
                                                {loading ? 'Saving...' : 'Update Notification Email'}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === 'notifications' && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-2xl font-bold mb-6">Integrations & Alerts</h2>
                                
                                <div className="space-y-6">
                                    {/* Discord */}
                                    <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
                                        <div className="flex items-center space-x-4 mb-8">
                                            <div className="h-12 w-12 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/20 flex items-center justify-center">
                                                <i className="fab fa-discord text-[#5865F2] text-2xl" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold">Discord Notifications</h3>
                                                <p className="text-sm text-slate-400">Receive instant alerts in your Discord channel.</p>
                                            </div>
                                        </div>

                                        <form onSubmit={handleUpdateDiscord} className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Webhook URL</label>
                                                <input 
                                                    type="url"
                                                    value={discordUrl}
                                                    onChange={(e) => setDiscordUrl(e.target.value)}
                                                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#5865F2] transition-all"
                                                    placeholder="https://discord.com/api/webhooks/..."
                                                />
                                            </div>
                                            <div className="flex gap-3">
                                                <button 
                                                    type="submit"
                                                    disabled={loading}
                                                    className="bg-[#5865F2] hover:opacity-90 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-lg shadow-[#5865F2]/10"
                                                >
                                                    {loading ? 'Saving...' : discordUrl ? 'Update Webhook' : 'Connect discord'}
                                                </button>
                                                {userProfile?.discord_webhook && (
                                                    <button 
                                                        type="button"
                                                        onClick={() => { setDiscordUrl(''); handleUpdateDiscord({ preventDefault: () => {} }); }}
                                                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold py-3 px-6 rounded-xl text-sm transition-all"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    </div>

                                    {/* Slack */}
                                    <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
                                        <div className="flex items-center space-x-4 mb-8">
                                            <div className="h-12 w-12 rounded-xl bg-[#4A154B]/10 border border-[#4A154B]/20 flex items-center justify-center">
                                                <i className="fab fa-slack text-[#4A154B] text-2xl" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold">Slack Notifications</h3>
                                                <p className="text-sm text-slate-400">Connect your team workspace via incoming webhooks.</p>
                                            </div>
                                        </div>

                                        <form onSubmit={handleUpdateSlack} className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Webhook URL</label>
                                                <input 
                                                    type="url"
                                                    value={slackUrl}
                                                    onChange={(e) => setSlackUrl(e.target.value)}
                                                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#4A154B] transition-all"
                                                    placeholder="https://hooks.slack.com/services/..."
                                                />
                                            </div>
                                            <div className="flex gap-3">
                                                <button 
                                                    type="submit"
                                                    disabled={loading}
                                                    className="bg-[#4A154B] hover:opacity-90 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-lg shadow-[#4A154B]/10"
                                                >
                                                    {loading ? 'Saving...' : slackUrl ? 'Update Webhook' : 'Connect Slack'}
                                                </button>
                                                {userProfile?.slack_webhook && (
                                                    <button 
                                                        type="button"
                                                        onClick={() => { setSlackUrl(''); handleUpdateSlack({ preventDefault: () => {} }); }}
                                                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold py-3 px-6 rounded-xl text-sm transition-all"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};
