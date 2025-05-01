import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import SpecInputPage from './pages/SpecInputPage';
import MainPage from './pages/MainPage';
import MyPage from './pages/MyPage';
import RankingPage from './pages/RankingPage';
import RankingResultPage from './pages/RankingResultPage';
import DmPage from './pages/DmPage';
import SocialPage from './pages/SocialPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/spec-input" element={<SpecInputPage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/rank" element={<RankingPage />} />
        <Route path="/ranking-results" element={<RankingResultPage />} />
        <Route path="/dm" element={<DmPage />} />
        <Route path="/social" element={<SocialPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;