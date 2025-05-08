import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { login } = useAuth();

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // 사용자 정보 조회 시도 - 쿠키는 자동으로 전송되므로 헤더에 추가할 필요 없음
        const response = await axios.get('/api/users/me');
        
        const user = response.data;
        
        // 인증 상태 업데이트
        login(user);

        if (!user.nickname || user.nickname.startsWith('guest-')) {
          // 프로필 설정 페이지로 이동 (최초 로그인)
          navigate('/profile-setup');
        } else {
          // 기존 사용자는 홈페이지로 이동
          navigate('/');
        }

      } catch (err) {
        if (err.response?.status === 401) {
          setError('세션이 만료되었습니다. 다시 로그인해주세요.');
        } else if (err.response?.status === 429) {
          setError('로그인 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
        } else {
          setError('로그인 중 알 수 없는 오류가 발생했습니다.');
        }
        console.error('OAuth 콜백 처리 오류:', err);
      } finally {
        setLoading(false);
      }
    };
    
    processOAuthCallback();
  }, [navigate, login]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-red-600">오류 발생</h2>
          <p className="mb-4 text-gray-700">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2 text-white bg-indigo-600 rounded-md"
          >
            로그인 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuthCallbackPage;