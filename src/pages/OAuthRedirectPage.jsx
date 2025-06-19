import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { getCookie, deleteCookie } from '../utils/cookie';
import { DOMAINS } from '../constants/domains';

const OAuthRedirectPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    const tempLoginId = getCookie('TempLoginId');
    const authorization = getCookie('access');

    if (tempLoginId) {
      navigate('/profile-setup');
      return;
    }
    if (authorization) {
      login(null, authorization);
      deleteCookie('access', '/', DOMAINS.COOKIE_DOMAIN);
      window.location.href = '/';
      return;
    }

    console.log('로그인 실패: Authorization, TempLoginId 둘 다 존재 X');
    navigate('/login');
  }, [navigate, login]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">처리 중입니다...</p>
    </div>
  );
};

export default OAuthRedirectPage;
