import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Navbar } from './Navbar';
import { LoadingSpinner } from './LoadingSpinner';
import { toast } from 'react-hot-toast';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, AreaChart, Area, CartesianGrid 
} from 'recharts';

export const Analytics = () => {
  const { websiteId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enabling, setEnabling] = useState(false);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    document.title = 'Analytics | Antigravtiven';
    loadAnalytics();
  }, [websiteId]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.getAnalytics(websiteId);
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnable = async () => {
    setEnabling(true);
    try {
      await api.enableAnalytics(websiteId);
      await loadAnalytics();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setEnabling(false);
    }
  };

  const handleResolveError = async (errorId) => {
    try {
      await api.resolveError(errorId);
      loadAnalytics(); // Refresh
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCopyScript = () => {
    const script = `<script src="${window.location.protocol}//${window.location.hostname}:3005/tracker.js" data-site-id="${data.site_id}"></script>`;
    navigator.clipboard.writeText(script);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <LoadingSpinner />
      </div>
    </div>
  );

  if (!data?.enabled) return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-12 backdrop-blur-xl">
          <div className="h-20 w-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
            <i className="fas fa-chart-line text-3xl text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Website Analytics</h1>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Track page views, sessions, traffic sources, and JavaScript errors directly from your visitors' browsers.
          </p>
          <button
            onClick={handleEnable}
            disabled={enabling}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {enabling ? 'Enabling...' : 'Enable Analytics for this Website'}
          </button>
        </div>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button 
              onClick={() => navigate(`/website/${websiteId}`)}
              className="text-slate-400 hover:text-white transition-colors mb-2 flex items-center text-sm"
            >
              <i className="fas fa-arrow-left mr-2" /> Back to Status
            </button>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          </div>
          <button 
            onClick={loadAnalytics}
            className="p-2 bg-slate-900 border border-white/10 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <i className="fas fa-sync-alt" />
          </button>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Page Views" 
            value={data.total_views} 
            subtitle="Last 30 days" 
            icon="fa-eye" 
            color="text-blue-400" 
          />
          <StatCard 
            title="Unique Sessions" 
            value={data.unique_sessions} 
            subtitle="Total active periods" 
            icon="fa-users" 
            color="text-indigo-400" 
          />
          <StatCard 
            title="Avg Session" 
            value={`${Math.floor(data.avg_session_duration_seconds / 60)}m ${data.avg_session_duration_seconds % 60}s`} 
            subtitle="Time spent on site" 
            icon="fa-clock" 
            color="text-emerald-400" 
          />
          <StatCard 
            title="JS Errors" 
            value={data.total_errors} 
            subtitle="Unresolved exceptions" 
            icon="fa-exclamation-circle" 
            color={data.total_errors > 0 ? "text-rose-400" : "text-slate-400"} 
          />
        </div>

        {/* Main Chart */}
        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm">
          <h3 className="text-lg font-bold mb-6">Traffic Over Time</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.views_per_day}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Pages */}
          <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-4">Top Pages</h3>
            <div className="space-y-4">
              {data.top_pages.map((p, i) => (
                <div key={i} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-300 truncate max-w-[250px]">{p.url}</span>
                    <span className="text-sm font-bold text-white">{p.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${(p.count / (data.top_pages[0]?.count || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              {data.top_pages.length === 0 && <p className="text-slate-500 text-center py-4 italic">No page data yet</p>}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-4">Traffic Sources</h3>
            <div className="space-y-4">
              {data.top_referrers.map((r, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-300">{r.source}</span>
                    <span className="text-sm font-bold text-white">{r.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${(r.count / (data.top_referrers[0]?.count || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              {data.top_referrers.length === 0 && <p className="text-slate-500 text-center py-4 italic">No referral data yet</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Devices */}
          <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-4">Devices</h3>
            <div className="space-y-4">
              {['Desktop', 'Mobile', 'Tablet'].map((type) => {
                const count = data.device_breakdown[type] || 0;
                const total = Object.values(data.device_breakdown).reduce((a, b) => a + b, 0) || 1;
                const pct = Math.round((count / total) * 100);
                const icons = { Desktop: 'fa-desktop', Mobile: 'fa-mobile-alt', Tablet: 'fa-tablet-alt' };
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-300 flex items-center">
                        <i className={`fas ${icons[type]} mr-2 text-slate-500`} /> {type}
                      </span>
                      <span className="text-sm font-bold text-white">{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Browsers */}
          <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-4">Browsers</h3>
            <div className="space-y-4">
              {['Chrome', 'Firefox', 'Safari', 'Edge', 'Other'].map((b) => {
                const count = data.browser_breakdown[b] || 0;
                const total = Object.values(data.browser_breakdown).reduce((a, b) => a + b, 0) || 1;
                const pct = Math.round((count / total) * 100);
                if (pct === 0 && count === 0 && b !== 'Chrome') return null;
                return (
                  <div key={b}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-300">{b}</span>
                      <span className="text-sm font-bold text-white">{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Errors */}
        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center">
              JavaScript Errors
              {data.total_errors > 0 && (
                <span className="ml-3 px-2 py-0.5 bg-rose-500/10 text-rose-500 text-xs rounded-full border border-rose-500/20">
                  {data.total_errors} Active
                </span>
              )}
            </h3>
          </div>
          
          <div className="space-y-4">
            {data.recent_errors.map((err) => (
              <div key={err.id} className="bg-slate-800/50 border border-white/5 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-rose-400 font-bold text-sm mb-1 truncate">{err.message}</p>
                  <p className="text-slate-500 text-xs mb-2">Happened on: <span className="text-slate-300">{err.page_url}</span></p>
                  <div className="flex items-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    <span className="flex items-center"><i className="fas fa-browser mr-1.5" /> {err.browser}</span>
                    <span className="flex items-center"><i className="fas fa-clock mr-1.5" /> {new Date(err.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleResolveError(err.id)}
                  className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-bold hover:bg-emerald-500/20 transition-all self-center"
                >
                  Mark Resolved
                </button>
              </div>
            ))}
            {data.recent_errors.length === 0 && (
              <div className="text-center py-8">
                <div className="h-12 w-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-check text-emerald-500" />
                </div>
                <p className="text-slate-400">No JavaScript errors detected!</p>
              </div>
            )}
          </div>
        </div>

        {/* Tracker Code */}
        <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-8 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-2">Install Tracking</h3>
          <p className="text-slate-400 mb-6 text-sm">
            Paste this script tag into the <code className="text-indigo-400">&lt;head&gt;</code> of your website to start collecting data.
          </p>
          <div className="relative group">
            <pre className="bg-black/50 border border-white/10 rounded-xl p-6 overflow-x-auto text-indigo-300 text-sm font-mono">
              {`<script src="${window.location.protocol}//${window.location.hostname}:3005/tracker.js" \n        data-site-id="${data.site_id}"></script>`}
            </pre>
            <button
              onClick={handleCopyScript}
              className="absolute top-4 right-4 p-2 bg-slate-800 border border-white/10 rounded-lg hover:bg-slate-700 transition-all text-white text-xs font-bold"
            >
              <i className={`fas ${copying ? 'fa-check text-emerald-400' : 'fa-copy'} mr-2`} />
              {copying ? 'Copied!' : 'Copy Snippet'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, icon, color }) => (
  <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
    <div className="flex items-center justify-between mb-3">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{title}</span>
      <div className={`h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center ${color} bg-opacity-10 border border-current border-opacity-10`}>
        <i className={`fas ${icon} text-sm`} />
      </div>
    </div>
    <div className="text-2xl font-bold mb-1 tracking-tight">{value}</div>
    <div className="text-[10px] text-slate-500 font-medium">{subtitle}</div>
  </div>
);
