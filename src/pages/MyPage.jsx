import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { ChevronRight, Star, Shield, LogOut, X, UserRoundPen, ScrollText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  
  const [isPublic, setIsPublic] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    // 사용자 정보 가져오기
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/api/users/me');

        if (response.data.isSuccess) {
          const userData = response.data.data.user;

          // 날짜 형식 변환
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

          // 공개 설정 상태 가져오기
          setIsPublic(userData.isPublic || false);

          // spec api 호출
          if (userData.spec?.hasActiveSpec) {
            const specResponse = await axiosInstance.get(`/api/specs/${userData.spec.activeSpec}`);
            if (specResponse.data.isSuccess) {
              const { totalScore, rank, jobFieldUserCount, jobFieldRank } = specResponse.data.data;

              setSpecStats({
                totalScore,
                rank,
                jobFieldUserCount,
                percentage: ((jobFieldRank / jobFieldUserCount) * 100).toFixed(2)
              });
            }
          } else {
            setSpecStats(null);
          }
        }
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        // 인증 오류 시 로그인 페이지로 리다이렉트
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleTogglePublic = async () => {
    try {
      // 토글 상태 변경 API 호출
      await axiosInstance.put('/api/users/me/visibility', {
        isPublic: !isPublic
      });
      setIsPublic(!isPublic);
    } catch (error) {
      console.error('공개 설정 변경 실패:', error);
    }
  };

  const handleWithdraw = async () => {
    try {
      // 회원탈퇴 API 호출
      await axiosInstance.delete('/api/users/me');
      
      // 로그아웃 처리
      logout();
      
      // 로그인 페이지로 이동
      navigate('/login');
    } catch (error) {
      console.error('회원탈퇴 실패:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 프로필 섹션 */}
      <div className="p-4">
        <div className="flex items-center">
          {/* 프로필 이미지 */}
          <div className="w-20 h-20 mr-4 bg-gray-200">
            <img src={user.profileImageUrl} alt="Profile" className="object-cover w-20 h-20" />
          </div>
          
          <div className="flex-1">
            <h2 className="mb-1 text-xl font-bold">{user.nickname}</h2>
            <div className="flex items-center">
              {specStats ? (
                <>
                  <span className="mr-2 text-yellow-500">상위 {specStats.percentage}%</span>
                  <span className="text-blue-500">총점 {specStats.totalScore}점</span>
                  <div className="mt-1 text-sm text-gray-500">
                    {specStats.rank}위 / {specStats.jobFieldUserCount}명
                  </div>
                </>
              ) : (
                <span className="text-gray-500">아직 스펙 정보가 없습니다</span>
              )}
            </div>
          </div>
        </div>
        
        {/* 가입일 */}
        <div className="flex items-center justify-between p-4 mt-3 bg-white rounded-lg shadow-sm">
          <span className="text-gray-600">가입일</span>
          <span className="text-gray-800">{user.createdAt}</span>
        </div>
      </div>
      
      {/* 메뉴 리스트 */}
      {/* 스펙 정보 공개 설정 */}
      <div className="p-4">
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 mr-3 bg-blue-100 rounded-full">
                    <Shield size={18} className="text-blue-500" />
                </div>
                <div>
                    <span className="font-medium text-gray-800">스펙 정보 공개 설정</span>
                    <p className="text-xs text-gray-500">소셜 페이지 공개 여부를 결정합니다.</p>
                </div>
            </div>
            <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out">
                <input
                    type="checkbox"
                    id="toggle"
                    className="w-0 h-0 opacity-0"
                    checked={isPublic}
                    onChange={handleTogglePublic}
                />
                <label
                    htmlFor="toggle"
                    className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full ${
                        isPublic ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                >
                    <span
                        className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                        isPublic ? 'transform translate-x-6' : ''
                        }`}
                    ></span>
                </label>
            </div>
        </div>
      </div>
      
      {/* 회원정보, 스펙 정보, 즐겨찾기 그룹 */}
      <div className="px-4">
        <div className="overflow-hidden bg-white rounded-lg shadow-sm">
          {/* 회원정보 관리 */}
          <div 
            className="flex items-center justify-between p-4 border-b cursor-pointer"
            onClick={() => alert("준비 중인 기능입니다.")}
          >
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 mr-3 bg-blue-100 rounded-full">
                <UserRoundPen size={18} className="text-blue-500" />
              </div>
              <div>
                <span className="font-medium text-gray-800">회원정보 관리</span>
                <p className="text-xs text-gray-500">닉네임, 이미지 등 개인정보를 관리합니다.</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
          
          {/* 스펙 정보 관리 */}
          <div 
            className="flex items-center justify-between p-4 border-b cursor-pointer"
            onClick={() => navigate('/spec-input')}
          >
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 mr-3 bg-blue-100 rounded-full">
                <ScrollText size={18} className="text-blue-500" />
              </div>
              <div>
                <span className="font-medium text-gray-800">스펙 정보 관리</span>
                <p className="text-xs text-gray-500">나의 스펙 정보를 등록 및 수정합니다.</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
          
          {/* 즐겨찾기 */}
          <div 
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => alert("준비 중인 기능입니다.")}
          >
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 mr-3 bg-blue-100 rounded-full">
                <Star size={18} className='text-blue-500' />
              </div>
              <div>
                <span className="font-medium text-gray-800">즐겨찾기</span>
                <p className="text-xs text-gray-500">저장한 다른 사용자들의 스펙 정보를 확인합니다.</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* 회원 탈퇴 */}
      <div className="px-4 mt-4">
        <div 
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 mr-3 bg-red-100 rounded-full">
              <LogOut size={18} className='text-red-500'/>
            </div>
            <div>
                <span className="font-medium text-gray-800">회원 탈퇴</span>
                <p className="text-xs text-gray-500">계정을 영구적으로 삭제합니다.</p>
              </div>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </div>
      </div>
      
      {/* 회원 탈퇴 확인 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-[300px] rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold">회원 탈퇴</h3>
              <button onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 mr-4 bg-red-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold">정말 탈퇴하시겠습니까?</h4>
                </div>
              </div>
              
              <p className="mb-6 text-sm text-gray-600">
                회원 탈퇴 시 모든 개인정보와 활동 내역이 삭제되며, 이 작업은 되돌릴 수 없습니다.
              </p>
              
              <div className="flex space-x-2">
                <button 
                  className="flex-1 py-2 text-white bg-red-500 rounded-md"
                  onClick={handleWithdraw}
                >
                  예, 탈퇴합니다
                </button>
                <button 
                  className="flex-1 py-2 text-gray-800 bg-gray-200 rounded-md"
                  onClick={() => setShowModal(false)}
                >
                  아니오
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;