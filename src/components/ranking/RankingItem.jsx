import React, { useMemo, useState } from 'react';
import { Award, MessageSquare, Star, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { useBookmarkStore } from '../../stores/useBookmarkStore';
import useToast from '../../hooks/useToast';
import { ButtonLoadingIndicator } from '../common/LoadingIndicator';
import ToastContainer from '../common/ToastContainer';

const RankingItem = React.memo(
  ({
    userId,
    specId,
    nickname,
    profileImageUrl,
    isOpenSpec,
    totalRank,
    totalUsersCount,
    rankByJobField,
    usersCountByJobField,
    score,
    jobField,
    commentsCount = 0,
    bookmarksCount = 0,
    onBookmarkChange,
    selectedFilter = '전체',
  }) => {
    const navigate = useNavigate();
    const { showToast, toasts, removeToast } = useToast();
    const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
    const { isLoggedIn, user: currentUser } = useAuthStore();
    const {
      isBookmarked,
      toggleBookmark,
      loading: bookmarkStoreLoading,
    } = useBookmarkStore();

    const shouldShowBookmarkButton = useMemo(() => {
      if (!isLoggedIn) return false;
      if (!currentUser) return false;
      if (!userId) return false;
      if (currentUser.id === userId) return false;

      return true;
    }, [isLoggedIn, currentUser, userId]);

    // 전역 스토어에서 즐겨찾기 상태 가져오기
    const bookmarked = isBookmarked(parseInt(specId));

    const rankingInfo = useMemo(() => {
      const isGlobalFilter = selectedFilter === '전체';
      const currentRank = isGlobalFilter ? totalRank : rankByJobField;
      const currentTotalUsers = isGlobalFilter
        ? totalUsersCount
        : usersCountByJobField;
      const percentage = ((currentRank / currentTotalUsers) * 100).toFixed(2);
      const formattedPercentage = isNaN(Number(percentage))
        ? '-'
        : Number(percentage).toFixed(2);

      return {
        rank: currentRank,
        totalUsers: currentTotalUsers,
        percentage: formattedPercentage,
        isGlobal: isGlobalFilter,
        percentageText: isGlobalFilter
          ? `전체 상위 ${formattedPercentage}%`
          : `직무 내 상위 ${formattedPercentage}%`,
      };
    }, [
      selectedFilter,
      totalRank,
      totalUsersCount,
      rankByJobField,
      usersCountByJobField,
    ]);

    const getMedalColor = (rank) => {
      switch (rank) {
        case 1:
          return '#EDBA3C';
        case 2:
          return '#C0C0C0';
        case 3:
          return '#CD7F32';
        default:
          return 'transparent';
      }
    };

    const Medal = ({ rank }) => {
      if (rank > 3)
        return <div className="w-6 font-semibold text-center">{rank}</div>;

      return (
        <div className="flex items-center justify-center">
          <Award size={28} color={getMedalColor(rank)} />
        </div>
      );
    };

    const formattedScore = score.toFixed(1);
    const formattedJobField = jobField?.replace(/_/g, '·') || '';

    const handleDetailClick = () => {
      if (!isLoggedIn) {
        showToast('로그인 후 세부 스펙을 확인해보세요!', 'info');
        return;
      }

      if (!specId || !userId) {
        showToast('스펙 정보를 찾을 수 없습니다.', 'error');
        return;
      }

      // 본인의 스펙인 경우 바로 이동
      if (currentUser && currentUser.id === userId) {
        navigate('/social');
        return;
      }

      navigate(`/social/${specId}?userId=${userId}`);
    };

    const handleBookmarkClick = async (e) => {
      e.stopPropagation();

      if (!specId) {
        showToast('스펙 정보를 찾을 수 없습니다.', 'error');
        return;
      }

      if (isBookmarkLoading || bookmarkStoreLoading) {
        return;
      }

      try {
        setIsBookmarkLoading(true);

        const result = await toggleBookmark(parseInt(specId));

        if (result.success) {
          const newBookmarkedState = !bookmarked;
          showToast(
            newBookmarkedState
              ? '즐겨찾기가 등록되었습니다.'
              : '즐겨찾기가 해제되었습니다.',
            'success'
          );

          // 부모 컴포넌트에 상태 변경 알림
          onBookmarkChange?.(specId, newBookmarkedState, result.bookmarkId);
        } else {
          showToast(result.message || '즐겨찾기 처리에 실패했습니다.', 'error');
        }
      } catch (error) {
        console.error('즐겨찾기 처리 중 오류: ', error);

        if (error.response?.status === 401)
          showToast('로그인이 필요한 기능입니다.', 'error');
        else if (error.response?.status === 404)
          showToast('해당 스펙을 찾을 수 없습니다.', 'error');
        else showToast('즐겨찾기 처리 중 오류가 발생했습니다.', 'error');
      } finally {
        setIsBookmarkLoading(false);
      }
    };

    return (
      <div className="p-4 my-1 bg-white rounded-lg shadow-sm">
        <div className="flex items-center mb-2">
          <div className="flex items-center justify-center min-w-[40px] mr-3">
            <Medal rank={rankingInfo.rank} />
          </div>

          <div className="mr-3">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={nickname}
                className="object-cover w-10 h-10"
              />
            ) : (
              <div className="flex items-center justify-center w-10 h-10 bg-red-100">
                <span className="font-bold text-red-500">
                  {nickname.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 mr-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">{nickname}</p>
              <span className="text-base font-bold text-blue-500">
                {formattedScore}점
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full whitespace-nowrap">
                {formattedJobField}
              </span>
              <span className="text-xs text-gray-500">
                {rankingInfo.percentageText}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pl-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center text-xs text-gray-500">
              <MessageSquare size={14} className="mr-1" />
              {commentsCount}
            </span>
            <span>·</span>
            <span className="flex items-center text-xs text-gray-500">
              <Star size={14} className="mr-1" />
              {bookmarksCount}
            </span>
            <button
              className="flex items-center justify-center p-1.5"
              onClick={handleDetailClick}
              aria-label="상세보기"
            >
              <span className="text-sm">상세보기</span>
              <ChevronRight size={18} className="text-gray-600" />
            </button>
          </div>

          <div className="flex items-center">
            {shouldShowBookmarkButton && (
              <button
                onClick={handleBookmarkClick}
                disabled={isBookmarkLoading || bookmarkStoreLoading}
                className={`p-1.5 relative ${isBookmarkLoading || bookmarkStoreLoading ? 'opacity-75' : ''}`}
                aria-label="즐겨찾기"
              >
                {isBookmarkLoading || bookmarkStoreLoading ? (
                  <div className="flex items-center justify-center w-5 h-5">
                    <ButtonLoadingIndicator />
                  </div>
                ) : (
                  <Star
                    size={20}
                    className={
                      bookmarked
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-yellow-400'
                    }
                  />
                )}
              </button>
            )}
          </div>
        </div>

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    );
  }
);

export default RankingItem;
