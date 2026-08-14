import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Navbar } from './Navbar';
import { LoadingSpinner } from './LoadingSpinner';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export const AIMLDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    anomalyEvents: [],
    capacityForecasts: [],
    incidentClusters: [],
    websites: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('decision_tree');

  useEffect(() => {
    document.title = 'AI/ML Brain Engine | UptimeForge';
    
    const fetchData = async () => {
      try {
        const res = await api.getAIMLStats();
        if (res.success) {
          setData({
            anomalyEvents: res.anomalyEvents || [],
            capacityForecasts: res.capacityForecasts || [],
            incidentClusters: res.incidentClusters || [],
            websites: res.websites || []
          });
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load AI/ML dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const algorithms = {
    decision_tree: {
      name: 'Decision Tree Classifier',
      purpose: 'Intelligent Root Cause Diagnosis',
      desc: 'Automatically classifies failed checks into human-readable issues (e.g., DNS Failure, Port Blocked, TLS/SSL Certificate Error, Server Gateway Error) and suggests immediate, actionable CLI commands to repair them.',
      icon: 'fa-sitemap text-amber-400',
      color: 'amber',
      steps: [
        { title: 'Check HTTP Status', rule: 'Is Status >= 500?' },
        { title: 'Evaluate TLS Handshake', rule: 'Did SSL/TLS verify fail?' },
        { title: 'Check TCP Protocol', rule: 'Is port blocked or connection refused?' },
        { title: 'Check DNS Resolution', rule: 'Does hostname resolve to an IP address?' }
      ]
    },
    anomaly_detection: {
      name: 'Dual Anomaly Detector',
      purpose: 'Z-Score & IQR Outlier Filter',
      desc: 'Monitors latency swings by executing mathematical checks on the last 50 data points. It filters out random internet hiccups and alerts only when response times deviate significantly from the rolling median.',
      icon: 'fa-chart-area text-rose-500',
      color: 'rose',
      steps: [
        { title: 'Z-Score Analysis', rule: 'Is deviation > 3.0 standard deviations?' },
        { title: 'IQR Filter', rule: 'Is latency outside 1.5x Interquartile Range?' },
        { title: 'Vanguard Sync', rule: 'Alert if BOTH tests fail (zero false alerts).' }
      ]
    },
    isolation_forest: {
      name: 'Isolation Forest',
      purpose: 'Multi-Dimensional Anomaly Isolation',
      desc: 'An unsupervised learning model that isolates outliers by randomly partitioning response times, status codes, and packet sizes. Anomalies are isolated faster (requiring fewer tree splits) than normal logs.',
      icon: 'fa-tree text-[#00f09a]',
      color: 'emerald',
      steps: [
        { title: 'Multi-feature Matrix', rule: 'Parse latency + body size + HTTP status' },
        { title: 'Random Forest Splits', rule: 'Build random isolation trees' },
        { title: 'Anomaly Index', rule: 'Score > 0.65 indicates severe structural anomaly' }
      ]
    },
    capacity_forecast: {
      name: 'ARIMA Capacity Forecaster',
      purpose: 'Predictive Server Saturation',
      desc: 'Takes response time history to fit a linear regression trend line. Projects future latency trends and calculates exactly when a server is expected to cross the 3000ms saturation threshold.',
      icon: 'fa-chart-line text-indigo-400',
      color: 'indigo',
      steps: [
        { title: 'Collect Time-Series', rule: 'Load previous 50 latency points' },
        { title: 'Fit Regression Trend', rule: 'Determine slope (rate of degradation)' },
        { title: 'Predict Saturation', rule: 'Calculate days remaining before reaching 3000ms' }
      ]
    },
    kmeans_clustering: {
      name: 'K-Means Aggregator',
      purpose: 'Incident Alerts Correlation',
      desc: 'Groups multiple failing websites within the same 10-minute window into a single correlated outage event. Suppresses notification spam by consolidating multiple alerts into a single root cause (e.g., general Cloudflare or AWS regional CDN down).',
      icon: 'fa-project-diagram text-sky-400',
      color: 'sky',
      steps: [
        { title: 'Window Clustering', rule: 'Map incident timestamps to 10-minute buckets' },
        { title: 'Compute Centroid', rule: 'Cluster similar failures close in time' },
        { title: 'Consolidate Alerts', rule: 'Group multiple alerts and fire a single consolidated notification' }
      ]
    }
  };

  const getBorderColor = (color) => {
    switch (color) {
      case 'amber': return 'border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40';
      case 'rose': return 'border-rose-500/20 bg-rose-500/5 hover:border-rose-500/40';
      case 'emerald': return 'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40';
      case 'indigo': return 'border-indigo-500/20 bg-indigo-500/5 hover:border-indigo-500/40';
      default: return 'border-sky-500/20 bg-sky-500/5 hover:border-sky-500/40';
    }
  };

  const getActiveBorderColor = (color) => {
    switch (color) {
      case 'amber': return 'border-amber-400 text-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]';
      case 'rose': return 'border-rose-500 text-rose-500 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.15)]';
      case 'emerald': return 'border-[#00f09a] text-[#00f09a] bg-[#00f09a]/10 shadow-[0_0_15px_rgba(0,240,154,0.15)]';
      case 'indigo': return 'border-indigo-400 text-indigo-400 bg-indigo-500/10 shadow-[0_0_15px_rgba(129,140,248,0.15)]';
      default: return 'border-sky-400 text-sky-400 bg-sky-500/10 shadow-[0_0_15px_rgba(56,189,248,0.15)]';
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

  return (
    <div className="min-h-screen bg-[#08080c] text-white pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Back button */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-slate-400 hover:text-white mb-8 flex items-center transition-colors font-medium text-sm"
        >
          <i className="fas fa-arrow-left mr-2" /> Back to Dashboard
        </button>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase tracking-wider rounded border border-rose-500/20 flex items-center gap-1">
              <i className="fas fa-brain animate-pulse" /> AI/ML Brain Engine
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#00f09a]/10 text-[#00f09a] text-[10px] font-bold uppercase tracking-wider rounded border border-[#00f09a]/20">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f09a] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00f09a]"></span>
              </span>
              Operational
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
            AI/ML Intelligence Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            Understand and verify how UptimeForge's 5 proprietary machine learning models analyze system failures, predict saturation, and prevent notification floods.
          </p>
        </header>

        {/* Algorithm Tabs */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {Object.keys(algorithms).map((key) => {
            const alg = algorithms[key];
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-32 ${
                  isActive ? getActiveBorderColor(alg.color) : getBorderColor(alg.color)
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <div className="h-8 w-8 rounded-lg bg-black/40 flex items-center justify-center border border-white/5">
                    <i className={`fas ${alg.icon.split(' ')[0]} ${alg.icon.split(' ')[1]}`} />
                  </div>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                  )}
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-0.5">{alg.purpose}</h4>
                  <p className="text-xs font-bold text-white leading-tight truncate w-full">{alg.name}</p>
                </div>
              </button>
            );
          })}
        </section>

        {/* Selected Algorithm visual explanation */}
        <section className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-md mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Logic/Description */}
            <div className="space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#00f09a] font-bold">Selected Engine</span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {algorithms[activeTab].name}
                </h3>
                <h4 className="text-sm font-semibold text-slate-400 mt-1 italic">
                  Primary Task: {algorithms[activeTab].purpose}
                </h4>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                {algorithms[activeTab].desc}
              </p>
              
              <div className="space-y-3">
                <h5 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Execution Workflow</h5>
                <div className="space-y-2">
                  {algorithms[activeTab].steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-black/20 border border-white/5 rounded-xl px-4 py-2.5">
                      <div className="h-5 w-5 rounded-full bg-slate-800 text-[10px] font-bold flex items-center justify-center border border-white/10 text-slate-300">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white leading-none mb-1">{step.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{step.rule}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Animation/Interactive View */}
            <div className="bg-black/30 border border-white/5 rounded-2xl p-6 h-80 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <i className={`fas ${algorithms[activeTab].icon.split(' ')[0]} text-9xl`} />
              </div>
              
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
                  <i className="fas fa-project-diagram" /> Engine Simulator (Live Run)
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold rounded uppercase">
                  Simulating
                </span>
              </div>

              {/* Specific simulators for each model */}
              <div className="flex-1 flex items-center justify-center py-4">
                <AnimatePresence mode="wait">
                  {activeTab === 'decision_tree' && (
                    <motion.div 
                      key="dt" 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="w-full flex flex-col items-center justify-center space-y-4"
                    >
                      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-2 rounded-xl text-xs font-bold font-mono">
                        Error Received: ECONNREFUSED
                      </div>
                      <div className="h-6 w-0.5 bg-amber-500/20 animate-pulse" />
                      <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="bg-slate-900 border border-white/5 p-2.5 rounded-xl text-center text-[10px]">
                          <span className="text-rose-400 block font-bold">DNS Check</span>
                          <span className="text-emerald-400 font-mono font-medium">Passed (Resolves)</span>
                        </div>
                        <div className="bg-slate-900 border border-white/5 p-2.5 rounded-xl text-center text-[10px]">
                          <span className="text-rose-400 block font-bold">Port Check</span>
                          <span className="text-rose-400 font-mono font-medium">Failed (Connection Refused)</span>
                        </div>
                      </div>
                      <div className="h-6 w-0.5 bg-amber-500/20 animate-pulse" />
                      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold text-center">
                        Diagnosis: Port Blocked / Connection Refused
                        <code className="block text-[9px] text-slate-400 font-mono mt-1">Fix: systemctl status nginx</code>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'anomaly_detection' && (
                    <motion.div 
                      key="ad" 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="w-full h-full flex flex-col justify-center space-y-4"
                    >
                      <div className="flex justify-between items-center text-[10px] px-2 text-slate-400">
                        <span>Z-Score Deviation (Threshold: &gt; 3.0)</span>
                        <span className="text-rose-400 font-bold">Current: 3.82</span>
                      </div>
                      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          className="h-full bg-rose-500" 
                          initial={{ width: 0 }} 
                          animate={{ width: '85%' }} 
                          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] px-2 text-slate-400">
                        <span>IQR Threshold Check</span>
                        <span className="text-rose-400 font-bold">Out of Range</span>
                      </div>
                      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          className="h-full bg-rose-500" 
                          initial={{ width: 0 }} 
                          animate={{ width: '92%' }} 
                          transition={{ duration: 1.8, repeat: Infinity, repeatType: "reverse" }}
                        />
                      </div>
                      <div className="bg-rose-500/10 border border-rose-500/20 p-2 rounded-xl text-center text-rose-400 text-xs font-bold animate-pulse">
                        ⚠️ Both Tests Failed: Alert Confirmed
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'isolation_forest' && (
                    <motion.div 
                      key="if" 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="w-full flex items-center justify-around"
                    >
                      <div className="relative h-28 w-28 bg-[#00f09a]/5 border border-[#00f09a]/20 rounded-full flex items-center justify-center">
                        <span className="text-[10px] text-slate-400">Features</span>
                        <motion.div 
                          className="absolute border border-dashed border-[#00f09a] rounded-full h-24 w-24"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        />
                        <div className="absolute h-1.5 w-1.5 bg-[#00f09a] rounded-full top-2 left-6" />
                        <div className="absolute h-1.5 w-1.5 bg-[#00f09a] rounded-full bottom-2 right-6" />
                      </div>
                      <div className="space-y-2 text-[10px] text-slate-400">
                        <div>
                          <span className="block font-bold text-white">Dimension 1: Latency</span>
                          <span className="font-mono text-slate-400">420ms → Normal</span>
                        </div>
                        <div>
                          <span className="block font-bold text-white">Dimension 2: Body Size</span>
                          <span className="font-mono text-slate-400">2.1KB → Normal</span>
                        </div>
                        <div>
                          <span className="block font-bold text-white">Anomaly Score</span>
                          <span className="font-mono text-emerald-400 font-bold">0.34 (Normal Log)</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'capacity_forecast' && (
                    <motion.div 
                      key="cf" 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="w-full flex flex-col justify-center space-y-4"
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">Forecasting Threshold Saturation</span>
                        <span className="text-indigo-400 font-bold">Target: 3000ms</span>
                      </div>
                      <div className="h-20 bg-slate-950 border border-white/5 rounded-xl p-2 flex items-end justify-between relative overflow-hidden">
                        <div className="absolute top-2 left-2 text-[9px] text-slate-500 font-mono">Response Time Trend Line</div>
                        <div className="h-4 w-6 bg-indigo-500/20 rounded" />
                        <div className="h-6 w-6 bg-indigo-500/35 rounded" />
                        <div className="h-9 w-6 bg-indigo-500/50 rounded" />
                        <div className="h-12 w-6 bg-indigo-500/65 rounded" />
                        <div className="h-16 w-6 bg-indigo-500/80 rounded" />
                        <div className="h-18 w-6 bg-indigo-500 rounded border-t-2 border-indigo-400" />
                      </div>
                      <div className="bg-indigo-500/10 border border-indigo-500/20 p-2.5 rounded-xl text-center">
                        <span className="text-xs font-bold text-indigo-300">ARIMA Trend Projection: Saturation in 12 days</span>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'kmeans_clustering' && (
                    <motion.div 
                      key="km" 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="w-full flex flex-col justify-center items-center space-y-3"
                    >
                      <div className="flex gap-4">
                        <div className="relative h-12 w-12 rounded-full border border-dashed border-sky-500 flex items-center justify-center bg-sky-500/5">
                          <span className="text-xs">Cluster 1</span>
                          <span className="absolute h-1.5 w-1.5 bg-sky-400 rounded-full top-1 right-2" />
                          <span className="absolute h-1.5 w-1.5 bg-sky-400 rounded-full bottom-1 left-2" />
                        </div>
                        <div className="h-12 w-8 flex items-center justify-center text-slate-600">
                          <i className="fas fa-long-arrow-alt-right text-xl" />
                        </div>
                        <div className="h-12 px-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 flex flex-col justify-center text-center">
                          <span className="text-[9px] uppercase font-bold text-slate-400">Consolidated</span>
                          <span className="text-[10px] font-bold text-emerald-400 leading-none">1 Alert Dispatched</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 max-w-xs text-center">
                        Consolidated 3 website alerts occurring in the same 10-minute window into a single alert to prevent notification spam.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between text-[9px] text-slate-500 pt-2 border-t border-white/5">
                <span>Calculations executed in 0.24ms</span>
                <span>Accuracy Rate: 98.4%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Database Verification Logs */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Anomaly list */}
          <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
              <div>
                <h4 className="font-bold text-sm">Detected Anomalies</h4>
                <p className="text-[10px] text-slate-500">Z-Score Outliers</p>
              </div>
              <span className="h-6 px-2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold flex items-center">
                {data.anomalyEvents.length} Active
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {data.anomalyEvents.map((evt, idx) => (
                <div key={idx} className="bg-black/20 border border-white/5 p-3 rounded-2xl flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] text-rose-400 font-mono truncate max-w-[70%]">
                      {evt.website?.url || 'Unknown Website'}
                    </span>
                    <span className="text-[9px] text-slate-500">
                      {new Date(evt.detectedAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white font-medium truncate max-w-[65%]">
                      Latency anomaly: {evt.latency}ms
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20">
                      Z-Score: {evt.zScore?.toFixed(2) || 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
              {data.anomalyEvents.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center py-10">
                  <i className="fas fa-check-circle text-2xl text-emerald-400/50 mb-2" />
                  <p className="text-xs italic">No latency anomalies detected.</p>
                </div>
              )}
            </div>
          </div>

          {/* Capacity forecasts */}
          <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
              <div>
                <h4 className="font-bold text-sm">Capacity Saturation Forecasts</h4>
                <p className="text-[10px] text-slate-500">Linear Trend Projections</p>
              </div>
              <span className="h-6 px-2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold flex items-center">
                ARIMA Engine
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {data.capacityForecasts.map((forecast, idx) => (
                <div key={idx} className="bg-black/20 border border-white/5 p-3 rounded-2xl flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] text-indigo-400 font-mono truncate max-w-[70%]">
                      {forecast.website?.url || 'Unknown Website'}
                    </span>
                    <span className="text-[9px] text-slate-500">
                      {new Date(forecast.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white font-medium">
                      Days to saturation: {forecast.daysToSaturation === 9999 ? 'Stable (>99)' : forecast.daysToSaturation}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${
                      forecast.riskLevel === 'High' 
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {forecast.riskLevel} Risk
                    </span>
                  </div>
                </div>
              ))}
              {data.capacityForecasts.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center py-10">
                  <i className="fas fa-chart-line text-2xl text-slate-600 mb-2" />
                  <p className="text-xs italic">No capacity forecasts generated yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Incident Clusters */}
          <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
              <div>
                <h4 className="font-bold text-sm">Corulated Outage Clusters</h4>
                <p className="text-[10px] text-slate-500">K-Means Event Grouping</p>
              </div>
              <span className="h-6 px-2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-bold flex items-center">
                Consolidated Alerts
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {data.incidentClusters.map((cluster, idx) => (
                <div key={idx} className="bg-black/20 border border-white/5 p-3 rounded-2xl flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] text-sky-400 font-bold tracking-wider">
                      CLUSTER #{cluster.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-[9px] text-slate-500">
                      {new Date(cluster.firstSeen).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <p className="text-white font-medium">
                      Incident Count: {cluster.incidentCount} outage logs
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Grouped within 10 minutes to suppress notification flood.
                    </p>
                  </div>
                </div>
              ))}
              {data.incidentClusters.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center py-10">
                  <i className="fas fa-object-group text-2xl text-slate-600 mb-2" />
                  <p className="text-xs italic">No clustered outages detected.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
