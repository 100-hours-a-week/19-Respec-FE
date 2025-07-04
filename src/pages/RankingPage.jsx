import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpecAPI, UserAPI } from '../api';
import RankingFilters from '../components/ranking/RankingFilters';
import RankingItem from '../components/ranking/RankingItem';

// 로딩 인디케이터 컴포넌트
const LoadingIndicator = () => (
  <div className="flex items-center justify-center py-4">
    <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
  </div>
);

// 메인 랭킹 페이지 컴포넌트
const RankingPage = () => {
  // 상태 관리
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [metaData, setMetaData] = useState({
    totalUserCount: 0,
    averageScore: 0,
  });

  // 참조용 변수들
  const observer = useRef();
  const navigate = useNavigate();

  // 마지막 요소 참조 콜백 (Intersection Observer API를 활용한 무한 스크롤 구현)
  const lastRankingElementRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          // 화면에 마지막 요소가 보이고, 더 불러올 데이터가 있으면 추가 데이터 로드
          fetchMoreRankings();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // 랭킹 데이터 초기 로드
  const fetchRankings = async (jobField = '전체') => {
    setLoading(true);
    setError(null);

    try {
      console.log('랭킹 데이터 요청 중...', {
        type: 'ranking',
        jobField: jobField,
        limit: 10,
      });

      // 올바른 API 엔드포인트 및 파라미터로 요청
      const response = await SpecAPI.getRankings({
        type: 'ranking',
        jobField: jobField,
        limit: 10,
      });

      // console.log('API 응답:', response.data);

      if (response.data.isSuccess) {
        console.log('성공적으로 랭킹 데이터를 받았습니다');

        // API 응답 구조에 맞게 데이터 설정
        if (response.data.data && response.data.data.rankings) {
          console.log('랭킹 데이터 개수:', response.data.data.rankings.length);

          // 중복 제거를 위해 Map 사용 (userId를 키로 사용)
          const uniqueRankings = removeDuplicateRankings(
            response.data.data.rankings
          );
          console.log('중복 제거 후 랭킹 데이터 개수:', uniqueRankings.length);
          // console.log('랭킹 데이터 구조 샘플:', uniqueRankings[0]);

          // 각 랭킹 아이템에 대해 사용자 정보를 조회하여 isOpenSpec 정보 추가
          const rankingsWithUserInfo = await Promise.all(
            uniqueRankings.map(async (item) => {
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

          setRankings(rankingsWithUserInfo);
          setHasMore(response.data.data.hasNext);
          setNextCursor(response.data.data.nextCursor);
        } else {
          console.warn(
            '랭킹 데이터가 예상 구조와 다릅니다:',
            response.data.data
          );
          loadTestData(jobField);
        }
      } else {
        console.error('API 에러 응답:', response.data.message);
        setError(response.data.message);
        loadTestData(jobField);
      }

      // 메타 데이터 가져오기
      fetchMetaData(jobField);
    } catch (err) {
      console.error('랭킹 데이터 로드 중 오류 발생:', err);
      setError('랭킹 데이터를 불러오는 중 오류가 발생했습니다.');
      loadTestData(jobField);
    } finally {
      setLoading(false);
    }
  };

  // 메타 데이터 가져오기 (총 사용자 수, 평균 점수)
  const fetchMetaData = async (jobFieldName) => {
    try {
      const response = await SpecAPI.getMetaData({
        type: 'meta',
        jobField: jobFieldName,
      });

      if (response.data.isSuccess) {
        setMetaData({
          totalUserCount: response.data.data.totalUserCount || 0,
          averageScore: parseFloat(
            response.data.data.averageScore || 0
          ).toFixed(1),
        });
      }
    } catch (err) {
      console.error('메타 데이터 로드 중 오류 발생:', err);
      // 기본값 설정
      setMetaData({ totalUserCount: 0, averageScore: 0 });
    }
  };

  // 중복 랭킹 제거 함수
  const removeDuplicateRankings = (rankings) => {
    const uniqueMap = new Map();

    // userId를 키로 사용하여 중복 제거
    rankings.forEach((ranking) => {
      // API 응답 필드 매핑 (usersCountByJobField -> totalUsersCountByJobField)
      if (ranking.usersCountByJobField !== undefined) {
        ranking.totalUsersCountByJobField = ranking.usersCountByJobField;
      }
      uniqueMap.set(ranking.userId, ranking);
    });

    return Array.from(uniqueMap.values());
  };

  // 테스트 데이터 로드 (API 연결 전까지 임시로 사용)
  const loadTestData = (jobField) => {
    console.log('테스트 데이터를 로드합니다:', jobField);

    // 테스트 데이터
    const testData = [
      {
        userId: 1,
        nickname: 'jelly.song',
        profileImageUrl: 'https://picsum.photos/200',
        specId: 2,
        score: 89.5,
        totalRank: 1,
        totalUsersCount: 150,
        jobField: jobField,
        rankByJobField: 1,
        totalUsersCountByJobField: 50,
        commentsCount: 57,
        bookmarksCount: 243,
      },
      {
        userId: 2,
        nickname: 'user2',
        profileImageUrl: null,
        specId: 3,
        score: 85.2,
        totalRank: 2,
        totalUsersCount: 150,
        jobField: jobField,
        rankByJobField: 2,
        totalUsersCountByJobField: 50,
        commentsCount: 42,
        bookmarksCount: 120,
      },
      {
        userId: 3,
        nickname: 'user3',
        profileImageUrl: 'https://picsum.photos/201',
        specId: 4,
        score: 82.7,
        totalRank: 3,
        totalUsersCount: 150,
        jobField: jobField,
        rankByJobField: 3,
        totalUsersCountByJobField: 50,
        commentsCount: 35,
        bookmarksCount: 98,
      },
      {
        userId: 4,
        nickname: 'user4',
        profileImageUrl: null,
        specId: 5,
        score: 78.3,
        totalRank: 4,
        totalUsersCount: 150,
        jobField: jobField,
        rankByJobField: 4,
        totalUsersCountByJobField: 50,
        commentsCount: 28,
        bookmarksCount: 76,
      },
      {
        userId: 5,
        nickname: 'user5',
        profileImageUrl: 'https://picsum.photos/202',
        specId: 6,
        score: 75.9,
        totalRank: 5,
        totalUsersCount: 150,
        jobField: jobField,
        rankByJobField: 5,
        totalUsersCountByJobField: 50,
        commentsCount: 21,
        bookmarksCount: 65,
      },
    ];

    setRankings(testData);
    setHasMore(false);
    setNextCursor(null);
  };

  // 추가 랭킹 데이터 로드 (무한 스크롤)
  const fetchMoreRankings = async () => {
    if (!hasMore || loading) return;

    setLoading(true);

    try {
      console.log('추가 랭킹 데이터 요청 중...', {
        type: 'ranking',
        jobField: selectedFilter,
        cursor: nextCursor,
        limit: 10,
      });

      const response = await SpecAPI.getRankings({
        type: 'ranking',
        jobField: selectedFilter,
        cursor: nextCursor,
        limit: 10,
      });

      if (response.data.isSuccess) {
        console.log('추가 랭킹 데이터 로드 성공');

        if (response.data.data && response.data.data.rankings) {
          // 새로운 랭킹 데이터 가져오기
          const newRankings = response.data.data.rankings;

          // 각 새로운 랭킹 아이템에 대해 사용자 정보 조회
          const newRankingsWithUserInfo = await Promise.all(
            newRankings.map(async (item) => {
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

          // 중복 제거하며 rankings 상태 업데이트
          setRankings((prev) => {
            const combinedRankings = [...prev, ...newRankingsWithUserInfo];
            return removeDuplicateRankings(combinedRankings);
          });

          setHasMore(response.data.data.hasNext);
          setNextCursor(response.data.data.nextCursor);
        }
      } else {
        console.error('추가 랭킹 데이터 로드 실패:', response.data.message);
      }
    } catch (err) {
      console.error('추가 랭킹 데이터 로드 중 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  // 필터 변경 핸들러 - HomePage와 동일하게 단순화
  const handleFilterChange = useCallback((newFilter) => {
    console.log('필터 변경:', newFilter);
    setSelectedFilter(newFilter);
    setRankings([]);
    setHasMore(true);
    setNextCursor(null);
    fetchRankings(newFilter);
  }, []);

  // 검색어 강조 함수 (일치하는 부분을 파란색으로 표시)
  const highlightText = (text, query) => {
    if (!query || query.trim() === '') return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className="text-blue-500">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // 사용자 검색 입력 핸들러
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length >= 2) {
      try {
        // 올바른 검색 API 호출
        const response = await SpecAPI.getSearch({
          type: 'search',
          'nickname-keyword': value.trim(),
        });

        if (response.data.isSuccess) {
          // 검색 결과를 상태에 저장
          const results = response.data.data.results || [];

          // API 응답 필드 매핑 (usersCountByJobField -> totalUsersCountByJobField)
          results.forEach((user) => {
            if (user.usersCountByJobField !== undefined) {
              user.totalUsersCountByJobField = user.usersCountByJobField;
            }
          });

          setSearchResults(results);
          setShowSearchResults(true);
        } else {
          setSearchResults([]);
          setShowSearchResults(false);
        }
      } catch (err) {
        console.error('사용자 검색 중 오류:', err);
        setSearchResults([]);
        setShowSearchResults(false);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  // 검색 제출 핸들러
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (searchTerm.trim().length > 0) {
      // 검색 결과 페이지로 이동
      navigate(
        `/ranking-results?keyword=${encodeURIComponent(searchTerm.trim())}`
      );
    }
  };

  const handleBookmarkChange = useCallback((specId, isBookmarked) => {
    // 전역 스토어에서 상태가 자동으로 업데이트되므로 추가 작업 불필요
  }, []);

  // 초기 랭킹 데이터 로드
  useEffect(() => {
    // 실제 백엔드 API 호출
    fetchRankings(selectedFilter);
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      <div className="relative flex flex-col flex-1 w-full max-w-md pb-16 mx-auto bg-white">
        <div className="flex-1 p-4 pb-20 overflow-y-auto">
          {/* 검색 바 */}
          <div className="mb-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="사용자 검색..."
                maxLength={20}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute text-gray-500 transform -translate-y-1/2 right-3 top-1/2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {/* 검색 결과 드롭다운 */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg max-h-72">
                  {searchResults.map((user) => (
                    <div
                      key={user.userId}
                      className="flex items-center p-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="relative flex items-center justify-center flex-shrink-0 w-10 h-10 mr-3 text-sm font-bold text-white bg-blue-500 rounded-full">
                        {user.profileImageUrl ? (
                          <img
                            src={user.profileImageUrl}
                            alt={user.nickname}
                            className="object-cover w-full h-full rounded-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-gray-600 bg-gray-300">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        )}
                        <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-blue-600 rounded-full -top-1 -right-1">
                          {user.totalRank}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {highlightText(user.nickname, searchTerm)}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>
                            {highlightText(
                              user.jobField.replace(/_/g, ' '),
                              searchTerm
                            )}
                          </span>
                          <span className="mx-1">•</span>
                          <span>
                            점수:{' '}
                            <span className="font-semibold text-blue-600">
                              {user.score.toFixed(1)}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="ml-2 text-xs text-gray-500 whitespace-nowrap">
                        {user.rankByJobField}위/
                        {typeof user.totalUsersCountByJobField === 'number'
                          ? user.totalUsersCountByJobField
                          : '-'}
                        명
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          <RankingFilters
            selectedFilter={selectedFilter}
            setSelectedFilter={handleFilterChange}
          />

          {/* 메타 데이터 (총 사용자 수, 평균 점수) */}
          <div className="mb-2">
            <div className="flex rounded-lg bg-blue-50">
              <div className="flex-1 p-4 text-center">
                <div className="mb-1 text-sm text-gray-500">총 사용자</div>
                <div className="text-xl font-bold text-blue-600">
                  {metaData.totalUserCount}명
                </div>
              </div>
              <div className="w-4 bg-white"></div>
              <div className="flex-1 p-4 text-center">
                <div className="mb-1 text-sm text-gray-500">평균 점수</div>
                <div className="text-xl font-bold text-blue-600">
                  {metaData.averageScore}점
                </div>
              </div>
            </div>
          </div>

          {/* 랭킹 목록 */}
          {error ? (
            <div className="p-4 text-red-800 bg-red-100 rounded-lg">
              <p>{error}</p>
              <button
                className="mt-2 text-blue-500 underline"
                onClick={() => fetchRankings(selectedFilter)}
              >
                다시 시도
              </button>
            </div>
          ) : (
            <>
              {rankings.length === 0 && !loading ? (
                <div className="p-8 text-center text-gray-500">
                  <p>랭킹 데이터가 없습니다.</p>
                </div>
              ) : (
                <div>
                  {rankings.map((ranking, index) => {
                    return (
                      <div
                        key={`${ranking.userId}_${index}`}
                        ref={
                          index === rankings.length - 1
                            ? lastRankingElementRef
                            : null
                        }
                      >
                        <RankingItem
                          userId={ranking.userId}
                          specId={ranking.specId}
                          nickname={ranking.nickname}
                          profileImageUrl={ranking.profileImageUrl}
                          isOpenSpec={ranking.isOpenSpec}
                          totalRank={ranking.totalRank}
                          totalUsersCount={ranking.totalUsersCount}
                          rankByJobField={ranking.rankByJobField}
                          usersCountByJobField={ranking.usersCountByJobField}
                          score={ranking.score}
                          jobField={ranking.jobField}
                          commentsCount={ranking.commentsCount}
                          bookmarksCount={ranking.bookmarksCount}
                          onBookmarkChange={handleBookmarkChange}
                          selectedFilter={selectedFilter}
                        />
                      </div>
                    );
                  })}
                  {loading && <LoadingIndicator />}
                  {!hasMore && rankings.length > 0 && (
                    <div className="py-4 text-sm text-center text-gray-500">
                      모든 랭킹을 불러왔습니다.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 커스텀 스타일 */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default RankingPage;
