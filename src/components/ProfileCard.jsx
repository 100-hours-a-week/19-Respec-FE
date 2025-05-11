import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageCircleQuestion } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';

const ProfileCard = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [score, setScore] = useState(null);
  const [rankPercent, setRankPercent] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.spec?.hasActiveSpec || !user?.spec?.activeSpec) return;

      try {
        const response = await axiosInstance.get(`/api/specs/${user.spec.activeSpec}`, { withCredentials: true });
        const detail = response.data.data.rankings.details;
        const percent = ((detail.jobFieldRank / detail.jobFieldUserCount) * 100).toFixed(2);

        setScore(detail.score);
        setRankPercent(percent);
      } catch (error) {
        console.error('스펙 상세 정보 조회 실패:', error);
      }
    };

    if (user) {
      setProfileData(user);
      fetchProfile();
    }
    if (user) {
      // const fetchProfile = async () => {
      //   try {
      //     setLoading(true);

      //     const userResponse = await axios.get('/api/users/me');
      //     const userData = userResponse.data.data.user;
      //     setProfileData(userData);

      //     if (userData.spec?.hasActiveSpec && userData.spec.activeSpec) {
      //       const specResponse = await axios.get(`/api/specs/${userData.spec.activeSpec}`);
      //       const detail = specResponse.data.data.rankings.details;
      //       const percent = ((detail.jobFieldRank / detail.jobFieldUserCount) * 100).toFixed(2);

      //       setScore(detail.score);
      //       setRankPercent(percent);
      //     }
      //   } catch (err) {
      //     console.error('프로필 불러오기 실패:', err);
      //     setError(err);
      //   } finally {
      //     setLoading(false);
      //   }
      // };

      // fetchProfile();

      setProfileData(user);
    }
  }, [user]);

  // 미로그인 상태일 때 보여줄 블러 처리된 카드
  if (!user) {
    return (
      <div className="relative p-4 mb-4 overflow-hidden bg-white rounded-lg shadow">
        <div className="pointer-events-none blur-sm">
          {/* 실제 카드 내용과 유사한 더미 콘텐츠 */}
          <div className="flex items-center mb-3">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2" />
                <path d="M50 5 A45 45 0 0 1 95 50" fill="none" stroke="#3b82f6" strokeWidth="10" strokeLinecap="round" />
                <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="20" fontWeight="bold" fill="#3b82f6">--</text>
                <text x="50" y="65" textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#94a3b8">상위 %</text>
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-bold">로그인이 필요합니다</h2>
              <div className="w-full h-2 mt-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-blue-500 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <p className="mt-1 text-sm text-gray-500">---</p>
            </div>
          </div>
        </div>

        {/* 로그인 유도 오버레이 */}
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
          <Link 
            to="/login" 
            className="px-4 py-2 text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
          >
            로그인하여 내 정보 확인하기
          </Link>
        </div>
      </div>
    );
  }

  // 로그인했지만 스펙 정보가 없을 때 표시
  if (!profileData?.spec?.hasActiveSpec) {
    return (
      <div className="p-4 mb-4 bg-white rounded-lg shadow">
        <div className="flex items-center mb-3">
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2" />
            </svg>
            <div className="absolute top-5 left-5">
              <MessageCircleQuestion size={24} className="text-gray-400" />
            </div>
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-bold">안녕하세요, {user?.nickname}님</h2>
            <p className="text-sm text-gray-700">스펙 정보를 입력하고 순위를 확인해보세요!</p>
            <Link 
              to="/spec-input" 
              className="inline-block px-4 py-2 mt-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              스펙 입력하기
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 mb-4 bg-white rounded-lg shadow">
      <div className="flex items-center mb-3">
        <div className="relative w-20 h-20">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2" />
            <path
              d="M50 5 A45 45 0 0 1 95 50"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="20" fontWeight="bold" fill="#3b82f6">22</text>
            <text x="50" y="65" textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#94a3b8">상위 %</text>
          </svg>
        </div>
        <div className="ml-4">
          <h2 className="text-lg font-bold">지금 {profileData.nickname} 님은</h2>
          <h2 className="text-lg font-bold">{profileData.jobField} 기준 상위 {rankPercent}%입니다</h2>
          <div className="w-full h-2 mt-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${score}%` }}></div>
          </div>
          <p className="mt-1 text-sm text-gray-500">점수: {score} / 100</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;