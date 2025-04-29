import React from 'react';
import { Link } from 'react-router-dom';
import BottomNavBar from '../components/BottomNavBar';

const MyPage = () => {
  const userInfo = {
    name: '임슬',
    rank: '상위 12%',
    totalUsers: '5280명',
    position: 'IT.인터넷',
    ranking: '342위',
    totalInPosition: '78명',
    joinDate: '2025년 5월 1일'
  };

  const menuItems = [
    {
      id: 'profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      title: '회원정보 관리',
      description: '닉네임, 프로필 이미지 등 계정정보를 관리합니다',
      link: '/profile'
    },
    {
      id: 'spec',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
      title: '스펙 정보 관리',
      description: '나의 스펙 정보를 생성 및 수정합니다',
      link: '/spec-input'
    },
    {
      id: 'bookmark',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
      title: '즐겨찾기',
      description: '저장된 다른 사용자들의 스펙 정보를 확인합니다',
      link: '/bookmarks'
    },
    {
      id: 'visibility',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ),
      title: '스펙/공개',
      description: '소셜 페이지 공개 여부를 결정합니다',
      link: '/visibility',
      toggle: true
    },
    {
      id: 'withdraw',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      ),
      title: '회원 탈퇴',
      description: '계정을 영구적으로 삭제합니다',
      link: '/withdraw'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <div className="w-full max-w-[390px] mx-auto flex flex-col flex-1 bg-white">
        <div className="flex items-center p-4">
          <img src="/logo.svg" alt="스펙랭킹" className="h-8" />
        </div>

        {/* User Profile Section */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-start space-x-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{userInfo.name}</h2>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-yellow-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                  </span>
                  <span className="text-blue-500">{userInfo.rank}</span>
                  <span className="text-gray-500">총점 {userInfo.totalInPosition}명</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                지원분야: {userInfo.position} / {userInfo.ranking} / {userInfo.totalUsers}
              </p>
              <p className="text-sm text-gray-400 mt-1">가입일: {userInfo.joinDate}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 px-4 py-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
              {item.toggle ? (
                <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                  <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></div>
                </div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              )}
            </Link>
          ))}
        </div>

        <BottomNavBar />
      </div>
    </div>
  );
};

export default MyPage;