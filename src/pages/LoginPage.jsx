import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../utils/cookie';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showRedirectNotice, setShowRedirectNotice] = useState(false);

  // 쿠키에서 TempLoginId 확인
  useEffect(() => {
    const tempLoginId = getCookie("TempLoginId");
  
    if (tempLoginId) {
      setShowRedirectNotice(true);
      setTimeout(() => {
        navigate('/profile-setup');
      }, 1500);
    }
  }, [navigate]);

  // 리다이렉션 안내 문구
  if (showRedirectNotice) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="p-6 bg-white rounded shadow-md">
          <p className="font-medium text-gray-800">
            소셜 인증은 완료되었으나<br/>회원가입이 필요합니다.
          </p>
          <p className="mt-2 text-sm text-gray-500">회원가입 페이지로 이동 중...</p>
        </div>
      </div>
    );
  }

  const handleLogin = () => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const frontendBaseUrl = process.env.REACT_APP_FRONTEND_URL;

    const redirectUri = encodeURIComponent(`${frontendBaseUrl}/oauth-redirect`);

    window.location.href = `${apiBaseUrl}/oauth2/authorization/kakao?redirect_uri=${redirectUri}`;
  };

  return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md p-8 my-8 space-y-8 bg-white rounded-lg shadow">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full">
                <img src='/specranking_logo.png' alt='logo'/>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-indigo-900">스펙랭킹</h2>
            <p className="mt-2 text-sm font-semibold text-gray-500">
              취업 준비의 모든 것,<br/>당신의 커리어를 한 단계 더 높이세요
            </p>
          </div>
          
          <div className="mt-10">
            <button onClick={handleLogin}>
              <img src='/kakao_login_large_wide.png' alt='카카오 계정으로 로그인'/>
            </button>
            
            <p className="mt-5 text-xs text-center text-gray-600">
              아직 회원이 아니신가요?<br/>로그인 시 자동 회원가입됩니다.
            </p>
          </div>
        </div>
      </div>
    );
};

export default LoginPage;
