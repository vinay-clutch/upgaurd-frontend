import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { LoadingSpinner } from './LoadingSpinner';
import { DashboardSkeleton } from './Skeleton';
import { AddWebsiteModal } from './AddWebsiteModal';
import { Navbar } from './Navbar';
import { getSocket } from '../services/socket';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area, CartesianGrid } from 'recharts';

export const Dashboard = () => {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total_websites: 0, websites_up: 0, websites_down: 0, avg_uptime_percentage: 100, total_incidents_today: 0 });
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    document.title = 'Dashboard | UpGuard';
    void loadData();
    // Poll every 30 seconds as backup
    const interval = setInterval(loadData, 30000);
    
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
      // Refresh stats on tick
      void loadStats();
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

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      loadWebsites(),
      loadStats(),
      loadPerformance()
    ]);
    setLoading(false);
  };

  const loadWebsites = async () => {
    try {
      const data = await api.getWebsites();
      setWebsites(data.websites || []);
    } catch (error) {
      console.error('Failed to load websites:', error);
    }
  };

  const loadStats = async () => {
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadPerformance = async () => {
    try {
      const data = await api.getGlobalPerformance();
      setPerformanceData(data);
    } catch (error) {
      console.error('Failed to load performance data:', error);
    }
  };

  const handleAddWebsite = () => {
    void loadData();
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08080a] via-[#0a0a0d] to-black text-white selection:bg-[#00f09a]/20">
      <Navbar />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Summary Cards */}
        {!loading && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Sites</p>
              <p className="text-2xl font-black text-white">{stats.total_websites}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-emerald-500/80 text-[10px] font-black uppercase tracking-widest mb-1">Online</p>
              <p className="text-2xl font-black text-emerald-400">{stats.websites_up}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-rose-500/80 text-[10px] font-black uppercase tracking-widest mb-1">Offline</p>
              <p className="text-2xl font-black text-rose-400">{stats.websites_down}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-[#00f09a]/80 text-[10px] font-black uppercase tracking-widest mb-1">Avg Uptime</p>
              <p className="text-2xl font-black text-[#00f09a]">{stats.avg_uptime_percentage}%</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 backdrop-blur-sm col-span-2 lg:col-span-1">
              <p className="text-amber-500/80 text-[10px] font-black uppercase tracking-widest mb-1">Incidents Today</p>
              <p className="text-2xl font-black text-amber-400">{stats.total_incidents_today}</p>
            </div>
          </div>
        )}

        {/* Global Performance Section */}
        {!loading && performanceData.length > 0 && (
          <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 mb-12 backdrop-blur-md">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black flex items-center gap-3">
                  <i className="fas fa-chart-line text-[#00f09a]" />
                  Global Response Latency (24h)
                </h3>
                <p className="text-slate-500 text-xs mt-1 font-medium">Aggregated performance baseline across all monitored nodes.</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Avg Latency</p>
                <p className="text-xl font-black text-white">
                  {Math.round(performanceData.reduce((acc, curr) => acc + curr.avg_response_ms, 0) / performanceData.length)}ms
                </p>
              </div>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="globalLatency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f09a" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00f09a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis 
                    dataKey="timestamp" 
                    hide 
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.1)" 
                    fontSize={10} 
                    tickFormatter={(val) => `${val}ms`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#08080a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#00f09a' }}
                    labelFormatter={(val) => new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  />
                  <Area
                    type="monotone"
                    dataKey="avg_response_ms"
                    stroke="#00f09a"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#globalLatency)"
                    name="Latency"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
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
                    ? 'bg-[#00f09a] border-[#00f09a] text-[#050505] shadow-lg shadow-[#00f09a]/10'
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
            className="group relative bg-[#00f09a] hover:bg-[#00cc82] text-[#050505] px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-[#00f09a]/20 active:scale-95"
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
              <div className="absolute inset-0 bg-[#00f09a]/10 blur-3xl rounded-full" />
              <div className="relative h-24 w-24 bg-slate-800 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
                <i className="fas fa-rocket text-4xl text-[#00f09a]" />
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
                className="group relative bg-slate-900/40 border border-white/5 rounded-2xl p-6 cursor-pointer hover:bg-slate-800/40 hover:border-[#00f09a]/30 transition-all hover:shadow-2xl hover:shadow-[#00f09a]/5 backdrop-blur-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className={`h-3 w-3 rounded-full shrink-0 shadow-sm ${
                      website.isPaused ? 'bg-slate-500' :
                      website.latest_status === 'Up' ? 'bg-emerald-400 shadow-emerald-500/40' : 
                      website.latest_status === 'Down' ? 'bg-rose-400 shadow-rose-500/40' : 'bg-slate-400'
                    }`} />
                    <h3 className="font-bold text-white truncate text-sm group-hover:text-[#00f09a] transition-colors" title={website.url}>
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
                    <i className="fas fa-arrow-right opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#00f09a]" />
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
