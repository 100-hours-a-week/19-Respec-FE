import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { getCookie, deleteCookie } from '../utils/cookie';
import { DOMAINS } from '../constants/domains';

const OAuthRedirectPage = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuthStore();
  const [loginAttempted, setLoginAttempted] = useState(false);

  useEffect(() => {
    const tempLoginId = getCookie('TempLoginId');
    const authorization = getCookie('access');

    if (tempLoginId) {
      navigate('/profile-setup');
      return;
    }

    if (authorization && !loginAttempted) {
      console.log('로그인 시도 시작');
      setLoginAttempted(true);

      login(null, authorization);

      deleteCookie('access', '/', DOMAINS.COOKIE_DOMAIN);
      return;
    }

    if (!authorization && !tempLoginId) {
      console.log('로그인 실패: Authorization, TempLoginId 둘 다 존재 X');
      navigate('/login');
    }
  }, [navigate, login, loginAttempted]);

  useEffect(() => {
    if (loginAttempted && isLoggedIn) {
      console.log('로그인 완료 확인, 홈페이지로 이동');
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    }
  }, [isLoggedIn, loginAttempted]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">
        {loginAttempted ? '로그인 처리 중입니다...' : '처리 중입니다...'}
      </p>
    </div>
  );
};

export default OAuthRedirectPage;
