import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { LoadingSpinner } from './LoadingSpinner';
import { DashboardSkeleton } from './Skeleton';
import { AddWebsiteModal } from './AddWebsiteModal';
import { Navbar } from './Navbar';
import { getSocket } from '../services/socket';

export const Dashboard = () => {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const { userProfile, updateUserEmail } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');

  const getTagColor = (tag) => {
    switch (tag) {
      case 'Production': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Staging': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Client': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Personal': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    }
  };

  const allTags = ['All', ...new Set(websites.flatMap(w => w.tags || []))];
  const filteredWebsites = activeFilter === 'All' 
    ? websites 
    : websites.filter(w => (w.tags || []).includes(activeFilter));

  const isMaintActive = (w) => w.maintenance_start && w.maintenance_end && 
    new Date() >= new Date(w.maintenance_start) && 
    new Date() <= new Date(w.maintenance_end);

  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    document.title = 'Dashboard | UpGuard';
    void loadWebsites();
    // Poll every 30 seconds as backup
    const interval = setInterval(loadWebsites, 30000);
    
    // WebSocket setup
    const socket = getSocket();
    
    const handleTickUpdate = (data) => {
      setWebsites(prev => prev.map(site => {
        if (site.id === data.websiteId) {
          return {
            ...site,
            latest_status: data.status,
            last_response_ms: data.response_ms,
            last_checked: data.timestamp
          };
        }
        return site;
      }));
    };

    socket.on('tick_update', handleTickUpdate);
    socket.on('connect', () => setIsLive(true));
    socket.on('disconnect', () => setIsLive(false));
    setIsLive(socket.connected);

    return () => {
      clearInterval(interval);
      socket.off('tick_update', handleTickUpdate);
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const loadWebsites = async () => {
    try {
      const data = await api.getWebsites();
      setWebsites(data.websites || []);
    } catch (error) {
      console.error('Failed to load websites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWebsite = () => {
    void loadWebsites();
    setShowAddModal(false);
  };

  const getStats = () => {
    const total = websites.length;
    const up = websites.filter(w => w.latest_status === 'Up' && !w.isPaused).length;
    const down = websites.filter(w => w.latest_status === 'Down' && !w.isPaused).length;
    const avgUptime = websites.length > 0
      ? (websites.reduce((acc, w) => acc + w.uptime_percentage, 0) / websites.length).toFixed(1)
      : 0;
    
    return { total, up, down, avgUptime };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#bc2c12]/20 font-['Outfit']">
      <Navbar />

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Summary Bar */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { l: 'TOTAL ASSETS', v: stats.total, c: 'text-white' },
              { l: 'SYSTEMS ONLINE', v: stats.up, c: 'text-white' },
              { l: 'SYSTEMS OFFLINE', v: stats.down, c: 'text-[#bc2c12]' },
              { l: 'UPTIME ACCURACY', v: `${stats.avgUptime}%`, c: 'text-[#bc2c12]' }
            ].map((stat, i) => (
              <div key={i} className="bg-[#050505] border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#bc2c12]/5 blur-3xl rounded-full -mr-16 -mt-16 transition-all group-hover:bg-[#bc2c12]/10" />
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.l}</p>
                <p className={`text-4xl font-black ${stat.c} tracking-tighter`}>{stat.v}</p>
              </div>
            ))}
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div>
              <h2 className="text-3xl font-black tracking-tighter mb-1">Infrastructure Control</h2>
              <p className="text-slate-500 text-sm font-medium">Global status monitoring for mission-critical services</p>
            </div>
            {isLive ? (
              <span className="bg-[#bc2c12]/10 text-[#bc2c12] px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border border-[#bc2c12]/20 flex items-center gap-2 shadow-lg shadow-[#bc2c12]/10">
                <span className="w-1.5 h-1.5 bg-[#bc2c12] rounded-full animate-pulse shadow-[0_0_8px_#bc2c12]" />
                LIVE FEED
              </span>
            ) : (
              <span className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                <i className="fas fa-circle-notch fa-spin text-[8px]" />
                Syncing
              </span>
            )}
          </div>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="w-full md:w-auto bg-[#bc2c12] hover:bg-[#d43216] text-white px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:shadow-[0_15px_30px_-5px_rgba(188,44,18,0.4)] active:scale-95 flex items-center justify-center gap-3"
          >
            <i className="fas fa-plus text-[10px]" />
            Provision Website
          </button>
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : websites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-[#050505] border border-white/5 rounded-[32px] shadow-2xl">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-[#bc2c12]/20 blur-[100px] rounded-full" />
              <div className="relative h-28 w-28 bg-[#0c0c0e] rounded-[32px] flex items-center justify-center border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                <i className="fas fa-satellite-dish text-5xl text-[#bc2c12]" />
              </div>
            </div>
            <h3 className="text-2xl font-black mb-3 tracking-tight">System Ready for Provisioning</h3>
            <p className="text-slate-500 mb-10 max-w-sm text-center text-sm font-medium leading-relaxed">
              Initialize your first monitoring node to start receiving real-time diagnostic data and global uptime alerts.
            </p>
            <button 
              onClick={() => setShowAddModal(true)} 
              className="bg-white text-black px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl active:scale-95"
            >
              Initialize Node
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWebsites.map((website) => (
              <div 
                key={website.id}
                onClick={() => navigate(`/website/${website.id}`)}
                className="group relative bg-[#050505] border border-white/5 rounded-[24px] p-8 cursor-pointer hover:border-[#bc2c12]/40 transition-all hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#bc2c12]/2 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-[#bc2c12]/5 transition-all" />
                
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4 overflow-hidden">
                    <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                      website.isPaused ? 'bg-slate-700' :
                      website.latest_status === 'Up' ? 'bg-[#bc2c12] shadow-[0_0_10px_#bc2c12]' : 
                      'bg-rose-600 animate-pulse shadow-[0_0_15px_#e11d48]'
                    }`} />
                    <h3 className="font-black text-white truncate text-base tracking-tight group-hover:text-[#bc2c12] transition-colors" title={website.url}>
                      {website.url.replace(/^https?:\/\//, '').toUpperCase()}
                    </h3>
                  </div>
                  {isMaintActive(website) ? (
                    <span className="text-[9px] uppercase font-black text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                      OFFLINE FIX
                    </span>
                  ) : website.isPaused && (
                    <span className="text-[9px] uppercase font-black text-slate-500 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                      PAUSED
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-black border border-white/5 rounded-2xl p-4 group-hover:bg-[#0c0c0e] transition-colors">
                    <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-1.5">Latency</p>
                    <p className="text-xl font-black text-white tracking-tighter">
                      {website.isPaused ? '--' : `${website.last_response_ms || 0} MS`}
                    </p>
                  </div>
                  <div className="bg-black border border-white/5 rounded-2xl p-4 group-hover:bg-[#0c0c0e] transition-colors">
                    <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-1.5">Uptime</p>
                    <p className="text-xl font-black text-[#bc2c12] tracking-tighter">{website.uptime_percentage}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-slate-600 font-black uppercase tracking-widest">
                    <i className="far fa-clock text-[#bc2c12] opacity-50" />
                    {website.last_checked ? new Date(website.last_checked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        api.exportCsv(website.id, 7);
                      }}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-[#bc2c12] hover:text-white text-slate-500 transition-all border border-white/5"
                    >
                      <i className="fas fa-share-square text-[10px]" />
                    </button>
                    <i className="fas fa-chevron-right text-[10px] text-slate-700 group-hover:text-[#bc2c12] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <AddWebsiteModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onAdd={handleAddWebsite} 
      />
    </div>
  );
};
