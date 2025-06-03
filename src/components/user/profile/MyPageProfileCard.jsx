import React from 'react';
import NoSpecCard from './NoSpecCard';
import ProfileCard from './ProfileCard';

const MyPageProfileCard = ({ userData, hasSpec = false }) => {
  // 스펙이 없는 경우
  if (!hasSpec) {
    return (
      <NoSpecCard
        profileImageUrl={userData.profileImageUrl}
        nickname={userData.nickname}
        joinDate={userData.joinDate}
        showJoinDate={true}
        variant="mypage"
      />
    );
  }

  // 스펙이 있는 경우
  return (
    <ProfileCard
      profileImageUrl={userData.profileImageUrl}
      nickname={userData.nickname}
      jobField={userData.jobField}
      totalScore={userData.totalScore}
      joinDate={userData.joinDate}
      showJoinDate={true}
    />
  );
};

export default MyPageProfileCard;
