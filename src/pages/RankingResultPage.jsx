import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { SpecAPI, UserAPI } from '../api';
import RankingItem from '../components/ranking/RankingItem';

// 로딩 인디케이터 컴포넌트
const LoadingIndicator = () => (
  <div className="flex items-center justify-center py-4">
    <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
  </div>
);

// 중복 결과 제거 함수
const removeDuplicateResults = (results) => {
  const uniqueMap = new Map();

  // userId를 키로 사용하여 중복 제거
  results.forEach((result) => {
    uniqueMap.set(result.userId, result);
  });

  return Array.from(uniqueMap.values());
};

// 검색 결과 페이지 컴포넌트
const RankingResultPage = () => {
  // URL 쿼리 파라미터에서 검색어 추출
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get('keyword') || '';

  // 상태 관리
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);

  // 참조용 변수들
  const observer = useRef();

  // 추가 검색 결과 로드 (무한 스크롤)
  const fetchMoreResults = useCallback(async () => {
    if (!hasMore || loading || !nextCursor) return;

    setLoading(true);

    try {
      console.log('추가 검색 결과 요청 중...', {
        type: 'search',
        'nickname-keyword': keyword,
        cursor: nextCursor,
        limit: 10,
      });

      const response = await SpecAPI.getSearch({
        type: 'search',
        'nickname-keyword': keyword,
        cursor: nextCursor,
        limit: 10,
      });

      console.log('추가 검색 결과 API 응답:', response.data);

      if (response.data.isSuccess) {
        if (response.data.data && response.data.data.results) {
          // 새로 받은 데이터에 사용자 정보 추가
          const newResultsWithUserInfo = await Promise.all(
            response.data.data.results.map(async (item) => {
              try {
                const userResponse = await UserAPI.getUserInfo(item.userId);
                if (userResponse.data.isSuccess) {
                  return {
                    ...item,
                    isOpenSpec: userResponse.data.data.user.isOpenSpec,
                  };
                }
                return item;
              } catch (error) {
                console.error('사용자 정보 조회 실패:', error);
                return item;
              }
            })
          );

          // 기존 데이터와 새 데이터 모두 포함하여 중복 제거
          setSearchResults((prev) => {
            const combinedResults = [...prev, ...newResultsWithUserInfo];
            return removeDuplicateResults(combinedResults);
          });

          setHasMore(response.data.data.hasNext);
          setNextCursor(response.data.data.nextCursor);
        } else {
          setHasMore(false);
        }
      } else {
        console.error('추가 검색 결과 로드 실패:', response.data.message);
      }
    } catch (err) {
      console.error('추가 검색 결과 로드 중 오류 발생:', err);
      setError('추가 검색 결과를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, keyword, nextCursor]);

  // 마지막 요소 참조 콜백 (Intersection Observer API를 활용한 무한 스크롤 구현)
  const lastResultElementRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && nextCursor) {
          // 화면에 마지막 요소가 보이고, 더 불러올 데이터가 있으면 추가 데이터 로드
          fetchMoreResults();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, nextCursor, fetchMoreResults]
  );

  const handleBookmarkChange = useCallback((specId, isBookmarked) => {
    // 전역 스토어에서 상태가 자동으로 업데이트되므로 추가 작업 불필요
  }, []);

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    // 검색 결과 초기 로드
    const fetchSearchResults = async (keyword) => {
      if (!keyword || keyword.trim() === '') {
        setSearchResults([]);
        setError('검색어를 입력해주세요.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('검색 결과 요청 중...', {
          type: 'search',
          'nickname-keyword': keyword,
          limit: 10,
        });

        const response = await SpecAPI.getSearch({
          type: 'search',
          'nickname-keyword': keyword,
          limit: 10,
        });

        console.log('검색 결과 API 응답:', response.data);

        if (response.data.isSuccess) {
          if (response.data.data && response.data.data.results) {
            // 각 검색 결과에 대해 사용자 정보를 조회하여 isOpenSpec 정보 추가
            const resultsWithUserInfo = await Promise.all(
              response.data.data.results.map(async (item) => {
                try {
                  const userResponse = await UserAPI.getUserInfo(item.userId);
                  if (userResponse.data.isSuccess) {
                    return {
                      ...item,
                      isOpenSpec: userResponse.data.data.user.isOpenSpec,
                    };
                  }
                  return item;
                } catch (error) {
                  console.error('사용자 정보 조회 실패:', error);
                  return item;
                }
              })
            );

            // 중복 제거를 위해 Map 사용 (userId를 키로 사용)
            const uniqueResults = removeDuplicateResults(resultsWithUserInfo);

            setSearchResults(uniqueResults);
            setHasMore(response.data.data.hasNext);
            setNextCursor(response.data.data.nextCursor);
          } else {
            setSearchResults([]);
            setHasMore(false);
          }
        } else {
          setError(response.data.message || '검색 중 오류가 발생했습니다.');
        }
      } catch (err) {
        console.error('검색 결과 로드 중 오류 발생:', err);
        setError('검색 결과를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (keyword) {
      // 검색어가 변경될 때마다 상태 초기화
      setSearchResults([]);
      setHasMore(true);
      setNextCursor(null);
      fetchSearchResults(keyword);
    }
  }, [keyword]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      <div className="relative flex flex-col flex-1 w-full max-w-md pb-16 mx-auto bg-white">
        <div className="flex-1 p-4 pb-20 overflow-y-auto">
          {/* 검색 키워드 */}
          <div className="mb-4">
            <h2 className="text-lg font-medium">
              <span className="text-blue-600">"{keyword}"</span> 검색 결과
            </h2>
          </div>

          {/* 검색 결과 리스트 */}
          {error ? (
            <div className="p-4 text-red-800 bg-red-100 rounded-lg">
              <p>{error}</p>
            </div>
          ) : (
            <>
              {searchResults.length === 0 && !loading ? (
                <div className="p-8 text-center text-gray-500">
                  <p>검색 결과가 없습니다.</p>
                  <p className="mt-2 text-sm">
                    다른 검색어로 다시 시도해보세요.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((result, index) => (
                    <div
                      key={`${result.userId}_${index}`}
                      ref={
                        index === searchResults.length - 1
                          ? lastResultElementRef
                          : null
                      }
                    >
                      <RankingItem
                        userId={result.userId}
                        specId={result.specId}
                        nickname={result.nickname}
                        profileImageUrl={result.profileImageUrl}
                        isOpenSpec={result.isOpenSpec}
                        totalRank={result.totalRank}
                        totalUsersCount={result.totalUsersCount}
                        rankByJobField={result.rankByJobField}
                        usersCountByJobField={result.totalUsersCountByJobField}
                        score={result.score}
                        jobField={result.jobField}
                        commentsCount={result.commentsCount}
                        bookmarksCount={result.bookmarksCount}
                        onBookmarkChange={handleBookmarkChange}
                        selectedFilter={result.selectedFilter}
                      />
                    </div>
                  ))}
                  {loading && <LoadingIndicator />}
                  {!hasMore && searchResults.length > 0 && (
                    <div className="py-4 text-sm text-center text-gray-500">
                      모든 검색 결과를 불러왔습니다.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RankingResultPage;
