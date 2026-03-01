import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleOAuthSuccess } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    if (token) {
      handleOAuthSuccess(token);
      navigate('/dashboard');
    } else if (error) {
      console.error('OAuth error:', error);
      navigate('/login?error=' + error);
    } else {
      navigate('/login');
    }
  }, [location, handleOAuthSuccess, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-black">
      <div className="text-center text-white">
        <div className="loading-spinner mb-4" />
        <p>Processing authentication...</p>
      </div>
    </div>
  );
};