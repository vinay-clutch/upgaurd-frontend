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
    document.title = "UpGuard — Premium Uptime Monitoring";
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#08080a] text-white font-['Inter',sans-serif] overflow-x-hidden selection:bg-[#00f09a]/20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        .hero-h1 {
          font-family: 'Outfit';
          letter-spacing: -3px;
          line-height: 0.95;
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-up {
          animation: fadeInUp 0.8s ease forwards;
        }
        
        .mockup-glow {
          box-shadow: 0 0 100px -20px rgba(0, 240, 154, 0.15);
        }
      `}</style>

      <BeamCanvas />
      
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 inset-x-0 h-20 md:h-24 z-50 flex items-center justify-center pointer-events-none px-4">
        <div className="w-full max-w-5xl h-14 md:h-16 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-between px-6 pointer-events-auto shadow-2xl">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-8 h-8 md:w-9 md:h-9 bg-[#00f09a] rounded-xl flex items-center justify-center text-[#050505] shadow-lg shadow-[#00f09a]/20 transition-transform group-hover:scale-105">
              <i className="fas fa-shield-alt text-base md:text-lg" />
            </div>
            <span className="font-['Outfit'] font-black text-lg md:text-xl tracking-tight">UpGuard</span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => navigate("/login")}
              className="text-sm font-bold text-slate-400 hover:text-white transition-colors px-4 py-2"
            >
              Log in
            </button>
            <button 
              onClick={() => navigate("/register")}
              className="bg-[#00f09a] hover:bg-[#00cc82] text-[#050505] px-5 md:px-7 py-2 md:py-2.5 rounded-full text-sm font-black transition-all hover:shadow-lg hover:shadow-[#00f09a]/30 active:scale-95 shadow-xl"
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-44 pb-20 md:pt-60 md:pb-32 px-6 overflow-hidden">
        {/* Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-[radial-gradient(circle_at_50%_-20%,rgba(0,240,154,0.12)_0%,transparent_70%)] pointer-events-none z-0" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-[#00f09a]/10 border border-[#00f09a]/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f09a] animate-pulse" />
            <span className="text-[10px] md:text-xs font-black uppercase text-[#00f09a] tracking-widest">Global Infrastructure Watch</span>
          </div>

          <h1 className="hero-h1 text-6xl md:text-8xl lg:text-[110px] font-black text-white mb-8">
            Infrastructure<br />
            <span className="text-transparent bg-clip-text bg-[linear-gradient(135deg,#00f09a_0%,#06b6d4_50%,#00f09a_100%)]">Intelligence.</span>
          </h1>
          
          <p className="max-w-xl mx-auto text-slate-400 text-lg md:text-xl leading-relaxed mb-12 font-medium">
            Professional uptime monitoring, globally distributed checks, and 
            instant alert dispatch — built for high-scale engineering teams.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
            <button 
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto bg-[#00f09a] hover:bg-[#00cc82] text-[#050505] px-10 py-5 rounded-2xl text-lg font-black transition-all hover:shadow-2xl hover:shadow-[#00f09a]/30 active:scale-95 shadow-xl"
            >
              Start Monitoring Free
            </button>
            <button 
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto group bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white px-10 py-5 rounded-2xl text-lg font-black transition-all flex items-center justify-center gap-3 backdrop-blur-sm shadow-xl"
            >
              Dashboard
              <i className="fas fa-arrow-right text-sm text-[#00f09a] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ── MOCKUP ── */}
        <div className="max-w-5xl mx-auto mt-24 md:mt-32 px-4 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00f09a]/40 to-[#06b6d4]/40 rounded-3xl blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity" />
          <div className="relative bg-[#0b0b0d] border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl mockup-glow">
            {/* Mockup Line Glow */}
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#00f09a] to-transparent shadow-[0_0_20px_#00f09a] z-20" />
            
            <div className="flex flex-col md:flex-row h-[420px] md:h-[520px]">
              {/* Sidebar */}
              <div className="hidden md:block w-56 border-r border-white/5 bg-[#08080a] p-8">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-2.5 h-2.5 rounded bg-[#00f09a]" />
                  <span className="text-[#00f09a] text-xs font-black tracking-widest uppercase">UpGuard</span>
                </div>
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={`h-2.5 rounded-full mb-6 ${i === 1 ? 'bg-[#00f09a]/20 w-3/4' : 'bg-white/5 w-1/2'}`} />
                ))}
              </div>
              
              {/* Content Area */}
              <div className="flex-1 p-6 md:p-10">
                <div className="flex justify-between mb-10">
                  <div className="h-6 w-32 bg-white/5 rounded-lg" />
                  <div className="h-6 w-20 bg-[#00f09a]/10 rounded-lg border border-[#00f09a]/20" />
                </div>
                <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10">
                  {[1,2,3].map(i => (
                    <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 md:p-6">
                      <div className="h-2 w-1/2 bg-white/10 rounded mb-4" />
                      <div className="h-4 md:h-6 w-3/4 bg-white/20 rounded" />
                    </div>
                  ))}
                </div>
                <div className="relative h-44 md:h-56 bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden flex items-end px-4">
                  <svg className="absolute inset-0 w-full h-full p-2" viewBox="0 0 500 200" preserveAspectRatio="none">
                    <path d="M0,150 C50,140 100,60 150,120 S250,30 300,90 S400,10 500,50" fill="none" stroke="#00f09a" strokeWidth="3" strokeLinecap="round" />
                    <path d="M0,150 C50,140 100,60 150,120 S250,30 300,90 S400,10 500,50 L500,200 L0,200 Z" fill="rgba(0, 240, 154, 0.05)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <Marquee />

      {/* ── FEATURES (Classic Content Restore) ── */}
      <section className="py-24 md:py-40 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20 md:mb-32">
          <span className="text-[#00f09a] text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-4 block">Unmatched Visibility</span>
          <h2 className="hero-h1 text-4xl md:text-6xl font-black mb-6">Built for Industrial Scale</h2>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">Everything you need to maintain 99.9% uptime and deliver a flawless user experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {[
            { 
              title: "Global Distribution", 
              desc: "Monitor your infrastructure from US, Europe, and Asia. Detect regional routing failures instantly.", 
              icon: "fa-globe-americas"
            },
            { 
              title: "Smart Notifications", 
              desc: "Connect seamlessly with Discord, Slack, and Email. Custom thresholds ensure no notification fatigue.", 
              icon: "fa-bell"
            },
            { 
              title: "Deep Diagnostics", 
              desc: "Detailed error logs for every downtime. Understand exactly where certificates or DNS failed.", 
              icon: "fa-vial"
            },
            { 
              title: "SSL Tracking", 
              desc: "Never let a certificate expire again. Automated tracking and alerting for all your HTTPS assets.", 
              icon: "fa-lock"
            },
            { 
              title: "Analytics Suite", 
              desc: "Embedded tracking script captures page views, JS errors, and custom business events.", 
              icon: "fa-chart-pie"
            },
            { 
              title: "PDF Reporting", 
              desc: "Share professional weekly and monthly uptime summaries with stakeholders and clients.", 
              icon: "fa-file-invoice"
            }
          ].map((f, i) => (
            <div key={i} className="group p-8 md:p-10 bg-white/[0.02] border border-white/5 rounded-[32px] hover:bg-white/[0.05] hover:border-[#00f09a]/20 transition-all duration-300">
              <div className="w-14 h-14 bg-[#00f09a] rounded-2xl flex items-center justify-center text-[#050505] text-xl mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-[#00f09a]/10">
                <i className={`fas ${f.icon}`} />
              </div>
              <h3 className="font-['Outfit'] font-black text-xl mb-4 group-hover:text-[#00f09a] transition-colors">{f.title}</h3>
              <p className="text-slate-400 text-base leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS SECTION (Classic) ── */}
      <section className="py-20 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center lg:text-left">
          {[
            { n: "99.9%", l: "Target Uptime" },
            { n: "60s", l: "Check Interval" },
            { n: "∞", l: "Global Scale" },
            { n: "0ms", l: "Alert Latency" }
          ].map((s, i) => (
            <div key={i}>
              <div className="font-['Outfit'] font-black text-4xl md:text-5xl lg:text-6xl mb-2 tracking-tighter">{s.n}</div>
              <div className="text-[10px] md:text-xs font-black uppercase text-slate-500 tracking-widest">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 md:py-56 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,154,0.08)_0%,transparent_60%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="hero-h1 text-5xl md:text-8xl font-black mb-2">Ready to monitor?</h2>
          <p className="text-slate-400 text-lg md:text-xl font-medium mb-12">Join hundreds of engineers who trust UpGuard for their high-availability infrastructure.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto bg-[#00f09a] hover:bg-[#00cc82] text-[#050505] px-12 py-5 rounded-2xl text-lg font-black transition-all hover:shadow-2xl shadow-xl active:scale-95"
            >
              Start Free Trial
            </button>
            <button 
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 px-12 py-5 rounded-2xl text-lg font-black transition-all backdrop-blur-xl shadow-xl"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-16 px-6 border-t border-white/5 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00f09a] rounded-lg flex items-center justify-center text-[#050505] shadow-lg shadow-[#00f09a]/20">
              <i className="fas fa-shield-alt text-xs" />
            </div>
            <span className="font-['Outfit'] font-black text-xl tracking-tight">UpGuard</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {["Terms", "Privacy", "Status", "Contact", "API"].map((l, i) => (
              <a key={i} href="#" className="text-sm font-bold text-slate-500 hover:text-white transition-colors">{l}</a>
            ))}
          </div>
          
          <div className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
            © 2026 UpGuard Systems — Developed for Engineers
          </div>
        </div>
      </footer>
    </div>
  );
}
