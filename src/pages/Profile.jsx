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
        document.title = 'Security Profile | UpGuard';
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
            toast.success('Signal protocols updated');
            await refreshProfile();
        } catch (error) {
            toast.error(error.message || 'Transmission failed');
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
                toast.success('Discord channel linked');
            } else {
                await api.removeDiscordWebhook();
                toast.success('Discord channel severed');
            }
            await refreshProfile();
        } catch (error) {
            toast.error(error.message || 'Operation failed');
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
                toast.success('Slack relay active');
            } else {
                await api.removeSlackWebhook();
                toast.success('Slack relay offline');
            }
            await refreshProfile();
        } catch (error) {
            toast.error(error.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-[#00f09a]/20 font-['Inter']">
            <Navbar />
            
            <main className="max-w-6xl mx-auto py-32 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-16">
                    
                    {/* Sidebar */}
                    <aside className="w-full lg:w-72 space-y-3">
                        <div className="mb-10">
                           <h1 className="text-3xl font-black tracking-tight mb-2 uppercase italic">Identity</h1>
                           <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Access & Signal Config</p>
                        </div>
                        <button 
                            onClick={() => setActiveTab('account')}
                            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'account' ? 'bg-[#00f09a] text-black shadow-2xl' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                        >
                            <i className="fas fa-fingerprint text-sm w-6" />
                            <span>Primary Identity</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('notifications')}
                            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'notifications' ? 'bg-[#00f09a] text-black shadow-2xl' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                        >
                            <i className="fas fa-wave-square text-sm w-6" />
                            <span>Signal Relays</span>
                        </button>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 space-y-12">
                        
                        {activeTab === 'account' && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-xl font-black mb-8 italic uppercase tracking-widest">Account Topology</h2>
                                
                                <div className="bg-[#0b0b0d] border border-white/5 rounded-[32px] p-10 shadow-2xl space-y-10">
                                    <div className="flex items-center space-x-8">
                                        <div className="h-24 w-24 rounded-3xl bg-black border border-white/5 flex items-center justify-center text-4xl font-black text-[#00f09a] shadow-2xl">
                                            {userProfile?.username?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white italic">{userProfile?.username.toUpperCase() || 'USER_UNK'}</h3>
                                            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">ID: {userProfile?.id?.substring(0, 12) || '...'}</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/5 pt-10">
                                        <form onSubmit={handleUpdateEmail} className="max-w-md space-y-6">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-3">Diagnostic Email</label>
                                                <div className="relative group">
                                                    <i className="fas fa-envelope-open absolute left-5 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within:text-[#00f09a] transition-colors" />
                                                    <input 
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full bg-black border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:outline-none focus:border-[#00f09a] transition-all"
                                                        placeholder="Target address for reports..."
                                                    />
                                                </div>
                                                <p className="mt-4 text-[10px] text-slate-700 font-bold uppercase tracking-widest leading-relaxed">System will route emergency telemetry and weekly analytical reports to this coordinate.</p>
                                            </div>
                                            <button 
                                                type="submit"
                                                disabled={loading}
                                                className="bg-[#0b0b0d] border border-white/5 hover:bg-[#00f09a] hover:text-black disabled:opacity-50 text-white font-black py-4 px-8 rounded-2xl text-[10px] uppercase tracking-widest transition-all shadow-2xl"
                                            >
                                                {loading ? 'Transmitting...' : 'Link Coordinate'}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === 'notifications' && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-xl font-black mb-8 italic uppercase tracking-widest">Signal Relays</h2>
                                
                                <div className="space-y-8">
                                    {/* Discord */}
                                    <div className="bg-[#0b0b0d] border border-white/5 rounded-[32px] p-10 shadow-2xl">
                                        <div className="flex items-center space-x-6 mb-10">
                                            <div className="h-14 w-14 rounded-2xl bg-[#5865F2]/5 border border-[#5865F2]/20 flex items-center justify-center">
                                                <i className="fab fa-discord text-[#5865F2] text-2xl" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black italic">Discord Synchronization</h3>
                                                <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">Instant Relay Protocol</p>
                                            </div>
                                        </div>

                                        <form onSubmit={handleUpdateDiscord} className="space-y-6">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-3">Target Webhook</label>
                                                <input 
                                                    type="url"
                                                    value={discordUrl}
                                                    onChange={(e) => setDiscordUrl(e.target.value)}
                                                    className="w-full bg-black border border-white/5 rounded-2xl py-4 px-6 text-xs font-bold focus:outline-none focus:border-[#5865F2] transition-all"
                                                    placeholder="https://discord.com/api/webhooks/..."
                                                />
                                            </div>
                                            <div className="flex gap-4">
                                                <button 
                                                    type="submit"
                                                    disabled={loading}
                                                    className="bg-[#5865F2] hover:opacity-90 disabled:opacity-50 text-white font-black py-4 px-8 rounded-2xl text-[10px] uppercase tracking-widest transition-all shadow-xl"
                                                >
                                                    {loading ? 'Authorizing...' : discordUrl ? 'Update Signal' : 'Initiate Relay'}
                                                </button>
                                                {userProfile?.discord_webhook && (
                                                    <button 
                                                        type="button"
                                                        onClick={() => { setDiscordUrl(''); handleUpdateDiscord({ preventDefault: () => {} }); }}
                                                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 font-black py-4 px-8 rounded-2xl text-[10px] uppercase tracking-widest transition-all"
                                                    >
                                                        Sever
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    </div>

                                    {/* Slack */}
                                    <div className="bg-[#0b0b0d] border border-white/5 rounded-[32px] p-10 shadow-2xl">
                                        <div className="flex items-center space-x-6 mb-10">
                                            <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                                <i className="fab fa-slack text-white text-2xl" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black italic">Slack Integration</h3>
                                                <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">Workspace Broadcast Relay</p>
                                            </div>
                                        </div>

                                        <form onSubmit={handleUpdateSlack} className="space-y-6">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-3">Service Webhook</label>
                                                <input 
                                                    type="url"
                                                    value={slackUrl}
                                                    onChange={(e) => setSlackUrl(e.target.value)}
                                                    className="w-full bg-black border border-white/5 rounded-2xl py-4 px-6 text-xs font-bold focus:outline-none focus:border-white/30 transition-all font-mono"
                                                    placeholder="https://hooks.slack.com/services/..."
                                                />
                                            </div>
                                            <div className="flex gap-4">
                                                <button 
                                                    type="submit"
                                                    disabled={loading}
                                                    className="bg-white text-black hover:bg-slate-200 disabled:opacity-50 font-black py-4 px-8 rounded-2xl text-[10px] uppercase tracking-widest transition-all shadow-xl"
                                                >
                                                    {loading ? 'Processing...' : slackUrl ? 'Update Relay' : 'Enable Slack'}
                                                </button>
                                                {userProfile?.slack_webhook && (
                                                    <button 
                                                        type="button"
                                                        onClick={() => { setSlackUrl(''); handleUpdateSlack({ preventDefault: () => {} }); }}
                                                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 font-black py-4 px-8 rounded-2xl text-[10px] uppercase tracking-widest transition-all"
                                                    >
                                                        Disconnect
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
