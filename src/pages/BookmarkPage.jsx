import React, { useState, useCallback } from 'react';
import { TriangleAlert } from 'lucide-react';
import RankingItem from '../components/ranking/RankingItem';
import { PageLoadingIndicator } from '../components/common/LoadingIndicator';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { useAuthStore } from '../stores/useAuthStore';
import { getBookmarkPageData } from '../mocks/data/bookmarkData';

const BookmarkPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [nextCursor, setNextCursor] = useState(0);
  const { isLoggedIn } = useAuthStore();

  const loadBookmarks = useCallback(
    async (cursor = 0, isInitial = false) => {
      if (loading) return;

      setLoading(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const response = getBookmarkPageData(cursor, 10);
        const {
          data,
          hasNext: responseHasNext,
          nextCursor: responseNextCursor,
        } = response;

        if (isInitial) {
          setBookmarks(data);
          setInitialized(true);
        } else {
          setBookmarks((prev) => [...prev, ...data]);
        }

        setHasNext(responseHasNext);
        setNextCursor(responseNextCursor);
      } catch (error) {
        console.error('즐겨찾기 로드 중 오류:', error);
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  const handleLoadMore = useCallback(() => {
    if (nextCursor !== null) {
      loadBookmarks(nextCursor);
      console.log('추가 즐겨찾기 데이터 로딩 완료');
    }
  }, [nextCursor, loadBookmarks]);

  const lastElementRef = useInfiniteScroll(loading, hasNext, handleLoadMore);

  const handleBookmarkChange = useCallback(
    (specId, isBookmarked, bookmarkId) => {
      if (!isBookmarked) {
        setBookmarks((prev) => prev.filter((item) => item.specId !== specId));
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
    []
  );

  React.useEffect(() => {
    if (!initialized) {
      loadBookmarks(0, true);
    }
  }, [initialized, loadBookmarks]);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-8">
        <div size={20} className="mb-4 text-gray-400">
          <TriangleAlert />
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

  //   if (error) {
  //     return (
  //       <div className="p-4">
  //         <div className="mb-4">
  //           <h2 className="text-lg font-bold text-gray-800">
  //             내가 즐겨찾기한 스펙 목록
  //           </h2>
  //           <p className="text-sm text-gray-600">
  //             관심있는 스펙들을 확인해보세요.
  //           </p>
  //         </div>
  //         <div className="flex flex-col items-center justify-center py-20">
  //           <div size={20} className="mb-4 text-gray-500">
  //             <TriangleAlert />
  //           </div>
  //           <p className="mb-4 text-gray-600">{error}</p>
  //           <button
  //             onClick={handleRetry}
  //             className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
  //           >
  //             다시 시도
  //           </button>
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800">
          내가 즐겨찾기한 스펙 목록
        </h2>
        <p className="text-sm text-gray-600">관심있는 스펙들을 확인해보세요.</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <h3 className="mb-2 text-lg font-semibold text-gray-700">
            즐겨찾기한 스펙이 없습니다
          </h3>
          <p className="text-gray-500">
            관심있는 스펙에 즐겨찾기를 추가해보세요.
          </p>
        </div>
      ) : (
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
                bookmarkId={bookmark.bookmarkId}
                commentsCount={bookmark.commentsCount}
                bookmarksCount={bookmark.bookmarksCount}
                selectedFilter="전체"
                onBookmarkChange={handleBookmarkChange}
              />
            </div>
          ))}

          {loading && (
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
      )}
    </div>
  );
};

export default BookmarkPage;
