import React, { useEffect, useState } from 'react';
import { Brain } from 'lucide-react';
import HomeProfileCard from './profile/HomeProfileCard';
import SpecBars from '../spec-analysis/SpecBars';
import AIInsights from '../spec-analysis/AIInsights';
import { PageLoadingIndicator } from '../common/LoadingIndicator';

const UserInfoSection = ({
  userData,
  isLoggedIn = false,
  hasSpec = false,
  categoryScores = [],
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [animatedScores, setAnimatedScores] = useState([0, 0, 0, 0, 0]);
  const [showBars, setShowBars] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  // 애니메이션 효과
  useEffect(() => {
    if (isLoggedIn && hasSpec && userData && categoryScores.length > 0) {
      setIsAnalyzing(true);
      setShowBars(true);
      setShowInsights(true);
      setAnimatedScores([0, 0, 0, 0, 0]);

      // 스펙 분석 애니메이션
      const animateScores = () => {
        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;

        for (let i = 0; i <= steps; i++) {
          setTimeout(() => {
            const progress = i / steps;
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setAnimatedScores(
              categoryScores.map((score) => Math.floor(score * easeOut))
            );

            if (i === steps) {
              setIsAnalyzing(false);
              // 막대 그래프 표시
              setTimeout(() => {
                setShowBars(true);
                setTimeout(() => setShowInsights(true), 800);
              }, 200);
            }
          }, i * stepDuration);
        }
      };

      const timer = setTimeout(animateScores, 100);
      return () => clearTimeout(timer);
    } else {
      // 스펙이 없거나 로그인하지 않은 경우 애니메이션 상태 초기화
      setShowBars(false);
      setShowInsights(false);
      setAnimatedScores([0, 0, 0, 0, 0]);
    }
  }, [isLoggedIn, hasSpec, userData, categoryScores]);

  // ✅ 로그인하지 않은 경우 바로 LoginPrompt로 빠지기
  if (!isLoggedIn) {
    return (
      <HomeProfileCard userData={userData} isLoggedIn={false} hasSpec={false} />
    );
  }

  // ✅ 로그인은 했지만 아직 userData를 못 받았거나 스펙 여부 판단 중이면 로딩 UI
  if (userData === null || hasSpec === null) {
    return (
      <div className="flex-1 p-4 pb-20">
        <div className="p-6 mb-4 bg-white rounded-lg shadow">
          <div className="flex items-center space-x-4 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
              <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ 로그인은 했지만 스펙이 없는 경우
  if (!hasSpec) {
    return (
      <HomeProfileCard userData={userData} isLoggedIn={true} hasSpec={false} />
    );
  }

  // ✅ 로그인 + 스펙 존재 + 분석점수 있음
  if (categoryScores.length === 0) {
    return (
      <div className="flex-1 p-4 pb-20">
        <div className="p-6 mb-4 bg-white rounded-lg shadow">
          <div className="flex items-center space-x-4 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
              <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ 최종 분석 화면
  return (
    <div className="w-full mb-4 bg-white border border-gray-100 shadow-sm rounded-2xl">
      <div className="p-4">
        <HomeProfileCard userData={userData} isLoggedIn={true} hasSpec={true} />
      </div>

      <div className="p-5 border-t border-gray-200">
        <SpecBars
          animatedScores={animatedScores}
          aiTitle="AI 기반 스펙 분석"
          aiIcon={<Brain size={15} className="text-white" />}
        />

        {showInsights && (
          <div className="pt-4 mt-6 border-t border-gray-200">
            <AIInsights assessment={userData?.assessment} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfoSection;
