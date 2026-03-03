import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../services/socket';
import { api, API_BASE_URL } from '../services/api';
import { LoadingSpinner } from './LoadingSpinner';
import { toast } from 'react-hot-toast';
import { StatusBadge } from './StatusBadge';
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

  const tagOptions = ['Production', 'Staging', 'Client', 'Personal', 'E-commerce', 'API', 'Blog'];

  const getTagColor = (tag) => {
    switch (tag) {
      case 'Production': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Staging': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Client': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Personal': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-[#00f09a]/10 text-[#00f09a] border-[#00f09a]/20';
    }
  };

  const fetchSsl = async () => {
    setSslLoading(true);
    try {
      const data = await api.getSslStatus(id);
      setSsl(data);
    } catch (err) {
      setSsl({ valid: false, daysUntilExpiry: 0, expiryDate: 'Unknown', issuer: 'Unknown', error: 'Failed to check SSL' });
    } finally {
      setSslLoading(false);
    }
  };

  const fetchDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getWebsiteStatus(id);
      setDetails(data);
    } catch (error) {
      console.error('Failed to load website details:', error);
      setError(error.message || 'Failed to load website details');
    } finally {
      setLoading(false);
    }
  };

  const handleSetMaintenance = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.setMaintenance(id, maintStart, maintEnd, maintNote);
      await fetchDetails();
      setShowMaintenanceForm(false);
    } catch (err) {
      toast.error('Failed to set maintenance window');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearMaintenance = async () => {
    setActionLoading(true);
    try {
      await api.clearMaintenance(id);
      await fetchDetails();
    } catch (err) {
      toast.error('Failed to clear maintenance window');
    } finally {
      setActionLoading(false);
    }
  };

  const isMaintenanceActive = details?.maintenance_start && details?.maintenance_end && 
    new Date() >= new Date(details.maintenance_start) && 
    new Date() <= new Date(details.maintenance_end);

  const isMaintenanceScheduled = details?.maintenance_start && details?.maintenance_end;

  useEffect(() => {
    if (details?.url) {
      document.title = `${details.url.replace(/^https?:\/\//, '')} | UpGuard`;
    }
    if (id) {
      fetchDetails();
      fetchSsl();
    }
  }, [id]);

  useEffect(() => {
    const socket = getSocket();
    const handleTickUpdate = (data) => {
      if (data.websiteId === id) {
        void fetchDetails();
        void fetchSsl();
      }
    };

    socket.on('tick_update', handleTickUpdate);
    return () => {
      socket.off('tick_update', handleTickUpdate);
    };
  }, [id]);

  const handlePauseResume = async () => {
    if (!details) return;
    const isPaused = details.isPaused;
    
    setConfirmConfig({
      title: isPaused ? 'Resume Monitoring?' : 'Pause Monitoring?',
      message: isPaused 
        ? `UpGuard will start checking ${details.url} again from multiple global regions.`
        : `Monitoring for ${details.url} will be stopped immediately. No status updates or alerts will be sent while paused.`,
      confirmText: isPaused ? 'Resume Checks' : 'Stop Checks',
      type: isPaused ? 'resume' : 'pause',
      onConfirm: async () => {
        setActionLoading(true);
        setShowConfirm(false);
        try {
          if (isPaused) {
            await api.resumeWebsite(id);
            toast.success('Monitoring resumed for ' + details.url);
          } else {
            await api.pauseWebsite(id);
            toast.success('Monitoring paused for ' + details.url);
          }
          await fetchDetails();
        } catch (error) {
          toast.error(error.message || "Failed to update status");
        } finally {
          setActionLoading(false);
        }
      }
    });
    setShowConfirm(true);
  };

  const handleShareStatus = () => {
    const url = `${window.location.origin}/status/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }).catch(() => {
      window.prompt('Copy this status page link:', url);
    });
  };
  

  const handleDelete = async () => {
    if (!details) return;
    
    setConfirmConfig({
      title: 'Delete Website?',
      message: `You are about to stop monitoring ${details.url}. All historical uptime records, incident logs, and analytics for this target will be PERMANENTLY deleted.`,
      confirmText: 'Delete Permanently',
      type: 'danger',
      onConfirm: async () => {
        setActionLoading(true);
        setShowConfirm(false);
        try {
          await api.deleteWebsite(id);
          toast.success('Website deleted from monitoring');
          navigate('/dashboard');
        } catch (error) {
          toast.error(error.message || "Failed to delete website");
          setActionLoading(false);
        }
      }
    });
    setShowConfirm(true);
  };

  const handleToggleTag = async (tag) => {
    if (!details) return;
    const currentTags = details.tags || [];
    let newTags;
    if (currentTags.includes(tag)) {
      newTags = currentTags.filter(t => t !== tag);
    } else {
      newTags = [...currentTags, tag];
    }
    
    try {
      await api.updateWebsiteTags(id, newTags);
      setDetails({ ...details, tags: newTags });
    } catch (err) {
      toast.error('Failed to update tags');
    }
  };

  const handleAddCustomTag = async (e) => {
    e.preventDefault();
    if (!customTag.trim()) return;
    const tag = customTag.trim();
    const currentTags = details.tags || [];
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag];
      try {
        await api.updateWebsiteTags(id, newTags);
        setDetails({ ...details, tags: newTags });
        setCustomTag('');
        setShowTagInput(false);
      } catch (err) {
        toast.error('Failed to add tag');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
        <Navbar />
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
        <Navbar />
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle text-4xl text-amber-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Website</h2>
            <p className="text-slate-400 mb-4">{error}</p>
            <Link 
              to="/dashboard"
              className="bg-[#00f09a] hover:bg-[#00cc82] text-[#050505] px-4 py-2 rounded-md text-sm font-bold"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
        {/* Premium design improvement: ConfirmationModal for error state actions if any */}
        <ConfirmationModal
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={confirmConfig.onConfirm}
          title={confirmConfig.title}
          message={confirmConfig.message}
          confirmText={confirmConfig.confirmText}
          type={confirmConfig.type}
          loading={actionLoading}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08080a] via-[#0a0a0d] to-black text-white selection:bg-[#00f09a]/20">
      <Navbar />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {isMaintenanceActive && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center animate-pulse">
                <i className="fas fa-tools text-white" />
              </div>
              <div>
                <h4 className="font-bold text-amber-400">🔧 Maintenance In Progress</h4>
                <p className="text-sm text-slate-400">
                  {details.maintenance_note ? `Reason: ${details.maintenance_note}` : 'Alerts are currently paused for planned maintenance.'}
                </p>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ends At</p>
              <p className="text-sm font-mono text-white">{new Date(details.maintenance_end).toLocaleString()}</p>
            </div>
          </div>
        )}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-slate-400 hover:text-white transition-colors mb-4 text-sm font-medium"
          >
            <i className="fas fa-arrow-left mr-2" />
            Back to Dashboard
          </button>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center space-x-4 min-w-0">
              <div className={`h-14 w-14 shrink-0 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center shadow-xl ${
                details?.latest_status === 'Up' ? 'border-emerald-500/20 shadow-emerald-500/10' : 'border-rose-500/20 shadow-rose-500/10'
              }`}>
                <i className={`fas fa-globe text-2xl ${details?.latest_status === 'Up' ? 'text-emerald-400' : 'text-rose-400'}`} />
              </div>
              <div className="min-w-0">
                <h1 className="text-3xl font-bold tracking-tight truncate max-w-full drop-shadow-sm">{details?.url}</h1>
                <p className="text-slate-400 text-sm flex items-center mt-1">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2.5 ${
                    details?.isPaused ? 'bg-slate-500' : 
                    details?.latest_status === 'Up' ? 'bg-emerald-400 animate-pulse' : 
                    details?.latest_status === 'Unknown' ? 'bg-slate-500' : 'bg-rose-400 animate-ping'
                  }`} />
                  <span className="font-semibold uppercase tracking-wider text-[11px]">
                    {details?.isPaused ? 'Monitoring Paused' : 
                     details?.latest_status === 'Up' ? 'System Operational' : 
                     details?.latest_status === 'Unknown' ? 'Waiting for First Check...' : 'Service Disruption'}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <button 
                onClick={handlePauseResume}
                disabled={actionLoading}
                className={`flex-1 sm:flex-none px-5 py-3 rounded-xl text-sm font-bold border transition-all flex items-center justify-center min-w-[170px] ${
                  details?.isPaused 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 shadow-lg shadow-emerald-500/5' 
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20 shadow-lg shadow-amber-500/5'
                }`}
              >
                {actionLoading ? <i className="fas fa-spinner fa-spin mr-2" /> : <i className={`fas ${details?.isPaused ? 'fa-play' : 'fa-pause'} mr-2`} />}
                {details?.isPaused ? 'Resume Monitoring' : 'Pause Monitoring'}
              </button>
              
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => navigate(`/websites/${id}/incidents`)}
                  className="flex-1 sm:flex-none px-4 py-3 rounded-xl text-sm font-bold bg-[#00f09a]/10 border border-[#00f09a]/20 text-[#00f09a] hover:bg-[#00f09a]/20 transition-all flex items-center justify-center shadow-lg shadow-[#00f09a]/5"
                >
                  <i className="fas fa-clipboard-list mr-2" />
                  Incidents
                </button>
                <button
                  onClick={() => navigate(`/websites/${id}/analytics`)}
                  className="flex-1 sm:flex-none px-4 py-3 rounded-xl text-sm font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all flex items-center justify-center shadow-lg shadow-blue-500/5"
                >
                  <i className="fas fa-chart-bar mr-2" />
                  Analytics
                </button>
                <button
                  onClick={() => navigate(`/websites/${id}/security`)}
                  className="flex-1 sm:flex-none px-4 py-3 rounded-xl text-sm font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center justify-center shadow-lg shadow-emerald-500/5"
                >
                  <i className="fas fa-shield-alt mr-2" />
                  Security
                </button>
                <button
                  onClick={handleShareStatus}
                  className={`flex-1 sm:flex-none px-4 py-3 rounded-xl text-sm font-bold border transition-all flex items-center justify-center shadow-lg ${
                    shareCopied
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-emerald-500/5'
                      : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 shadow-cyan-500/5'
                  }`}
                >
                  <i className={`fas ${shareCopied ? 'fa-check' : 'fa-link'} mr-2`} />
                  {shareCopied ? 'Status Page' : 'Status Page'}
                </button>
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('token');
                      const response = await fetch(
                        `${API_BASE_URL}/websites/${id}/report/pdf`,
                        { headers: { 'Authorization': `Bearer ${token}` } }
                      );
                      const html = await response.text();
                      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.target = '_blank';
                      a.click();
                      setTimeout(() => URL.revokeObjectURL(url), 5000);
                    } catch(e) {
                      toast.error('Failed to generate report');
                    }
                  }}
                  disabled={actionLoading}
                  className="flex-1 sm:flex-none px-4 py-3 rounded-xl text-sm font-bold bg-slate-500/10 border border-slate-500/20 text-slate-300 hover:bg-slate-500/20 transition-all flex items-center justify-center shadow-lg shadow-slate-500/5"
                >
                  {actionLoading ? <i className="fas fa-spinner fa-spin mr-2" /> : <i className="fas fa-file-pdf mr-2" />}
                  {actionLoading ? 'PDF' : 'PDF'}
                </button>

                <button 
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="flex-1 sm:flex-none px-4 py-3 rounded-xl text-sm font-bold bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 transition-all flex items-center justify-center shadow-lg shadow-rose-500/5"
                >
                  <i className="fas fa-trash-alt mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {details && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Total Uptime</p>
                <p className="text-2xl font-bold text-white tracking-tight">{details.uptime_percentage}%</p>
              </div>
              <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Continious Uptime</p>
                <p className="text-2xl font-bold text-white tracking-tight">{details.uptime_duration?.formatted || '0m'}</p>
              </div>
              <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-sm col-span-1 sm:col-span-2">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Last Incident</p>
                <p className="text-sm font-medium text-slate-300">
                  {details.latest_status === 'Down' ? 'Ongoing incident detected' : 'No major incidents in last 50 checks'}
                </p>
              </div>
            </div>

            {/* SSL Certificate Card */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  sslLoading ? 'bg-slate-500/10 border border-slate-500/20' :
                  ssl?.error ? 'bg-amber-500/10 border border-amber-500/20' :
                  ssl?.valid && ssl?.daysUntilExpiry > 30 ? 'bg-emerald-500/10 border border-emerald-500/20' :
                  ssl?.valid && ssl?.daysUntilExpiry > 10 ? 'bg-amber-500/10 border border-amber-500/20' :
                  'bg-rose-500/10 border border-rose-500/20'
                }`}>
                  <i className={`fas fa-lock ${
                    sslLoading ? 'text-slate-400' :
                    ssl?.error ? 'text-amber-400' :
                    ssl?.valid && ssl?.daysUntilExpiry > 30 ? 'text-emerald-400' :
                    ssl?.valid && ssl?.daysUntilExpiry > 10 ? 'text-amber-400' :
                    'text-rose-400'
                  }`} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">SSL Certificate</h3>
                  <p className="text-slate-500 text-xs">HTTPS security status</p>
                </div>
              </div>
              {sslLoading ? (
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <i className="fas fa-spinner fa-spin" /> Checking SSL...
                </div>
              ) : ssl?.error ? (
                <div className="space-y-2">
                  <p className="text-amber-400 text-sm font-medium flex items-center gap-2">
                    <i className="fas fa-exclamation-triangle" /> {ssl.error}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Days Until Expiry</p>
                    <p className={`text-2xl font-bold tracking-tight ${
                      ssl?.daysUntilExpiry > 30 ? 'text-emerald-400' :
                      ssl?.daysUntilExpiry > 10 ? 'text-amber-400' :
                      'text-rose-400'
                    }`}>
                      {ssl?.daysUntilExpiry}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Expires On</p>
                    <p className="text-sm text-white font-medium">{ssl?.expiryDate}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Issuer</p>
                    <p className="text-sm text-white font-medium">{ssl?.issuer}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Monitoring Regions */}
            {(() => {
              const regionMap = {};
              if (!details.recent_ticks) return null;
              for (const tick of details.recent_ticks) {
                if (!regionMap[tick.region]) {
                  regionMap[tick.region] = { latest_status: tick.status, latest_ms: tick.total_response_time_ms, count: 0, upCount: 0 };
                }
                regionMap[tick.region].count++;
                if (tick.status === 'Up') regionMap[tick.region].upCount++;
              }
              const regions = Object.entries(regionMap);
              if (regions.length <= 1) return null;
              return (
                <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
                  <h3 className="font-bold text-sm mb-4">Monitoring Regions</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {regions.map(([name, info]) => (
                      <div key={name} className="bg-slate-800/50 border border-white/5 rounded-xl p-3 text-center">
                        <p className="text-lg mb-1">{getRegionFlag(name)}</p>
                        <p className="text-xs font-bold text-white mb-1">{getRegionShortName(name)}</p>
                        <p className={`text-xs font-bold mb-0.5 ${info.latest_status === 'Up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {info.latest_status === 'Up' ? '✓ UP' : '✗ DOWN'}
                        </p>
                        <p className="text-[10px] text-slate-500">{info.latest_ms}ms</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Monitoring Interval Card */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-[#00f09a]/10 border border-[#00f09a]/20 flex items-center justify-center">
                  <i className="fas fa-clock text-[#00f09a]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Monitoring Frequency</h3>
                  <p className="text-slate-500 text-xs">How often we check your website</p>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {[1, 5, 15, 30, 60].map((interval) => (
                  <button
                    key={interval}
                    onClick={async () => {
                      setActionLoading(true);
                      try {
                        await api.updateCheckInterval(id, interval);
                        setDetails({ ...details, check_interval: interval });
                      } catch (err) {
                        toast.error('Failed to update interval');
                      } finally {
                        setActionLoading(false);
                      }
                    }}
                    className={`px-3 py-3 rounded-xl text-xs font-bold border transition-all ${
                      details?.check_interval === interval
                        ? 'bg-[#00f09a] border-[#00f09a] text-[#050505] shadow-lg shadow-[#00f09a]/20 scale-105'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    {interval === 1 ? '1 min' : `${interval} min`}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Section */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#00f09a]/10 border border-[#00f09a]/20 flex items-center justify-center">
                    <i className="fas fa-tags text-[#00f09a]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Tags & Categories</h3>
                    <p className="text-slate-500 text-xs">Organize your monitoring targets</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowTagInput(!showTagInput)}
                  className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <i className={`fas ${showTagInput ? 'fa-times' : 'fa-plus'} text-xs`} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {(details.tags || []).length > 0 ? (
                  details.tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleToggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-bold border transition-all hover:scale-105 active:scale-95 ${getTagColor(tag)}`}
                      title="Click to remove"
                    >
                      {tag} <i className="fas fa-times ml-1 opacity-50" />
                    </button>
                  ))
                ) : (
                  <p className="text-slate-500 text-xs italic">No tags added yet</p>
                )}
              </div>

              {showTagInput && (
                <div className="space-y-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex flex-wrap gap-2">
                    {tagOptions.filter(opt => !(details.tags || []).includes(opt)).map(opt => (
                      <button
                        key={opt}
                        onClick={() => handleToggleTag(opt)}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all text-sm"
                      >
                        + {opt}
                      </button>
                    ))}
                  </div>
                  <form onSubmit={handleAddCustomTag} className="flex gap-2">
                    <input
                      type="text"
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      placeholder="Add custom tag..."
                      className="bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00f09a] flex-1"
                    />
                    <button
                      type="submit"
                      className="bg-[#00f09a] hover:bg-[#00cc82] text-[#050505] text-xs font-bold px-4 py-1.5 rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Performance Chart */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Performance Timeline</h3>
                <div className="flex items-center text-xs text-slate-500">
                  <span className="flex items-center mr-4">
                    <span className="h-2 w-2 rounded-full bg-[#00f09a] mr-2" />
                    Response Time (ms)
                  </span>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponseTimeChart data={details.recent_ticks} />
              </div>
            </div>

            {/* Embed Badge Section */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <i className="fas fa-certificate text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Uptime Status Badge</h3>
                  <p className="text-slate-500 text-sm">Display your real-time uptime on GitHub or your website</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Preview</p>
                  <div className="bg-black/20 rounded-xl p-8 border border-white/5 flex items-center justify-center">
                    <img 
                      src={`${API_BASE_URL}/websites/badge/${id}?t=${Date.now()}`} 
                      alt="Uptime Badge" 
                      className="shadow-2xl"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Markdown</p>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(`![Uptime](${window.location.port === '5173' ? 'http://localhost:3005' : window.location.origin}/api/v1/websites/badge/${id})`);
                          setBadgeCopied(true);
                          setTimeout(() => setBadgeCopied(false), 2000);
                        }}
                        className="text-[#00f09a] hover:text-[#00cc82] text-[10px] font-bold uppercase"
                      >
                        {badgeCopied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                      <code className="block bg-slate-950 border border-white/10 rounded-lg p-3 text-[11px] text-slate-300 break-all">
                        {`![Uptime](${API_BASE_URL}/websites/badge/${id})`}
                      </code>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">HTML</p>
                    <code className="block bg-slate-950 border border-white/10 rounded-lg p-3 text-[11px] text-slate-300 break-all">
                      {`<img src="${API_BASE_URL}/websites/badge/${id}" alt="Uptime Status">`}
                    </code>
                  </div>

                  <div className="bg-[#00f09a]/5 border border-[#00f09a]/10 rounded-xl p-4">
                    <p className="text-[11px] text-[#00f09a]/80 leading-relaxed">
                      <i className="fas fa-info-circle mr-2" />
                      Paste this badge in your GitHub README.md or documentation to show off your reliability to users. The badge updates in real-time.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Maintenance Window Section */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <i className="fas fa-tools text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Maintenance Window</h3>
                    <p className="text-slate-500 text-sm">Schedule planned downtime to pause alerts</p>
                  </div>
                </div>
                {isMaintenanceScheduled && (
                  <button 
                    onClick={handleClearMaintenance}
                    className="px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition-all"
                  >
                    Cancel Maintenance
                  </button>
                )}
              </div>

              {isMaintenanceScheduled ? (
                <div className={`p-4 rounded-xl border ${isMaintenanceActive ? 'bg-amber-500/10 border-amber-500/20 animate-pulse' : 'bg-blue-500/10 border-blue-500/20'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${isMaintenanceActive ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'}`}>
                      <i className={`fas ${isMaintenanceActive ? 'fa-exclamation-triangle' : 'fa-calendar-check'}`} />
                    </div>
                    <div>
                      <p className="font-bold text-white">
                        {isMaintenanceActive ? '🔧 IN MAINTENANCE NOW — alerts paused' : '📅 Maintenance scheduled'}
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        {details.maintenance_note ? `Note: ${details.maintenance_note}` : 'No notes provided'}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-slate-500 font-mono">
                        <span>From: {new Date(details.maintenance_start).toLocaleString()}</span>
                        <span>To: {new Date(details.maintenance_end).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {!showMaintenanceForm ? (
                    <div className="text-center py-8 bg-black/20 rounded-xl border border-dashed border-white/10">
                      <p className="text-slate-500 text-sm mb-4">No maintenance scheduled</p>
                      <button 
                        onClick={() => setShowMaintenanceForm(true)}
                        className="px-6 py-2.5 rounded-xl bg-[#00f09a] hover:bg-[#00cc82] text-[#050505] text-sm font-bold transition-all shadow-lg shadow-[#00f09a]/20"
                      >
                        Schedule Maintenance
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSetMaintenance} className="space-y-4 bg-black/20 p-6 rounded-xl border border-white/5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase">Start Time</label>
                          <input 
                            type="datetime-local" 
                            required
                            value={maintStart}
                            onChange={e => setMaintStart(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase">End Time</label>
                          <input 
                            type="datetime-local" 
                            required
                            value={maintEnd}
                            onChange={e => setMaintEnd(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Maintenance Note</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Database migration or v2.0 deployment"
                          value={maintNote}
                          onChange={e => setMaintNote(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button 
                          type="submit"
                          disabled={actionLoading}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-lg transition-all"
                        >
                          {actionLoading ? 'Saving...' : 'Set Maintenance Window'}
                        </button>
                        <button 
                          type="button"
                          onClick={() => setShowMaintenanceForm(false)}
                          className="px-6 bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 rounded-lg transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>

            {/* Export Section */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <i className="fas fa-file-export text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Export Data</h3>
                  <p className="text-slate-500 text-sm">Download your monitoring history in CSV format</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(!details?.recent_ticks || details.recent_ticks.length === 0) ? (
                  <div className="col-span-3 py-6 text-center bg-black/20 rounded-xl border border-dashed border-white/5">
                    <p className="text-slate-500 text-xs italic">No data collected yet to export</p>
                  </div>
                ) : [7, 30, 90].map(days => (
                  <button 
                    key={days}
                    onClick={() => api.exportCsv(id, days)}
                    className="flex items-center justify-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-indigo-500/50 transition-all group"
                  >
                    <i className="fas fa-file-csv text-xl text-slate-400 group-hover:text-indigo-400" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">Last {days} days</p>
                      <p className="text-[10px] text-slate-500 uppercase">Download CSV</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Event Log */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
              <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold">Recent Status Logs</h3>
                <button onClick={fetchDetails} className="text-slate-400 hover:text-white transition-colors">
                  <i className="fas fa-sync-alt text-sm" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] uppercase font-bold text-slate-500 tracking-widest border-b border-white/5">
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Latency</th>
                      <th className="px-6 py-4">Node Region</th>
                      <th className="px-6 py-4">Log Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {details.recent_ticks.length > 0 ? (
                      details.recent_ticks.map((tick, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-4">
                            <StatusBadge status={tick.status} />
                          </td>
                          <td className="px-6 py-4 font-bold text-white text-sm">
                            {tick.total_response_time_ms}ms
                          </td>
                          <td className="px-6 py-4 text-slate-400 text-sm">
                            <span className="mr-1.5">{getRegionFlag(tick.region)}</span>
                            {getRegionShortName(tick.region)}
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-sm font-medium">
                            {new Date(tick.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic text-sm">
                          No monitoring logs available yet. Checks run every {details.check_interval || 1} min.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        type={confirmConfig.type}
        loading={actionLoading}
      />
    </div>
  );
};
