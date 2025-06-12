import React, { useState, useCallback } from 'react';
import { TriangleAlert } from 'lucide-react';
import RankingItem from '../components/ranking/RankingItem';
import { PageLoadingIndicator } from '../components/common/LoadingIndicator';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { useAuthStore } from '../stores/useAuthStore';
import { BookmarkAPI } from '../api';
import ToastContainer from '../components/common/ToastContainer';
import useToast from '../hooks/useToast';

const BookmarkPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [nextCursor, setNextCursor] = useState(0);
  const { isLoggedIn } = useAuthStore();
  const { toasts, showToast, removeToast } = useToast();

  const loadBookmarks = useCallback(
    async (cursor = null, isInitial = false) => {
      if (loading) return;

      setLoading(true);

      try {
        const response = await BookmarkAPI.getBookmarks({ cursor, limit: 10 });

        if (response.data.isSuccess) {
          const {
            bookmarks: bookmarkData,
            hasNext: responseHasNext,
            nextCursor: responseNextCursor,
          } = response.data.data;

          const transformedBookmarks = bookmarkData.map((bookmark) => ({
            bookmarkId: bookmark.id,
            userId: bookmark.spec.userId || null,
            specId: bookmark.spec.id,
            nickname: bookmark.spec.nickname,
            profileImageUrl: bookmark.spec.profileImageUrl,
            totalRank: bookmark.spec.totalRank,
            totalUsersCount: bookmark.spec.totalUserCount,
            rankByJobField: bookmark.spec.jobFieldRank,
            usersCountByJobField: bookmark.spec.jobFieldUserCount,
            score: bookmark.spec.score,
            jobField: bookmark.spec.jobField,
            isBookmarked: bookmark.spec.isBookmarked,
            commentsCount: bookmark.spec.commentsCount,
            bookmarksCount: bookmark.spec.bookmarksCount,
          }));

          if (isInitial) {
            setBookmarks(transformedBookmarks);
            setInitialized(true);
          } else {
            setBookmarks((prev) => [...prev, ...transformedBookmarks]);
          }

          setHasNext(responseHasNext);
          setNextCursor(responseNextCursor);
          setError(null);
        } else {
          throw new Error(
            response.data.message || '즐겨찾기 목록 조회에 실패했습니다.'
          );
        }
      } catch (error) {
        console.error('즐겨찾기 로드 중 오류:', error);
        const errorMessage =
          error.response?.data?.message ||
          '즐겨찾기 목록을 불러오는데 실패했습니다.';
        setError(errorMessage);

        if (isInitial) {
          setInitialized(true);
        }
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  const handleLoadMore = useCallback(() => {
    if (nextCursor && hasNext) {
      loadBookmarks(nextCursor);
      console.log('추가 즐겨찾기 데이터 로딩 완료');
    }
  }, [nextCursor, hasNext, loadBookmarks]);

  const lastElementRef = useInfiniteScroll(loading, hasNext, handleLoadMore);

  const handleBookmarkChange = useCallback(
    (specId, isBookmarked, bookmarkId) => {
      if (!isBookmarked) {
        setBookmarks((prev) => prev.filter((item) => item.specId !== specId));
        showToast('즐겨찾기가 해제되었습니다.', 'success');
      } else {
        setBookmarks((prev) =>
          prev.map((item) =>
            item.specId === specId
              ? { ...item, isBookmarked, bookmarkId }
              : item
          )
        );
      }
    },
    [showToast]
  );

  const handleRetry = useCallback(() => {
    setError(null);
    setBookmarks([]);
    setHasNext(true);
    setNextCursor(null);
    setInitialized(false);
    loadBookmarks(null, true);
  }, [loadBookmarks]);

  React.useEffect(() => {
    if (!initialized && isLoggedIn) {
      loadBookmarks(null, true);
    }
  }, [initialized, isLoggedIn, loadBookmarks]);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-8">
        <div className="mb-4 text-gray-400">
          <TriangleAlert size={20} />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-700">
          로그인이 필요합니다
        </h3>
        <p className="mb-4 text-gray-500">
          즐겨찾기 목록을 확인하려면 로그인해주세요.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            내가 즐겨찾기한 스펙 목록
          </h2>
          <p className="text-sm text-gray-600">
            관심있는 스펙들을 확인해보세요.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 text-gray-500">
            <TriangleAlert size={20} />
          </div>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800">
          내가 즐겨찾기한 스펙 목록
        </h2>
        <p className="text-sm text-gray-600">관심있는 스펙들을 확인해보세요.</p>
      </div>

      {!loading && bookmarks.length === 0 && initialized ? (
        <div className="flex flex-col items-center justify-center py-20">
          <h3 className="mb-2 text-lg font-semibold text-gray-700">
            즐겨찾기한 스펙이 없습니다
          </h3>
          <p className="text-gray-500">
            관심있는 스펙에 즐겨찾기를 추가해보세요.
          </p>
        </div>
      ) : (
        <>
          {/* 초기 로딩 */}
          {loading && bookmarks.length === 0 && (
            <div className="py-20">
              <PageLoadingIndicator />
            </div>
          )}

          {/* 즐겨찾기 목록 */}
          <div className="space-y-3">
            {bookmarks.map((bookmark, index) => (
              <div
                key={`${bookmark.userId}-${bookmark.specId}`}
                ref={index === bookmarks.length - 1 ? lastElementRef : null}
              >
                <RankingItem
                  userId={bookmark.userId}
                  specId={bookmark.specId}
                  nickname={bookmark.nickname}
                  profileImageUrl={bookmark.profileImageUrl}
                  totalRank={bookmark.totalRank}
                  totalUsersCount={bookmark.totalUsersCount}
                  rankByJobField={bookmark.rankByJobField}
                  usersCountByJobField={bookmark.usersCountByJobField}
                  score={bookmark.score}
                  jobField={bookmark.jobField}
                  isBookmarked={bookmark.isBookmarked}
                  commentsCount={bookmark.commentsCount}
                  bookmarksCount={bookmark.bookmarksCount}
                  selectedFilter="전체"
                  onBookmarkChange={handleBookmarkChange}
                />
              </div>
            ))}

            {/* 추가 로딩 */}
            {loading && bookmarks.length > 0 && (
              <div className="py-4">
                <PageLoadingIndicator />
              </div>
            )}

            {!hasNext && bookmarks.length > 0 && (
              <div className="py-4 text-sm text-center text-gray-500">
                모든 즐겨찾기를 불러왔습니다.
              </div>
            )}
          </div>
        </>
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default BookmarkPage;
