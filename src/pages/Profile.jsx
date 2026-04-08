import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Navbar } from '../components/Navbar';
import { toast } from 'react-hot-toast';

export const Profile = () => {
    const { userProfile, refreshProfile, logout } = useAuth();
    const [name, setName] = useState(userProfile?.name || '');
    const [email, setEmail] = useState(userProfile?.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [discordUrl, setDiscordUrl] = useState(userProfile?.discord_webhook || '');
    const [slackUrl, setSlackUrl] = useState(userProfile?.slack_webhook || '');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('account');

    useEffect(() => {
        document.title = 'Profile | UpGuard';
        if (userProfile) {
            setName(userProfile.name || '');
            setEmail(userProfile.email || '');
            setDiscordUrl(userProfile.discord_webhook || '');
            setSlackUrl(userProfile.slack_webhook || '');
        }
    }, [userProfile]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.updateProfile(name, email);
            toast.success('Profile updated successfully!');
            await refreshProfile();
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await api.changePassword(currentPassword, newPassword);
            toast.success('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error(error.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('CRITICAL: This will permanently delete your account and all monitoring data. This action cannot be undone. Are you sure?')) {
            return;
        }
        
        const secondConfirm = window.prompt('Type "DELETE" to confirm account deletion:');
        if (secondConfirm !== 'DELETE') return;

        setLoading(true);
        try {
            await api.deleteAccount();
            toast.success('Account deleted successfully');
            logout();
        } catch (error) {
            toast.error(error.message || 'Failed to delete account');
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
        <div className="min-h-screen bg-[#08080a] text-white font-['Inter',sans-serif]">
            <Navbar />
            
            <main className="max-w-6xl mx-auto py-16 px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Command Center</h1>
                        <p className="text-slate-500 text-lg">Manage your identity, security, and global integrations.</p>
                    </div>
                    {userProfile?.stats && (
                        <div className="flex gap-4">
                            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 min-w-[140px] backdrop-blur-sm">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">MONITORED</div>
                                <div className="text-2xl font-black text-[#00f09a]">{userProfile.stats.total_websites} Sites</div>
                            </div>
                            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 min-w-[140px] backdrop-blur-sm">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">TOTAL CHECKS</div>
                                <div className="text-2xl font-black text-[#06b6d4]">{userProfile.stats.total_checks} Ticks</div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Sidebar */}
                    <aside className="w-full lg:w-72 space-y-2">
                        <button 
                            onClick={() => setActiveTab('account')}
                            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'account' ? 'bg-[#00f09a] text-[#050505] shadow-lg shadow-[#00f09a]/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <i className="fas fa-user-circle text-lg" />
                            <span>Account Details</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'security' ? 'bg-[#00f09a] text-[#050505] shadow-lg shadow-[#00f09a]/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <i className="fas fa-shield-alt text-lg" />
                            <span>Security</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('notifications')}
                            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'notifications' ? 'bg-[#00f09a] text-[#050505] shadow-lg shadow-[#00f09a]/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <i className="fas fa-bell text-lg" />
                            <span>Notifications</span>
                        </button>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 space-y-8">
                        
                        {activeTab === 'account' && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 md:p-12 backdrop-blur-md">
                                    <div className="flex items-center space-x-8 mb-12">
                                        <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-[#00f09a] to-[#06b6d4] flex items-center justify-center text-4xl font-black text-[#050505] shadow-2xl shadow-[#00f09a]/10">
                                            {userProfile?.username?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black text-white mb-1">{userProfile?.username || 'User Profile'}</h3>
                                            <p className="text-slate-500 font-mono text-sm uppercase tracking-wider">UID: {userProfile?.id?.split('-')[0] || '...'}</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleUpdateProfile} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Full Name</label>
                                                <div className="relative group">
                                                    <i className="fas fa-user absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-[#00f09a]" />
                                                    <input 
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-[#00f09a] focus:ring-4 focus:ring-[#00f09a]/5 transition-all text-white placeholder-slate-700"
                                                        placeholder="Your full name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Email Address</label>
                                                <div className="relative group">
                                                    <i className="fas fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-[#00f09a]" />
                                                    <input 
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-[#00f09a] focus:ring-4 focus:ring-[#00f09a]/5 transition-all text-white placeholder-slate-700"
                                                        placeholder="Your notification email"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="pt-4">
                                            <button 
                                                type="submit"
                                                disabled={loading}
                                                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black py-4 px-10 rounded-2xl text-sm transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
                                            >
                                                {loading ? <i className="fas fa-circle-notch animate-spin" /> : <i className="fas fa-save" />}
                                                <span>Save Profile Changes</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </section>
                        )}

                        {activeTab === 'security' && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                                <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 md:p-12 backdrop-blur-md">
                                    <h3 className="text-2xl font-black mb-8">Update Password</h3>
                                    
                                    <form onSubmit={handleChangePassword} className="max-w-md space-y-6">
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Current Password</label>
                                            <input 
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-[#00f09a] transition-all text-white"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">New Password</label>
                                            <input 
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-[#00f09a] transition-all text-white"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Confirm New Password</label>
                                            <input 
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-[#00f09a] transition-all text-white"
                                                required
                                            />
                                        </div>
                                        <button 
                                            type="submit"
                                            disabled={loading}
                                            className="bg-[#00f09a] hover:opacity-90 text-[#050505] font-black py-4 px-10 rounded-2xl text-sm transition-all shadow-xl shadow-[#00f09a]/10 active:scale-95 disabled:opacity-50"
                                        >
                                            {loading ? 'Processing...' : 'Change Password'}
                                        </button>
                                    </form>
                                </div>

                                <div className="bg-rose-500/[0.02] border border-rose-500/10 rounded-[32px] p-8 md:p-12">
                                    <h3 className="text-2xl font-black text-rose-500 mb-4">Danger Zone</h3>
                                    <p className="text-slate-400 mb-8 max-w-xl">Once you delete your account, there is no going back. Please be certain.</p>
                                    
                                    <button 
                                        onClick={handleDeleteAccount}
                                        className="bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 font-black py-4 px-10 rounded-2xl text-sm transition-all active:scale-95"
                                    >
                                        Delete My Account Permanently
                                    </button>
                                </div>
                            </section>
                        )}

                        {activeTab === 'notifications' && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                                {/* Discord */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 md:p-12 backdrop-blur-md">
                                    <div className="flex items-center space-x-6 mb-10">
                                        <div className="h-16 w-16 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/20 flex items-center justify-center text-3xl">
                                            <i className="fab fa-discord text-[#5865F2]" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white">Discord Dispatch</h3>
                                            <p className="text-slate-500">Global incident notifications via Discord webhooks.</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleUpdateDiscord} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Webhook URL</label>
                                            <input 
                                                type="url"
                                                value={discordUrl}
                                                onChange={(e) => setDiscordUrl(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-[#5865F2] transition-all text-white"
                                                placeholder="https://discord.com/api/webhooks/..."
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <button 
                                                type="submit"
                                                disabled={loading}
                                                className="bg-[#5865F2] hover:opacity-90 text-white font-black py-4 px-10 rounded-2xl text-sm transition-all shadow-xl shadow-[#5865F2]/10 active:scale-95 disabled:opacity-50"
                                            >
                                                {loading ? 'Connecting...' : discordUrl ? 'Update Discord' : 'Connect Discord'}
                                            </button>
                                            {userProfile?.discord_webhook && (
                                                <button 
                                                    type="button"
                                                    onClick={() => { setDiscordUrl(''); handleUpdateDiscord({ preventDefault: () => {} }); }}
                                                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold py-4 px-10 rounded-2xl text-sm transition-all"
                                                >
                                                    Disconnect
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>

                                {/* Slack */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 md:p-12 backdrop-blur-md">
                                    <div className="flex items-center space-x-6 mb-10">
                                        <div className="h-16 w-16 rounded-2xl bg-[#4A154B]/10 border border-[#4A154B]/20 flex items-center justify-center text-3xl">
                                            <i className="fab fa-slack text-[#E01E5A]" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white">Slack Sync</h3>
                                            <p className="text-slate-500">Real-time alerts for your engineering workspace.</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleUpdateSlack} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Webhook URL</label>
                                            <input 
                                                type="url"
                                                value={slackUrl}
                                                onChange={(e) => setSlackUrl(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-[#4A154B] transition-all text-white"
                                                placeholder="https://hooks.slack.com/services/..."
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <button 
                                                type="submit"
                                                disabled={loading}
                                                className="bg-[#4A154B] hover:opacity-90 text-white font-black py-4 px-10 rounded-2xl text-sm transition-all shadow-xl shadow-[#4A154B]/10 active:scale-95 disabled:opacity-50"
                                            >
                                                {loading ? 'Connecting...' : slackUrl ? 'Update Slack' : 'Connect Slack'}
                                            </button>
                                            {userProfile?.slack_webhook && (
                                                <button 
                                                    type="button"
                                                    onClick={() => { setSlackUrl(''); handleUpdateSlack({ preventDefault: () => {} }); }}
                                                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold py-4 px-10 rounded-2xl text-sm transition-all"
                                                >
                                                    Disconnect
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};
