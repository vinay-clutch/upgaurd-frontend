import './index.css';
import { useAuth } from './context/AuthContext';
import { Dashboard } from './components/Dashboard';
import { LoginForm } from './components/LoginForm';
import { Landing } from './pages/Landing';
import { Profile } from './pages/Profile';
import { WebsiteDetails } from './components/WebsiteDetails';
import { IncidentHistory } from './components/IncidentHistory';
import { PublicStatus } from './components/PublicStatus';
import { Analytics } from './components/Analytics';
import { RUMAnalytics } from './components/RUMAnalytics';
import { AIMLDashboard } from './components/AIMLDashboard';
import { AuthSuccess } from './components/AuthSuccess';

import { SecurityCheck } from './pages/SecurityCheck'; 
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08080a]">
        <div className="loading-spinner" />
      </div>
    );
  }

  const RequireAuth = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return <PageTransition>{children}</PageTransition>;
  };

  const RedirectIfAuthed = ({ children }) => {
    if (user) return <Navigate to="/dashboard" replace />;
    return <PageTransition>{children}</PageTransition>;
  };

  return (
    <ErrorBoundary>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '600'
          }
        }}
      />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <RedirectIfAuthed>
                <Landing />
              </RedirectIfAuthed>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectIfAuthed>
                <LoginForm />
              </RedirectIfAuthed>
            }
          />
          <Route
            path="/auth/success"
            element={<AuthSuccess />}
          />
          <Route
            path="/register"
            element={
              <RedirectIfAuthed>
                <LoginForm defaultIsLogin={false} />
              </RedirectIfAuthed>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/ai-dashboard"
            element={
              <RequireAuth>
                <AIMLDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/website/:id"
            element={
              <RequireAuth>
                <WebsiteDetails />
              </RequireAuth>
            }
          />
          <Route
            path="/websites/:websiteId/incidents"
            element={
              <RequireAuth>
                <IncidentHistory />
              </RequireAuth>
            }
          />
          <Route
            path="/websites/:websiteId/analytics"
            element={
              <RequireAuth>
                <Analytics />
              </RequireAuth>
            }
          />
          <Route
            path="/websites/:websiteId/rum"
            element={
              <RequireAuth>
                <RUMAnalytics />
              </RequireAuth>
            }
          />
          <Route
            path="/websites/:id/security"
            element={
              <RequireAuth>
                <SecurityCheck />
              </RequireAuth>
            }
          />
          <Route
            path="/status/:username"
            element={
              <PageTransition>
                <PublicStatus />
              </PageTransition>
            }
          />
          <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
        </Routes>
      </AnimatePresence>
    </ErrorBoundary>
  );
}

export default App;
