import React from 'react';
import NoSpecCard from './NoSpecCard';
import ProfileCard from './ProfileCard';

const SocialProfileCard = ({
  userData,
  hasSpec = false,
  showButtons,
  onDMClick,
  onFavoriteClick,
  isFavorite,
}) => {
  // 스펙이 없는 경우
  if (!hasSpec) {
    return (
      <NoSpecCard
        profileImageUrl={userData.profileImageUrl}
        nickname={userData.nickname}
        showButtons={true}
        onDMClick={onDMClick}
        onFavoriteClick={onFavoriteClick}
        isFavorite={isFavorite}
        variant="social"
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
      totalRank={userData.totalRank}
      totalRankPercent={userData.totalRankPercent}
      jobFieldRank={userData.jobFieldRank}
      jobFieldRankPercent={userData.jobFieldRankPercent}
      totalUsers={userData.totalUsers}
      jobFieldUsers={userData.jobFieldUsers}
      showRanking={true}
      showButtons={showButtons}
      onDMClick={onDMClick}
      onFavoriteClick={onFavoriteClick}
      isFavorite={isFavorite}
    />
  );
};

export default SocialProfileCard;
