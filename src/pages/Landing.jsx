import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Landing() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) navigate("/dashboard");
    document.title = "UpGuard | Infrastructure Intelligence";
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
          --text-secondary: #64748b;
        }

        .landing-root {
          background-color: var(--bg-dark);
          color: white;
          font-family: 'Inter', -apple-system, sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
        }

        .glow-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 50% -20%, rgba(0, 240, 154, 0.07) 0%, transparent 50%),
                      radial-gradient(circle at 0% 100%, rgba(0, 240, 154, 0.02) 0%, transparent 40%),
                      radial-gradient(circle at 100% 100%, rgba(0, 240, 154, 0.02) 0%, transparent 40%);
          pointer-events: none;
          z-index: 0;
        }

        /* ── NAVBAR ── */
        .nav-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 5%;
          z-index: 1000;
          background: rgba(5, 5, 5, 0.8);
          backdrop-filter: blur(10px);
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 40px;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 22px;
          color: white;
          text-decoration: none;
          letter-spacing: -1px;
        }

        .logo-icon {
          width: 24px;
          height: 24px;
          background: var(--primary);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          mask: url('https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield-check.svg') no-repeat center;
          -webkit-mask: url('https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield-check.svg') no-repeat center;
        }

        .nav-links {
          display: none;
          gap: 30px;
        }

        @media (min-width: 1024px) {
          .nav-links { display: flex; }
        }

        .nav-link {
          color: #94a3b8;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-link:hover { color: white; }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .btn-text {
          color: white;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
        }

        .btn-outline {
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 10px 22px;
          border-radius: 100px;
          color: white;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.3);
        }

        /* ── HERO SECTION ── */
        .hero-section {
          padding-top: 180px;
          padding-bottom: 100px;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .hero-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(40px, 8vw, 84px);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -3px;
          margin-bottom: 24px;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
          color: white;
        }

        .hero-subtitle {
          color: var(--text-secondary);
          font-size: 18px;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto 40px;
          font-weight: 400;
        }

        .btn-cta {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: var(--primary);
          color: #050505;
          padding: 16px 36px;
          border-radius: 100px;
          font-size: 16px;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
          box-shadow: 0 10px 40px rgba(0, 240, 154, 0.25);
        }

        .btn-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 50px rgba(0, 240, 154, 0.4);
          background: #00ffaa;
        }

        .btn-cta i {
          font-size: 14px;
          transition: transform 0.3s;
        }

        .btn-cta:hover i {
          transform: translate(2px, -2px);
        }

        .trust-section {
          margin-top: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .trust-text {
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .rating-box {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stars {
          color: #fbbf24;
          display: flex;
          gap: 2px;
        }

        .rating-score {
          font-weight: 800;
          font-size: 14px;
          color: white;
        }

        .google-icon {
          height: 14px;
          opacity: 0.8;
        }

        /* ── MOCKUP ── */
        .mockup-container {
          max-width: 1000px;
          margin: 80px auto 0;
          padding: 0 20px;
          position: relative;
        }

        .mockup-glow {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--primary), transparent);
          box-shadow: 0 0 30px var(--primary);
          opacity: 0.8;
        }

        .mockup-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
          display: flex;
          height: 540px;
        }

        .mockup-sidebar {
          width: 220px;
          border-right: 1px solid var(--border);
          padding: 30px 20px;
          display: none;
          background: #08080a;
        }

        @media (min-width: 768px) {
          .mockup-sidebar { display: block; }
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
          font-size: 16px;
          margin-bottom: 40px;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }

        .sidebar-item.active {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .mockup-main {
          flex: 1;
          padding: 30px;
          overflow: hidden;
        }

        .mockup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .header-title {
          font-size: 18px;
          font-weight: 800;
          font-family: 'Outfit';
        }

        .mockup-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }

        .card-inner {
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
        }

        .chart-placeholder {
          height: 200px;
          width: 100%;
          position: relative;
          margin-top: 20px;
        }

        .chart-line {
          width: 100%;
          height: 100%;
          stroke: var(--primary);
          stroke-width: 3;
          fill: none;
        }

        .chart-gradient {
          fill: url(#chartGrad);
        }

        /* ── FOOTER ── */
        .footer {
          padding: 100px 0 60px;
          text-align: center;
          border-top: 1px solid var(--border);
          margin-top: 100px;
        }

        .footer-logo {
          font-family: 'Outfit';
          font-weight: 800;
          font-size: 20px;
          margin-bottom: 20px;
          display: inline-block;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }

        .footer-link:hover { color: white; }

        .copyright {
          color: #334155;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
      `}</style>

      <div className="glow-bg" />

      {/* NAVBAR */}
      <nav className="nav-container">
        <div className="nav-left">
          <a href="/" className="nav-logo">
            <div className="logo-icon" />
            UpGuard
          </a>
          <div className="nav-links">
            <a href="#" className="nav-link">Why UpGuard?</a>
            <a href="#" className="nav-link">Services</a>
            <a href="#" className="nav-link">How it works</a>
            <a href="#" className="nav-link">FAQ</a>
          </div>
        </div>
        <div className="nav-right">
          <a href="/login" className="btn-text">Login</a>
          <a href="/register" className="btn-outline">Create account</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container mx-auto px-6">
          <h1 className="hero-title">
            Take Control of Your Digital Infrastructure
          </h1>
          <p className="hero-subtitle">
            UpGuard offers a seamless, secure experience for monitoring your digital assets. Instant alerts, optimized performance, and premium design.
          </p>
          <a href="/register" className="btn-cta">
            Get started
            <i className="fas fa-arrow-right" />
          </a>

          <div className="trust-section">
            <span className="trust-text">They trust us</span>
            <div className="rating-box">
              <div className="stars">
                {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star" />)}
              </div>
              <span className="rating-score">4,9</span>
              <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" className="google-icon" />
            </div>
          </div>
        </div>

        {/* MOCKUP PREVIEW */}
        <div className="mockup-container">
          <div className="mockup-glow" />
          <div className="mockup-card">
            <div className="mockup-sidebar">
              <div className="sidebar-logo">
                <div className="logo-icon" style={{width: '20px', height: '20px'}} />
                UpGuard
              </div>
              <div className="sidebar-item active">
                <i className="fas fa-th-large" /> Dashboard
              </div>
              <div className="sidebar-item">
                <i className="fas fa-server" /> Assets
              </div>
              <div className="sidebar-item">
                <i className="fas fa-chart-line" /> Market
                <span style={{marginLeft: 'auto', fontSize: '10px', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px'}}>New</span>
              </div>
              <div className="sidebar-item">
                <i className="fas fa-exchange-alt" /> Trade
              </div>
            </div>

            <div className="mockup-main">
              <div className="mockup-header">
                <div>
                  <p style={{fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px'}}>Real-time Monitoring</p>
                  <h4 className="header-title">Main Dashboard</h4>
                </div>
                <div style={{display: 'flex', gap: '15px', color: '#64748b'}}>
                  <i className="fas fa-bell" />
                  <i className="fas fa-search" />
                </div>
              </div>

              <div className="mockup-grid">
                <div className="card-inner">
                  <p style={{fontSize: '11px', color: '#64748b', fontWeight: '600'}}>Global Uptime</p>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px'}}>
                    <h3 style={{fontSize: '32px', fontWeight: '900', fontFamily: 'Outfit'}}>99.98%</h3>
                    <span style={{color: '#00f09a', fontSize: '12px', fontWeight: '800'}}>+0.4%</span>
                  </div>
                  
                  <div className="chart-placeholder">
                    <svg viewBox="0 0 500 200" style={{width: '100%', height: '100%', overflow: 'visible'}}>
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00f09a" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#00f09a" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path className="chart-gradient" d="M0,180 C50,160 100,100 150,120 S250,50 300,80 S400,20 500,60 L500,200 L0,200 Z" />
                      <path className="chart-line" d="M0,180 C50,160 100,100 150,120 S250,50 300,80 S400,20 500,60" />
                      <circle cx="500" cy="60" r="6" fill="#00f09a" />
                      <circle cx="500" cy="60" r="12" fill="#00f09a" opacity="0.3" />
                    </svg>
                  </div>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                  <div className="card-inner" style={{flex: 1}}>
                    <p style={{fontSize: '11px', color: '#64748b', fontWeight: '600', marginBottom: '15px'}}>Quick Status</p>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px'}}>
                      <div style={{width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,191,0,0.1)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#fbbf24'}}>
                        <i className="fas fa-bolt" />
                      </div>
                      <div style={{flex: 1}}>
                        <p style={{fontSize: '12px', fontWeight: '800'}}>API Edge</p>
                        <p style={{fontSize: '10px', color: '#64748b'}}>24ms Latency</p>
                      </div>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <div style={{width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,240,154,0.1)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#00f09a'}}>
                        <i className="fas fa-check" />
                      </div>
                      <div style={{flex: 1}}>
                        <p style={{fontSize: '12px', fontWeight: '800'}}>Main Portal</p>
                        <p style={{fontSize: '10px', color: '#64748b'}}>Healthy</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container mx-auto px-6">
          <div className="footer-logo">
            <div className="logo-icon" style={{width: '20px', height: '20px', display: 'inline-block', verticalAlign: 'middle', marginRight: '10px'}} />
            UpGuard
          </div>
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Contact Us</a>
            <a href="#" className="footer-link">Status Page</a>
          </div>
          <p className="copyright">© 2024 UpGuard Space • All systems operational</p>
        </div>
      </footer>
    </div>
  );
}
