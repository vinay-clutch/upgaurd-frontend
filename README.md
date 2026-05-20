# UpGuard Frontend — Real-Time Website Monitoring Dashboard

> 🎯 The beautiful, animated frontend for UpGuard — featuring a live AI/ML Brain Engine dashboard, real-user monitoring, security scanning, and predictive intelligence visualizations.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router DOM v6 |
| Animations | Framer Motion |
| Charts | Chart.js + react-chartjs-2 |
| Styling | Tailwind CSS |
| HTTP | Axios + Fetch API |
| Real-time | Socket.IO Client |
| Notifications | react-hot-toast |
| Auth | JWT (stored in localStorage) |

---

## ✨ Features

- 📊 **Live Dashboard** — Real-time website uptime, response time graphs, and incident history
- 🧠 **AI/ML Brain Engine Dashboard** — Interactive visual simulator showing all 5 ML algorithms in action
- 🔍 **Real-User Monitoring (RUM)** — Track live visitors and capture JavaScript exceptions from production
- 🛡️ **Security Scanner** — HTTP security header analysis with a letter grade and detailed fix instructions
- 🔮 **Predictive Intelligence** — Capacity saturation forecasts shown directly on each website's detail page
- 🌍 **Global Command Center Map** — See monitoring agents active across 5 worldwide regions
- 📄 **PDF Report Export** — Download professional monitoring reports
- 🔔 **Multi-Channel Alerts** — Email, Discord, and Slack notification integrations

---

## ⚡ Quick Start (After Cloning)

### 1. Prerequisites
Make sure you have:
- [Node.js v18+](https://nodejs.org/)
- The **Backend** running on http://localhost:8080 (see backend repo)

### 2. Clone the repo
```bash
git clone https://github.com/vinay-clutch/upgaurd-frontend.git
cd upgaurd-frontend
```

### 3. Install dependencies
```bash
npm install
```

### 4. Set up environment variables
```bash
# Copy the example file
copy .env.example .env
```
Then open `.env` and fill in:
```env
VITE_API_URL=http://localhost:8080
```

### 5. Start the development server
```bash
npm run dev
```
> App running at **http://localhost:5173** 🎉

---

## 📁 Project Structure

```
src/
├── components/
│   ├── AIMLDashboard.jsx      # 🧠 AI/ML Brain Engine Dashboard (NEW)
│   ├── Dashboard.jsx          # Main monitoring dashboard
│   ├── WebsiteDetails.jsx     # Full website detail view + AI alerts
│   ├── RUMAnalytics.jsx       # Real-User Monitoring live feed
│   ├── Analytics.jsx          # Website analytics + tracker setup
│   ├── IncidentHistory.jsx    # Incident history log
│   ├── Navbar.jsx             # Top navigation with AI/ML link
│   ├── CommandCenterMap.jsx   # Global monitoring regions map
│   ├── PublicStatus.jsx       # Public uptime status page
│   ├── StatusBadge.jsx        # Embeddable uptime badge
│   └── ResponseTimeChart.jsx  # Response time area chart
├── pages/
│   ├── Landing.jsx            # Marketing landing page
│   ├── Profile.jsx            # User account settings
│   └── SecurityCheck.jsx      # HTTP security headers report
├── services/
│   └── api.ts                 # All API calls to backend
├── context/
│   └── AuthContext.jsx        # JWT auth state management
└── App.jsx                    # Routes configuration
```

---

## 🧭 Navigation Guide

| Route | Page |
|---|---|
| `/` | Landing / Marketing page |
| `/dashboard` | Main monitoring dashboard |
| `/ai-dashboard` | 🧠 AI/ML Brain Engine Dashboard |
| `/website/:id` | Individual website details + AI forecast |
| `/websites/:id/analytics` | Analytics + RUM tracker setup |
| `/websites/:id/rum` | Real-User Monitoring live feed |
| `/websites/:id/incidents` | Incident history |
| `/websites/:id/security` | Security header scan |
| `/status/:username` | Public status page |
| `/profile` | Account settings + integrations |

---

## 🔄 Running with the Backend

For the full experience you need both running at the same time:

```bash
# Terminal 1 — Backend API
cd upgaurd-backend
npm run dev

# Terminal 2 — Frontend App
cd upgaurd-frontend
npm run dev
```

---

## 📜 Available npm Scripts

```bash
npm run dev      # Start development server with HMR
npm run build    # Build for production
npm run preview  # Preview production build locally
```
