import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import { api } from '../services/api';
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
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8 text-white font-['Outfit'] overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[#bc2c12]/5 blur-[120px] rounded-full -translate-y-1/2" />
      
      <div className="max-w-md w-full relative z-10">
        <div className="bg-[#050505] border border-white/5 rounded-[40px] p-10 shadow-2xl backdrop-blur-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#bc2c12] to-transparent" />
          
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-3 text-[10px] font-black text-slate-700 hover:text-white tracking-[0.3em] uppercase transition-all mb-10 group">
              <i className="fas fa-chevron-left group-hover:-translate-x-1 transition-transform" /> Back to base
            </Link>
            <div className="mb-4 inline-flex h-16 w-16 bg-[#bc2c12]/10 border border-[#bc2c12]/20 rounded-2xl items-center justify-center shadow-2xl">
              <i className="fas fa-microchip text-2xl text-[#bc2c12]" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter mb-3 uppercase">
              UpGuard Control
            </h2>
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
              {isLogin ? 'Mission-Critical Access' : 'Initialize New Node'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider animate-shake">
                <i className="fas fa-shield-virus mr-3" /> {error}
              </div>
            )}
            {success && (
              <div className="bg-[#bc2c12]/10 border border-[#bc2c12]/20 text-[#bc2c12] px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider">
                <i className="fas fa-check-shield mr-3" /> {success}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  required
                  className="w-full px-6 py-5 bg-black border border-white/5 rounded-2xl text-white placeholder-slate-800 focus:outline-none focus:border-[#bc2c12] sm:text-sm transition-all font-black"
                  placeholder="USERNAME_ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {!isLogin && (
                <div className="relative animate-in fade-in slide-in-from-top-2">
                  <input
                    type="email"
                    className="w-full px-6 py-5 bg-black border border-white/5 rounded-2xl text-white placeholder-slate-800 focus:outline-none focus:border-[#bc2c12] sm:text-sm transition-all font-black"
                    placeholder="EMAIL_ADDR (OPTIONAL)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-6 py-5 bg-black border border-white/5 rounded-2xl text-white placeholder-slate-800 focus:outline-none focus:border-[#bc2c12] sm:text-sm transition-all pr-14 font-black"
                  placeholder="ACCESS_KEY"
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
              className="w-full flex justify-center py-5 px-6 bg-[#bc2c12] text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-[#d43216] active:scale-95 disabled:opacity-50 transition-all shadow-[0_20px_40px_-10px_rgba(188,44,18,0.4)] relative group overflow-hidden"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <span className="flex items-center gap-3">
                  {isLogin ? 'Establish Session' : 'Create Identity'}
                  <i className="fas fa-chevron-right text-[10px] group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>

            <div className="pt-4 text-center">
              <button
                type="button"
                className="text-slate-700 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                  setEmail('');
                }}
              >
                {isLogin ? "Generate New Credentials" : 'Existing User Identification'}
              </button>
            </div>
          </form>
        </div>
        
        <p className="mt-10 text-center text-[10px] text-slate-800 font-black uppercase tracking-[0.4em]">
           SECURE UPLINK ESTABLISHED &bull; 2026
        </p>
      </div>
    </div>
  );
};
