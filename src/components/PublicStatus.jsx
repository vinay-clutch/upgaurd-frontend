import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { LoadingSpinner } from './LoadingSpinner';

export const PublicStatus = () => {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = `${username}'s Status | UptimeForge`;
    loadStatus();
    const interval = setInterval(loadStatus, 60000);
    return () => clearInterval(interval);
  }, [username]);

  const loadStatus = async () => {
    try {
      const result = await api.getPublicStatusByUsername(username);
      setData(result);
      setError('');
    } catch (err) {
      setError('Status page not found or private.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#08080a] flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col items-center justify-center p-4">
      <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center border border-rose-500/20 mb-6">
        <i className="fas fa-ghost text-4xl text-rose-500" />
      </div>
      <h1 className="text-2xl font-black mb-2">404 - Not Found</h1>
      <p className="text-slate-400">{error}</p>
    </div>
  );

  const overallHealth = data.websites.every(w => w.status === 'Up' || w.status === 'Paused');

  return (
    <div className="min-h-screen bg-[#08080a] text-white selection:bg-[#00f09a]/20 font-sans">
      {/* Branding Header */}
      <div className="border-b border-white/5 bg-white/[0.02] backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-[#00f09a] rounded-lg flex items-center justify-center text-black font-black italic shadow-lg shadow-[#00f09a]/20">U</div>
            <span className="font-black tracking-tighter text-xl">UPTIMEFORGE <span className="text-slate-500 font-medium text-sm">/ {username}</span></span>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 py-1 px-3 rounded-full border border-white/10">Public Status Page</span>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Core Status Block */}
        <div className={`rounded-[40px] p-10 mb-12 border transition-all duration-700 ${
          overallHealth 
          ? 'bg-emerald-500/5 border-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.05)]' 
          : 'bg-rose-500/5 border-rose-500/10 shadow-[0_0_50px_rgba(244,63,94,0.05)]'
        }`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <div className={`h-24 w-24 rounded-[32px] flex items-center justify-center text-4xl shadow-2xl ${
                overallHealth ? 'bg-emerald-500 text-black shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-rose-500/20'
              }`}>
                <i className={`fas ${overallHealth ? 'fa-check' : 'fa-exclamation-triangle'}`} />
              </div>
              <div>
                <h1 className="text-4xl font-black mb-2 tracking-tight">
                  {overallHealth ? 'All Systems Operational' : 'Partial Service Disruption'}
                </h1>
                <p className="text-slate-400 font-medium">Verified health metrics for {data.websites.length} connected services.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Node Health */}
        <div className="mb-12">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-slate-800"></span>
            Global Network Infrastructure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.global_nodes.map((node, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${node.status === 'Operational' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-amber-400 animate-pulse'}`} />
                  <span className="text-sm font-bold">{node.name}</span>
                </div>
                <span className="text-xs font-mono text-slate-500">{node.latency}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Individual Services */}
        <div className="space-y-4">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-slate-800"></span>
            Service Health Details
          </h2>
          {data.websites.map((site) => (
            <div key={site.id} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 hover:bg-white/[0.04] transition-all flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl border transition-colors ${
                  site.status === 'Up' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                  site.status === 'Paused' ? 'bg-slate-500/10 border-slate-500/20 text-slate-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}>
                  <i className={`fas ${site.status === 'Up' ? 'fa-globe' : site.status === 'Paused' ? 'fa-pause' : 'fa-exclamation-circle'}`} />
                </div>
                <div>
                  <h3 className="font-bold text-lg group-hover:text-[#00f09a] transition-colors">{site.url.replace(/^https?:\/\//, '')}</h3>
                  <div className="flex items-center gap-3 text-[10px] uppercase font-black tracking-widest text-slate-500 mt-1">
                    <span>{site.status === 'Up' ? 'Operational' : site.status}</span>
                    <span className="h-1 w-1 bg-slate-700 rounded-full"></span>
                    <span>{site.latency}ms</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(24)].map((_, i) => (
                  <div key={i} className={`h-8 w-1.5 rounded-full ${site.status === 'Up' ? 'bg-emerald-500/40' : 'bg-emerald-500/10'}`} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-white/5 text-center">
           <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Check Completed: {new Date().toLocaleTimeString()}</span>
           </div>
           <p className="text-xs text-slate-600 font-medium">Powered by <span className="text-white">UptimeForge Infrastructure Monitoring</span></p>
        </footer>
      </main>
    </div>
  );
};
