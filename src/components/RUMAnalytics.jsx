import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Navbar } from './Navbar';
import { LoadingSpinner } from './LoadingSpinner';
import { getSocket } from '../socket';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export const RUMAnalytics = () => {
  const { websiteId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeVisitors, setActiveVisitors] = useState(0);
  const [exceptions, setExceptions] = useState([]);
  const [siteId, setSiteId] = useState(null);

  useEffect(() => {
    document.title = 'RUM Analytics | UpGuard';
    
    const init = async () => {
      setLoading(true);
      try {
        const res = await api.getAnalytics(websiteId);
        setData(res);
        setSiteId(res.site_id);
        setExceptions(res.recent_errors || []);
        setActiveVisitors(res.active_visitors || 0);

        // Quick separate check for live count as requested
        const liveRes = await api.getLiveCount(websiteId);
        if (liveRes.active_visitors !== undefined) {
          setActiveVisitors(liveRes.active_visitors);
        }
        
        if (res.enabled) {
          const socket = getSocket();
          socket.emit('join_site_room', res.site_id);
          
          socket.on('visitor_joined', (data) => {
            setActiveVisitors(data.activeCount);
          });
          
          socket.on('visitor_left', (data) => {
            setActiveVisitors(data.activeCount);
          });
          
          socket.on('client_error', (data) => {
            setExceptions(prev => [data.error, ...prev].slice(0, 20));
            toast.error(`New Exception: ${data.error.message}`, {
              icon: '🚨',
              style: {
                borderRadius: '10px',
                background: '#1e1e2e',
                color: '#fff',
              },
            });
          });
        }
      } catch (err) {
        toast.error('Failed to load analytics: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    init();

    return () => {
      const socket = getSocket();
      socket.off('visitor_joined');
      socket.off('visitor_left');
      socket.off('client_error');
    };
  }, [websiteId]);

  const handleResolveError = async (errorId) => {
    try {
      await api.resolveError(errorId);
      setExceptions(prev => prev.filter(err => err.id !== errorId));
      toast.success('Error marked as resolved');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return (

    <div className="min-h-screen bg-[#08080a] text-white">
      <Navbar />
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <LoadingSpinner />
      </div>
    </div>
  );

  if (!data?.enabled) {
    return (
      <div className="min-h-screen bg-[#08080a] text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto py-12 px-4">
          <button 
            onClick={() => navigate(`/website/${websiteId}`)}
            className="text-slate-400 hover:text-white mb-8 flex items-center transition-colors font-medium text-sm"
          >
            <i className="fas fa-arrow-left mr-2" /> Back to Details
          </button>
          <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-12 backdrop-blur-xl text-center">
            <h1 className="text-2xl font-bold mb-4 text-rose-400">RUM Not Enabled</h1>
            <p className="text-slate-400 mb-8">Please enable standard Analytics first to get your Site ID and Tracker script.</p>
            <button 
               onClick={() => navigate(`/websites/${websiteId}/analytics`)}
               className="bg-[#00f09a] text-black px-6 py-2 rounded-xl font-bold"
            >
              Go to Analytics
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-white pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(`/website/${websiteId}`)}
          className="text-slate-400 hover:text-white mb-8 flex items-center transition-colors font-medium text-sm"
        >
          <i className="fas fa-arrow-left mr-2" /> Back to Details
        </button>
        <header className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded border border-indigo-500/20">
                Real-User Monitoring
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#00f09a]/10 text-[#00f09a] text-[10px] font-bold uppercase tracking-wider rounded border border-[#00f09a]/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f09a] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f09a]"></span>
                </span>
                Live
              </div>
            </div>
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
              RUM Analytics
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-slate-900/80 border border-white/5 rounded-2xl px-6 py-3 flex items-center gap-4 backdrop-blur-md">
               <div className="flex flex-col items-end">
                 <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Visitors</span>
                 <span className="text-2xl font-black text-[#00f09a] tabular-nums">{activeVisitors}</span>
               </div>
               <div className="h-10 w-10 bg-[#00f09a]/10 rounded-xl flex items-center justify-center border border-[#00f09a]/20">
                  <i className="fas fa-users text-[#00f09a]" />
               </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Visitor Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-[#00f09a]/10 to-transparent border border-[#00f09a]/20 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -m-4 h-32 w-32 bg-[#00f09a]/5 rounded-full blur-3xl group-hover:bg-[#00f09a]/10 transition-all duration-700" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-2 w-2 bg-[#00f09a] rounded-full animate-pulse shadow-[0_0_10px_#00f09a]" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Live Status</h3>
                </div>
                
                <h4 className="text-5xl font-black mb-2 tabular-nums">
                  {activeVisitors}
                </h4>
                <p className="text-slate-400 text-sm font-medium">
                  Current concurrent visitors browsing your site right now.
                </p>
                
                <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Site ID</span>
                    <span className="text-slate-300 font-mono">{siteId}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Status</span>
                    <span className="text-[#00f09a] font-bold">Connected</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-6">
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                 <i className="fas fa-info-circle" /> RUM Guide
               </h3>
               <p className="text-slate-400 text-xs leading-relaxed">
                 Real-User Monitoring captures live interactions. Ensure the tracker script is properly placed in your site's <code className="text-indigo-400">HEAD</code>.
               </p>
            </div>
          </div>

          {/* Exceptions Table */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/50 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Recent Frontend Exceptions</h3>
                  <p className="text-xs text-slate-500 mt-1">Live feed of JavaScript errors occurring in production.</p>
                </div>
                <div className="h-8 w-8 bg-rose-500/10 rounded-lg flex items-center justify-center text-rose-500 border border-rose-500/20">
                  <i className="fas fa-bug" />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.02] text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      <th className="px-6 py-4">Error Message</th>
                      <th className="px-6 py-4">URL</th>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-white/5">
                    <AnimatePresence initial={false}>
                      {exceptions.map((err) => (
                        <motion.tr 
                          key={err.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="hover:bg-white/[0.02] transition-colors group"
                        >
                          <td className="px-6 py-4 max-w-xs transition-all">
                            <div className="flex flex-col">
                              <span className="text-rose-400 font-bold mb-1 group-hover:text-rose-300">{err.message}</span>
                              <span className="text-[10px] text-slate-500 font-mono truncate">{err.browser || 'Unknown Browser'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-400 font-medium">
                            {err.page_url}
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-xs tabular-nums">
                            {new Date(err.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleResolveError(err.id)}
                              className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-bold hover:bg-emerald-500/20 transition-all opacity-0 group-hover:opacity-100"
                            >
                              Resolve
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>

                    
                    {exceptions.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-6 py-12 text-center">
                           <div className="flex flex-col items-center gap-3">
                              <div className="h-12 w-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                                <i className="fas fa-check-circle text-xl" />
                              </div>
                              <p className="text-slate-400 font-medium italic">No frontend exceptions caught yet.</p>
                           </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
