import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../services/socket';
import { api, API_BASE_URL } from '../services/api';
import { LoadingSpinner } from './LoadingSpinner';
import { toast } from 'react-hot-toast';
import { ResponseTimeChart } from './ResponseTimeChart';
import { Navbar } from './Navbar';
import { ConfirmationModal } from './ConfirmationModal';

const getRegionFlag = (regionName) => {
  if (!regionName) return '🌍';
  if (regionName.includes('Virginia') || regionName.includes('US East')) return '🇺🇸';
  if (regionName.includes('Mumbai') || regionName.includes('ap-south')) return '🇮🇳';
  if (regionName.includes('Singapore')) return '🇸🇬';
  if (regionName.includes('Ireland')) return '🇮🇪';
  if (regionName.includes('Frankfurt')) return '🇩🇪';
  return '🌍';
};

const getRegionShortName = (regionName) => {
  if (!regionName) return 'Unknown';
  if (regionName.includes('Virginia') || regionName.includes('US East')) return 'US East';
  if (regionName.includes('Mumbai')) return 'Mumbai';
  if (regionName.includes('Singapore')) return 'Singapore';
  if (regionName.includes('Ireland')) return 'Ireland';
  if (regionName.includes('Frankfurt')) return 'Frankfurt';
  return regionName;
};

export const WebsiteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [ssl, setSsl] = useState(null);
  const [sslLoading, setSslLoading] = useState(true);
  const [shareCopied, setShareCopied] = useState(false);
  const [badgeCopied, setBadgeCopied] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [customTag, setCustomTag] = useState('');
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [maintStart, setMaintStart] = useState('');
  const [maintEnd, setMaintEnd] = useState('');
  const [maintNote, setMaintNote] = useState('');

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: '',
    message: '',
    confirmText: '',
    type: 'info',
    onConfirm: () => {}
  });

  const fetchSsl = async () => {
    setSslLoading(true);
    try {
      const data = await api.getSslStatus(id);
      setSsl(data);
    } catch (err) {
      setSsl({ valid: false, error: 'Failed' });
    } finally {
      setSslLoading(false);
    }
  };

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const data = await api.getWebsiteStatus(id);
      setDetails(data);
    } catch (error) {
      setError(error.message || 'Failed');
    } finally {
      setLoading(false);
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
    } catch (e) { toast.error('Action failed'); }
    finally { setActionLoading(false); }
  };

  const handleShareStatus = () => {
    const url = `${window.location.origin}/status/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  };

  const handleDelete = async () => {
    if (!window.confirm('PERMANENTLY DELETE THIS NODE?')) return;
    setActionLoading(true);
    try {
      await api.deleteWebsite(id);
      navigate('/dashboard');
    } catch (e) { toast.error('Delete failed'); setActionLoading(false); }
  };

  const isMaintenanceActive = details?.maintenance_start && details?.maintenance_end && 
    new Date() >= new Date(details.maintenance_start) && 
    new Date() <= new Date(details.maintenance_end);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-['Outfit']"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#bc2c12]/20 font-['Outfit']">
      <Navbar />

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {isMaintenanceActive && (
          <div className="mb-8 bg-[#bc2c12]/5 border border-[#bc2c12]/10 rounded-2xl p-6 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-6">
              <div className="h-12 w-12 rounded-xl bg-[#bc2c12] flex items-center justify-center shadow-lg">
                <i className="fas fa-tools text-white text-lg" />
              </div>
              <div>
                <h4 className="font-black text-white text-xs uppercase tracking-widest">Maintenance Active</h4>
                <p className="text-sm text-slate-500 font-medium">Monitoring is periodically suspended for maintenance.</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-12">
          <button onClick={() => navigate('/dashboard')} className="flex items-center text-slate-600 hover:text-white transition-all mb-8 text-[10px] font-black uppercase tracking-[0.3em]">
            <i className="fas fa-chevron-left mr-3" /> Control Center
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="flex items-center space-x-6 min-w-0">
              <div className={`h-20 w-20 shrink-0 rounded-[24px] bg-[#050505] border border-white/5 flex items-center justify-center shadow-2xl relative`}>
                <div className={`absolute inset-0 blur-2xl rounded-full opacity-20 ${details?.latest_status === 'Up' ? 'bg-[#bc2c12]' : 'bg-rose-500'}`} />
                <i className={`fas fa-microchip text-3xl relative ${details?.latest_status === 'Up' ? 'text-[#bc2c12]' : 'text-rose-500'}`} />
              </div>
              <div className="min-w-0">
                <h1 className="text-5xl font-black tracking-tighter truncate max-w-full drop-shadow-2xl">{details?.url.toUpperCase().replace(/^HTTPS?:\/\//, '')}</h1>
                <p className="text-slate-600 text-[10px] flex items-center mt-3 font-black tracking-[0.2em] uppercase">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full mr-3 shadow-lg ${
                    details?.isPaused ? 'bg-slate-800' : 
                    details?.latest_status === 'Up' ? 'bg-[#bc2c12] shadow-[0_0_8px_#bc2c12]' : 
                    'bg-rose-600 animate-pulse shadow-[0_0_12px_#e11d48]'
                  }`} />
                  {details?.isPaused ? 'Signal Offline' : details?.latest_status === 'Up' ? 'Uplink Secure' : 'Emergency Disruption'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 lg:justify-end">
              <button onClick={handlePauseResume} className="px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 bg-[#050505] hover:bg-white/5 transition-all shadow-xl">
                 <i className={`fas ${details?.isPaused ? 'fa-bolt text-[#bc2c12]' : 'fa-power-off text-slate-600'} mr-3`} />
                 {details?.isPaused ? 'Resume Node' : 'Suspend Node'}
              </button>
              <div className="flex items-center gap-3 bg-[#050505] border border-white/5 p-1 rounded-2xl shadow-xl">
                <button onClick={() => navigate(`/websites/${id}/analytics`)} className="px-6 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Analytics</button>
                <button onClick={handleShareStatus} className="px-6 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#bc2c12] bg-[#bc2c12]/5 hover:bg-[#bc2c12]/10 transition-all">Status Page</button>
                <button onClick={handleDelete} className="px-6 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-600/10 transition-all">Decommission</button>
              </div>
            </div>
          </div>
        </div>

        {details && (
          <div className="space-y-12">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               {[
                { l: 'SIGNAL STABILITY', v: `${details.uptime_percentage}%`, c: 'text-white' },
                { l: 'LATENCY (MS)', v: details.last_response_ms || 0, c: 'text-[#bc2c12]' },
                { l: 'CONTINUOUS UPTIME', v: details.uptime_duration?.formatted || '0m', c: 'text-white' },
                { l: 'SECURITY RATING', v: '9.8 / 10', c: 'text-white' }
               ].map((s, i) => (
                 <div key={i} className="bg-[#050505] border border-white/5 rounded-3xl p-8 relative overflow-hidden shadow-2xl group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#bc2c12]/5 blur-3xl rounded-full -mr-16 -mt-16" />
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-3">{s.l}</p>
                    <p className={`text-4xl font-black ${s.c} tracking-tighter`}>{s.v}</p>
                 </div>
               ))}
            </div>

            {/* Performance Chart */}
            <div className="bg-[#050505] border border-white/5 rounded-[32px] p-10 shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black tracking-tight">Transmission Performance</h3>
                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-600">
                   <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#bc2c12]" /> Connect</div>
                   <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-800" /> Latency</div>
                </div>
              </div>
              <div className="h-[350px]">
                <ResponseTimeChart data={details.recent_ticks} />
              </div>
            </div>

            {/* Sub Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* SSL */}
               <div className="bg-[#050505] border border-white/5 rounded-[32px] p-8 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 bg-[#bc2c12]/10 border border-[#bc2c12]/20 rounded-2xl flex items-center justify-center"><i className="fas fa-shield-alt text-[#bc2c12]" /></div>
                     <div>
                       <h3 className="text-lg font-black tracking-tight">SSL Security Protocol</h3>
                       <p className="text-slate-600 text-xs font-medium uppercase tracking-widest">Certificate Verification</p>
                     </div>
                  </div>
                  {sslLoading ? <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px] italic animate-pulse">Scanning...</p> : (
                    <div className="flex items-center justify-between bg-black rounded-2xl p-6 border border-white/5 group hover:border-[#bc2c12]/40 transition-all">
                       <div>
                          <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1">Status</p>
                          <p className={`text-xl font-black ${ssl?.valid ? 'text-[#bc2c12]' : 'text-rose-600'}`}>{ssl?.valid ? 'ENCRYPTED' : 'UNSECURED'}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1">Expires In</p>
                          <p className="text-xl font-black text-white">{ssl?.daysUntilExpiry || 0} DAYS</p>
                       </div>
                    </div>
                  )}
               </div>

               {/* Regions */}
               <div className="bg-[#050505] border border-white/5 rounded-[32px] p-8 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center"><i className="fas fa-satellite-dish text-slate-400" /></div>
                     <div>
                       <h3 className="text-lg font-black tracking-tight">Global Signal Points</h3>
                       <p className="text-slate-600 text-xs font-medium uppercase tracking-widest">Diagnostic Nodes</p>
                     </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                     {['Virginia', 'Mumbai', 'Singapore', 'Ireland', 'Frankfurt'].map(r => (
                       <div key={r} className="bg-black border border-white/5 px-4 py-3 rounded-xl flex items-center gap-3 group hover:border-[#bc2c12]/40 transition-all cursor-crosshair">
                          <span className="text-lg opacity-40 group-hover:opacity-100 transition-opacity">{getRegionFlag(r)}</span>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white">{r}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
