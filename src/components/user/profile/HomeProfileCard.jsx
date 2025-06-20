import React from 'react';
import LoginPrompt from './LoginPrompt';
import SpecInputPrompt from './SpecInputPrompt';
import ProfileCard from './ProfileCard';

const HomeProfileCard = ({ userData, isLoggedIn = false, hasSpec = false }) => {
  let content;

  // 로그인하지 않은 경우
  if (!isLoggedIn) {
    content = <LoginPrompt />;
  } else if (!hasSpec) {
    content = <SpecInputPrompt userData={userData} />;
  } else if (!userData) {
    content = (
      <div className="max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center space-x-3 animate-pulse">
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
            <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  } else {
    content = (
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
  }

  return <>{content}</>;
};

export default HomeProfileCard;
