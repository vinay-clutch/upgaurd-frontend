import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const profile = await api.me();
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.signin(username, password);
      localStorage.setItem('token', response.token);
      setUser({ token: response.token });

      try {
        const profile = await api.me();
        setUserProfile(profile);
      } catch (error) {
        console.error('Failed to fetch user profile after login:', error);
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (username, password) => {
    try {
      await api.signup(username, password);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateUserEmail = async (email) => {
    try {
      console.log('Updating email with: in auth context', email);
      await api.updateEmail(email);
      setUserProfile(prev => ({ ...prev, email }));

      await fetchUserProfile();
      
      return { success: true };
    } catch (error) {
      console.error('Failed to update email in context:', error);
      throw error;
    }
  };

  const handleOAuthSuccess = async (token) => {
    localStorage.setItem('token', token);
    try {
      const userData = await api.me();
      setUser(userData);
    } catch (error) {
      console.error('Failed to get user data after OAuth:', error);
      localStorage.removeItem('token');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile, 
      login, 
      signup, 
      logout, 
      loading, 
      handleOAuthSuccess,
      updateUserEmail,
      refreshProfile: fetchUserProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
