import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Navbar } from '../components/Navbar';

export const SecurityCheck = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Security Check | Antigravtiven';
    const fetchReport = async () => {
      try {
        const data = await api.getSecurityHeaders(id);
        setReport(data);
      } catch (err) {
        setError(err.message || 'Failed to analyze security headers');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
    if (grade.startsWith('B')) return 'text-blue-400 border-blue-500/20 bg-blue-500/10';
    if (grade.startsWith('C')) return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/20 bg-rose-500/10';
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-rose-500/20 text-rose-400 border-rose-500/20';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/20';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/20';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/20';
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
        <p className="mt-4 text-slate-400 animate-pulse">Analyzing security headers...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <button 
          onClick={() => navigate(`/website/${id}`)}
          className="text-slate-400 hover:text-white mb-8 flex items-center transition-colors font-medium text-sm"
        >
          <i className="fas fa-arrow-left mr-2" /> Back to Details
        </button>

        {error ? (
          <div className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-2xl text-center">
            <i className="fas fa-shield-alt text-rose-500 text-4xl mb-4" />
            <h2 className="text-xl font-bold mb-2">Analysis Failed</h2>
            <p className="text-slate-400">{error}</p>
          </div>
        ) : report && (
          <div className="space-y-8">
            {/* Header / Score */}
            <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <i className="fas fa-shield-virus text-8xl" />
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className={`h-32 w-32 rounded-3xl border-2 flex items-center justify-center text-5xl font-black shadow-2xl ${getGradeColor(report.grade)}`}>
                  {report.grade}
                </div>
                <div>
                  <h1 className="text-3xl font-black mb-2">Security Header Analysis</h1>
                  <p className="text-slate-400 max-w-lg mb-6">
                    A security check of how well your server protects users from common web vulnerabilities like XSS, Clickjacking, and MIME sniffing.
                  </p>
                  <div className="flex gap-4">
                    <div className="bg-black/20 rounded-xl px-4 py-2 border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Security Score</span>
                      <span className="text-xl font-bold">{report.score}/100</span>
                    </div>
                    <div className="bg-black/20 rounded-xl px-4 py-2 border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Headers Passed</span>
                      <span className="text-xl font-bold text-emerald-400">{report.passed}</span>
                      <span className="text-slate-500 ml-1">/ {report.passed + report.failed}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Headers Table */}
            <div className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
              <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02]">
                <h3 className="font-bold">Detailed Header Report</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] uppercase font-bold text-slate-500 tracking-widest border-b border-white/5">
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">Header</th>
                      <th className="px-8 py-4">Severity</th>
                      <th className="px-8 py-4">Information</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {report.headers.map((h, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-6">
                          {h.present ? (
                            <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                              <i className="fas fa-check" />
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                              <i className="fas fa-times" />
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          <p className="font-bold text-white text-sm">{h.name}</p>
                          {h.present && (
                            <code className="text-[10px] text-slate-400 block mt-1 truncate max-w-[200px]" title={h.value}>
                              {h.value}
                            </code>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${getSeverityBadge(h.severity)}`}>
                            {h.severity}
                          </span>
                        </td>
                        <td className="px-8 py-6 max-w-xs">
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {h.description}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* How to Fix */}
            {report.failed > 0 && (
              <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <i className="fas fa-tools text-indigo-400 text-xl" />
                  <h3 className="font-bold text-lg">Recommended Fixes</h3>
                </div>
                <div className="space-y-6">
                  {report.headers.filter(h => !h.present && (h.severity === 'critical' || h.severity === 'high')).map((h, i) => (
                    <div key={i} className="bg-black/20 border border-white/5 rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        <h4 className="font-bold text-sm">Add {h.name} header</h4>
                      </div>
                      <p className="text-xs text-slate-400 mb-4">
                        To resolve this {h.severity} issue, add the following to your Nginx configuration:
                      </p>
                      <code className="block bg-slate-950 p-4 rounded-xl text-[11px] text-indigo-300 font-mono border border-white/5">
                        add_header {h.name} "{h.name === 'Strict-Transport-Security' ? 'max-age=31536000; includeSubDomains' : '...' }";
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
