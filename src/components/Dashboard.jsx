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
import { CommandCenterMap } from './CommandCenterMap';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activePulse, setActivePulse] = useState(null);
  const [stats, setStats] = useState({ total_websites: 0, websites_up: 0, websites_down: 0, avg_uptime_percentage: 100, total_incidents_today: 0 });
  const [performanceData, setPerformanceData] = useState([]);

  const allTags = ['All', ...new Set(websites.flatMap(s => s.tags || []))];
  const filteredWebsites = activeFilter === 'All' 
    ? websites 
    : websites.filter(s => s.tags?.includes(activeFilter));

  useEffect(() => {
    document.title = 'Dashboard | UpGuard';
    void loadData();
    const interval = setInterval(loadData, 30000);
    
    const socket = getSocket();
    const handleTickUpdate = (data) => {
      setWebsites(prev => prev.map(site => {
        if (site.id === data.websiteId) {
          // Trigger map pulse based on region
          const regionMap = { 'Mumbai, IN': 'mumbai', 'Singapore, SG': 'singapore', 'US East, VA': 'us-east' };
          setActivePulse(regionMap[data.region] || 'mumbai');
          setTimeout(() => setActivePulse(null), 100);

          return {
            ...site,
            latest_status: data.status,
            last_response_ms: data.response_ms,
            last_checked: data.timestamp
          };
        }
        return site;
      }));
      void loadStats();
    };

    socket.on('tick_update', handleTickUpdate);
    socket.on('connect', () => setIsLive(true));
    socket.on('disconnect', () => setIsLive(false));
    setIsLive(socket.connected);

    return () => {
      clearInterval(interval);
      socket.off('tick_update', handleTickUpdate);
    };
  }, []);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadWebsites(), loadStats(), loadPerformance()]);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08080a] via-[#0a0a0d] to-black text-white selection:bg-[#00f09a]/20">
      <Navbar />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Real-time Intel Map */}
        <div className="mb-12">
          <CommandCenterMap 
             activePulse={activePulse} 
             riskLevel={stats.websites_down > 0 ? 'High' : 'Stable'}
          />
        </div>

        {/* Summary Cards */}
        {!loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-10"
          >
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Sites</p>
              <p className="text-2xl font-black text-white">{stats.total_websites}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-emerald-500/80 text-[10px] font-black uppercase tracking-widest mb-1">Online</p>
              <p className="text-2xl font-black text-emerald-400">{stats.websites_up}</p>
            </div>
            <div className="bg-[#00f09a]/5 border border-[#00f09a]/20 rounded-2xl p-4 backdrop-blur-sm ring-1 ring-[#00f09a]/20">
              <div className="flex justify-between items-start mb-1">
                <p className="text-[#00f09a] text-[10px] font-black uppercase tracking-widest">Global Uptime</p>
                {Number(stats.avg_uptime_percentage) >= 100 && (
                  <span className="text-[10px] animate-bounce">🏆</span>
                )}
              </div>
              <p className="text-2xl font-black text-[#00f09a]">{stats.avg_uptime_percentage}%</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">SLA Target</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-black text-white">99.9%</p>
                <i className={`fas fa-check-circle text-xs ${Number(stats.avg_uptime_percentage) >= 99.9 ? 'text-emerald-400' : 'text-slate-600'}`} />
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-rose-500/80 text-[10px] font-black uppercase tracking-widest mb-1">Offline</p>
              <p className="text-2xl font-black text-rose-400">{stats.websites_down}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-amber-500/80 text-[10px] font-black uppercase tracking-widest mb-1">Incidents</p>
              <p className="text-2xl font-black text-amber-400">{stats.total_incidents_today}</p>
            </div>
          </motion.div>
        )}

        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black tracking-tighter">Command Center</h2>
            <p className="text-slate-400 text-sm">Real-time infrastructure health matrix</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="group bg-[#00f09a] hover:bg-[#00cc82] text-[#050505] px-6 py-2.5 rounded-xl text-sm font-black transition-all active:scale-95 shadow-lg shadow-[#00f09a]/20"
          >
            <i className="fas fa-plus mr-2" />
            Connect Asset
          </button>
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredWebsites.map((website, i) => (
                <motion.div 
                  key={website.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/website/${website.id}`)}
                  className="group relative bg-white/[0.02] border border-white/5 rounded-3xl p-6 cursor-pointer hover:bg-white/[0.04] hover:border-[#00f09a]/30 transition-all backdrop-blur-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                        website.isPaused ? 'bg-slate-500' :
                        website.latest_status === 'Up' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                      }`} />
                      <h3 className="font-bold text-white truncate text-base group-hover:text-[#00f09a] transition-colors">
                        {website.url.replace(/^https?:\/\//, '')}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Latency</p>
                      <p className="text-xl font-black text-white">{website.last_response_ms || 0}ms</p>
                    </div>
                    <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Uptime</p>
                      <p className="text-xl font-black text-white">{website.uptime_percentage}%</p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex gap-1">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className={`h-1 w-4 rounded-full ${website.latest_status === 'Up' ? 'bg-emerald-500/40' : 'bg-rose-500/40'}`} />
                      ))}
                    </div>
                    <i className="fas fa-chevron-right text-[10px] text-slate-600 group-hover:text-[#00f09a] group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      <AddWebsiteModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onAdd={loadData} 
      />
    </div>
  );
};
