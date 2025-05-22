import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

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
      try {
        const response = await axiosInstance.get('/api/users/me');
        
        if (response.data?.data?.user) {
          setUser(response.data.data.user);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
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

    if (window.location.pathname === "/profile-setup" || tempLoginId) {
      setLoading(false);
    } else if (hasAuthorization) {
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
      await axiosInstance.delete('/api/auth/token');
      setUser(null);
      setIsLoggedIn(false);

      // 쿠키 삭제
      document.cookie = "Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "TempLoginId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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