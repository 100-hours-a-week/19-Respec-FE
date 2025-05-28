import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { AuthAPI, UserAPI, SpecAPI } from '../api';
import { getAccessToken } from '../utils/token';
import ProfileSection from '../components/user/ProfileSection';
import MenuList from '../components/user/MenuList';
import WithdrawModal from '../components/user/WithdrawModal';

const MyPage = () => {
  const [user, setUser] = useState({
    nickname: '',
    profileImageUrl: '',
    createdAt: '',
    jobField: '',
    hasActiveSpec: false,
    activeSpec: 0
  });

  const [specStats, setSpecStats] = useState(null);
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

        const response = await UserAPI.getUserById(authUser.id);

        if (response.data.isSuccess) {
          const userData = response.data.data.user;

          const createdAt = new Date(userData.createdAt);
          const formattedDate = `${createdAt.getFullYear()}년 ${createdAt.getMonth() + 1}월 ${createdAt.getDate()}일`;
          
          setUser({
            nickname: userData.nickname,
            profileImageUrl: userData.profileImageUrl,
            createdAt: formattedDate,
            jobField: userData.jobField || '',
            hasActiveSpec: userData.spec?.hasActiveSpec,
            activeSpec: userData.spec?.activeSpec
          });

          setIsPublic(userData.isPublic || false);

          if (userData.spec?.hasActiveSpec) {
            const specResponse = await SpecAPI.fetchSpecDetail(userData.spec.activeSpec);

            if (specResponse.data.isSuccess) {
              const { 
                score,
                jobFieldRank, 
                jobFieldUserCount, 
                totalRank,
                totalUserCount
              } = specResponse.data.specDetailData.rankings.details;

              setSpecStats({
                score,
                jobFieldRank,
                jobFieldUserCount,
                totalRank,
                totalUserCount,
                percentage: ((totalRank / totalUserCount) * 100).toFixed(2)
              });
            }
          } else {
            setSpecStats(null);
          }
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
      await AuthAPI.updateVisibility({
        isPublic: !isPublic
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileSection user={user} specStats={specStats} />
      
      <MenuList
        isPublic={isPublic}
        onTogglePublic={handleTogglePublic}
        onNavigateToSpecInput={() => navigate('/spec-input')}
        onShowWithdrawModal={() => setShowModal(true)}
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