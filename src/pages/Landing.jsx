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
    width: 10 + layer * 5,
    length: height * 2.5,
    angle,
    speed: 0.2 + layer * 0.2 + Math.random() * 0.2,
    opacity: 0.08 + layer * 0.05 + Math.random() * 0.1,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.01 + Math.random() * 0.015,
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
    const BEAMS_PER_LAYER = 8;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.scale(dpr, dpr);
      beamsRef.current = [];
      for (let l = 1; l <= LAYERS; l++) {
        for (let i = 0; i < BEAMS_PER_LAYER; i++) {
          beamsRef.current.push(
            createBeam(window.innerWidth, window.innerHeight, l)
          );
        }
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const drawBeam = (beam) => {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);
      const op = Math.min(
        1,
        beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.4)
      );
      const grad = ctx.createLinearGradient(0, 0, 0, beam.length);
      grad.addColorStop(0, "rgba(139,92,246,0)");
      grad.addColorStop(0.2, `rgba(139,92,246,${op * 0.5})`);
      grad.addColorStop(0.5, `rgba(139,92,246,${op})`);
      grad.addColorStop(0.8, `rgba(139,92,246,${op * 0.5})`);
      grad.addColorStop(1, "rgba(139,92,246,0)");
      ctx.fillStyle = grad;
      ctx.filter = `blur(${2 + beam.layer * 2}px)`;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      ctx.restore();
    };

    const animate = () => {
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, "#05050f");
      grad.addColorStop(1, "#080818");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      beamsRef.current.forEach((beam) => {
        beam.y -= beam.speed * (beam.layer / LAYERS + 0.5);
        beam.pulse += beam.pulseSpeed;
        if (beam.y + beam.length < -50) {
          beam.y = window.innerHeight + 50;
          beam.x = Math.random() * window.innerWidth;
        }
        drawBeam(beam);
      });

      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
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
      }}
    />
  );
}

// ═══════════════════════════════════
// MARQUEE (scrolling tech names)
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
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div style={{
        display: "flex",
        animation: "marquee 20s linear infinite",
        width: "max-content"
      }}>
        {techs.concat(techs).map((t, i) => (
          <span key={i} style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0 32px",
            color: "#475569",
            fontSize: "14px",
            fontWeight: "500",
            whiteSpace: "nowrap"
          }}>
            <span style={{
              width: "6px", height: "6px",
              borderRadius: "50%",
              background: "#7c3aed"
            }}/>
            {t}
          </span>
        ))}
      </div>
    </div>
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
    document.title = "Antigravtiven — Prevent Downtime";
  }, [token, navigate]);

  return (
    <div style={{
      background: "#05050f",
      color: "white",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflowX: "hidden"
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes floatR {
          0%,100% { transform: translateY(-12px); }
          50% { transform: translateY(0px); }
        }
        @keyframes pulse {
          0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
          50% { opacity: 0.8; box-shadow: 0 0 0 6px rgba(34,197,94,0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .btn-primary {
          background: #7c3aed;
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .btn-primary:hover {
          background: #6d28d9;
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(124,58,237,0.35);
        }
        .btn-ghost {
          background: rgba(255,255,255,0.05);
          color: white;
          border: 1px solid rgba(255,255,255,0.12);
          padding: 14px 28px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.25);
          transform: translateY(-2px);
        }
        .feature-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 32px;
          transition: all 0.3s;
        }
        .feature-card:hover {
          border-color: rgba(124,58,237,0.35);
          background: rgba(124,58,237,0.04);
          transform: translateY(-6px);
          box-shadow: 0 24px 48px rgba(124,58,237,0.08);
        }
        .check-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #94a3b8;
          font-size: 15px;
          margin-bottom: 12px;
        }
        .check-item::before {
          content: "✓";
          color: #7c3aed;
          font-weight: 700;
          font-size: 16px;
          flex-shrink: 0;
        }
        .section-label {
          display: inline-block;
          background: rgba(124,58,237,0.12);
          border: 1px solid rgba(124,58,237,0.25);
          color: #a78bfa;
          padding: 5px 14px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .mockup-card {
          background: #0d0d20;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.5);
        }
        .site-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 13px;
        }
        .badge {
          padding: 3px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0,
        zIndex: 1000,
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 60px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        background: "rgba(5,5,15,0.85)"
      }}>
        <div style={{
          display: "flex", alignItems: "center",
          gap: "10px", fontWeight: "800",
          fontSize: "20px", color: "white"
        }}>
          🛡️ Antigravtiven
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className="btn-ghost"
            onClick={() => navigate("/login")}
            style={{ padding: "10px 22px", fontSize: "14px" }}
          >
            Sign in
          </button>
          <button
            className="btn-primary"
            onClick={() => navigate("/register")}
            style={{ padding: "10px 22px", fontSize: "14px" }}
          >
            Get started
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        paddingTop: "80px"
      }}>
        <BeamCanvas />

        {/* Grid overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          pointerEvents: "none"
        }}/>

        {/* Center purple glow */}
        <div style={{
          position: "absolute",
          top: "20%", left: "50%",
          transform: "translateX(-50%)",
          width: "700px", height: "700px",
          background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)",
          pointerEvents: "none", zIndex: 1
        }}/>

        {/* Hero content */}
        <div style={{
          position: "relative", zIndex: 10,
          textAlign: "center",
          padding: "0 20px",
          maxWidth: "900px",
          animation: "fadeUp 1s ease forwards"
        }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center", gap: "8px",
            background: "rgba(124,58,237,0.1)",
            border: "1px solid rgba(124,58,237,0.25)",
            borderRadius: "100px",
            padding: "8px 18px",
            marginBottom: "36px",
            fontSize: "13px", color: "#a78bfa"
          }}>
            <span style={{
              width: "7px", height: "7px",
              background: "#7c3aed",
              borderRadius: "50%",
              display: "inline-block"
            }}/>
            Now monitoring 1,000+ websites worldwide
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: "clamp(52px, 8vw, 96px)",
            fontWeight: 900,
            lineHeight: 1.0,
            letterSpacing: "-3px",
            marginBottom: "24px",
            color: "white"
          }}>
            Prevent downtime.<br/>
            <span style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 50%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Monitor everything.
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: "19px",
            color: "#64748b",
            maxWidth: "520px",
            margin: "0 auto 44px",
            lineHeight: 1.7
          }}>
            The all-in-one platform that watches your websites,
            tracks analytics, and catches errors —
            before your users notice.
          </p>

          {/* Buttons */}
          <div style={{
            display: "flex", gap: "14px",
            justifyContent: "center", marginBottom: "56px",
            flexWrap: "wrap"
          }}>
            <button
              className="btn-primary"
              onClick={() => navigate("/register")}
            >
              Start monitoring free
            </button>
            <button
              className="btn-ghost"
              onClick={() => navigate("/login")}
            >
              View dashboard →
            </button>
          </div>

          {/* Integration badges */}
          <div style={{
            display: "flex", gap: "10px",
            justifyContent: "center", flexWrap: "wrap"
          }}>
            {["📧 Email","💬 Discord","💼 Slack",
              "🌍 Multi-region","🔒 SSL"].map((item, i) => (
              <span key={i} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "100px",
                padding: "6px 16px",
                fontSize: "13px", color: "#94a3b8"
              }}>{item}</span>
            ))}
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div style={{
          position: "relative",
          marginTop: "80px",
          width: "100%",
          maxWidth: "900px",
          padding: "0 20px",
          zIndex: 10,
          animation: "float 6s ease-in-out infinite"
        }}>
          {/* Glow behind mockup */}
          <div style={{
            position: "absolute",
            inset: "-2px",
            background: "linear-gradient(135deg,#7c3aed,#06b6d4,#7c3aed)",
            borderRadius: "22px",
            filter: "blur(25px)",
            opacity: 0.25,
            zIndex: -1
          }}/>

          {/* Browser window */}
          <div className="mockup-card">
            {/* Browser chrome */}
            <div style={{
              background: "#0a0a1a",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              borderBottom: "1px solid rgba(255,255,255,0.05)"
            }}>
              <div style={{ display:"flex", gap:"6px" }}>
                {["#ff5f57","#febc2e","#28c840"].map((c,i) => (
                  <div key={i} style={{
                    width:"11px", height:"11px",
                    borderRadius:"50%", background: c
                  }}/>
                ))}
              </div>
              <div style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                borderRadius: "6px",
                padding: "4px 14px",
                fontSize: "12px",
                color: "#334155",
                textAlign: "center"
              }}>
                app.upgaurd.io/dashboard
              </div>
            </div>

            {/* Dashboard body */}
            <div style={{ display:"flex", height:"360px" }}>
              {/* Sidebar */}
              <div style={{
                width: "180px",
                background: "#080818",
                borderRight: "1px solid rgba(255,255,255,0.05)",
                padding: "20px 14px",
                flexShrink: 0
              }}>
                <div style={{
                  color:"#7c3aed", fontWeight:"800",
                  fontSize:"14px", marginBottom:"24px",
                  display:"flex", alignItems:"center", gap:"6px"
                }}>
                  🛡️ Antigravtiven
                </div>
                {["Dashboard","Websites","Analytics",
                  "Incidents","Settings"].map((item, i) => (
                  <div key={i} style={{
                    padding: "9px 12px",
                    borderRadius: "8px",
                    color: i === 0 ? "white" : "#334155",
                    background: i === 0
                      ? "rgba(124,58,237,0.2)"
                      : "transparent",
                    fontSize: "13px",
                    marginBottom: "2px",
                    fontWeight: i === 0 ? "600" : "400"
                  }}>{item}</div>
                ))}
              </div>

              {/* Main area */}
              <div style={{ flex:1, padding:"20px" }}>
                {/* Stats row */}
                <div style={{
                  display:"grid",
                  gridTemplateColumns:"repeat(3,1fr)",
                  gap:"10px",
                  marginBottom:"16px"
                }}>
                  {[
                    {l:"Total Sites", v:"12", c:"#a78bfa"},
                    {l:"Online", v:"11", c:"#22c55e"},
                    {l:"Avg Uptime", v:"99.9%", c:"#06b6d4"}
                  ].map((s,i) => (
                    <div key={i} style={{
                      background:"rgba(255,255,255,0.03)",
                      border:"1px solid rgba(255,255,255,0.06)",
                      borderRadius:"10px",
                      padding:"12px 14px"
                    }}>
                      <div style={{
                        color:"#334155", fontSize:"10px",
                        marginBottom:"6px",
                        textTransform:"uppercase",
                        letterSpacing:"0.5px"
                      }}>{s.l}</div>
                      <div style={{
                        color: s.c,
                        fontSize:"22px",
                        fontWeight:"800"
                      }}>{s.v}</div>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div style={{
                  background:"rgba(255,255,255,0.02)",
                  border:"1px solid rgba(255,255,255,0.05)",
                  borderRadius:"12px",
                  padding:"16px",
                  height:"220px",
                  position:"relative"
                }}>
                  <div style={{
                    color:"#334155", fontSize:"11px",
                    marginBottom:"10px",
                    textTransform:"uppercase",
                    letterSpacing:"0.5px"
                  }}>
                    Response Time (ms)
                  </div>
                  <svg width="100%" height="170"
                    viewBox="0 0 500 170"
                    preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="g1"
                        x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"
                          stopColor="#7c3aed"
                          stopOpacity="0.4"/>
                        <stop offset="100%"
                          stopColor="#7c3aed"
                          stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,130 C40,110 70,70 120,80
                         S190,100 240,55
                         S340,20 400,45
                         S470,65 500,35
                         L500,170 L0,170 Z"
                      fill="url(#g1)"/>
                    <path
                      d="M0,130 C40,110 70,70 120,80
                         S190,100 240,55
                         S340,20 400,45
                         S470,65 500,35"
                      fill="none"
                      stroke="#7c3aed"
                      strokeWidth="2.5"/>
                    <circle r="5" fill="#06b6d4">
                      <animateMotion dur="4s"
                        repeatCount="indefinite"
                        path="M0,130 C40,110 70,70 120,80
                               S190,100 240,55
                               S340,20 400,45
                               S470,65 500,35"/>
                    </circle>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Floating left card */}
          <div style={{
            position:"absolute",
            left:"-20px", bottom:"80px",
            background:"rgba(13,13,32,0.95)",
            backdropFilter:"blur(20px)",
            border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:"16px",
            padding:"16px 20px",
            width:"170px",
            animation:"float 4s ease-in-out infinite",
            zIndex:20
          }}>
            <div style={{
              display:"flex", alignItems:"center",
              gap:"8px", marginBottom:"8px"
            }}>
              <div style={{
                width:"8px", height:"8px",
                background:"#22c55e",
                borderRadius:"50%",
                animation:"pulse 2s infinite"
              }}/>
              <span style={{
                color:"#64748b", fontSize:"11px",
                fontWeight:"600",
                textTransform:"uppercase",
                letterSpacing:"1px"
              }}>Live Monitor</span>
            </div>
            <div style={{
              color:"white", fontWeight:"800",
              fontSize:"18px", marginBottom:"4px"
            }}>12 Sites UP</div>
            <div style={{
              color:"#22c55e", fontSize:"12px"
            }}>↑ All systems green</div>
          </div>

          {/* Floating right card */}
          <div style={{
            position:"absolute",
            right:"-20px", top:"80px",
            background:"rgba(13,13,32,0.95)",
            backdropFilter:"blur(20px)",
            border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:"16px",
            padding:"16px 20px",
            width:"180px",
            animation:"floatR 5s ease-in-out infinite",
            zIndex:20
          }}>
            <div style={{
              color:"#64748b", fontSize:"11px",
              marginBottom:"8px",
              textTransform:"uppercase",
              letterSpacing:"1px",
              fontWeight:"600"
            }}>🔔 Alert dispatched</div>
            <div style={{
              color:"white", fontSize:"14px",
              fontWeight:"700", marginBottom:"4px"
            }}>mysite.com recovered</div>
            <div style={{
              color:"#7c3aed", fontSize:"12px"
            }}>2 seconds ago</div>
          </div>
        </div>

        {/* Bottom fade */}
        <div style={{
          position:"absolute",
          bottom:0, left:0, right:0,
          height:"200px",
          background:"linear-gradient(transparent,#05050f)",
          zIndex:5, pointerEvents:"none"
        }}/>
      </section>

      {/* ── TRUSTED BY MARQUEE ── */}
      <div style={{ padding:"16px 0" }}>
        <p style={{
          textAlign:"center",
          color:"#334155",
          fontSize:"12px",
          fontWeight:"600",
          letterSpacing:"2px",
          textTransform:"uppercase",
          marginBottom:"16px"
        }}>TRUSTED BY DEVELOPERS BUILDING WITH:</p>
        <Marquee />
      </div>

      {/* ── FEATURE 1 - Uptime Monitoring ── */}
      <section style={{
        padding:"120px 60px",
        maxWidth:"1200px",
        margin:"0 auto",
        display:"grid",
        gridTemplateColumns:"1fr 1fr",
        gap:"80px",
        alignItems:"center"
      }}>
        <div>
          <div className="section-label">UPTIME MONITORING</div>
          <h2 style={{
            fontSize:"clamp(36px,4vw,52px)",
            fontWeight:900,
            lineHeight:1.1,
            letterSpacing:"-2px",
            marginBottom:"20px",
            color:"white"
          }}>
            Know before<br/>your users do.
          </h2>
          <p style={{
            color:"#64748b", fontSize:"16px",
            lineHeight:1.7, marginBottom:"28px"
          }}>
            Antigravtiven monitors your websites every 60 seconds
            from multiple regions. Get notified the second
            your global status changes.
          </p>
          <div className="check-item">60s check intervals</div>
          <div className="check-item">5 Global regions</div>
          <div className="check-item">Response time analysis</div>
          <div className="check-item">Downtime diagnostics</div>
          <div style={{ cursor: "pointer", color:"#7c3aed", fontSize:"15px", fontWeight:"600", marginTop:"12px" }}>Learn more →</div>
        </div>

        {/* Site list mockup */}
        <div className="mockup-card" style={{ padding:"8px" }}>
          {[
            {url:"google.com", status:"UP",
              statusColor:"#22c55e",
              dotColor:"#22c55e",
              ms:"24ms", uptime:"100%"},
            {url:"shopify.com", status:"UP",
              statusColor:"#22c55e",
              dotColor:"#22c55e",
              ms:"142ms", uptime:"99.9%"},
            {url:"api.production.co", status:"SLOW",
              statusColor:"#f59e0b",
              dotColor:"#f59e0b",
              ms:"1200ms", uptime:"99.2%"},
            {url:"legacy.app.io", status:"DOWN",
              statusColor:"#ef4444",
              dotColor:"#ef4444",
              ms:"—", uptime:"96.5%"}
          ].map((site, i) => (
            <div key={i} className="site-row">
              <div style={{
                display:"flex",
                alignItems:"center", gap:"10px"
              }}>
                <div style={{
                  width:"8px", height:"8px",
                  borderRadius:"50%",
                  background: site.dotColor,
                  flexShrink:0
                }}/>
                <span style={{
                  color:"#94a3b8", fontSize:"13px"
                }}>{site.url}</span>
              </div>
              <div style={{
                display:"flex",
                alignItems:"center", gap:"16px"
              }}>
                <span style={{
                  color: site.statusColor,
                  fontWeight:"700", fontSize:"12px"
                }}>{site.status}</span>
                <span style={{
                  color:"#334155", fontSize:"12px",
                  minWidth:"55px", textAlign:"right"
                }}>{site.ms}</span>
                <span style={{
                  color:"#475569", fontSize:"12px",
                  minWidth:"42px", textAlign:"right"
                }}>{site.uptime}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURE 2 - Analytics ── */}
      <section style={{
        padding:"120px 60px",
        maxWidth:"1200px",
        margin:"0 auto",
        display:"grid",
        gridTemplateColumns:"1fr 1fr",
        gap:"80px",
        alignItems:"center"
      }}>
        {/* Analytics mockup */}
        <div className="mockup-card" style={{ padding:"24px" }}>
          <div style={{
            color:"#334155", fontSize:"11px",
            textTransform:"uppercase",
            letterSpacing:"1px",
            marginBottom:"20px"
          }}>Sessions over time</div>
          
          {/* Bar chart */}
          <div style={{
            display:"flex",
            alignItems:"flex-end",
            gap:"8px", height:"120px",
            marginBottom:"20px"
          }}>
            {[40,65,45,80,55,90,70,85,60,95,75,100]
              .map((h, i) => (
              <div key={i} style={{
                flex:1,
                height:`${h}%`,
                background:`linear-gradient(
                  to top,
                  #7c3aed,
                  #06b6d4
                )`,
                borderRadius:"4px 4px 0 0",
                opacity: 0.7 + i * 0.025
              }}/>
            ))}
          </div>

          <div style={{
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
            padding:"12px 0",
            borderTop:"1px solid rgba(255,255,255,0.06)"
          }}>
            <div>
              <div style={{
                color:"#334155", fontSize:"11px",
                marginBottom:"4px"
              }}>Sessions today</div>
              <div style={{
                color:"white", fontSize:"20px",
                fontWeight:"800"
              }}>1,482</div>
            </div>
            <div style={{
              color:"#22c55e", fontSize:"13px",
              fontWeight:"600"
            }}>↑ 12.5%</div>
          </div>
        </div>

        <div>
          <div className="section-label">BUILT-IN ANALYTICS</div>
          <h2 style={{
            fontSize:"clamp(36px,4vw,52px)",
            fontWeight:900,
            lineHeight:1.1,
            letterSpacing:"-2px",
            marginBottom:"20px",
            color:"white"
          }}>
            Metrics that matter.<br/>
            <span style={{
              background:"linear-gradient(135deg,#7c3aed,#06b6d4)",
              WebkitBackgroundClip:"text",
              WebkitTextFillColor:"transparent",
              backgroundClip:"text"
            }}>Privacy focused.</span>
          </h2>
          <p style={{
            color:"#64748b", fontSize:"16px",
            lineHeight:1.7, marginBottom:"28px"
          }}>
            Ditch Google Analytics. Track page views, sessions
            and traffic sources without cookies. 100% GDPR
            compliant and blazing fast.
          </p>
          <div className="check-item">Zero-cookie tracking</div>
          <div className="check-item">Traffic origin analysis</div>
          <div className="check-item">Device & Browser stats</div>
          <div className="check-item">Performance watermarks</div>
        </div>
      </section>

      {/* ── FEATURE 3 - Alerts ── */}
      <section style={{
        padding:"120px 60px",
        maxWidth:"1200px",
        margin:"0 auto",
        display:"grid",
        gridTemplateColumns:"1fr 1fr",
        gap:"80px",
        alignItems:"center"
      }}>
        <div>
          <div className="section-label">INSTANT ALERTS</div>
          <h2 style={{
            fontSize:"clamp(36px,4vw,52px)",
            fontWeight:900,
            lineHeight:1.1,
            letterSpacing:"-2px",
            marginBottom:"20px",
            color:"white"
          }}>
            Resolve downtime<br/>faster than ever.
          </h2>
          <p style={{
            color:"#64748b", fontSize:"16px",
            lineHeight:1.7, marginBottom:"28px"
          }}>
            Get notified instantly via Email, Discord or Slack.
            Smart alerts prevent spam with intelligent
            cooldowns and error diagnosis.
          </p>
          <div className="check-item">
            Email alerts with error diagnosis
          </div>
          <div className="check-item">
            Discord webhook integration
          </div>
          <div className="check-item">
            Slack workspace alerts
          </div>
          <div className="check-item">
            Slow response warnings
          </div>
        </div>

        {/* Alert cards mockup */}
        <div style={{
          display:"flex",
          flexDirection:"column", gap:"12px"
        }}>
          {[
            {
              icon:"💬", platform:"Discord",
              color:"#5865f2",
              title:"🔴 mysite.com is DOWN",
              msg:"Error: ECONNREFUSED • 2 min ago",
              bg:"rgba(88,101,242,0.08)"
            },
            {
              icon:"📧", platform:"Email",
              color:"#7c3aed",
              title:"⚠️ Slow Response Alert",
              msg:"api.mysite.com • 3200ms • 5 min ago",
              bg:"rgba(124,58,237,0.08)"
            },
            {
              icon:"💼", platform:"Slack",
              color:"#22c55e",
              title:"✅ mysite.com recovered!",
              msg:"Downtime: 3m 42s • Just now",
              bg:"rgba(34,197,94,0.08)"
            }
          ].map((alert, i) => (
            <div key={i} style={{
              background: alert.bg,
              border:`1px solid ${alert.color}22`,
              borderLeft:`3px solid ${alert.color}`,
              borderRadius:"12px",
              padding:"16px 20px"
            }}>
              <div style={{
                display:"flex",
                alignItems:"center",
                gap:"8px",
                marginBottom:"6px"
              }}>
                <span style={{ fontSize:"16px" }}>
                  {alert.icon}
                </span>
                <span style={{
                  color: alert.color,
                  fontSize:"12px",
                  fontWeight:"700",
                  textTransform:"uppercase",
                  letterSpacing:"1px"
                }}>{alert.platform}</span>
              </div>
              <div style={{
                color:"white", fontSize:"14px",
                fontWeight:"600", marginBottom:"4px"
              }}>{alert.title}</div>
              <div style={{
                color:"#64748b", fontSize:"13px"
              }}>{alert.msg}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{
        background:"rgba(124,58,237,0.04)",
        borderTop:"1px solid rgba(124,58,237,0.1)",
        borderBottom:"1px solid rgba(124,58,237,0.1)",
        padding:"80px 60px"
      }}>
        <div style={{
          maxWidth:"1000px", margin:"0 auto",
          display:"grid",
          gridTemplateColumns:"repeat(4,1fr)",
          gap:"40px", textAlign:"center"
        }}>
          {[
            {n:"99.9%", l:"UPTIME RELIABILITY"},
            {n:"<60s", l:"DETECTION SPEED"},
            {n:"5", l:"GLOBAL REGIONS"},
            {n:"3+", l:"ALERT CHANNELS"}
          ].map((s,i) => (
            <div key={i}>
              <div style={{
                fontSize:"clamp(40px,5vw,64px)",
                fontWeight:900,
                letterSpacing:"-2px",
                background:"linear-gradient(135deg,#fff,#a78bfa)",
                WebkitBackgroundClip:"text",
                WebkitTextFillColor:"transparent",
                backgroundClip:"text",
                marginBottom:"8px"
              }}>{s.n}</div>
              <div style={{
                color:"#334155",
                fontSize:"11px",
                fontWeight:"700",
                letterSpacing:"2px",
                textTransform:"uppercase"
              }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{
        padding:"160px 20px",
        textAlign:"center",
        background:"radial-gradient(ellipse at center, rgba(124,58,237,0.15) 0%, transparent 65%)"
      }}>
        <h2 style={{
          fontSize:"clamp(40px,6vw,72px)",
          fontWeight:900,
          letterSpacing:"-3px",
          marginBottom:"20px",
          color:"white"
        }}>
          Downtime ends today.
        </h2>
        <p style={{
          color:"#64748b",
          fontSize:"18px",
          maxWidth:"440px",
          margin:"0 auto 44px",
          lineHeight:1.7
        }}>
          Join 500+ developers who trust Antigravtiven to keep
          their services running. No credit card required.
        </p>
        <button
          className="btn-primary"
          onClick={() => navigate("/register")}
          style={{
            fontSize:"17px",
            padding:"16px 36px"
          }}
        >
          Get started for free
        </button>
        <div style={{
          color:"#334155",
          fontSize:"13px",
          marginTop:"16px"
        }}>
          Setup in less than 2 minutes
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background:"#030308",
        borderTop:"1px solid rgba(255,255,255,0.05)",
        padding:"60px"
      }}>
        <div style={{
          maxWidth:"1200px",
          margin:"0 auto",
          display:"grid",
          gridTemplateColumns:"2fr 1fr 1fr 1fr",
          gap:"60px",
          marginBottom:"40px"
        }}>
          <div>
            <div style={{
              fontWeight:"800",
              fontSize:"18px",
              marginBottom:"12px",
              display:"flex",
              alignItems:"center", gap:"8px"
            }}>
              🛡️ Antigravtiven
            </div>
            <p style={{
              color:"#334155",
              fontSize:"14px",
              lineHeight:1.7,
              maxWidth:"240px"
            }}>
              Built for mission-critical engineering
              teams. The observability platform that
              works at the scale you do.
            </p>
          </div>
          {[
            {
              title:"PRODUCT",
              links:["Uptime","Analytics",
                     "Security","API Status"]
            },
            {
              title:"INTEGRATIONS",
              links:["Discord","Slack",
                     "Email","Webhooks"]
            },
            {
              title:"COMPANY",
              links:["Privacy","Terms",
                     "Security","GitHub"]
            }
          ].map((col,i) => (
            <div key={i}>
              <div style={{
                color:"#334155",
                fontSize:"11px",
                fontWeight:"700",
                letterSpacing:"2px",
                textTransform:"uppercase",
                marginBottom:"20px"
              }}>{col.title}</div>
              {col.links.map((link,j) => (
                <div key={j} style={{
                  color:"#475569",
                  fontSize:"14px",
                  marginBottom:"10px",
                  cursor:"pointer"
                }}>{link}</div>
              ))}
            </div>
          ))}
        </div>

        <div style={{
          borderTop:"1px solid rgba(255,255,255,0.05)",
          paddingTop:"24px",
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center",
          flexWrap:"wrap", gap:"12px"
        }}>
          <span style={{
            color:"#1e293b", fontSize:"13px"
          }}>
            © 2026 Antigravtiven Technologies. 
            Built for the developer web.
          </span>
          <span style={{
            color:"#1e293b", fontSize:"13px"
          }}>
            Twitter • GitHub
          </span>
        </div>
      </footer>
    </div>
  );
}
