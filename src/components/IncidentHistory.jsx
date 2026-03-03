import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { LoadingSpinner } from './LoadingSpinner';
import { Navbar } from './Navbar';

export const IncidentHistory = () => {
  const { websiteId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Incidents | UpGuard';
    if (websiteId) loadIncidents();
  }, [websiteId]);

  const loadIncidents = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api.getIncidentHistory(websiteId);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load incident history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Still ongoing';
    return new Date(dateStr).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080a] text-white">
        <Navbar />
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#08080a] text-white">
        <Navbar />
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)]">
          <i className="fas fa-exclamation-triangle text-4xl text-amber-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Incidents</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#00f09a] hover:bg-[#00cc82] text-[#050505] px-4 py-2 rounded-md text-sm font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-white selection:bg-[#00f09a]/20">
      <Navbar />

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-400 hover:text-white transition-colors mb-6 text-sm font-medium"
        >
          <i className="fas fa-arrow-left mr-2" />
          Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Incident History</h1>
              <p className="text-slate-400 text-sm break-all">{data?.website_url}</p>
            </div>
            <div className="flex items-center">
              <span className="bg-[#00f09a]/10 border border-[#00f09a]/20 text-[#00f09a] px-4 py-2 rounded-xl text-sm font-bold">
                {data?.total_incidents || 0} Incident{data?.total_incidents !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Incidents List */}
        {data?.incidents?.length > 0 ? (
          <div className="space-y-4">
            {data.incidents.map((incident) => (
              <div
                key={incident.id}
                className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-sm hover:border-white/10 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold w-fit ${
                      incident.status === 'Ongoing'
                        ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                        : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        incident.status === 'Ongoing' ? 'bg-rose-400 animate-pulse' : 'bg-emerald-400'
                      }`}
                    />
                    {incident.status}
                  </span>
                  <span className="text-slate-500 text-xs font-medium">
                    Duration: {incident.duration_formatted}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                      Started At
                    </p>
                    <p className="text-sm text-white font-medium">
                      {formatDate(incident.started_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                      Resolved At
                    </p>
                    <p className={`text-sm font-medium ${incident.resolved_at ? 'text-white' : 'text-rose-400'}`}>
                      {formatDate(incident.resolved_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                      Region
                    </p>
                    <p className="text-sm text-white font-medium">
                      {incident.region || 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-12 backdrop-blur-sm text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check-circle text-3xl text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No incidents recorded!</h3>
            <p className="text-slate-400 text-sm">Your site has been stable.</p>
          </div>
        )}
      </main>
    </div>
  );
};
