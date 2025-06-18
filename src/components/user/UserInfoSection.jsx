import React, { useEffect, useState } from 'react';
import { Brain } from 'lucide-react';
import HomeProfileCard from './profile/HomeProfileCard';
import SpecBars from '../spec-analysis/SpecBars';
import AIInsights from '../spec-analysis/AIInsights';

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

  // 스펙이 없거나 로그인하지 않은 경우 기본 프로필 카드만 표시
  if (!isLoggedIn || !hasSpec || categoryScores.length === 0) {
    return (
      <HomeProfileCard
        userData={userData}
        isLoggedIn={isLoggedIn}
        hasSpec={hasSpec}
      />
    );
  }

  // 로그인하고 스펙이 있는 경우 AI 분석 포함
  return (
    <div className="w-full mb-4 bg-white border border-gray-100 shadow-sm rounded-2xl">
      <div className="p-4">
        <HomeProfileCard
          userData={userData}
          isLoggedIn={isLoggedIn}
          hasSpec={hasSpec}
        />
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
