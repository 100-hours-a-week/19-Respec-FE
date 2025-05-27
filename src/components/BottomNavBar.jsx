import React from 'react';
import { Home, BarChart2, MessageSquare, Users, CircleUserRound } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { getAccessToken } from '../utils/token';

const BottomNavBar = ({ active }) => {
  const { isLoggedIn, loading } = useAuthStore();
  const token = getAccessToken();

  const isAuthenticated = isLoggedIn || (token && !loading);
  
  // 기본 네비게이션 아이템
  const baseNavItems = [
    { name: 'HOME', icon: Home, path: '/' },
    { name: 'RANK', icon: BarChart2, path: '/rank' },
    { name: 'DM', icon: MessageSquare, path: '/dm' },
    { name: 'SOCIAL', icon: Users, path: '/social' },
  ];
  
  // 로그인 상태에 따라 마지막 아이템 추가
  const navItems = [
    ...baseNavItems,
    isAuthenticated
      ? { name: 'MY', icon: CircleUserRound, path: '/my' }
      : { name: 'LOGIN', icon: CircleUserRound, path: '/login' }
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[390px] h-16 bg-white flex justify-between items-center px-2 border-t border-gray-100">
      {navItems.map((item) => (
        <a 
          key={item.name}
          href={item.name === 'DM' || item.name === 'SOCIAL' ? '#' : item.path}
          className={`flex flex-col items-center justify-center w-16 h-full ${
            active === item.name.toLowerCase() ? 'text-blue-500' : 'text-gray-500'
          }`}
          onClick={(e) => {
            if (item.name === 'DM' || item.name === 'SOCIAL') {
              e.preventDefault();
              alert('준비 중인 기능입니다.');
            }
          }}        
        >
          <item.icon size={20} />
          <span className="mt-1 text-xs">{item.name}</span>
        </a>
      ))}
    </div>
  );
};

export default BottomNavBar;