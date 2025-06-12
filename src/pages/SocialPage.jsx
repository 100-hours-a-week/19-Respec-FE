import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { BarChart3, FileText } from 'lucide-react';
import SocialProfileCard from '../components/user/profile/SocialProfileCard';
import RadarChart from '../components/spec-analysis/RadarChart';
import { SpecAPI, UserAPI } from '../api';
import CommentsSection from '../components/comment/CommentsSection';

const SocialPage = () => {
  const { specId } = useParams();
  const { user: currentUser } = useAuthStore();
  const navigate = useNavigate();

  const [isMyPage, setIsMyPage] = useState(false);
  const [userData, setUserData] = useState(null);
  const [hasSpec, setHasSpec] = useState(false);
  const [specData, setSpecData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [animatedScores, setAnimatedScores] = useState([0, 0, 0, 0, 0]);
  const [activeTab, setActiveTab] = useState('analysis');

  // 실제 스펙 점수 (임시 데이터)
  const actualScores = [50, 0, 60, 75, 85];

  const tabs = [
    { id: 'analysis', label: 'AI 분석 결과', icon: BarChart3 },
    { id: 'details', label: '세부 스펙 정보', icon: FileText },
  ];

  useEffect(() => {
    loadPageData();
  }, [specId, currentUser]);

  // 탭이 'analysis'로 변경될 때마다 애니메이션 시작
  useEffect(() => {
    if (activeTab === 'analysis') {
      setIsAnalyzing(true);
      setAnimatedScores([0, 0, 0, 0, 0]);

      // 레이더 차트 애니메이션
      const animateRadar = () => {
        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;

        for (let i = 0; i <= steps; i++) {
          setTimeout(() => {
            const progress = i / steps;
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setAnimatedScores(
              actualScores.map((score) => Math.floor(score * easeOut))
            );

            if (i === steps) {
              setIsAnalyzing(false);
            }
          }, i * stepDuration);
        }
      };

      const timer = setTimeout(animateRadar, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const loadPageData = async () => {
    try {
      setLoading(true);

      if (!specId) {
        setIsMyPage(true);

        const userId = currentUser.id;

        if (!userId) {
          console.error('로그인된 사용자 정보가 없습니다.');
          navigate('/login');
          return;
        }

        const userResponse = await UserAPI.getUserInfo(userId);

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
          }

          setUserData(profileData);
        }
      } else {
        setIsMyPage(false);

        // const userResponse = await mockAPI.getUserBySpecId(specId);
        const userResponse = await UserAPI.getUserInfo(specId);
        const specResponse = await SpecAPI.getSpecDetail(specId);

        if (userResponse?.isSuccess) {
          const userInfo = userResponse.data.user;

          // 기본 사용자 데이터 설정 (타인의 정보)
          const profileData = {
            id: userInfo.id,
            nickname: userInfo.nickname,
            profileImageUrl: userInfo.profileImageUrl,
            jobField: userInfo.jobField,
            joinDate: new Date(userInfo.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          };

          setUserData(profileData);
          setHasSpec(true); // specId가 있다는 것은 스펙이 있다는 의미
        }

        if (specResponse?.isSuccess) {
          const specDetailData = specResponse.specDetailData;
          const rankings = specDetailData.rankings?.details;

          setSpecData(specDetailData);

          if (rankings && userData) {
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
            setUserData((prevData) => ({
              ...prevData,
              totalScore: rankings.score.toFixed(1),
              totalRank: rankings.totalRank,
              totalUsers: rankings.totalUserCount,
              totalRankPercent: totalRankPercent,
              jobFieldRank: rankings.jobFieldRank,
              jobFieldUsers: rankings.jobFieldUserCount,
              jobFieldRankPercent: jobFieldRankPercent,
            }));
          }
        }

        // 실제로는 API를 통해 즐겨찾기 여부 확인
        // const bookmarkStatus = await mockAPI.checkBookmark(specId);
        // setIsBookmarked(bookmarkStatus);
      }
    } catch (error) {
      console.error('Failed to load page data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDMClick = () => {
    console.log('DM 버튼 클릭');
  };

  const handleBookmarkChange = useCallback((specId, isBookmarked) => {
    setSpecData((prevData) =>
      prevData.map((item) =>
        item.specId === specId ? { ...item, isBookmarked } : item
      )
    );
  }, []);

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
        />

        {/* 스펙 분석 카드 */}
        <div className="p-6 mb-4 bg-white shadow-sm rounded-2xl">
          <h3 className="mb-4 text-lg font-bold">스펙 분석</h3>
          {/* 탭 메뉴 */}
          <div className="flex p-1 mb-6 bg-gray-100 rounded-lg">
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

          {/* 그래프 영역 */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-xs">
              <RadarChart
                animatedScores={animatedScores}
                isAnalyzing={isAnalyzing}
              />
            </div>
          </div>
        </div>

        <CommentsSection
          specId={specId || userData.spec?.activeSpec}
          isMyPage={isMyPage}
        />
      </div>
    </div>
  );
};

export default SocialPage;
