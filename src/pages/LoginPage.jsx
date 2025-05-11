import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showRedirectNotice, setShowRedirectNotice] = useState(false);

  // 쿠키에서 TempLoginId 확인
  useEffect(() => {
    const getCookie = (name) =>
      document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];
  
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
    const redirectUri = encodeURIComponent("http://localhost:3000/oauth-redirect");

    // window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
    window.location.href = `http://localhost:8080/oauth2/authorization/kakao?redirect_uri=${redirectUri}`;
  };

  return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md p-8 my-8 space-y-8 bg-white rounded-lg shadow">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full">
                <svg className="w-10 h-10 text-indigo-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.5L17 9v6l-5 3-5-3V9l5-3.5z" />
                  <path d="M12 7l-1 5 3 2 3-4-5-3zm0 2l2 1-1 1-1-2z" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-indigo-700">스펙랭킹</h2>
            <p className="mt-2 text-sm text-gray-600">
              취업 준비의 모든 것,<br/>당신의 커리어를 한 단계 더 높이세요
            </p>
          </div>
          
          <div className="mt-10">
            {/* <a
              href="http://localhost:8080/oauth2/authorization/kakao"
              className="flex items-center justify-center w-full px-4 py-3 text-black transition-colors bg-yellow-400 rounded-md hover:bg-yellow-500"
            > */}
            <button
              onClick={handleLogin}
              className="flex items-center justify-center w-full gap-3 px-4 py-3 text-black transition-colors bg-yellow-400 rounded-md hover:bg-yellow-500"
            >
              <LogIn/>
              카카오 계정으로 로그인
            </button>
            
            <p className="mt-8 text-sm text-center text-gray-600">
              아직 회원이 아니신가요?<br/>로그인 시 자동 회원가입됩니다.
            </p>
          </div>
        </div>
      </div>
    );
};

export default LoginPage;
