import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout, userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const userInitial = userProfile?.username?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'py-4 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl' : 'py-6 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="group flex items-center space-x-3">
            <div className="h-10 w-10 bg-[#00f09a] rounded-xl flex items-center justify-center transition-all group-hover:shadow-[0_0_15px_rgba(0,240,154,0.4)]">
              <i className="fas fa-bolt text-black text-lg" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">UpGuard</span>
          </Link>

          <div className="flex items-center space-x-6">
            {!user ? (
              <>
                <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Sign In</Link>
                <Link to="/register" className="bg-[#00f09a] text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#00cc82] transition-all transform hover:scale-105">
                  Get Started
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                <Link to="/dashboard" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Dashboard</Link>
                <div className="relative group">
                  <div className="flex items-center space-x-3 cursor-pointer p-1 pr-3 rounded-full bg-white/5 border border-white/5 hover:border-[#00f09a]/30 transition-all">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00f09a] to-[#00cc82] flex items-center justify-center text-black text-xs font-black">
                      {userInitial}
                    </div>
                    <span className="text-xs font-bold text-slate-300 group-hover:text-white">{userProfile?.username || 'Pilot'}</span>
                    <i className="fas fa-chevron-down text-[10px] text-slate-500 group-hover:text-[#00f09a] transition-all" />
                  </div>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-3 w-56 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                    <div className="bg-[#0b0b0d] border border-white/10 rounded-2xl p-2 shadow-2xl">
                      <div className="px-4 py-3 border-b border-white/5 mb-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Control Panel</p>
                        <p className="text-sm font-bold text-white truncate">{userProfile?.email || user?.username}</p>
                      </div>
                      <Link to="/profile" className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                        <i className="far fa-user-circle text-sm" />
                        <span className="text-sm font-bold">Account Space</span>
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all">
                        <i className="fas fa-power-off text-sm" />
                        <span className="text-sm font-bold text-left">Terminate Session</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
