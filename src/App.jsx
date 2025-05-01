import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SpecInputPage from './pages/SpecInputPage';
import RankingPage from './pages/RankingPage';
// 다른 import문...

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/spec-input" element={<SpecInputPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        {/* 다른 라우트들... */}
      </Routes>
    </Router>
  );
}

export default App; 