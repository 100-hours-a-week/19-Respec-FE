import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 사용자 인증 상태 확인
  useEffect(() => {
    const getCookie = (name) =>
      document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];
  
    const tempLoginId = getCookie("TempLoginId");
    const hasAuthorization = document.cookie.includes("Authorization");

    const checkAuthStatus = async () => {
      if (!hasAuthorization) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/users/me');
        
        if (response.data?.data?.user) {
          setUser(response.data.data.user);
          setIsLoggedIn(true);
        }
      } catch (error) {
        // 인증 실패 시에도 public page에서는 error 처리 생략
        const publicPaths = ['/', '/rank', '/ranking-results'];
        
        if (!publicPaths.includes(window.location.pathname)) {
          console.error('인증 실패: ', error);
        }

        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    if (window.location.pathname === "/profile-setup" || (!!tempLoginId && !document.cookie.includes("Authorization"))) {
      setLoading(false);
    } else {
      if (!isLoggedIn && !user) {
        checkAuthStatus();
      } else {
        setLoading(false);
      }
    }
  }, [isLoggedIn, user]);

  // 로그인 함수
  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      await axios.delete('/api/auth/token');
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