import React, { useState, useEffect, useCallback } from 'react';
import { SpecAPI } from '../api';
import ProfileCard from '../components/user/ProfileCard/ProfileCard';
import ServiceIntro from '../components/ServiceIntro';
import RankingFilters from '../components/ranking/RankingFilters';
import RankingItem from '../components/ranking/RankingItem';
import { PageLoadingIndicator } from '../components/common/LoadingIndicator';

const HomePage = () => {
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [rankingData, setRankingData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRankings = useCallback(async (filter) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await SpecAPI.getRankings({
        type: 'ranking',
        jobField: filter,
        limit: 4,
      });

      setRankingData(response.data.data.rankings);
    } catch (error) {
      console.error('랭킹 데이터를 불러오는 데 실패했습니다.', error);
      setError('랭킹 데이터를 불러오는 데 실패했습니다.');
      setRankingData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRankings(selectedFilter);
  }, [selectedFilter, fetchRankings]);

  const handleFilterChange = useCallback((newFilter) => {
    setSelectedFilter(newFilter);
  }, []);

  const handleBookmarkChange = useCallback(
    (specId, isBookmarked, bookmarkId) => {
      setRankingData((prevData) =>
        prevData.map((item) =>
          item.specId === specId ? { ...item, isBookmarked, bookmarkId } : item
        )
      );
    },
    []
  );

  const handleRetry = () => {
    fetchRankings(selectedFilter);
  };

  return (
    <div className="p-4">
      <ProfileCard />
      <ServiceIntro />

      <h3 className="mt-6 mb-2 text-lg font-bold">상위 랭킹 TOP 4</h3>
      <RankingFilters
        selectedFilter={selectedFilter}
        setSelectedFilter={handleFilterChange}
      />

      <div className="bg-white rounded-lg shadow min-h-[300px] relative">
        {isLoading ? (
          <PageLoadingIndicator className="py-20" />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center">
              <div className="mb-4 text-gray-500">
                <svg
                  className="w-12 h-12 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <p className="mb-4 text-gray-600">{error}</p>
              <button
                onClick={handleRetry}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
              >
                다시 시도
              </button>
            </div>
          </div>
        ) : rankingData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center">
              <p className="text-gray-500">랭킹 데이터가 없습니다.</p>
            </div>
          </div>
        ) : (
          rankingData.map((item) => (
            <RankingItem
              key={`${item.userId}-${selectedFilter}`}
              userId={item.userId}
              specId={item.specId}
              nickname={item.nickname}
              profileImageUrl={item.profileImageUrl}
              totalRank={item.totalRank}
              totalUsersCount={item.totalUsersCount}
              rankByJobField={item.rankByJobField}
              usersCountByJobField={item.usersCountByJobField}
              score={item.score}
              jobField={item.jobField}
              isBookmarked={item.isBookmarked}
              bookmarkId={item.bookmarkId}
              commentsCount={item.commentsCount}
              bookmarksCount={item.bookmarksCount}
              selectedFilter={selectedFilter}
              onBookmarkChange={handleBookmarkChange}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
