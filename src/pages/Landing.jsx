import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ═══════════════════════════════════
// TOP GLOW (Matte Cryptix Style)
// ═══════════════════════════════════
function TopGlow() {
  return (
    <div style={{
      position: "absolute",
      top: "-100px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "120%",
      maxWidth: "1400px",
      height: "500px",
      background: "radial-gradient(ellipse at center, rgba(188, 44, 18, 0.45) 0%, transparent 65%)",
      filter: "blur(70px)",
      zIndex: 1,
      pointerEvents: "none",
    }} />
  );
}


// ═══════════════════════════════════
// MAIN LANDING PAGE
// ═══════════════════════════════════
export function Landing() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    if (token) navigate("/dashboard");
    document.title = "UpGuard — Accelerate Growth";
  }, [token, navigate]);

  return (
    <div style={{
      background: "#000000",
      color: "white",
      fontFamily: "'Outfit', 'Inter', sans-serif",
      overflowX: "hidden"
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .btn-primary {
          background: #bc2c12;
          color: #ffffff;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 12px 28px;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 30px rgba(188, 44, 18, 0.2);
        }
        .btn-primary:hover {
          background: #d43216;
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(188, 44, 18, 0.35);
        }
        .btn-ghost {
          background: rgba(255,255,255,0.02);
          color: white;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 14px 28px;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }
        .mockup-card {
          background: #080808;
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.8);
          position: relative;
        }
        .mockup-line-glow {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 50%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #bc2c12, transparent);
          box-shadow: 0 0 15px 1px #bc2c12;
          z-index: 10;
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <div style={{
        marginTop: "32px",
        display: "flex",
        justifyContent: "center",
      }}>
        <nav style={{
          zIndex: 1000,
          display: "flex", alignItems: "center",
          gap: "40px",
          padding: "10px 10px 10px 24px",
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "100px",
          maxWidth: "fit-content",
        }}>
          <div style={{
            display: "flex", alignItems: "center",
            gap: "8px", fontWeight: "900",
            fontSize: "18px", color: "white"
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L4.5 5.5V10C4.5 14.7 7.7 19.1 12 21.5C16.3 19.1 19.5 14.7 19.5 10V5.5L12 2ZM17.5 10C17.5 13.8 15.2 17.3 12 19.4C8.8 17.3 6.5 13.8 6.5 10V6.6L12 4.1L17.5 6.6V10Z" fill="#bc2c12"/>
            </svg>
            UpGuard
          </div>

          <div style={{ display: "none" }} className="md:flex items-center gap-10">
            {["About", "Features", "Pricing", "Resources", "Contact"].map((link, i) => (
              <a key={i} href="#" style={{
                color: "white",
                fontSize: "13px",
                fontWeight: "600",
                textDecoration: "none",
                opacity: 0.8,
                padding: "0 10px"
              }}>
                {link}
              </a>
            ))}
          </div>

          <button
            className="btn-primary"
            onClick={() => navigate("/register")}
            style={{ 
              padding: "10px 24px", 
              fontSize: "13px",
              borderRadius: "100px",
              background: "#bc2c12",
              border: "none",
              boxShadow: "none"
            }}
          >
            Get Started
          </button>
        </nav>
      </div>

      {/* ── HERO ── */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "40px",
        paddingBottom: "80px"
      }}>
        <TopGlow />

        {/* Hero content */}
        <div style={{
          position: "relative", zIndex: 10,
          textAlign: "center",
          padding: "0 20px",
          maxWidth: "900px",
          animation: "fadeUp 0.8s ease-out forwards"
        }}>
          <h1 style={{
            fontSize: "clamp(48px, 6.5vw, 82px)",
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-3px",
            marginBottom: "32px",
            color: "white"
          }}>
            Accelerate Business Growth<br/>
            Through Smart AI Conversations.
          </h1>

          <p style={{
            fontSize: "20px",
            color: "#94a3b8",
            maxWidth: "650px",
            margin: "0 auto 48px",
            lineHeight: 1.6,
            fontWeight: "400"
          }}>
            Deliver instant, personalized conversations with our<br/>
            cutting-edge, AI-driven chatbot solutions.
          </p>

          <div style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            marginBottom: "64px"
          }}>
            <button
              className="btn-primary"
              onClick={() => navigate("/register")}
              style={{ padding: "16px 40px", fontSize: "16px" }}
            >
              Get Started
            </button>
            <button
              className="btn-ghost"
              style={{ padding: "16px 40px", fontSize: "16px", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div style={{
          position: "relative",
          width: "90%",
          maxWidth: "1100px",
          zIndex: 10,
          animation: "float 6s ease-in-out infinite"
        }}>
          <div className="mockup-card">
            <div className="mockup-line-glow" />
            <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", height: "480px" }}>
              {/* Sidebar */}
              <div style={{ borderRight: "1px solid rgba(255,255,255,0.05)", padding: "32px 20px", background: "rgba(0,0,0,0.2)" }}>
                <div style={{ color: "#bc2c12", fontWeight: "900", fontSize: "15px", marginBottom: "40px", display: "flex", alignItems: "center", gap: "8px" }}>
                   <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#bc2c12" }} />
                   UpGuard
                </div>
                {["Dashboard", "AI Models", "Knowledge Base", "Conversations", "Settings"].map((item, i) => (
                  <div key={i} style={{
                    padding: "10px 14px", borderRadius: "10px", fontSize: "13px", fontWeight: "600",
                    color: i === 0 ? "white" : "#64748b",
                    background: i === 0 ? "rgba(188, 44, 18, 0.15)" : "transparent",
                    marginBottom: "8px"
                  }}>{item}</div>
                ))}
              </div>
              {/* Main Content */}
              <div style={{ padding: "40px", background: "#050505" }}>
                <div style={{ display: "flex", gap: "24px", marginBottom: "40px" }}>
                  {[
                    { l: "ACTIVE USERS", v: "1,284", c: "white" },
                    { l: "CONVERSATIONS", v: "42.5k", c: "#bc2c12" },
                    { l: "CSAT SCORE", v: "98%", c: "#38bdf8" }
                  ].map((stat, i) => (
                    <div key={i} style={{ flex: 1, padding: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px" }}>
                      <div style={{ fontSize: "10px", fontWeight: "900", color: "#475569", letterSpacing: "1px", marginBottom: "8px" }}>{stat.l}</div>
                      <div style={{ fontSize: "24px", fontWeight: "800", color: stat.c }}>{stat.v}</div>
                    </div>
                  ))}
                </div>
                {/* Visual Chart Placeholder */}
                <div style={{ height: "200px", position: "relative" }}>
                   <div style={{ fontSize: "11px", fontWeight: "800", color: "#475569", marginBottom: "20px" }}>CONVERSATION VOLUMES</div>
                   <svg width="100%" height="100%" viewBox="0 0 600 150" preserveAspectRatio="none">
                      <path d="M0 120 Q 50 110, 100 130 T 200 90 T 300 110 T 400 60 T 500 80 T 600 30" fill="none" stroke="#bc2c12" strokeWidth="3" strokeLinecap="round" />
                      <path d="M0 120 Q 50 110, 100 130 T 200 90 T 300 110 T 400 60 T 500 80 T 600 30 L 600 150 L 0 150 Z" fill="rgba(188, 44, 18, 0.1)" />
                   </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR CLIENTS ── */}
      <div style={{ padding: "80px 0 40px", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
        <p style={{ textAlign: "center", color: "#64748b", fontSize: "12px", fontWeight: "800", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "48px", opacity: 0.7 }}>Our Clients</p>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "60px", flexWrap: "wrap", opacity: 0.5 }}>
          <div style={{ fontSize: "24px", fontWeight: "900", color: "#64748b" }}>IPSUM</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "24px", height: "24px", background: "#64748b", transform: "skew(-15deg)" }} />
            <span style={{ fontWeight: "800", color: "#64748b", fontSize: "18px" }}>Lorem Ipsum</span>
          </div>
          <div style={{ fontWeight: "900", color: "#64748b", fontSize: "20px" }}>LOREM IPSUM</div>
          <div style={{ fontSize: "24px", color: "#64748b", fontWeight: "700" }}>✽ flora</div>
          <div style={{ fontSize: "26px", fontWeight: "900", color: "#64748b" }}>///</div>
        </div>
      </div>

      {/* ── PRODUCTS SECTION ── */}
      <section style={{ padding: "120px 24px", maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(36px, 5vw, 48px)", color: "#bc2c12", fontWeight: "900", marginBottom: "20px" }}>Try One Of Our AI Chatbots Below</h2>
        <p style={{ color: "#94a3b8", fontSize: "18px", maxWidth: "700px", margin: "0 auto 80px", lineHeight: 1.6 }}>
          Explore AI-powered assistants tailored for various industries and platforms. 
          Pick one that fits your needs and experience seamless automation.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
          {[
            { platform: "TikTok", icon: "fab fa-tiktok", desc: "Generate content ideas, manage comments, and respond instantly." },
            { platform: "Telegram", icon: "fab fa-telegram", desc: "Handle support queries and automate sales funnels effortlessly." },
            { platform: "X (Twitter)", icon: "fab fa-twitter", desc: "Drive engagement and capture leads 24/7 on X platform." }
          ].map((app, i) => (
            <div key={i} className="mockup-card" style={{
              padding: "54px 40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px",
              background: "#050505", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.3s ease"
            }}>
              <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: "rgba(188, 44, 18, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className={app.icon} style={{ fontSize: "32px", color: "#bc2c12" }} />
              </div>
              <div>
                 <div style={{ fontSize: "24px", fontWeight: "900", color: "white", marginBottom: "8px" }}>{app.platform}</div>
                 <div style={{ fontSize: "12px", fontWeight: "900", color: "#bc2c12", textTransform: "uppercase", letterSpacing: "2px" }}>SOCIAL AI</div>
              </div>
              <p style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.6", minHeight: "80px" }}>{app.desc}</p>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#bc2c12", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 25px rgba(188, 44, 18, 0.4)" }}>
                 <i className="fas fa-arrow-right" style={{ color: "white", fontSize: "18px" }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section style={{ padding: "120px 24px", background: "#000000", borderTop: "1px solid rgba(255,255,255,0.03)", textAlign: "center" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "80px" }}>
          {[
            { n: "99.9%", l: "UPTIME ACCURACY" },
            { n: "24/7", l: "SMART RESPONSE" },
            { n: "10M+", l: "CHATS ANALYZED" },
            { n: "500+", l: "TRUSTED CLIENTS" }
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: "clamp(52px, 7vw, 84px)", fontWeight: 950, letterSpacing: "-4px", color: "white", marginBottom: "8px" }}>{s.n}</div>
              <div style={{ color: "#bc2c12", fontSize: "12px", fontWeight: "900", letterSpacing: "4px", textTransform: "uppercase" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: "200px 24px", textAlign: "center", background: "radial-gradient(circle at center, rgba(188, 44, 18, 0.15) 0%, transparent 70%)" }}>
        <h2 style={{ fontSize: "clamp(48px, 8vw, 96px)", fontWeight: 900, letterSpacing: "-4px", lineHeight: 0.9, marginBottom: "40px", color: "white" }}>Ready to Accelerate?</h2>
        <p style={{ color: "#94a3b8", fontSize: "22px", maxWidth: "650px", margin: "0 auto 56px", lineHeight: 1.6 }}>
          Transform your business communication with our advanced AI solutions. Start your journey towards exponential growth today.
        </p>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
           <button className="btn-primary" onClick={() => navigate("/register")} style={{ padding: "20px 56px", fontSize: "18px" }}>Start Free Trial</button>
           <button className="btn-ghost" style={{ padding: "20px 56px", fontSize: "18px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "100px" }}>Contact Sales</button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "100px 40px 60px", background: "#000000", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "80px", marginBottom: "100px" }}>
          <div>
             <div style={{ fontSize: "24px", fontWeight: "900", color: "white", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L4.5 5.5V10C4.5 14.7 7.7 19.1 12 21.5C16.3 19.1 19.5 14.7 19.5 10V5.5L12 2ZM17.5 10C17.5 13.8 15.2 17.3 12 19.4C8.8 17.3 6.5 13.8 6.5 10V6.6L12 4.1L17.5 6.6V10Z" fill="#bc2c12"/>
                </svg>
                UpGuard
             </div>
             <p style={{ color: "#64748b", fontSize: "16px", lineHeight: "1.7", maxWidth: "320px" }}>The world's most advanced platform for AI-driven customer growth and automation.</p>
          </div>
          {[
            { t: "Platform", l: ["Solutions", "Integration", "Security", "Pricing"] },
            { t: "Company", l: ["About Us", "Careers", "Newsroom", "Contact"] },
            { t: "Legal", l: ["Privacy", "Terms", "Security", "GDPR"] }
          ].map((col, i) => (
            <div key={i}>
               <div style={{ color: "white", fontSize: "14px", fontWeight: "950", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "32px" }}>{col.t}</div>
               <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  {col.l.map((link, j) => (
                    <a key={j} href="#" style={{ color: "#64748b", fontSize: "15px", textDecoration: "none" }}>{link}</a>
                  ))}
               </div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: "1200px", margin: "0 auto", paddingTop: "40px", borderTop: "1px solid rgba(255,255,255,0.03)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
           <div style={{ color: "#475569", fontSize: "14px" }}>© 2026 UpGuard Technologies Inc. Built for the future.</div>
           <div style={{ display: "flex", gap: "24px", color: "#475569", fontSize: "18px" }}>
              <i className="fab fa-twitter" /><i className="fab fa-linkedin" /><i className="fab fa-github" />
           </div>
        </div>
      </footer>
    </div>
  );
}
