import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { AuthAPI, UserAPI, SpecAPI } from '../api';
import { getAccessToken } from '../utils/token';
import MyPageProfileCard from '../components/user/profile/MyPageProfileCard';
import MenuList from '../components/user/MenuList';
import WithdrawModal from '../components/user/WithdrawModal';

const MyPage = () => {
  const [userData, setUserData] = useState(null);
  const [hasSpec, setHasSpec] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const { logout, user: authUser, loading: authLoading, init } = useAuthStore();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        const token = getAccessToken();
        if (!token) {
          console.log('토큰이 없어 로그인 페이지로 이동합니다.');
          navigate('/login');
          return;
        }

        if (!authUser && token && !authLoading) {
          console.log('인증 상태를 다시 초기화하는 중...');
          await init();
          return;
        }

        if (authLoading) {
          console.log('인증 상태 로딩 중...');
          return;
        }

        if (!authUser?.id) {
          console.error('사용자 정보를 찾을 수 없습니다.');
          navigate('/login');
          return;
        }

        const response = await UserAPI.getUserInfo(authUser.id);

        if (response.data.isSuccess) {
          const userInfo = response.data.data.user;

          // 기본 사용자 데이터 설정
          const profileData = {
            id: userInfo.id,
            nickname: userInfo.nickname,
            profileImageUrl: userInfo.profileImageUrl,
            jobField: userInfo.jobField || '',
            joinDate: new Date(userInfo.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          };

          const hasActiveSpec = userInfo.spec?.hasActiveSpec || false;
          setHasSpec(hasActiveSpec);

          setIsPublic(
            userInfo.isPublic !== undefined ? userInfo.isPublic : true
          );

          if (hasActiveSpec && userInfo.spec?.activeSpec) {
            try {
              const specResponse = await SpecAPI.getSpecDetail(
                userInfo.spec.activeSpec
              );

              if (specResponse.data.isSuccess) {
                const specData = specResponse.data.specDetailData;
                const rankings = specData.rankings?.details;

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

                  // 스펙 정보 추가 (마이페이지에서는 순위 정보 불필요하지만 나중을 위해 저장)
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
              console.error('스펙 정보 조회 실패: ', specError);
            }
          }

          setUserData(profileData);
        }
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, authUser, init, authLoading]);

  const handleTogglePublic = async () => {
    try {
      await UserAPI.updateSpecVisibility({
        isPublic: !isPublic,
      });
      setIsPublic(!isPublic);
    } catch (error) {
      console.error('공개 설정 변경 실패:', error);
    }
  };

  const handleWithdraw = async () => {
    try {
      await AuthAPI.deleteUser();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('회원탈퇴 실패:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <MyPageProfileCard userData={userData} hasSpec={hasSpec} />
      </div>

      <MenuList
        isPublic={isPublic}
        onTogglePublic={handleTogglePublic}
        onShowWithdrawModal={() => setShowModal(true)}
        hasSpec={hasSpec}
      />

      <WithdrawModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onWithdraw={handleWithdraw}
      />
    </div>
  );
};

export default MyPage;
