import { BriefcaseBusiness, Send, Star, Users } from 'lucide-react';
import React, { useState } from 'react';
import useToast from '../../../hooks/useToast';
import { ButtonLoadingIndicator } from '../../common/LoadingIndicator';
import { BookmarkAPI } from '../../../api';

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
  specId,
}) => {
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const { showToast } = useToast();

  const handleFavoriteClick = async () => {
    if (!specId) {
      showToast('스펙 정보를 찾을 수 없습니다.', 'error');
      return;
    }

    if (isBookmarkLoading) return;

    try {
      setIsBookmarkLoading(true);

      if (isFavorite) {
        const response = await BookmarkAPI.removeBookmark(specId);
        if (response.status === 204 || response.data?.isSuccess) {
          showToast('즐겨찾기가 해제되었습니다.', 'success');
          onFavoriteClick?.(specId, false, null);
        } else {
          showToast(
            response.data.message || '즐겨찾기 해제에 실패했습니다.',
            'error'
          );
        }
      } else {
        const response = await BookmarkAPI.addBookmark(specId);
        if (response.data?.isSuccess) {
          const newBookmarkId = response.data.data?.bookmarkId;
          showToast('즐겨찾기가 등록되었습니다.', 'success');
          onFavoriteClick?.(specId, true, newBookmarkId);
        } else {
          showToast(
            response.data.message || '즐겨찾기 등록에 실패했습니다.',
            'error'
          );
        }
      }
    } catch (error) {
      console.error('즐겨찾기 처리 중 오류: ', error);

      if (error.response?.status === 401) {
        showToast('로그인이 필요한 기능입니다.', 'error');
      } else if (error.response?.status === 404) {
        showToast('해당 스펙을 찾을 수 없습니다.', 'error');
      } else {
        showToast('즐겨찾기 처리 중 오류가 발생했습니다.', 'error');
      }
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  return (
    <div className="max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* 헤더 영역 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 overflow-hidden bg-gray-200">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={nickname}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{nickname}</h3>
            <div className="flex items-center mt-1 space-x-2">
              {jobField && (
                <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                  {jobField}
                </span>
              )}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-blue-600">
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
            <button
              onClick={handleFavoriteClick}
              disabled={isBookmarkLoading}
              className={`p-2 text-yellow-500 ${isBookmarkLoading ? 'opacity-75' : ''}`}
            >
              {isBookmarkLoading ? (
                <div className="flex items-center justify-center w-[18px] h-[18px]">
                  <ButtonLoadingIndicator />
                </div>
              ) : (
                <Star
                  size={18}
                  className={
                    isFavorite
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-yellow-400'
                  }
                />
              )}
            </button>
          </div>
        )}
      </div>

      {/* 순위 정보 또는 가입일 */}
      {showRanking ? (
        <div className="p-3 font-semibold rounded-lg bg-gray-50">
          <div className="flex items-center justify-between pb-2 text-blue-600">
            <div className="flex items-center space-x-2">
              <BriefcaseBusiness />
              <span className="text-sm text-blue-600">직무 내 순위</span>
            </div>
            <div className="text-right">
              <span>
                {jobFieldRank} / {jobFieldUsers}명
              </span>
              <div className="mt-1 text-xs">상위 {jobFieldRankPercent}%</div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <Users />
              <span className="text-sm text-gray-600">전체 순위</span>
            </div>
            <div className="text-right">
              <span className="text-gray-600">
                {totalRank} / {totalUsers}명
              </span>
              <div className="mt-1 text-xs text-gray-500">
                상위 {totalRankPercent}%
              </div>
            </div>
          </div>
        </div>
      ) : showJoinDate ? (
        <div className="pt-3 mt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>가입일</span>
            <span>{joinDate}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProfileCard;
