import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircleQuestion,
  BadgeCheck,
  Briefcase,
  Users,
} from 'lucide-react';
import { UserAPI, SpecAPI } from '../api';
import { useAuthStore } from '../stores/useAuthStore';
import { PageLoadingIndicator } from './common/LoadingIndicator';

const ProfileCard = () => {
  const { user: authUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [specData, setSpecData] = useState(null);

  const formatNumber = (num) => {
    // 1,000 단위 콤마 표시
    return num.toLocaleString();
  };

  const formatNumberWithUnit = (num) => {
    // 큰 숫자는 단위로 표시 (예: 1,200,000 -> 120만)
    if (num >= 10000) {
      if (num >= 100000000) {
        // 1억 이상
        return (num / 100000000).toFixed(1) + '억명';
      } else if (num >= 10000) {
        // 1만 이상
        return (num / 10000).toFixed(1) + '만명';
      }
    }
    return num.toLocaleString() + '명';
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authUser?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await UserAPI.getUserById(authUser.id);
        if (response.data.isSuccess) {
          const userData = response.data.data.user;
          setUserData(userData);

          // 스펙 정보가 있는 경우에만 스펙 통계 정보 조회
          if (userData.spec?.hasActiveSpec && userData.spec?.activeSpec) {
            try {
              const specResponse = await SpecAPI.fetchSpecDetail(
                userData.spec.activeSpec
              );

              if (specResponse.data.isSuccess) {
                const details =
                  specResponse.data.specDetailData.rankings.details;

                setSpecData({
                  score: details.score,
                  jobFieldRank: details.jobFieldRank,
                  jobFieldUserCount: details.jobFieldUserCount,
                  totalRank: details.totalRank,
                  totalUserCount: details.totalUserCount,
                  percent: details.totalUserCount
                    ? (
                        (details.totalRank / details.totalUserCount) *
                        100
                      ).toFixed(2)
                    : '0.00',
                });
              } else {
                console.warn(
                  '스펙 데이터 형식이 올바르지 않습니다:',
                  specResponse.data
                );
                setSpecData(null);
              }
            } catch (error) {
              console.error('스펙 정보 조회 실패:', error);
              setSpecData(null);
            }
          } else {
            setSpecData(null);
          }
        } else {
          setError('사용자 정보를 불러올 수 없습니다.');
        }
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        setError('사용자 정보를 불러올 수 없습니다.');
        setUserData(null);
        setSpecData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser]);

  // 로딩 중일 때
  if (loading) {
    return (
      <div className="p-6 mb-4 bg-white rounded-lg shadow-md min-h-[180px]">
        <PageLoadingIndicator className="py-16" />
      </div>
    );
  }

  // 에러 발생 시
  if (error) {
    return (
      <div className="p-5 mb-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  // 미로그인 상태일 때 보여줄 블러 처리된 카드
  if (!authUser) {
    return (
      <div className="relative p-6 mb-4 overflow-hidden bg-white rounded-lg shadow-md">
        <div className="pointer-events-none blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="#f1f5f9"
                    stroke="#e2e8f0"
                    strokeWidth="2"
                  />
                  <path
                    d="M50 5 A45 45 0 0 1 95 50"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="20"
                    fontWeight="bold"
                    fill="#3b82f6"
                  >
                    --
                  </text>
                  <text
                    x="50"
                    y="65"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="10"
                    fill="#94a3b8"
                  >
                    상위 %
                  </text>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold">로그인이 필요합니다</h2>
                <div className="w-full h-2 max-w-xs mt-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: '0%' }}
                  ></div>
                </div>
                <p className="mt-1 text-sm text-gray-500">---</p>
              </div>
            </div>
          </div>
        </div>

        {/* 로그인 유도 오버레이 */}
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
          <Link
            to="/login"
            className="px-6 py-2.5 text-white transition-all duration-200 bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            로그인하여 내 정보 확인하기
          </Link>
        </div>
      </div>
    );
  }

  if (!userData || !userData.spec?.hasActiveSpec) {
    return (
      <div className="p-5 mb-4 transition-all bg-white rounded-lg shadow-md hover:shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50">
              <MessageCircleQuestion size={32} className="text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                안녕하세요,{' '}
                <span className="text-blue-500">{userData?.nickname}</span>님
              </h2>
              <p className="text-sm text-gray-700">
                스펙 정보를 입력하고 순위를 확인해보세요!
              </p>
              <Link
                to="/spec-input"
                className="inline-block px-5 py-2 mt-3 text-sm font-medium text-white transition-all bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                스펙 입력하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 로그인했고 스펙 정보도 있을 때 표시
  if (userData && userData.spec?.hasActiveSpec && specData) {
    return (
      <div className="mb-4 overflow-hidden bg-white border border-blue-100 shadow-sm rounded-xl">
        {/* 헤더 섹션 */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center">
            <div className="overflow-hidden w-14 h-14">
              <img
                src={userData.profileImageUrl}
                alt={userData.nickname}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="ml-4">
              <div className="flex items-center">
                <h2 className="text-lg font-bold text-gray-800">
                  {userData.nickname}님
                </h2>
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                  {userData.jobField.replace(/_/g, '·')}
                </span>
              </div>
              <div className="flex items-center mt-1">
                <BadgeCheck className="w-4 h-4 text-yellow-500" />
                <p className="ml-1 text-sm font-medium text-gray-700">
                  상위 {specData.percent || 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 순위 섹션 */}
        <div className="p-5">
          {/* 직무 내 순위 */}
          <div className="flex justify-between px-2">
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 text-blue-500" />
              <span className="ml-1.5 text-xs font-medium text-gray-700">
                직무 내 순위
              </span>
              <span className="ml-2 text-lg font-bold text-blue-600">
                {formatNumber(specData.jobFieldRank)}
              </span>
              <span className="ml-1 text-xs text-gray-500">
                / {formatNumberWithUnit(specData.jobFieldUserCount)}
              </span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="ml-1.5 text-xs font-medium text-gray-700">
                전체 순위
              </span>
              <span className="ml-2 text-lg font-bold text-blue-600">
                {formatNumber(specData.totalRank)}
              </span>
              <span className="ml-1 text-xs text-gray-500">
                / {formatNumberWithUnit(specData.totalUserCount)}
              </span>
            </div>
          </div>

          {/* 총점 섹션 */}
          <div className="p-4 mt-4 text-white rounded-lg bg-gradient-to-r from-blue-400 to-blue-500">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="text-xl font-bold">총점</span>
              </div>
              <span className="text-2xl font-bold">
                {specData.score.toFixed(1)}
              </span>
            </div>
            <div className="w-full h-3 overflow-hidden bg-blue-200 bg-opacity-50 rounded-full">
              <div
                className="h-3 transition-all duration-700 bg-white rounded-full"
                style={{ width: `${specData.score}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-blue-50">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ProfileCard;
