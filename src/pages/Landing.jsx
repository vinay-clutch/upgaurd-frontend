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
      const color = "0, 240, 154";
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
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        willChange: "transform"
      }}
    />
  );
}

// ═══════════════════════════════════
// MARQUEE (left to right scolling)
// ═══════════════════════════════════
const techs = [
  "React", "Node.js", "Next.js", "Vue",
  "Django", "Laravel", "FastAPI", "Spring",
  "Express", "NestJS", "Nuxt", "Remix"
];

function Marquee() {
  return (
    <div style={{
      overflow: "hidden",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      padding: "20px 0",
      background: "rgba(255,255,255,0.01)"
    }}>
      <style>{`
        @keyframes marqueeRev {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <div style={{
        display: "flex",
        animation: "marqueeRev 30s linear infinite",
        width: "max-content"
      }}>
        {techs.concat(techs).map((t, i) => (
          <span key={i} style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0 32px",
            color: "#64748b",
            fontSize: "14px",
            fontWeight: "600",
            whiteSpace: "nowrap"
          }}>
            <span style={{
              width: "6px", height: "6px",
              borderRadius: "50%",
              background: "#00f09a",
              boxShadow: "0 0 10px #00f09a"
            }}/>
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
    document.title = "UpGuard — Premium Infrastructure Monitoring";
  }, [token, navigate]);

  return (
    <div className="landing-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap');

        :root {
          --primary: #00f09a;
          --bg-dark: #050505;
          --bg-card: #0b0b0d;
          --border: rgba(255, 255, 255, 0.05);
          --text-secondary: #94a3b8;
        }

        .landing-root {
          background-color: var(--bg-dark);
          color: white;
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
        }

        .hero-glow {
          position: absolute;
          top: 0; left: 0; right: 0; height: 100vh;
          background: radial-gradient(circle at 50% -20%, rgba(0, 240, 154, 0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* ── NAVBAR ── */
        .nav-container {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 5%;
          z-index: 1000;
          background: rgba(5, 5, 5, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Outfit';
          font-weight: 800;
          font-size: 24px;
          color: white;
          cursor: pointer;
        }

        .logo-box {
          width: 28px; height: 28px;
          background: var(--primary);
          border-radius: 8px;
          display: flex;
          align-items: center; justify-content: center;
          color: #050505;
          font-size: 16px;
        }

        .nav-actions {
          display: flex;
          gap: 15px;
        }

        .btn-signin {
          padding: 10px 24px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          color: white;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-signin:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.3);
        }

        .btn-getstarted {
          padding: 10px 24px;
          background: var(--primary);
          color: #050505;
          border-radius: 12px;
          font-weight: 800;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-getstarted:hover {
          background: #00cc82;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 240, 154, 0.2);
        }

        /* ── HERO ── */
        .hero-section {
          padding: 180px 20px 80px;
          text-align: center;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .hero-h1 {
          font-family: 'Outfit';
          font-size: clamp(40px, 8vw, 88px);
          font-weight: 900;
          letter-spacing: -3px;
          line-height: 1;
          margin-bottom: 24px;
        }

        .hero-h1 span {
          background: linear-gradient(135deg, #00f09a, #06b6d4);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .hero-p {
          color: var(--text-secondary);
          font-size: 20px;
          max-width: 650px;
          margin: 0 auto 40px;
          line-height: 1.6;
        }

        /* ── MOCKUP ── */
        .mockup-wrapper {
          max-width: 950px;
          margin: 60px auto 0;
          position: relative;
          perspective: 1000px;
          padding: 0 20px;
        }

        .mockup-glow-line {
          position: absolute;
          top: -1px; left: 10%; right: 10%; height: 2px;
          background: linear-gradient(90deg, transparent, var(--primary), transparent);
          box-shadow: 0 0 20px var(--primary);
          z-index: 20;
          opacity: 0.8;
        }

        .mockup-container {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 50px 100px rgba(0,0,0,0.6);
          display: flex;
          height: 500px;
          text-align: left;
        }

        .mockup-side {
          width: 200px;
          background: #08080a;
          border-right: 1px solid var(--border);
          padding: 24px 16px;
          display: none;
        }

        @media (min-width: 768px) { .mockup-side { display: block; } }

        .mockup-main {
          flex: 1;
          padding: 24px;
          background: var(--bg-card);
        }

        .mockup-stat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }

        .mockup-stat-card {
           background: rgba(255,255,255,0.02);
           border: 1px solid var(--border);
           border-radius: 12px;
           padding: 16px;
        }

        /* ── FEATURE SECTIONS (RESTORED) ── */
        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          padding: 80px 5%;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .features-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .feature-item {
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border);
          padding: 40px 32px;
          border-radius: 24px;
          transition: all 0.3s;
        }

        .feature-item:hover {
          border-color: rgba(0, 240, 154, 0.4);
          background: rgba(0, 240, 154, 0.03);
          transform: translateY(-8px);
        }

        .f-icon {
          width: 48px; height: 48px;
          background: var(--primary);
          border-radius: 12px;
          display: flex;
          align-items: center; justify-content: center;
          color: #050505;
          font-size: 20px;
          margin-bottom: 24px;
        }

        .f-title {
          font-family: 'Outfit';
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .f-p {
          color: var(--text-secondary);
          font-size: 15px;
          line-height: 1.6;
        }

        /* ── FOOTER ── */
        .footer-root {
          padding: 100px 5% 40px;
          border-top: 1px solid var(--border);
          margin-top: 100px;
          text-align: center;
        }

        .footer-logo {
          font-family: 'Outfit';
          font-weight: 800;
          font-size: 22px;
          margin-bottom: 30px;
          display: inline-block;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .footer-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .footer-link:hover { color: white; }

        .footer-copy {
          color: #334155;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .btn-xl {
          padding: 16px 40px;
          font-size: 16px;
          font-weight: 800;
          margin-top: 30px;
        }
      `}</style>

      <BeamCanvas />
      <div className="hero-glow" />

      {/* NAVBAR */}
      <nav className="nav-container">
        <div className="nav-logo" onClick={() => navigate("/")}>
          <div className="logo-box"><i className="fas fa-shield-alt" /></div>
          UpGuard
        </div>
        <div className="nav-actions">
          <button className="btn-signin" onClick={() => navigate("/login")}>Login</button>
          <button className="btn-getstarted" onClick={() => navigate("/register")}>Sign Up</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">
        <h1 className="hero-h1">
          Infrastructure Intelligence<br/>
          <span>Redefined.</span>
        </h1>
        <p className="hero-p">
          Professional uptime monitoring, globally distributed checks, and 
          instant alert dispatch — made for high-availability engineering teams.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-getstarted btn-xl" onClick={() => navigate("/register")}>
            Start Monitoring Free
          </button>
          <button className="btn-signin btn-xl" onClick={() => navigate("/login")}>
            View Dashboard →
          </button>
        </div>

        {/* MOCKUP */}
        <div className="mockup-wrapper">
          <div className="mockup-glow-line" />
          <div className="mockup-container">
            <div className="mockup-side">
               <div style={{ marginBottom: '32px', fontWeight: '800', fontSize: '14px', color: '#00f09a' }}>🛡️ UpGuard App</div>
               {[...Array(5)].map((_, i) => (
                 <div key={i} style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '16px', width: (Math.random() * 40 + 60) + '%' }} />
               ))}
            </div>
            <div className="mockup-main">
               <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'24px' }}>
                  <div style={{ height:'20px', width:'150px', background:'rgba(255,255,255,0.08)', borderRadius:'6px' }} />
                  <div style={{ height:'20px', width:'80px', background:'rgba(0, 240, 154, 0.15)', borderRadius:'6px' }} />
               </div>
               <div className="mockup-stat-grid">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="mockup-stat-card">
                       <div style={{ height:'8px', width:'50%', background:'rgba(255,255,255,0.04)', borderRadius:'4px', marginBottom:'12px' }} />
                       <div style={{ height:'24px', width:'80%', background:'rgba(255,255,255,0.08)', borderRadius:'4px' }} />
                    </div>
                  ))}
               </div>
               <div style={{ height:'220px', width:'100%', background:'rgba(255,255,255,0.01)', border:'1px solid var(--border)', borderRadius:'16px', position:'relative', overflow:'hidden' }}>
                  <svg viewBox="0 0 500 200" style={{ width:'100%', height:'100%', overflow:'visible' }}>
                    <path d="M0,150 C50,140 100,50 150,110 S250,20 300,70 S400,0 500,40" fill="none" stroke="#00f09a" strokeWidth="3" />
                  </svg>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee />

      {/* FEATURES SECTION (RESTORED) */}
      <section style={{ padding: '40px 0' }}>
        <div style={{ textAlign:'center', marginBottom: '60px' }}>
          <p style={{ color: '#00f09a', fontSize:'12px', fontWeight:'900', letterSpacing:'4px', textTransform:'uppercase', marginBottom:'16px' }}>Features</p>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '42px', fontWeight: '900' }}>Complete Infrastructure Visibility</h2>
        </div>

        <div className="features-grid">
          <div className="feature-item">
            <div className="f-icon"><i className="fas fa-satellite-dish" /></div>
            <h3 className="f-title">Multi-Region Checks</h3>
            <p className="f-p">Monitor your servers from US East, Europe, or Asia. Detect regional failures before they impact global users.</p>
          </div>
          <div className="feature-item">
            <div className="f-icon"><i className="fas fa-bell" /></div>
            <h3 className="f-title">Smart Alerting</h3>
            <p className="f-p">Instant notifications via Email, Discord, or Slack. Configure custom thresholds and escalation policies.</p>
          </div>
          <div className="feature-item">
            <div className="f-icon"><i className="fas fa-chart-line" /></div>
            <h3 className="f-title">Advanced Analytics</h3>
            <p className="f-p">Track P99 latency, historical uptime, and performance trends over months. Export everything to CSV or PDF.</p>
          </div>
          <div className="feature-item">
            <div className="f-icon"><i className="fas fa-shield-alt" /></div>
            <h3 className="f-title">SSL Monitoring</h3>
            <p className="f-p">Automatically track SSL certificate expiration and health. Get alerted 30, 15, and 7 days before expiry.</p>
          </div>
          <div className="feature-item">
            <div className="f-icon"><i className="fas fa-tools" /></div>
            <h3 className="f-title">Maintenance Windows</h3>
            <p className="f-p">Schedule planned downtime to suppress alerts. Keep your uptime statistics clean and accurate.</p>
          </div>
          <div className="feature-item">
            <div className="f-icon"><i className="fas fa-file-invoice" /></div>
            <h3 className="f-title">Report Generation</h3>
            <p className="f-p">Share professional status reports with stakeholders. Demonstrate your reliability with audit-ready data.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-root">
        <div className="footer-logo">
           <div className="logo-box" style={{ display:'inline-flex', marginRight:'12px', verticalAlign:'middle' }}><i className="fas fa-shield-alt" /></div>
           UpGuard
        </div>
        <div className="footer-links">
          <a href="#" className="footer-link">Dashboard</a>
          <a href="#" className="footer-link">Status Page</a>
          <a href="#" className="footer-link">API Docs</a>
          <a href="#" className="footer-link">Security Policies</a>
          <a href="#" className="footer-link">Privacy</a>
        </div>
        <p className="footer-copy">© 2026 UpGuard Systems — Developed with ❤️ for Engineers</p>
      </footer>
    </div>
  );
}
