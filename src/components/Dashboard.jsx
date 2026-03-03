import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Navbar } from './Navbar';
import { AddWebsiteModal } from './AddWebsiteModal';
import { getSocket } from '../services/socket';

export const Dashboard = () => {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchWebsites = async () => {
    try {
      const data = await api.getWebsites();
      setWebsites(data);
      setLoading(true);
    } catch (error) {
      console.error('Failed to load websites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
    const socket = getSocket();
    socket.on('connect', () => setIsLive(true));
    socket.on('disconnect', () => setIsLive(false));
    socket.on('tick_update', fetchWebsites);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('tick_update');
    };
  }, []);

  const handleAddWebsite = async (url) => {
    try {
      await api.addWebsite(url);
      fetchWebsites();
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add website:', error);
    }
  };

  const getStats = () => {
    const total = websites.length;
    const up = websites.filter(w => !w.isPaused && w.latest_status === 'Up').length;
    const down = websites.filter(w => !w.isPaused && w.latest_status === 'Down').length;
    const avgUptime = websites.length > 0 
      ? (websites.reduce((acc, curr) => acc + parseFloat(curr.uptime_percentage), 0) / total).toFixed(3)
      : '100.000';
    return { total, up, down, avgUptime };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#00f09a]/20 font-['Inter']">
      <Navbar />

      <main className="max-w-7xl mx-auto py-32 px-4 sm:px-6 lg:px-8">
        {/* Summary Bar */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { l: 'TOTAL ASSETS', v: stats.total, c: 'text-white' },
              { l: 'SYSTEMS ONLINE', v: stats.up, c: 'text-[#00f09a]' },
              { l: 'SYSTEMS OFFLINE', v: stats.down, c: 'text-rose-500' },
              { l: 'SIGNAL STABILITY', v: `${stats.avgUptime}%`, c: 'text-[#00f09a]' }
            ].map((stat, i) => (
              <div key={i} className="bg-[#0b0b0d] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f09a]/5 blur-3xl rounded-full -mr-16 -mt-16 transition-all group-hover:bg-[#00f09a]/10" />
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-3">{stat.l}</p>
                <p className={`text-4xl font-black ${stat.c} tracking-tighter`}>{stat.v}</p>
              </div>
            ))}
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-2 uppercase italic">Global Monitoring</h2>
              <p className="text-slate-500 text-sm font-medium">Real-time telemetry from multiple distributed regions</p>
            </div>
            {isLive ? (
              <span className="bg-[#00f09a]/10 text-[#00f09a] px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border border-[#00f09a]/20 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#00f09a] rounded-full animate-pulse shadow-[0_0_8px_#00f09a]" />
                LIVE STREAM
              </span>
            ) : (
              <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                <i className="fas fa-circle-notch fa-spin text-[8px]" />
                Connecting
              </span>
            )}
          </div>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="w-full md:w-auto bg-[#00f09a] hover:bg-[#00cc82] text-black px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-[0_20px_40px_-10px_rgba(0,240,154,0.3)]"
          >
            <i className="fas fa-plus text-[10px]" />
            New Monitor
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse" />
             ))}
          </div>
        ) : websites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-[#0b0b0d] border border-white/5 rounded-[40px] shadow-2xl">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-[#00f09a]/10 blur-[80px] rounded-full" />
              <div className="relative h-28 w-28 bg-black rounded-3xl flex items-center justify-center border border-white/10">
                <i className="fas fa-satellite-dish text-4xl text-[#00f09a]" />
              </div>
            </div>
            <h3 className="text-2xl font-black mb-3">System Ready</h3>
            <p className="text-slate-500 mb-10 max-w-sm text-center text-sm font-medium leading-relaxed">
              Enable your first monitoring node to start receiving real-time diagnostic data and global uptime alerts.
            </p>
            <button 
              onClick={() => setShowAddModal(true)} 
              className="bg-white text-black px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl"
            >
              Add Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {websites.map((website) => (
              <div 
                key={website.id}
                onClick={() => navigate(`/website/${website.id}`)}
                className="group relative bg-[#0b0b0d] border border-white/5 rounded-[32px] p-8 cursor-pointer hover:border-[#00f09a]/40 transition-all hover:shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f09a]/2 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-[#00f09a]/5 transition-all" />
                
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center space-x-4 overflow-hidden">
                    <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                      website.isPaused ? 'bg-slate-700' :
                      website.latest_status === 'Up' ? 'bg-[#00f09a] shadow-[0_0_10px_#00f09a]' : 
                      'bg-rose-500 animate-pulse shadow-[0_0_15px_#f43f5e]'
                    }`} />
                    <h3 className="font-bold text-white truncate text-base tracking-tight group-hover:text-[#00f09a] transition-colors" title={website.url}>
                      {website.url.replace(/^https?:\/\//, '').toUpperCase()}
                    </h3>
                  </div>
                  {website.isPaused && (
                    <span className="text-[9px] uppercase font-bold text-slate-500 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                      PAUSED
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-black border border-white/5 rounded-2xl p-4 transition-colors group-hover:bg-white/5">
                    <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-1.5">Latency</p>
                    <p className="text-xl font-bold text-white tracking-tighter">
                      {website.isPaused ? '--' : `${website.last_response_ms || 0} MS`}
                    </p>
                  </div>
                  <div className="bg-black border border-white/5 rounded-2xl p-4 transition-colors group-hover:bg-white/5">
                    <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-1.5">Uptime</p>
                    <p className="text-xl font-bold text-[#00f09a] tracking-tighter">{website.uptime_percentage}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                    <i className="far fa-clock text-[#00f09a] opacity-50" />
                    {website.last_checked ? new Date(website.last_checked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
                  </div>
                  <i className="fas fa-chevron-right text-[10px] text-slate-800 group-hover:text-[#00f09a] group-hover:translate-x-1 transition-all" />
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
