import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { LoadingSpinner } from './LoadingSpinner';
import { toast } from 'react-hot-toast';
import { ResponseTimeChart } from './ResponseTimeChart';
import { Navbar } from './Navbar';
import { getSocket } from '../services/socket';

const getRegionFlag = (regionName) => {
  if (!regionName) return '🌍';
  if (regionName.includes('Virginia') || regionName.includes('US East')) return '🇺🇸';
  if (regionName.includes('Mumbai') || regionName.includes('ap-south')) return '🇮🇳';
  if (regionName.includes('Singapore')) return '🇸🇬';
  if (regionName.includes('Ireland')) return '🇮🇪';
  if (regionName.includes('Frankfurt')) return '🇩🇪';
  return '🌍';
};

export const WebsiteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [ssl, setSsl] = useState(null);
  const [sslLoading, setSslLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const data = await api.getWebsiteStatus(id);
      setDetails(data);
    } catch (error) {
      console.error('Failed to load website details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSsl = async () => {
    try {
      const data = await api.getSslStatus(id);
      setSsl(data);
    } catch (err) {
      setSsl({ valid: false, error: 'Failed to check SSL' });
    } finally {
      setSslLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetails();
      fetchSsl();
    }
  }, [id]);

  useEffect(() => {
    const socket = getSocket();
    const handleUpdate = (data) => { if (data.websiteId === id) fetchDetails(); };
    socket.on('tick_update', handleUpdate);
    return () => socket.off('tick_update', handleUpdate);
  }, [id]);

  const handlePauseResume = async () => {
    if (!details) return;
    const isPaused = details.isPaused;
    setActionLoading(true);
    try {
      if (isPaused) await api.resumeWebsite(id);
      else await api.pauseWebsite(id);
      await fetchDetails();
      toast.success(isPaused ? 'Uplink Resumed' : 'Uplink Suspended');
    } catch (e) { toast.error('Command Failed'); }
    finally { setActionLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('TERMINATE MONITORING FOR THIS NODE?')) return;
    setActionLoading(true);
    try {
      await api.deleteWebsite(id);
      toast.success('Node Decommissioned');
      navigate('/dashboard');
    } catch (e) { toast.error('Termination Failed'); setActionLoading(false); }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-['Inter']"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#00f09a]/20 font-['Inter']">
      <Navbar />

      <main className="max-w-7xl mx-auto py-32 px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <button onClick={() => navigate('/dashboard')} className="flex items-center text-slate-600 hover:text-white transition-all mb-8 text-[10px] font-black uppercase tracking-[0.3em]">
            <i className="fas fa-chevron-left mr-3" /> System Console
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="flex items-center space-x-6 min-w-0">
              <div className={`h-20 w-20 shrink-0 rounded-[28px] bg-[#0b0b0d] border border-white/5 flex items-center justify-center shadow-2xl relative`}>
                <div className={`absolute inset-0 blur-[40px] rounded-full opacity-20 ${details?.latest_status === 'Up' ? 'bg-[#00f09a]' : 'bg-rose-500'}`} />
                <i className={`fas fa-microchip text-3xl relative ${details?.latest_status === 'Up' ? 'text-[#00f09a]' : 'text-rose-500'}`} />
              </div>
              <div className="min-w-0">
                <h1 className="text-5xl font-black tracking-tighter truncate max-w-full italic">{details?.url.toUpperCase().replace(/^HTTPS?:\/\//, '')}</h1>
                <p className="text-slate-600 text-[10px] flex items-center mt-3 font-black tracking-[0.2em] uppercase">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full mr-3 shadow-lg ${
                    details?.isPaused ? 'bg-slate-800' : 
                    details?.latest_status === 'Up' ? 'bg-[#00f09a] shadow-[0_0_8px_#00f09a]' : 
                    'bg-rose-600 animate-pulse shadow-[0_0_12px_#f43f5e]'
                  }`} />
                  {details?.isPaused ? 'Signal Offline' : details?.latest_status === 'Up' ? 'Uplink Stable' : 'Service Alert'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 lg:justify-end">
              <button 
                onClick={handlePauseResume} 
                disabled={actionLoading}
                className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 bg-[#0b0b0d] hover:bg-[#00f09a] hover:text-black transition-all shadow-2xl disabled:opacity-50"
              >
                 <i className={`fas ${details?.isPaused ? 'fa-play' : 'fa-pause'} mr-3`} />
                 {details?.isPaused ? 'Restore Node' : 'Suspend Node'}
              </button>
              <div className="flex items-center gap-3 bg-[#0b0b0d] border border-white/5 p-1 rounded-2xl shadow-2xl">
                <button onClick={() => navigate(`/websites/${id}/analytics`)} className="px-6 py-3.5 rounded-xl text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-all">Analytics</button>
                <button onClick={handleDelete} className="px-6 py-3.5 rounded-xl text-[9px] font-bold uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all">Destroy</button>
              </div>
            </div>
          </div>
        </div>

        {details && (
          <div className="space-y-12">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               {[
                { l: 'TOTAL UPTIME', v: `${details.uptime_percentage}%`, c: 'text-white' },
                { l: 'SIGNAL LATENCY', v: `${details.last_response_ms || 0} MS`, c: 'text-[#00f09a]' },
                { l: 'ACTIVE SESSION', v: details.uptime_duration?.formatted || '0m', c: 'text-white' },
                { l: 'SECURITY STATUS', v: ssl?.valid ? 'SECURE' : 'UNSAFE', c: ssl?.valid ? 'text-[#00f09a]' : 'text-rose-500' }
               ].map((s, i) => (
                 <div key={i} className="bg-[#0b0b0d] border border-white/5 rounded-[32px] p-8 relative overflow-hidden shadow-2xl group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f09a]/5 blur-[60px] rounded-full -mr-16 -mt-16 transition-all group-hover:bg-[#00f09a]/10" />
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-3">{s.l}</p>
                    <p className={`text-4xl font-black ${s.c} tracking-tighter`}>{s.v}</p>
                 </div>
               ))}
            </div>

            {/* Performance Chart */}
            <div className="bg-[#0b0b0d] border border-white/5 rounded-[40px] p-10 shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black tracking-tight tracking-widest italic">Performance Topology</h3>
                <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                   <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00f09a]" /> Transmission</div>
                   <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-800" /> Delay</div>
                </div>
              </div>
              <div className="h-[350px]">
                <ResponseTimeChart data={details.recent_ticks} />
              </div>
            </div>

            {/* Regions */}
            <div className="bg-[#0b0b0d] border border-white/5 rounded-[40px] p-10 shadow-2xl">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-[#00f09a]/10 border border-[#00f09a]/20 rounded-2xl flex items-center justify-center"><i className="fas fa-satellite text-[#00f09a]" /></div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight italic">Global Uplink Points</h3>
                    <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Active Diagnostic Nodes</p>
                  </div>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  {['Virginia', 'Mumbai', 'Singapore', 'Ireland', 'Frankfurt'].map(r => (
                    <div key={r} className="bg-black border border-white/5 p-6 rounded-[24px] text-center group hover:border-[#00f09a]/40 transition-all cursor-crosshair">
                        <span className="text-3xl block mb-4 filter grayscale group-hover:grayscale-0 transition-all">{getRegionFlag(r)}</span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white transition-all">{r}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
