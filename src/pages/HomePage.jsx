import React, { useState, useEffect, useCallback } from 'react';
import { SpecAPI, UserAPI } from '../api';
import { useAuthStore } from '../stores/useAuthStore';
import UserInfoSection from '../components/user/UserInfoSection';
import ServiceIntro from '../components/ServiceIntro';
import RankingFilters from '../components/ranking/RankingFilters';
import RankingItem from '../components/ranking/RankingItem';
import { PageLoadingIndicator } from '../components/common/LoadingIndicator';
import { TriangleAlert } from 'lucide-react';

const HomePage = () => {
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [rankingData, setRankingData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isLoggedIn, user, loading: authLoading } = useAuthStore();

  const [userData, setUserData] = useState(null);
  const [hasSpec, setHasSpec] = useState(false);
  const [categoryScores, setCategoryScores] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    if (!isLoggedIn || !user?.id) return;

    try {
      setProfileLoading(true);

      const userResponse = await UserAPI.getUserInfo(user.id);

      if (userResponse.data.isSuccess) {
        const userData = userResponse.data.data.user;

        const profileData = {
          id: userData.id,
          nickname: userData.nickname,
          profileImageUrl: userData.profileImageUrl,
          jobField: userData.jobField,
          isOpenSpec: userData.isOpenSpec,
          joinDate: new Date(userData.createdAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        };

        const hasActiveSpec = userData.spec?.hasActiveSpec || false;
        setHasSpec(hasActiveSpec);

        if (hasActiveSpec && userData.spec?.activeSpec) {
          // 스펙이 있는 경우 상세 스펙 정보 조회
          try {
            const specResponse = await SpecAPI.getSpecDetail(
              userData.spec.activeSpec
            );

            if (specResponse.data.isSuccess) {
              const specData = specResponse.data.specDetailData;
              const rankings = specData.rankings?.details;
              const categories = specData.rankings?.categories || [];
              const assessment = specData.assessment || null;

              const scores = [
                categories.find((category) => category.name === '학력_성적')
                  ?.score || 0,
                categories.find((category) => category.name === '직무_경험')
                  ?.score || 0,
                categories.find((category) => category.name === '자격증_스킬')
                  ?.score || 0,
                categories.find((category) => category.name === '어학_능력')
                  ?.score || 0,
                categories.find((category) => category.name === '활동_네트워킹')
                  ?.score || 0,
              ];
              setCategoryScores(scores);

              if (rankings) {
                // 상위 퍼센트 계산
                const totalRankPercent = (
                  (rankings.totalRank / rankings.totalUserCount) *
                  100
                ).toFixed(2);
                const jobFieldRankPercent = (
                  (rankings.jobFieldRank / rankings.jobFieldUserCount) *
                  100
                ).toFixed(2);

                // 스펙 정보 추가
                profileData.totalScore = rankings.score.toFixed(1);
                profileData.totalRank = rankings.totalRank;
                profileData.totalUsers = rankings.totalUserCount;
                profileData.totalRankPercent = totalRankPercent;
                profileData.jobFieldRank = rankings.jobFieldRank;
                profileData.jobFieldUsers = rankings.jobFieldUserCount;
                profileData.jobFieldRankPercent = jobFieldRankPercent;
                profileData.assessment = assessment;
              }
            }
          } catch (specError) {
            console.error('스펙 정보 조회 실패:', specError);
          }
        }

        setUserData(profileData);
      }
    } catch (error) {
      console.error('사용자 정보 조회 실패: ', error);
    } finally {
      setProfileLoading(false);
    }
  }, [isLoggedIn, user?.id]);

  const fetchRankings = useCallback(async (filter) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await SpecAPI.getRankings({
        type: 'ranking',
        jobField: filter,
        limit: 4,
      });

      // 각 랭킹 아이템에 대해 사용자 정보를 조회하여 isOpenSpec 정보 추가
      const rankingsWithUserInfo = await Promise.all(
        response.data.data.rankings.map(async (item) => {
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

      setRankingData(rankingsWithUserInfo);
    } catch (error) {
      console.error('랭킹 데이터를 불러오는 데 실패했습니다.', error);
      setError('랭킹 데이터를 불러오는 데 실패했습니다.');
      setRankingData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 인증 상태가 변경되거나 사용자 정보가 변경될 때 프로필 정보 조회
  useEffect(() => {
    if (!authLoading) {
      fetchUserProfile();
    }
  }, [authLoading, fetchUserProfile]);

  useEffect(() => {
    fetchRankings(selectedFilter);
  }, [selectedFilter, fetchRankings]);

  const handleFilterChange = useCallback((newFilter) => {
    setSelectedFilter(newFilter);
  }, []);

  const handleBookmarkChange = useCallback((specId, isBookmarked) => {
    // 전역 스토어에서 상태가 자동으로 업데이트되므로 추가 작업 불필요
  }, []);

  const handleRetry = () => {
    fetchRankings(selectedFilter);
  };

  // 인증 로딩 중일 때
  if (authLoading) {
    return (
      <div className="flex-1 p-4 pb-20">
        <div className="p-6 mb-4 bg-white rounded-lg shadow">
          <div className="flex items-center space-x-4 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
              <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <PageLoadingIndicator className="hidden" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 pb-20">
      <UserInfoSection
        userData={userData}
        isLoggedIn={isLoggedIn}
        hasSpec={hasSpec}
        categoryScores={categoryScores}
      />

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
                <TriangleAlert />
              </div>
              <p className="mb-4 text-gray-600">{error}</p>
              <button
                onClick={handleRetry}
                className="px-4 py-2 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
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
              isOpenSpec={item.isOpenSpec}
              totalRank={item.totalRank}
              totalUsersCount={item.totalUsersCount}
              rankByJobField={item.rankByJobField}
              usersCountByJobField={item.usersCountByJobField}
              score={item.score}
              jobField={item.jobField}
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
