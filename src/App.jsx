import './App.css';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import MyPage from './pages/MyPage';
import SpecInputPage from './pages/SpecInputPage';
import RankingPage from './pages/RankingPage';
import RankingResultPage from './pages/RankingResultPage';
import ChatroomsPage from './pages/ChatroomsPage';
import ChatsPage from './pages/ChatsPage';
import SocialPage from './pages/SocialPage';
import TopBar from './components/TopBar';
import BottomNavBar from './components/BottomNavBar';
import { AuthProvider, useAuth } from './context/AuthContext';
import OAuthRedirectPage from './pages/OAuthRedirectPage';
import React from 'react';

axios.defaults.withCredentials = true;

// 인증이 필요한 라우트를 위한 컴포넌트
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  React.useEffect(() => {
    if (!isLoggedIn) {
      // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [isLoggedIn, navigate, location]);
  
  return isLoggedIn ? children : null;
};

// 레이아웃 컴포넌트
const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const { isLoggedIn } = useAuth();
  
  // 현재 경로에 따라 TopBar 타이틀 설정
  const getTitleByPath = () => {
    const path = location.pathname;
    
    if (path === '/') return '홈';
    if (path === '/login') return '로그인';
    if (path === '/profile-setup') return '프로필 설정';
    if (path === '/spec-input') return '스펙 입력';
    if (path === '/rank') return '랭킹';
    if (path === '/ranking-results') return '랭킹 결과';
    if (path === '/chatrooms') return '채팅';
    if (path.startsWith('/chat')) return '스펙랭킹';
    if (path === '/social') return '소셜';
    if (path === '/my') return '마이페이지';
    
    return '';
  };

  // 뒤로가기 버튼 설정
  const getBackButtonConfig = () => {
    const path = location.pathname;
    
    if (path === '/profile-setup') return null;
    if (path === '/spec-input') return '/my';
    if (path === '/ranking-results') return '/rank';
    if (path.startsWith('/chat')) return '/chatrooms';
    
    return '/';
  };

  // 현재 활성 메뉴 설정
  const getActiveMenu = () => {
    const path = window.location.pathname;
    
    if (path === '/') return 'home';
    if (path === '/rank') return 'rank';
    if (path === '/chatrooms' || path.startsWith('/chat')) return 'dm';
    if (path === '/social') return 'social';
    if (path === '/my') return 'my';
    
    return '';
  };
  
  // 콜백 페이지 등 TopBar와 BottomNavBar가 필요없는 페이지 체크
  const shouldShowNavigation = !['/oauth2/callback'].includes(path);
  
  // 채팅 페이지 여부 확인
  const isChatPage = path.startsWith('/chat');

  return (
    <div className="max-w-[390px] mx-auto bg-gray-50 min-h-screen pb-16 relative overflow-hidden">
      {shouldShowNavigation && <TopBar title={getTitleByPath()} backLink={getBackButtonConfig()} />}
      <main className={isChatPage ? '' : 'pt-16'}>
        {children}
      </main>
      {shouldShowNavigation && <BottomNavBar active={getActiveMenu()} />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="overflow-hidden h-screen">
          <Routes>
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/login" element={<Layout><LoginPage /></Layout>} />
            <Route path="/profile-setup" element={<Layout><ProfileSetupPage /></Layout>} />
            <Route path="/oauth2/callback" element={<OAuthCallbackPage />} />
            <Route path="/oauth-redirect" element={<OAuthRedirectPage />} />
            <Route path="/spec-input" element={<Layout><SpecInputPage /></Layout>} />
            <Route path="/rank" element={<Layout><RankingPage /></Layout>} />
            <Route path="/ranking-results" element={<Layout><RankingResultPage /></Layout>} />
            <Route path="/chatrooms" element={<Layout><ChatroomsPage /></Layout>} />
            <Route path="/chat" element={<Layout><ChatsPage /></Layout>} />
            <Route path="/social" element={<Layout><SocialPage /></Layout>} />
            <Route path="/my" element={
              <ProtectedRoute>
                <Layout><MyPage /></Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
