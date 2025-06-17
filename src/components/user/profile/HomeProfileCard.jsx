import React from 'react';
import LoginPrompt from './LoginPrompt';
import SpecInputPrompt from './SpecInputPrompt';
import ProfileCard from './ProfileCard';

const HomeProfileCard = ({ userData, isLoggedIn = false, hasSpec = false }) => {
  // 로그인하지 않은 경우
  if (!isLoggedIn) {
    return <LoginPrompt />;
  }

  // 로그인했지만 스펙이 없는 경우
  if (!hasSpec) {
    return <SpecInputPrompt userData={userData} />;
  }

  if (!userData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 max-w-sm">
        <div className="animate-pulse flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // 로그인하고 스펙이 있는 경우
  return (
    <ProfileCard
      profileImageUrl={userData.profileImageUrl}
      nickname={userData.nickname}
      jobField={userData.jobField}
      totalScore={userData.totalScore}
      totalRank={userData.totalRank}
      totalRankPercent={userData.totalRankPercent}
      jobFieldRank={userData.jobFieldRank}
      jobFieldRankPercent={userData.jobFieldRankPercent}
      totalUsers={userData.totalUsers}
      jobFieldUsers={userData.jobFieldUsers}
      showRanking={true}
    />
  );
};

export default HomeProfileCard;
