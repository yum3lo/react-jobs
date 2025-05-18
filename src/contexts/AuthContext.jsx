import { createContext, useState, useEffect, useContext } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    user: null,
    isLoading: true,
    isFetching: false
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthState(prev => ({ ...prev, isFetching: true }));
        
        const response = await fetch(`${API_BASE_URL}/auth/check`, {
          credentials: 'include'
        });
        
        const data = await response.json();
        
        setAuthState({
          isLoggedIn: response.ok,
          user: response.ok ? data.user : null,
          isLoading: false,
          isFetching: false
        });
        
      } catch (err) {
        setAuthState({
          isLoggedIn: false,
          user: null,
          isLoading: false,
          isFetching: false
        });
      }
    };
    
    checkAuth();
  }, []);

  const login = async (user, pwd) => {
    setAuthState(prev => ({
      ...prev,
      isLoading: true
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ user, pwd })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      setAuthState({
        isLoggedIn: true,
        user: data.user,
        isLoading: false,
        isFetching: false
      });

      return { success: true };
    } catch (err) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        isFetching: false
      }));
      
      return { success: false, error: err.message };
    }
  };

  const register = async (user, pwd) => {
    setAuthState(prev => ({
      ...prev,
      isLoading: true
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ user, pwd })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      // automatic login
      const loginResult = await login(user, pwd);
      
      if (!loginResult.success) {
        throw new Error('Registration successful but automatic login failed');
      }

      return { success: true };
    } catch (err) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        isFetching: false
      }));
      
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      
      setAuthState({
        isLoggedIn: false,
        user: null,
        isLoading: false,
        isFetching: false
      });
      
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Logout failed: ' + err.message };
    }
  };

  const value = {
    authState,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};