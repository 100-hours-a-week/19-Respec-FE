import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 사용자 인증 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('/api/users/me');
        
        if (response.data?.data?.user) {
          setUser(response.data.data.user);
          setIsLoggedIn(true);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log('Not authenticated (401)');
        } else if (error.code === "ERR_NETWORK") {
            console.log('Network or CORS error occurred');
        } else {
            console.error('Auth check failed: ', error);
        }
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    if (window.location.pathname !== "/profile-setup") {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
    
  }, []);

  // 로그인 함수
  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      await axios.delete('/api/auth/token');
      axios.defaults.headers.common['Authorization'] = undefined;
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);