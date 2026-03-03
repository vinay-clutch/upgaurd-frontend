import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4">
      <div className="w-full max-w-7xl flex items-center justify-between py-4 px-8 bg-transparent">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00f09a] rounded-lg flex items-center justify-center">
              <i className="fas fa-bolt text-black text-sm" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">UpGuard</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Why UpGuard?</a>
            <a href="#services" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Services</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">How it works</a>
            <a href="#faq" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">FAQ</a>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-[#00f09a] text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#00cc82] transition-all"
            >
              Dashboard
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-white hover:text-[#00f09a] transition-colors">Login</Link>
              <button 
                onClick={() => navigate('/register')}
                className="bg-transparent text-white border border-white/20 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-white/5 transition-all"
              >
                Create account
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const TopGlow = () => (
  <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden pointer-events-none z-0">
    <div 
      className="absolute top-[-250px] left-[-150px] w-[800px] h-[800px] rounded-full opacity-[0.4]"
      style={{
        background: 'radial-gradient(circle, #00f09a 0%, transparent 75%)',
        filter: 'blur(120px)'
      }}
    />
    <div 
      className="absolute top-[-300px] right-[-100px] w-[600px] h-[600px] rounded-full opacity-[0.2]"
      style={{
        background: 'radial-gradient(circle, #00f09a 0%, transparent 75%)',
        filter: 'blur(100px)'
      }}
    />
  </div>
);

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#00f09a]/30 font-['Inter'] relative overflow-x-hidden">
      <TopGlow />
      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-48 pb-24 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
              Take Control of <br />
              <span className="text-white">Your Digital Infrastructure</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 font-medium">
              UpGuard offers a seamless, secure experience for managing your uptime. 
              Instant alerts, global nodes, and premium design for modern teams.
            </p>
            
            <button 
              onClick={() => navigate('/register')}
              className="group bg-[#00f09a] text-black px-10 py-5 rounded-full text-lg font-bold hover:scale-105 transition-all shadow-[0_20px_40px_-10px_rgba(0,240,154,0.4)] flex items-center gap-3 mx-auto"
            >
              Get started
              <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="mt-16 flex flex-col items-center gap-4">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">They trust us</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star text-white text-xs" />
                ))}
                <span className="ml-2 text-sm font-bold text-white">4.9</span>
                <div className="ml-3 h-6 w-6 bg-white rounded-full flex items-center justify-center">
                   <span className="text-black font-black text-[10px]">G</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mockup Section */}
        <section className="pb-32 px-4 relative">
          <div className="max-w-6xl mx-auto relative group">
            {/* Mockup Glow */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[80%] h-20 bg-[#00f09a]/20 blur-[60px] rounded-full" />
            
            <div className="bg-[#0b0b0d] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl relative">
              {/* Header Strip */}
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#00f09a] to-transparent opacity-50" />
              
              <div className="p-8 md:p-12">
                 <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 space-y-2">
                       <div className="flex items-center gap-3 mb-8">
                          <div className="w-8 h-8 bg-[#00f09a] rounded-lg flex items-center justify-center">
                            <i className="fas fa-bolt text-black text-xs" />
                          </div>
                          <span className="text-lg font-bold">UpGuard</span>
                       </div>
                       {[
                         { icon: 'fa-th-large', label: 'Dashboard', active: true },
                         { icon: 'fa-cube', label: 'Monitors' },
                         { icon: 'fa-chart-line', label: 'Incidents' },
                         { icon: 'fa-cog', label: 'Settings' }
                       ].map((item, i) => (
                         <div key={i} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${item.active ? 'bg-white/5 text-white' : 'text-slate-500 hover:bg-white/5'}`}>
                           <i className={`fas ${item.icon} text-sm`} />
                           <span className="text-sm font-bold">{item.label}</span>
                         </div>
                       ))}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-8">
                       <div className="flex justify-between items-center">
                          <h3 className="text-2xl font-bold">Main Infrastructure</h3>
                          <div className="flex gap-2">
                             {['1D', '7D', '1M', '1Y'].map(t => (
                               <span key={t} className={`px-3 py-1 rounded-lg text-[10px] font-bold ${t === '1Y' ? 'bg-white/10 text-white' : 'text-slate-500'}`}>{t}</span>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-2">
                          <p className="text-sm text-slate-500 font-medium tracking-tight">System Reliability</p>
                          <div className="flex items-end gap-3">
                             <span className="text-4xl font-black">99.998%</span>
                             <span className="text-[#00f09a] text-sm font-bold mb-1">+0.002%</span>
                          </div>
                       </div>

                       {/* Chart Placeholder */}
                       <div className="h-64 w-full bg-[#0d0d0f] rounded-2xl border border-white/5 relative overflow-hidden">
                          <svg className="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="none">
                             <path 
                              d="M0,200 Q150,150 300,180 T600,100 T900,140 T1200,80 V256 H0 Z" 
                              fill="url(#chartGradient)" 
                              className="opacity-20"
                             />
                             <path 
                              d="M0,200 Q150,150 300,180 T600,100 T900,140 T1200,80" 
                              stroke="#00f09a" 
                              strokeWidth="3" 
                              fill="none" 
                             />
                             <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="0%" stopColor="#00f09a" />
                                   <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                             </defs>
                          </svg>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-24 border-t border-white/5 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex justify-center items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-[#00f09a] rounded-lg flex items-center justify-center">
                <i className="fas fa-bolt text-black text-sm" />
              </div>
              <span className="text-xl font-bold tracking-tight">UpGuard</span>
            </div>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-12">
              The world's most advanced infrastructure monitoring platform. 
              Designed for reliability, built for speed.
            </p>
            <div className="flex justify-center gap-8 mb-12 text-sm font-medium text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
            <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">
              © 2026 UpGuard Technologies. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};
