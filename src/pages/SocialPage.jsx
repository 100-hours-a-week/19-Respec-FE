import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { BarChart3, FileText } from 'lucide-react';
import SocialProfileCard from '../components/user/profile/SocialProfileCard';
import RadarChart from '../components/spec-analysis/RadarChart';
import SpecDetailInfo from '../components/spec-analysis/SpecDetailTab';
import { SpecAPI, UserAPI, BookmarkAPI } from '../api';
import CommentsSection from '../components/comment/CommentsSection';

const SocialPage = () => {
  const { specId } = useParams();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const { user: currentUser } = useAuthStore();
  const navigate = useNavigate();

  const [isMyPage, setIsMyPage] = useState(false);
  const [userData, setUserData] = useState(null);
  const [hasSpec, setHasSpec] = useState(false);
  const [specData, setSpecData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('analysis');
  const [currentSpecId, setCurrentSpecId] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);

  const tabs = [
    { id: 'analysis', label: 'AI 분석 결과', icon: BarChart3 },
    { id: 'details', label: '세부 스펙 정보', icon: FileText },
  ];

  // 실제 스펙 점수를 specData에서 가져오도록 수정
  const getActualScores = () => {
    if (!specData?.rankings?.categories) {
      return [0, 0, 0, 0, 0]; // 기본값
    }

    return specData.rankings.categories.map((category) =>
      Math.round(category.score)
    );
  };

  const categoryScores = getActualScores();

  useEffect(() => {
    loadPageData();
  }, [specId, userId, currentUser]);

  // loadPageData 함수에서 타인 페이지 처리 부분에 추가
  const checkBookmarkStatus = async (specId) => {
    try {
      const bookmarkResponse = await BookmarkAPI.getBookmarks({ cursor: null });
      if (bookmarkResponse.data.isSuccess) {
        const bookmarks = bookmarkResponse.data.data.bookmarks;
        return bookmarks.some(
          (bookmark) => bookmark.spec.id === parseInt(specId)
        );
      }
      return false;
    } catch (error) {
      console.error('즐겨찾기 상태 확인 실패:', error);
      return false;
    }
  };

  const loadPageData = async () => {
    try {
      setLoading(true);
      setAccessDenied(false);

      if (!specId || !userId) {
        setIsMyPage(true);

        const currentUserId = currentUser.id;

        if (!currentUserId) {
          console.error('로그인된 사용자 정보가 없습니다.');
          navigate('/login');
          return;
        }

        const userResponse = await UserAPI.getUserInfo(currentUserId);

        if (userResponse.data.isSuccess) {
          const userInfo = userResponse.data.data.user;

          // 기본 사용자 데이터 설정
          const profileData = {
            id: userInfo.userId,
            nickname: userInfo.nickname,
            profileImageUrl: userInfo.profileImageUrl,
            jobField: userInfo.jobField,
            joinDate: new Date(userInfo.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          };

          // 스펙 보유 여부 확인
          const hasActiveSpec = userInfo.spec?.hasActiveSpec || false;
          setHasSpec(hasActiveSpec);

          if (hasActiveSpec && userInfo.spec?.activeSpec) {
            setCurrentSpecId(userInfo.spec.activeSpec);

            // 스펙이 있는 경우 상세 스펙 정보 조회
            try {
              const specResponse = await SpecAPI.getSpecDetail(
                userInfo.spec.activeSpec
              );
              console.log('specResponse: ', specResponse);

              if (specResponse.data.isSuccess) {
                const specDetailData = specResponse.data.specDetailData;
                const rankings = specDetailData.rankings?.details;

                setSpecData(specDetailData);

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
                }
              }
            } catch (specError) {
              console.error('스펙 정보 조회 실패:', specError);
            }
          } else {
            setCurrentSpecId(null);
          }

          setUserData(profileData);
        }
      } else {
        setIsMyPage(false);
        setCurrentSpecId(specId);

        const userResponse = await UserAPI.getUserInfo(userId);

        if (userResponse.data.isSuccess) {
          const userInfo = userResponse.data.data.user;
          console.log('userInfo: ', userInfo);

          if (!userInfo.isOpenSpec) {
            console.log('스펙이 비공개 상태입니다.');
            setAccessDenied(true);

            // 기본 사용자 데이터 설정 (타인의 정보)
            const profileData = {
              id: userInfo.id,
              nickname: userInfo.nickname,
              profileImageUrl: userInfo.profileImageUrl,
              jobField: userInfo.jobField,
              joinDate: new Date(userInfo.createdAt).toLocaleDateString(
                'ko-KR',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }
              ),
            };

            setUserData(profileData);
            setHasSpec(false);
            return;
          }

          const specResponse = await SpecAPI.getSpecDetail(specId);

          if (specResponse.data.isSuccess) {
            const specDetailData = specResponse.data.specDetailData;
            const rankings = specDetailData.rankings.details;

            setSpecData(specDetailData);
            setHasSpec(true);

            // 기본 사용자 데이터 설정 (타인의 정보)
            const profileData = {
              id: userInfo.id,
              nickname: userInfo.nickname,
              profileImageUrl: userInfo.profileImageUrl,
              isOpenSpec: userInfo.isOpenSpec,
              jobField: userInfo.jobField,
              joinDate: new Date(userInfo.createdAt).toLocaleDateString(
                'ko-KR',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }
              ),
            };

            if (rankings) {
              const totalRankPercent = (
                (rankings.totalRank / rankings.totalUserCount) *
                100
              ).toFixed(2);
              const jobFieldRankPercent = (
                (rankings.jobFieldRank / rankings.jobFieldUserCount) *
                100
              ).toFixed(2);

              profileData.totalScore = rankings.score.toFixed(1);
              profileData.totalRank = rankings.totalRank;
              profileData.totalUsers = rankings.totalUserCount;
              profileData.totalRankPercent = totalRankPercent;
              profileData.jobFieldRank = rankings.jobFieldRank;
              profileData.jobFieldUsers = rankings.jobFieldUserCount;
              profileData.jobFieldRankPercent = jobFieldRankPercent;
            }

            setUserData(profileData);
            const bookmarkStatus = await checkBookmarkStatus(specId);
            setIsBookmarked(bookmarkStatus);
          } else {
            console.error('스펙 정보 조회 실패:', specResponse.data?.message);
            throw new Error('스펙 정보를 불러올 수 없습니다.');
          }
        } else {
          console.error('사용자 정보 조회 실패:', userResponse.data?.message);
          throw new Error('사용자 정보를 불러올 수 없습니다.');
        }
      }
    } catch (error) {
      console.error('페이지 데이터 로드 실패: ', error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDMClick = () => {
    console.log('DM 버튼 클릭');
  };

  const handleBookmarkChange = useCallback(
    (specId, isBookmarked, bookmarkId) => {
      setIsBookmarked(isBookmarked);
    },
    []
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">사용자 정보를 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-4">
        <SocialProfileCard
          userData={userData}
          hasSpec={hasSpec}
          showButtons={!isMyPage}
          onDMClick={handleDMClick}
          onFavoriteClick={handleBookmarkChange}
          isFavorite={isBookmarked}
          specId={specId}
        />

        {/* 스펙 분석 카드 */}
        <div className="p-6 pb-2 my-4 bg-white shadow-sm rounded-2xl">
          <h3 className="mb-4 text-lg font-bold">스펙 분석</h3>
          {/* 탭 메뉴 */}
          <div className="flex p-1 mb-3 bg-gray-100 rounded-lg">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <IconComponent size={14} />
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 탭 콘텐츠 */}
          {activeTab === 'analysis' ? (
            <div className="flex items-center justify-center pt-3 pb-1">
              <div className="w-full max-w-xs">
                <RadarChart categoryScores={categoryScores} />
              </div>
            </div>
          ) : (
            <div className="p-1">
              <SpecDetailInfo specData={specData} />
            </div>
          )}
        </div>

        <CommentsSection
          specId={currentSpecId}
          isMyPage={isMyPage}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
};

export default SocialPage;
