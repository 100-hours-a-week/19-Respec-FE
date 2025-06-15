import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import axios from 'axios';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import MyPage from './pages/MyPage';
import SpecInputPage from './pages/SpecInputPage';
import RankingPage from './pages/RankingPage';
import RankingResultPage from './pages/RankingResultPage';
import ChatroomsPage from './pages/ChatroomsPage';
import ChatsPage from './pages/ChatsPage';
import SocialPage from './pages/SocialPage';
import ProfileEditPage from './pages/ProfileEditPage';
import BookmarkPage from './pages/BookmarkPage';
import TopBar from './components/common/TopBar';
import BottomNavBar from './components/common/BottomNavBar';
import { useEffect } from 'react';
import { useAuthStore } from './stores/useAuthStore';
import OAuthRedirectPage from './pages/OAuthRedirectPage';

axios.defaults.withCredentials = true;

// 인증이 필요한 라우트를 위한 컴포넌트
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading, init } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // 라우트 변경 시 인증 상태 확인
    init();
  }, [location.pathname, init]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// 레이아웃 컴포넌트
const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const { isLoggedIn } = useAuthStore();

  // 현재 경로에 따라 TopBar 타이틀 설정
  const getTitleByPath = () => {
    // /chat/ 경로인 경우 스펙랭킹 표시 (채팅방 상세에서는 헤더에 상대방 이름 표시)
    if (path.startsWith('/chat/')) return '스펙랭킹';

    switch (path) {
      case '/':
        return '스펙랭킹';
      case '/login':
        return '로그인';
      case '/profile-setup':
        return '회원가입';
      case '/spec-input':
        return '스펙 입력';
      case '/rank':
        return '랭킹';
      case '/ranking-results':
        return '랭킹 검색 결과';
      case '/dm':
        return '채팅방';
      case '/social':
        return '소셜';
      case '/my':
        return '마이페이지';
      case '/edit-profile':
        return '회원정보 수정';
      case '/bookmark':
        return '즐겨찾기';
      default:
        if (path.startsWith('/social/')) {
          return '소셜';
        }
        return '스펙랭킹';
    }
  };

  // 뒤로가기 버튼 표시 여부 및 이동 경로 결정
  const getBackButtonConfig = () => {
    // 뒤로가기 버튼이 보이지 않아야 하는 페이지들
    if (
      ['/', '/login', '/rank', '/chatrooms', '/social', '/my'].includes(path)
    ) {
      return null;
    }

    // 특정 페이지로 이동해야 하는 경우
    if (path === '/profile-setup') return '/login';
    if (path === '/spec-input') return '/my';
    if (path === '/ranking-results') return '/rank';
    if (path === '/edit-profile') return '/my';
    if (path === '/bookmark') return '/my';

    // 그 외 페이지는 브라우저 히스토리 기반 이전 페이지로 이동
    return () => navigate(-1);
  };

  // 현재 활성화된 메뉴 아이템 결정
  const getActiveMenu = () => {
    if (path === '/') return 'home';
    if (path === '/rank' || path === 'ranking-results') return 'rank';
    if (path === '/chatrooms') return 'dm';
    if (path === '/social' || path.startsWith('/social/')) return 'social';
    if (
      path === '/my' ||
      path === '/spec-input' ||
      path === '/edit-profile' ||
      path === '/bookmark'
    )
      return 'my';
    if (path === '/login' || path === '/profile-setup')
      return isLoggedIn ? 'my' : 'login';
    return '';
  };

  // 채팅 페이지 여부 확인
  const isChatPage = path === '/chat';

  return (
    <div className="relative w-full max-w-[390px] mx-auto min-h-screen bg-gray-50">
      <TopBar title={getTitleByPath()} backLink={getBackButtonConfig()} />
      <main
        className={`${isChatPage ? '' : 'pt-14 pb-16'} min-h-[calc(100vh-120px)]`}
      >
        <div className="h-full">{children}</div>
      </main>
      <BottomNavBar active={getActiveMenu()} />
    </div>
  );
};

function App() {
  const init = useAuthStore((s) => s.init);
  useEffect(() => {
    init();
  }, [init]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <LoginPage />
            </Layout>
          }
        />
        <Route
          path="/profile-setup"
          element={
            <Layout>
              <ProfileSetupPage />
            </Layout>
          }
        />
        <Route path="/oauth-redirect" element={<OAuthRedirectPage />} />
        <Route
          path="/spec-input"
          element={
            <Layout>
              <SpecInputPage />
            </Layout>
          }
        />
        <Route
          path="/rank"
          element={
            <Layout>
              <RankingPage />
            </Layout>
          }
        />
        <Route
          path="/ranking-results"
          element={
            <Layout>
              <RankingResultPage />
            </Layout>
          }
        />
        <Route
          path="/chatrooms"
          element={
            <Layout>
              <ChatroomsPage />
            </Layout>
          }
        />
        <Route
          path="/chat"
          element={
            <Layout>
              <ChatsPage />
            </Layout>
          }
        />
        <Route
          path="/social"
          element={
            <Layout>
              <SocialPage />
            </Layout>
          }
        />
        <Route
          path="/social/:specId"
          element={
            <Layout>
              <SocialPage />
            </Layout>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <Layout>
              <ProfileEditPage />
            </Layout>
          }
        />
        <Route
          path="/bookmark"
          element={
            <Layout>
              <BookmarkPage />
            </Layout>
          }
        />
        <Route
          path="/my"
          element={
            <ProtectedRoute>
              <Layout>
                <MyPage />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
