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

axios.defaults.withCredentials = true;

// 인증이 필요한 라우트를 위한 컴포넌트
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// 레이아웃 컴포넌트
const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const { isLoggedIn } = useAuth();
  
  // 현재 경로에 따라 TopBar 타이틀 설정
  const getTitleByPath = () => {
    switch (path) {
      case '/': return '스펙랭킹';
      case '/login': return '로그인';
      case '/profile-setup': return '회원가입';
      case '/spec-input': return '스펙 입력';
      case '/rank': return '랭킹';
      case '/ranking-results': return '랭킹 검색 결과';
      case '/chatrooms': return '채팅방';
      case '/social': return '소셜';
      case '/my': return '마이페이지';
      default: return '스펙랭킹';
    }
  };

  // 뒤로가기 버튼 표시 여부 및 이동 경로 결정
  const getBackButtonConfig = () => {
    // 뒤로가기 버튼이 보이지 않아야 하는 페이지들
    if (['/', '/login', '/rank', '/chatrooms', '/social', '/my'].includes(path)) {
      return null;
    }
    
    // 특정 페이지로 이동해야 하는 경우
    if (path === '/profile-setup') return '/login';
    if (path === '/spec-input') return '/my';
    if (path === '/ranking-results') return '/rank';
    
    // 그 외 페이지는 브라우저 히스토리 기반 이전 페이지로 이동
    return () => navigate(-1);
  };

  // 현재 활성화된 메뉴 아이템 결정
  const getActiveMenu = () => {
    if (path === '/') return 'home';
    if (path === '/rank' || path === 'ranking-results') return 'rank';
    if (path === '/chatrooms') return 'dm';
    if (path === '/social') return 'social';
    if (path === '/my' || path === '/spec-input') return 'my';
    if (path === '/login' || path === '/profile-setup') return isLoggedIn ? 'my' : 'login';
    return '';
  };
  
  // 콜백 페이지 등 TopBar와 BottomNavBar가 필요없는 페이지 체크
  const shouldShowNavigation = !['/oauth2/callback'].includes(path);

  return (
    <div className="max-w-[390px] mx-auto bg-gray-50 min-h-screen pb-16 relative">
      {shouldShowNavigation && <TopBar title={getTitleByPath()} backLink={getBackButtonConfig()} />}
      <main className="pt-16">
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
          <Route path="/chat/:chatroomId" element={<Layout><ChatsPage /></Layout>} />
          <Route path="/social" element={<Layout><SocialPage /></Layout>} />
          <Route path="/my" element={
            <ProtectedRoute>
              <Layout><MyPage /></Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
