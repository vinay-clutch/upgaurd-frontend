import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ═══════════════════════════════════
// BEAM ANIMATION (Premium background)
// ═══════════════════════════════════
function createBeam(width, height, layer) {
  const angle = -35 + Math.random() * 10;
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    width: 6 + layer * 3,
    length: height * 2.5,
    angle,
    speed: 0.15 + layer * 0.1,
    opacity: 0.05 + layer * 0.03,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.01 + Math.random() * 0.01,
    layer,
  };
}

function BeamCanvas() {
  const canvasRef = useRef(null);
  const beamsRef = useRef([]);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const LAYERS = 3;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.scale(dpr, dpr);
      
      beamsRef.current = [];
      const count = w < 768 ? 4 : 8;
      for (let l = 1; l <= LAYERS; l++) {
        for (let i = 0; i < count; i++) {
          beamsRef.current.push(createBeam(w, h, l));
        }
      }
    };

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 250);
    };

    resize();
    window.addEventListener("resize", handleResize);

    const drawBeam = (beam) => {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);
      
      const op = Math.min(0.3, beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.4));
      const grad = ctx.createLinearGradient(0, 0, 0, beam.length);
      const color = "0, 240, 154"; // Emerald
      grad.addColorStop(0, `rgba(${color}, 0)`);
      grad.addColorStop(0.5, `rgba(${color}, ${op})`);
      grad.addColorStop(1, `rgba(${color}, 0)`);
      
      ctx.fillStyle = grad;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const h = window.innerHeight;
      const w = window.innerWidth;

      beamsRef.current.forEach((beam) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;
        if (beam.y + beam.length < -50) {
          beam.y = h + 50;
          beam.x = Math.random() * w;
        }
        drawBeam(beam);
      });

      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ willChange: "transform" }}
    />
  );
}

// ═══════════════════════════════════
// MARQUEE (Left to Right)
// ═══════════════════════════════════
const techs = [
  "React", "Node.js", "Next.js", "Vue",
  "Django", "Laravel", "FastAPI", "Spring",
  "Express", "NestJS", "Nuxt", "Remix"
];

function Marquee() {
  return (
    <div className="overflow-hidden border-y border-white/5 py-4 lg:py-6 bg-white/[0.01]">
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <div 
        className="flex whitespace-nowrap" 
        style={{ animation: "marqueeScroll 35s linear infinite", width: "max-content" }}
      >
        {techs.concat(techs).map((t, i) => (
          <span key={i} className="flex items-center gap-3 px-8 lg:px-12 text-slate-500 text-sm lg:text-base font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f09a] shadow-[0_0_10px_#00f09a]" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Landing() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) navigate("/dashboard");
    document.title = "UpGuard — Industrial Grade Uptime Monitoring";
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#08080a] text-white font-['Inter',sans-serif] overflow-x-hidden selection:bg-[#00f09a]/20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        .hero-h1 {
          font-family: 'Outfit';
          letter-spacing: -4px;
          line-height: 0.9;
          transform: scaleX(1.1);
          transform-origin: center;
        }
        
        @media (max-width: 768px) {
          .hero-h1 {
            letter-spacing: -2px;
            transform: scaleX(1);
          }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-up {
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        .float-animation {
          animation: float 6s ease-in-out infinite;
        }

        .mockup-glow {
          box-shadow: 0 0 120px -30px rgba(0, 240, 154, 0.2);
        }
      `}</style>

      <BeamCanvas />
      
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 inset-x-0 h-20 md:h-24 z-50 flex items-center justify-center pointer-events-none px-4">
        <div className="w-full max-w-[1400px] h-14 md:h-16 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-between px-6 md:px-10 pointer-events-auto shadow-2xl">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-8 h-8 md:w-9 md:h-9 bg-[#00f09a] rounded-xl flex items-center justify-center text-[#050505] shadow-lg shadow-[#00f09a]/20 transition-transform group-hover:scale-110">
              <i className="fas fa-shield-alt text-base md:text-lg" />
            </div>
            <span className="font-['Outfit'] font-black text-xl md:text-2xl tracking-tighter text-white drop-shadow-[0_0_10px_rgba(0,240,154,0.3)]">UpGuard</span>
          </div>
          
          <div className="flex items-center gap-3 md:gap-8">
            <button 
              onClick={() => navigate("/login")}
              className="hidden sm:block text-sm md:text-base font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Log in
            </button>
            <button 
              onClick={() => navigate("/register")}
              className="bg-[#00f09a] hover:bg-[#00cc82] text-[#050505] px-6 md:px-10 py-2 md:py-3 rounded-full text-sm md:text-base font-black transition-all hover:shadow-lg hover:shadow-[#00f09a]/30 active:scale-95 shadow-xl cursor-pointer pointer-events-auto"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-44 pb-16 md:pt-60 md:pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_50%_-10%,rgba(0,240,154,0.18)_0%,transparent_70%)] pointer-events-none z-0" />
        
        <div className="max-w-[1400px] mx-auto text-center relative z-10 animate-fade-up">
          <div className="inline-flex items-center gap-3 bg-[#00f09a]/10 border border-[#00f09a]/20 rounded-full px-5 py-2 mb-10">
            <span className="w-2 h-2 rounded-full bg-[#00f09a] animate-pulse" />
            <span className="text-xs md:text-sm font-black uppercase text-[#00f09a] tracking-[0.2em]">Global Uptime Intelligence</span>
          </div>

          <h1 className="hero-h1 text-6xl sm:text-7xl md:text-9xl lg:text-[140px] font-black text-white mb-12">
            Infrastructure<br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-[linear-gradient(135deg,#00f09a_0%,#06b6d4_50%,#00f09a_100%)]">Intelligence.</span>
          </h1>
          
          <p className="max-w-4xl mx-auto text-slate-400 text-xl md:text-2xl lg:text-3xl leading-relaxed mb-16 font-medium px-4">
            Professional-grade uptime monitoring, globally distributed checks, and 
            instant alert dispatch — built for high-scale engineering teams.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto bg-[#00f09a] hover:bg-[#00cc82] text-[#050505] px-14 py-6 md:px-16 md:py-7 rounded-[28px] text-xl md:text-2xl font-black transition-all hover:shadow-2xl hover:shadow-[#00f09a]/30 active:scale-95 shadow-xl cursor-pointer pointer-events-auto"
            >
              Start Monitoring Free
            </button>
            <button 
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto group bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white px-14 py-6 md:px-16 md:py-7 rounded-[28px] text-xl md:text-2xl font-black transition-all flex items-center justify-center gap-4 backdrop-blur-sm shadow-xl cursor-pointer pointer-events-auto"
            >
              Dashboard
              <i className="fas fa-arrow-right text-base text-[#00f09a] group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        {/* ── REAL-TIME DASHBOARD MOCKUP (Image Accurate High Fidelity) ── */}
        <div className="max-w-[1350px] mx-auto mt-28 md:mt-44 px-4 relative group float-animation">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#00f09a]/40 to-[#06b6d4]/40 rounded-[60px] blur-[150px] opacity-20 transition-opacity" />
          
          <div className="relative bg-[#0d0d12] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl mockup-glow">
            
            {/* Header / Sidebar Control */}
            <div className="bg-[#121217] px-8 py-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] border border-black/20" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#febc2e] border border-black/20" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#28c840] border border-black/20" />
              </div>
              <div className="hidden md:flex flex-1 max-w-sm mx-auto bg-black/40 rounded-xl px-5 py-2.5 text-center text-[10px] text-slate-500 font-black tracking-widest uppercase border border-white/5">
                app.upguard.io/dashboard
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10" />
                <div className="w-10 h-10 rounded-full bg-[#00f09a]/10 border border-[#00f09a]/20" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row h-[600px] md:h-[750px] relative">
              {/* Real Sidebar */}
              <div className="hidden md:block w-80 border-r border-white/5 bg-[#0a0a0f] p-10 pt-14">
                <div className="flex items-center gap-4 mb-16 px-2">
                   <div className="w-6 h-6 bg-[#00f09a] rounded-lg flex items-center justify-center text-[#050505]">
                      <i className="fas fa-shield-alt text-xs" />
                   </div>
                   <span className="text-[#00f09a] text-lg font-black tracking-widest uppercase">UpGuard</span>
                </div>
                
                <div className="space-y-4">
                  {[
                    { icon: 'fa-tachometer-alt', label: 'Dashboard', active: true },
                    { icon: 'fa-globe', label: 'Websites' },
                    { icon: 'fa-chart-area', label: 'Analytics' },
                    { icon: 'fa-exclamation-triangle', label: 'Incidents' },
                    { icon: 'fa-cog', label: 'Settings' }
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-5 px-6 py-4 rounded-2xl cursor-pointer transition-all ${item.active ? 'bg-[#00f09a]/10 border border-[#00f09a]/20 text-[#00f09a]' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                      <i className={`fas ${item.icon} text-base`} />
                      <span className="text-sm font-black tracking-tight">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-20 px-4">
                  <div className="h-0.5 w-full bg-white/5 mb-8" />
                  <div className="space-y-6">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-600 tracking-widest">
                       <span>Quota</span>
                       <span>85%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-[#00f09a] w-[85%] rounded-full shadow-[0_0_10px_#00f09a]" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content Area */}
              <div className="flex-1 p-10 md:p-16 relative overflow-hidden bg-[radial-gradient(circle_at_0%_0%,rgba(0,240,154,0.05)_0%,transparent_60%)]">
                <div className="flex items-center justify-between mb-16">
                   <h2 className="text-3xl font-black text-white tracking-tight">System Performance</h2>
                   <div className="flex gap-4">
                      <div className="bg-white/5 border border-white/10 px-5 py-2.5 rounded-xl text-xs font-black text-slate-400">Past 24H</div>
                      <div className="bg-[#00f09a] text-[#050505] px-5 py-2.5 rounded-xl text-xs font-black">Compare</div>
                   </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-16">
                  {[
                    { label: "MONITORED ASSETS", value: "24", color: "white" },
                    { label: "TOTAL UPTIME", value: "99.99%", color: "#00f09a" },
                    { label: "AVG LATENCY", value: "42ms", color: "#06b6d4" }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/5 rounded-[32px] p-10 md:p-12 ring-1 ring-white/5 hover:bg-white/[0.05] transition-all relative overflow-hidden group/card">
                      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover/card:opacity-20 transition-opacity">
                         <i className={`fas ${i === 0 ? 'fa-server' : i === 1 ? 'fa-check-circle' : 'fa-bolt'} text-4xl`} />
                      </div>
                      <div className="text-[10px] md:text-sm font-black text-slate-500 tracking-[0.3em] uppercase mb-8">{stat.label}</div>
                      <div className="text-5xl md:text-7xl font-black tracking-tighter" style={{ color: stat.color }}>{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Main Fidelity Graph */}
                <div className="relative h-80 md:h-[450px] bg-black/40 border border-white/5 rounded-[50px] overflow-hidden flex items-end px-8 md:px-16 pt-12 pb-8 group/graph">
                   <div className="absolute top-16 left-16 z-20">
                      <div className="text-[11px] md:text-sm font-black text-slate-600 tracking-[0.4em] uppercase mb-2">Global Response Distribution</div>
                      <div className="flex items-center gap-3">
                         <div className="w-3 h-3 rounded-full bg-[#00f09a]" />
                         <span className="text-2xl font-black text-white">42.5ms</span>
                         <span className="text-xs text-[#00f09a] font-black">(-2.1%)</span>
                      </div>
                   </div>
                   
                   {/* Grid Lines */}
                   <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none opacity-20">
                      {[...Array(24)].map((_, i) => (
                        <div key={i} className="border-t border-l border-white/10" />
                      ))}
                   </div>

                   <svg className="w-full h-full overflow-visible relative z-10" viewBox="0 0 1000 300" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="main-area-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00f09a" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#00f09a" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Secondary Trace */}
                      <path 
                        d="M0,250 C100,230 200,260 300,220 S500,180 600,210 S750,230 1000,180" 
                        fill="none" 
                        stroke="rgba(255,255,255,0.05)" 
                        strokeWidth="3" 
                        strokeLinejoin="round"
                      />
                      {/* Main Trace */}
                      <path 
                        d="M0,220 C150,180 300,280 450,200 S600,80 750,150 S900,180 1000,100" 
                        fill="none" 
                        stroke="#00f09a" 
                        strokeWidth="7" 
                        strokeLinecap="round" 
                        className="drop-shadow-[0_0_25px_rgba(0,240,154,0.7)]"
                      />
                      <path 
                        d="M0,220 C150,180 300,280 450,200 S600,80 750,150 S900,180 1000,100 L1000,300 L0,300 Z" 
                        fill="url(#main-area-grad)" 
                      />
                      <circle cx="650" cy="110" r="12" fill="#06b6d4" className="animate-pulse shadow-[0_0_20px_#06b6d4]" />
                   </svg>
                </div>

                {/* Activity Feed Overlay */}
                <div className="absolute right-12 top-1/4 bg-[#121217]/95 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 md:p-12 w-72 md:w-96 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] z-30 ring-1 ring-white/10 group-hover:translate-x-[-10px] transition-transform">
                   <div className="flex items-center justify-between mb-10">
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Live Activity</span>
                      <i className="fas fa-ellipsis-h text-slate-700" />
                   </div>
                   <div className="space-y-10">
                      {[
                        { time: '2m ago', event: 'UpGuard API', status: 'Recovered', color: '#00f09a' },
                        { time: '14m ago', event: 'US-EAST Node', status: 'Latency Spike', color: '#ea580c' },
                        { time: '1h ago', event: 'Asset: main-db', status: 'Check Success', color: '#06b6d4' }
                      ].map((item, i) => (
                        <div key={i} className="flex gap-5">
                           <div className="w-1.5 h-10 rounded-full" style={{ background: item.color }} />
                           <div>
                              <div className="text-white font-black text-base">{item.event}</div>
                              <div className="flex items-center gap-3">
                                 <span className="text-[10px] uppercase font-black tracking-widest" style={{ color: item.color }}>{item.status}</span>
                                 <span className="text-[10px] text-slate-600 font-bold">{item.time}</span>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Floating Metrics */}
                <div className="absolute left-12 bottom-20 bg-[#121217]/95 backdrop-blur-3xl border border-white/10 rounded-[35px] px-10 py-10 md:w-80 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] z-30 ring-1 ring-white/10">
                   <div className="flex items-center gap-5 mb-6">
                      <div className="w-4 h-4 rounded-full bg-[#00f09a] animate-pulse shadow-[0_0_20px_#00f09a]" />
                      <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Operational</span>
                   </div>
                   <div className="text-3xl md:text-5xl font-black text-white tracking-tighter">100%</div>
                   <div className="text-slate-600 text-[10px] font-black uppercase mt-4 tracking-widest">Network Integrity</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <Marquee />

      {/* ── FEATURES ── */}
      <section className="py-32 md:py-64 px-6 max-w-[1400px] mx-auto">
        <div className="text-center mb-32 md:mb-56 px-4">
          <span className="text-[#00f09a] text-sm font-black uppercase tracking-[0.6em] mb-10 block">Mission Critical Visibility</span>
          <h2 className="hero-h1 text-5xl sm:text-6xl md:text-9xl font-black mb-12 text-white">Built for scale.</h2>
          <p className="text-slate-500 text-2xl md:text-4xl max-w-5xl mx-auto font-medium leading-relaxed">Industrial-grade infrastructure monitoring for the world's most resilient engineering teams.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-20">
          {[
            { 
              title: "Global Distribution", 
              desc: "Monitor your infrastructure from US, Europe, and Asia. Detect regional routing failures and latency spikes instantly with edge precision.", 
              icon: "fa-globe-americas"
            },
            { 
              title: "Alert Orchestration", 
              desc: "Connect seamlessly with Discord, Slack, and Email. Multi-level thresholds and intelligent debounce logic ensure zero fatigue.", 
              icon: "fa-bell"
            },
            { 
              title: "Deep Diagnostics", 
              desc: "Automated root-cause analysis for every incident. Understand exactly where TCP, TLS, or DNS handshakes failed in the chain.", 
              icon: "fa-vial"
            },
            { 
              title: "SSL Life Cycle", 
              desc: "Never let a certificate expire again. Full lifecycle tracking with multi-stage alerting and automated verification for all assets.", 
              icon: "fa-lock"
            },
            { 
              title: "Real-time Analytics", 
              desc: "Embedded tracking captures page depth, unique sessions, and client-side JS exceptions. Zero-config telemetry for any platform.", 
              icon: "fa-chart-pie"
            },
            { 
              title: "Enterprise Reporting", 
              desc: "Generate pixel-perfect status reports for stakeholders. Automated high-fidelity summaries designed for compliance and trust.", 
              icon: "fa-file-invoice"
            }
          ].map((f, i) => (
            <div key={i} className="group p-12 md:p-20 bg-white/[0.02] border border-white/5 rounded-[60px] hover:bg-white/[0.05] hover:border-[#00f09a]/30 transition-all duration-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                 <i className={`fas ${f.icon} text-9xl`} />
              </div>
              <div className="w-20 h-20 bg-[#00f09a] rounded-3xl flex items-center justify-center text-[#050505] text-3xl mb-12 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-2xl shadow-[#00f09a]/20 relative z-10">
                <i className={`fas ${f.icon}`} />
              </div>
              <h3 className="font-['Outfit'] font-black text-3xl md:text-4xl mb-8 group-hover:text-[#00f09a] transition-colors tracking-tighter text-white relative z-10">{f.title}</h3>
              <p className="text-slate-400 text-lg md:text-2xl leading-relaxed font-medium relative z-10">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="py-32 md:py-52 bg-white/[0.01] border-y border-white/5 overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-24 text-center lg:text-left">
          {[
            { n: "99.99%", l: "Target SLA" },
            { n: "< 60s", l: "Heartbeat" },
            { n: "Multi", l: "Cloud Edge" },
            { n: "Sub-S", l: "Alert Latency" }
          ].map((s, i) => (
            <div key={i} className="relative group">
              <div className="font-['Outfit'] font-black text-7xl md:text-9xl lg:text-[160px] mb-8 tracking-tighter text-white/95 group-hover:text-[#00f09a] transition-colors drop-shadow-[0_0_50px_rgba(255,255,255,0.05)]">{s.n}</div>
              <div className="text-xs md:text-sm font-black uppercase text-slate-500 tracking-[0.5em] group-hover:text-[#00f09a] transition-colors">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-48 md:py-80 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,154,0.18)_0%,transparent_60%)] pointer-events-none" />
        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <h2 className="hero-h1 text-7xl sm:text-8xl md:text-[160px] font-black mb-10 text-white">Start monitoring.</h2>
          <p className="text-slate-400 text-2xl md:text-5xl font-medium mb-24 max-w-6xl mx-auto leading-relaxed px-4 tracking-tight">Protect your infrastructure with UpGuard today. Industrial-grade tools for modern engineering.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
            <button 
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto bg-[#00f09a] hover:bg-[#00cc82] text-[#050505] px-20 py-8 md:px-24 md:py-10 rounded-[40px] text-2xl md:text-3xl font-black transition-all hover:shadow-[0_20px_60px_-10px_rgba(0,240,154,0.5)] shadow-2xl active:scale-95 cursor-pointer ring-8 ring-[#00f09a]/5 pointer-events-auto"
            >
              Get Started Now
            </button>
            <button 
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 px-20 py-8 md:px-24 md:py-10 rounded-[40px] text-2xl md:text-3xl font-black transition-all backdrop-blur-2xl shadow-2xl cursor-pointer pointer-events-auto"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-32 px-6 border-t border-white/5 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-20">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-[#00f09a] rounded-2xl flex items-center justify-center text-[#050505] shadow-2xl shadow-[#00f09a]/20">
              <i className="fas fa-shield-alt text-2xl" />
            </div>
            <span className="font-['Outfit'] font-black text-4xl tracking-tighter text-white">UpGuard</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-14 md:gap-24">
            {["Terms", "Privacy", "Status", "Contact", "API", "Docs"].map((l, i) => (
              <a key={i} href="#" className="text-base font-bold text-slate-500 hover:text-[#00f09a] transition-all hover:scale-110">{l}</a>
            ))}
          </div>
          
          <div className="text-slate-700 text-[14px] font-black uppercase tracking-[0.6em] text-center md:text-right">
            © 2026 UpGuard Systems — Established for Resilience
          </div>
        </div>
      </footer>
    </div>
  );
}
