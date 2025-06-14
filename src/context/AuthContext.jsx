import { createContext, useState, useContext, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // checking if user is logged in on mount
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const storedUser = localStorage.getItem('user');
      
      if (!accessToken || !refreshToken || !storedUser) {
        setIsLoading(false);
        return;
      }
      
      try {
        // validating the token or refresh
        const response = await fetch(`${API_BASE_URL}/refresh-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken })
        });
        
        if (!response.ok) {
          throw new Error('Invalid session');
        }
        
        const data = await response.json();
        
        localStorage.setItem('accessToken', data.accessToken);
        
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (user, pwd) => {
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
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (user, pwd, role) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ user, pwd, role })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken })
      });
    } catch (error) {
      throw error;
    
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const authenticatedRequest = async (url, options = {}) => {
    let accessToken = localStorage.getItem('accessToken');
    
    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };
    
    let response = await fetch(url, { ...options, headers });
    
    if (response.status === 401 || response.status === 403) {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        logout();
        throw new Error('Session expired. Please log in again.');
      }
      
      const refreshResponse = await fetch(`${API_BASE_URL}/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken })
      });
      
      if (!refreshResponse.ok) {
        logout();
        throw new Error('Session expired. Please log in again.');
      }
      
      const data = await refreshResponse.json();
      accessToken = data.accessToken;
      
      localStorage.setItem('accessToken', accessToken);
      
      headers.Authorization = `Bearer ${accessToken}`;
      response = await fetch(url, { ...options, headers });
    }
    
    return response;
  };

  const isJobPoster = () => {
    return user?.role === 'job_poster';
  };

  const updateUserProfile = async (formData) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();

      // updating local state and storage with merging
      const updatedUserInfo = {...user, ...updatedUser};
      setUser(updatedUserInfo);
      localStorage.setItem('user', JSON.stringify(updatedUserInfo));
      
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  const deleteUserProfileImage = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/users/profile/image`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete profile image');
      }

      const updatedData = await response.json();
      setUser(updatedData);
      localStorage.setItem('user', JSON.stringify(updatedData));
      return updatedData;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      login, 
      logout, 
      register,
      isJobPoster,
      authenticatedRequest,
      updateUserProfile,
      deleteUserProfileImage
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);