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
import { AuthSuccess } from './components/AuthSuccess';
import { SecurityCheck } from './pages/SecurityCheck'; 
import { Navigate, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';


function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-black">
        <div className="loading-spinner" />
      </div>
    );
  }

  const RequireAuth = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  const RedirectIfAuthed = ({ children }) => {
    if (user) return <Navigate to="/dashboard" replace />;
    return children;
  };
  console.log("API URL:", import.meta.env.VITE_API_URL);

  return (
    <ErrorBoundary>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155'
          }
        }}
      />
      <Routes>
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
        {/* New OAuth success route */}
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
          path="/websites/:id/security"
          element={
            <RequireAuth>
              <SecurityCheck />
            </RequireAuth>
          }
        />
        <Route
          path="/status/:websiteId"

          element={<PublicStatus />}
        />
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
