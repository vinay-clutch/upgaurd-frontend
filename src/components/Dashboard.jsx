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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white selection:bg-indigo-500/30">
      <Navbar />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Summary Bar */}
        {!loading && websites.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Assets</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-emerald-500/80 text-xs font-bold uppercase tracking-widest mb-1">Online</p>
              <p className="text-2xl font-bold text-emerald-400">{stats.up}</p>
            </div>
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-rose-500/80 text-xs font-bold uppercase tracking-widest mb-1">Offline</p>
              <p className="text-2xl font-bold text-rose-400">{stats.down}</p>
            </div>
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-indigo-500/80 text-xs font-bold uppercase tracking-widest mb-1">Avg Uptime</p>
              <p className="text-2xl font-bold text-indigo-400">{stats.avgUptime}%</p>
            </div>
          </div>
        )}

        {/* Filters */}
        {!loading && websites.length > 0 && allTags.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8 items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mr-2">Filter by tag:</span>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  activeFilter === tag
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Monitoring Dashboard</h2>
              <p className="text-slate-400 text-sm">Real-time status of your connected infrastructure</p>
            </div>
            {isLive ? (
              <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-500/20 flex items-center gap-2 shadow-lg shadow-emerald-500/5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                LIVE
              </span>
            ) : (
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                <i className="fas fa-circle-notch fa-spin text-[8px]" />
                Connecting...
              </span>
            )}
          </div>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="group relative bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
          >
            <i className="fas fa-plus mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add Website
          </button>
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : websites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900/20 border border-dashed border-white/10 rounded-3xl">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
              <div className="relative h-24 w-24 bg-slate-800 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
                <i className="fas fa-rocket text-4xl text-indigo-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">No websites monitored yet</h3>
            <p className="text-slate-400 mb-8 max-w-xs text-center text-sm">
              Connect your first asset to start receiving real-time uptime alerts and performance insights.
            </p>
            <button 
              onClick={() => setShowAddModal(true)} 
              className="bg-white text-slate-950 px-8 py-3 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
            >
              Add your first website
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebsites.map((website) => (
              <div 
                key={website.id}
                onClick={() => navigate(`/website/${website.id}`)}
                className="group relative bg-slate-900/40 border border-white/5 rounded-2xl p-6 cursor-pointer hover:bg-slate-800/40 hover:border-indigo-500/30 transition-all hover:shadow-2xl hover:shadow-indigo-500/5 backdrop-blur-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className={`h-3 w-3 rounded-full shrink-0 shadow-sm ${
                      website.isPaused ? 'bg-slate-500' :
                      website.latest_status === 'Up' ? 'bg-emerald-400 shadow-emerald-500/40' : 
                      website.latest_status === 'Down' ? 'bg-rose-400 shadow-rose-500/40' : 'bg-slate-400'
                    }`} />
                    <h3 className="font-bold text-white truncate text-sm group-hover:text-indigo-300 transition-colors" title={website.url}>
                      {website.url.replace(/^https?:\/\//, '')}
                    </h3>
                  </div>
                  {isMaintActive(website) ? (
                    <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 animate-pulse">
                      <i className="fas fa-tools mr-1" /> Maint.
                    </span>
                  ) : website.isPaused && (
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                      Paused
                    </span>
                  )}
                </div>

                {/* Tags Badge */}
                {(website.tags || []).length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4 h-5 overflow-hidden">
                    {website.tags.map(tag => (
                      <span key={tag} className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getTagColor(tag)}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Latency</p>
                    <p className="text-lg font-bold text-slate-200">
                      {website.isPaused ? '--' : `${website.last_response_ms || 0}ms`}
                    </p>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Uptime</p>
                    <p className="text-lg font-bold text-slate-200">{website.uptime_percentage}%</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <div className="flex items-center">
                    <i className="fas fa-clock mr-1.5 opacity-50" />
                    {website.last_checked ? new Date(website.last_checked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        api.exportCsv(website.id, 7);
                      }}
                      title="Quick Export (Last 7 days)"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/5"
                    >
                      <i className="fas fa-file-export text-[10px]" />
                    </button>
                    <i className="fas fa-arrow-right opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-indigo-400" />
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
