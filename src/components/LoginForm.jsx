import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import { Link } from 'react-router-dom';

export const LoginForm = ({ defaultIsLogin = true }) => {
  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const result = await login(username, password);
        if (!result.success) setError(result.error);
      } else {
        const result = await signup(username, password, email || undefined);
        if (result.success) {
          setSuccess('Account created successfully! You can now sign in.');
          setIsLogin(true);
          setEmail('');
        } else {
          setError(result.error);
        }
      }
    } catch (_error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] py-12 px-4 sm:px-6 lg:px-8 text-white font-['Inter'] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-[#00f09a]/5 blur-[150px] rounded-full -translate-y-1/2 pointer-events-none" />
      
      <div className="max-w-md w-full relative z-10">
        <div className="bg-[#0b0b0d] border border-white/5 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f09a] to-transparent" />
          
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-3 text-[10px] font-black text-slate-700 hover:text-white tracking-[0.3em] uppercase transition-all mb-10 group">
              <i className="fas fa-chevron-left group-hover:-translate-x-1 transition-transform" /> Back to home
            </Link>
            <div className="mb-6 h-16 w-16 bg-[#00f09a]/10 border border-[#00f09a]/20 rounded-2xl flex items-center justify-center shadow-2xl mx-auto">
              <i className="fas fa-bolt text-2xl text-[#00f09a]" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter mb-4 italic uppercase">
              UpGuard Space
            </h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] italic">
              {isLogin ? 'Mission Authorization Required' : 'Initialize New Identity'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-5 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider animate-shake">
                <i className="fas fa-exclamation-triangle mr-3" /> {error}
              </div>
            )}
            {success && (
              <div className="bg-[#00f09a]/10 border border-[#00f09a]/20 text-[#00f09a] px-5 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider">
                <i className="fas fa-check-circle mr-3" /> {success}
              </div>
            )}

            <div className="space-y-4">
              <input
                type="text"
                required
                className="w-full px-6 py-5 bg-black border border-white/5 rounded-2xl text-white placeholder-slate-800 focus:outline-none focus:border-[#00f09a] sm:text-sm transition-all font-bold"
                placeholder="USERNAME"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              {!isLogin && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <input
                    type="email"
                    className="w-full px-6 py-5 bg-black border border-white/5 rounded-2xl text-white placeholder-slate-800 focus:outline-none focus:border-[#00f09a] sm:text-sm transition-all font-bold"
                    placeholder="EMAIL (OPTIONAL)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-6 py-5 bg-black border border-white/5 rounded-2xl text-white placeholder-slate-800 focus:outline-none focus:border-[#00f09a] sm:text-sm transition-all pr-14 font-bold"
                  placeholder="AUTHORIZATION_KEY"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-800 hover:text-white transition-colors"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-5 px-6 bg-[#00f09a] text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-[#00cc82] transition-all shadow-[0_20px_40px_-10px_rgba(0,240,154,0.3)] group"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <span className="flex items-center gap-3">
                  {isLogin ? 'Enter System' : 'Provision User'}
                  <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>

            <div className="pt-4 text-center">
              <button
                type="button"
                className="text-slate-600 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                  setEmail('');
                }}
              >
                {isLogin ? "Generate New Credentials" : 'Existing Identification'}
              </button>
            </div>
          </form>
        </div>
        
        <p className="mt-10 text-center text-[10px] text-slate-800 font-bold uppercase tracking-[0.4em]">
           ESTABLISHING SECURE UPLINK &bull; 2026
        </p>
      </div>
    </div>
  );
};
