import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';

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

export const PublicStatus = () => {
  const { websiteId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredCheck, setHoveredCheck] = useState(null);

  useEffect(() => {
    if (websiteId) loadStatus();
  }, [websiteId]);

  const loadStatus = async () => {
    try {
      const result = await api.getPublicStatus(websiteId);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load status');
    } finally {
      setLoading(false);
    }
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return 'Never';
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080a] flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-circle-notch fa-spin text-3xl text-[#00f09a] mb-4" />
          <p className="text-slate-400 text-sm">Loading status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#08080a] flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-circle text-4xl text-rose-400 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Status Page Not Found</h2>
          <p className="text-slate-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const statusConfig = {
    Up: {
      icon: 'fa-check-circle',
      label: 'All Systems Operational',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      glow: 'shadow-emerald-500/20',
      dot: 'bg-emerald-400',
    },
    Down: {
      icon: 'fa-times-circle',
      label: 'Service Disruption',
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      glow: 'shadow-rose-500/20',
      dot: 'bg-rose-400',
    },
    Unknown: {
      icon: 'fa-question-circle',
      label: 'Checking...',
      color: 'text-slate-400',
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/20',
      glow: 'shadow-slate-500/20',
      dot: 'bg-slate-400',
    },
  };

  const status = statusConfig[data?.current_status] || statusConfig.Unknown;
  const checks = [...(data?.last_90_checks || [])].reverse();

  return (
    <div className="min-h-screen bg-[#08080a] text-white selection:bg-[#00f09a]/20">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#00f09a]/10 border border-[#00f09a]/20 flex items-center justify-center">
              <i className="fas fa-shield-alt text-[#00f09a] text-sm" />
            </div>
            <span className="text-sm font-bold text-slate-300 tracking-tight">UpGuard</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Status Page</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Website URL */}
        <p className="text-slate-500 text-sm font-medium text-center mb-2 break-all">{data?.url}</p>

        {/* Big Status Badge */}
        <div className={`${status.bg} border ${status.border} rounded-3xl p-8 text-center mb-10 shadow-2xl ${status.glow}`}>
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${status.bg} border ${status.border} mb-5`}>
            <i className={`fas ${status.icon} text-4xl ${status.color}`} />
          </div>
          <h1 className={`text-3xl font-bold tracking-tight mb-2 ${status.color}`}>
            {status.label}
          </h1>
          <p className="text-slate-500 text-sm">
            Last checked {timeAgo(data?.last_checked)}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 text-center backdrop-blur-sm">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Uptime</p>
            <p className={`text-3xl font-bold tracking-tight ${
              data?.uptime_percentage >= 99 ? 'text-emerald-400' :
              data?.uptime_percentage >= 95 ? 'text-amber-400' :
              'text-rose-400'
            }`}>
              {data?.uptime_percentage}%
            </p>
          </div>
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 text-center backdrop-blur-sm">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Avg Response</p>
            <p className="text-3xl font-bold tracking-tight text-[#00f09a]">
              {data?.avg_response_ms}<span className="text-lg text-slate-500">ms</span>
            </p>
          </div>
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 text-center backdrop-blur-sm">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Last Check</p>
            <p className="text-sm font-bold text-white leading-relaxed">
              {timeAgo(data?.last_checked)}
            </p>
          </div>
        </div>

        {/* Region Breakdown */}
        {(() => {
          const regionMap = {};
          for (const check of data?.last_90_checks || []) {
            if (!regionMap[check.region]) {
              regionMap[check.region] = { latest_status: check.status, latest_ms: check.response_ms, count: 0, upCount: 0 };
            }
            regionMap[check.region].count++;
            if (check.status === 'Up') regionMap[check.region].upCount++;
          }
          const regions = Object.entries(regionMap);
          if (regions.length <= 1) return null;
          return (
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-sm mb-10">
              <h2 className="font-bold text-sm mb-4">Monitoring Regions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {regions.map(([name, info]) => (
                  <div key={name} className="bg-slate-800/50 border border-white/5 rounded-xl p-4 text-center">
                    <p className="text-xl mb-1">{getRegionFlag(name)}</p>
                    <p className="text-xs font-bold text-white mb-1">{getRegionShortName(name)}</p>
                    <p className={`text-xs font-bold ${info.latest_status === 'Up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {info.latest_status === 'Up' ? '✓ Operational' : '✗ Down'}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{info.latest_ms}ms</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Last 90 Checks */}
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-sm mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-sm">Last 90 Checks</h2>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Up
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> Down
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-500" /> Unknown
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="flex gap-[3px] items-end justify-center">
              {checks.length > 0 ? checks.map((check, i) => {
                const barColor =
                  check.status === 'Up' ? 'bg-emerald-400 hover:bg-emerald-300' :
                  check.status === 'Down' ? 'bg-rose-400 hover:bg-rose-300' :
                  'bg-slate-500 hover:bg-slate-400';
                const barHeight = check.status === 'Up'
                  ? `${Math.max(20, Math.min(40, 40 - (check.response_ms || 0) / 50))}px`
                  : '40px';

                return (
                  <div
                    key={i}
                    className="relative group"
                    onMouseEnter={() => setHoveredCheck(i)}
                    onMouseLeave={() => setHoveredCheck(null)}
                  >
                    <div
                      className={`w-[6px] sm:w-[7px] rounded-full cursor-pointer transition-all ${barColor}`}
                      style={{ height: barHeight }}
                    />
                    {hoveredCheck === i && (
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-white/10 rounded-xl px-3 py-2 shadow-xl whitespace-nowrap pointer-events-none">
                        <p className={`text-xs font-bold mb-1 ${
                          check.status === 'Up' ? 'text-emerald-400' :
                          check.status === 'Down' ? 'text-rose-400' :
                          'text-slate-400'
                        }`}>
                          {check.status}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(check.timestamp).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {check.response_ms}ms · {getRegionFlag(check.region)} {getRegionShortName(check.region)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              }) : (
                <p className="text-slate-500 text-sm py-4">No checks recorded yet</p>
              )}
            </div>
            {checks.length > 0 && (
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-slate-600 font-medium">Oldest</span>
                <span className="text-[10px] text-slate-600 font-medium">Latest</span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
          <p className="text-slate-600 text-xs font-medium">
            Powered by <span className="text-slate-400 font-bold">UpGuard</span>
          </p>
          <p className="text-slate-600 text-xs font-medium">
            {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </footer>
    </div>
  );
};
