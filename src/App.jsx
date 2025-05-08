import './App.css';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import MyPage from './pages/MyPage';
import TopBar from './components/TopBar';
import BottomNavBar from './components/BottomNavBar';
import { AuthProvider, useAuth } from './context/AuthContext';

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
  const path = location.pathname;
  const { isLoggedIn } = useAuth();
  
  // 현재 경로에 따라 TopBar 타이틀 설정
  const getTitleByPath = () => {
    switch (path) {
      case '/': return '스펙랭킹';
      case '/login': return '로그인';
      case '/profile-setup': return '회원가입';
      case '/rank': return '랭킹';
      case '/dm': return '메시지';
      case '/social': return '소셜';
      case '/my': return '마이페이지';
      default: return '스펙랭킹';
    }
  };

  // 현재 활성화된 메뉴 아이템 결정
  const getActiveMenu = () => {
    if (path === '/') return 'home';
    if (path === '/rank') return 'rank';
    if (path === '/dm') return 'dm';
    if (path === '/social') return 'social';
    if (path === '/my') return 'my';
    if (path === '/login') return isLoggedIn ? 'my' : 'login';
    return '';
  };
  
  // 콜백 페이지 등 TopBar와 BottomNavBar가 필요없는 페이지 체크
  const shouldShowNavigation = !['/oauth2/callback'].includes(path);

  return (
    <div className="max-w-[390px] mx-auto bg-gray-50 min-h-screen pb-16 relative">
      {shouldShowNavigation && <TopBar title={getTitleByPath()} backLink={path !== '/' ? '/' : null} />}
      <main className="pt-5 pb-5">
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
          <Route path="/rank" element={<Layout><div className="p-4">랭킹 페이지</div></Layout>} />
          <Route path="/dm" element={<Layout><div className="p-4">메시지 페이지</div></Layout>} />
          <Route path="/social" element={<Layout><div className="p-4">소셜 페이지</div></Layout>} />
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
