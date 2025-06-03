import { BriefcaseBusiness, Send, Star, Users } from 'lucide-react';
import React from 'react';

const ProfileCard = ({
  profileImageUrl,
  nickname,
  jobField,
  totalScore,
  joinDate,
  totalRank,
  totalRankPercent,
  jobFieldRank,
  jobFieldRankPercent,
  totalUsers,
  jobFieldUsers,
  showJoinDate = false,
  showRanking = false,
  showButtons = false,
  onDMClick,
  onFavoriteClick,
  isFavorite = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 max-w-sm">
      {/* 헤더 영역 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 flex items-center justify-center overflow-hidden">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={nickname}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{nickname}</h3>
            <div className="flex items-center space-x-2 mt-1">
              {jobField && (
                <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                  {jobField}
                </span>
              )}
              <div className="flex items-center space-x-2">
                <span className="text-blue-600 font-semibold text-sm">
                  · 총점 {totalScore}점
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 영역 (소셜페이지용) */}
        {showButtons && (
          <div className="flex space-x-2">
            <button
              onClick={onDMClick}
              className="text-blue-500 hover:text-blue-600"
            >
              <Send size={18} />
            </button>
            <button onClick={onFavoriteClick} className="p-2 text-yellow-500">
              <Star size={18} fill={`${isFavorite ? 'yellow-400' : 'none'}`} />
            </button>
          </div>
        )}
      </div>

      {/* 순위 정보 또는 가입일 */}
      {showRanking ? (
        <div className="bg-gray-50 p-3 rounded-lg font-semibold">
          <div className="flex justify-between items-center text-blue-600">
            <div className="flex items-center space-x-2">
              <BriefcaseBusiness />
              <span className="text-blue-600 text-sm">직무 내 순위</span>
            </div>
            <div className="text-right">
              <span>
                {jobFieldRank} / {jobFieldUsers}명
              </span>
              <div className="text-xs">상위 {jobFieldRankPercent}%</div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center space-x-2">
              <Users />
              <span className="text-gray-600 text-sm">전체 순위</span>
            </div>
            <div className="text-right">
              <span className="text-gray-600">
                {totalRank} / {totalUsers}명
              </span>
              <div className="text-xs text-gray-500">
                상위 {totalRankPercent}%
              </div>
            </div>
          </div>
        </div>
      ) : showJoinDate ? (
        <div className="border-t border-gray-100 pt-3 mt-3">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>가입일</span>
            <span>{joinDate}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProfileCard;
