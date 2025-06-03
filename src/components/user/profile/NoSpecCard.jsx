import { Send, Star } from 'lucide-react';
import React from 'react';

const NoSpecCard = ({
  profileImageUrl,
  nickname,
  joinDate,
  showJoinDate = false,
  showButtons = false,
  onDMClick,
  onFavoriteClick,
  isFavorite = false,
  variant = 'default',
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
            {variant === 'mypage' && (
              <p className="text-gray-500 text-sm mt-1">
                아직 스펙이 없습니다.
              </p>
            )}
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

      {/* 스펙 없음 메시지 */}
      {variant === 'social' && (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">아직 스펙이 없습니다.</p>
        </div>
      )}

      {/* 가입일 (마이페이지용) */}
      {showJoinDate && (
        <div className="border-t border-gray-100 pt-3 mt-3">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>가입일</span>
            <span>{joinDate}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoSpecCard;
