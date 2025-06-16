import React, { useState, useEffect } from 'react';
import {
  Home,
  BarChart2,
  MessageSquare,
  Users,
  CircleUserRound,
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { getAccessToken } from '../../utils/token';
import { NotificationAPI } from '../../api';

const BottomNavBar = ({ active, showToast }) => {
  const { isLoggedIn, loading } = useAuthStore();
  const token = getAccessToken();

  const isAuthenticated = isLoggedIn || (token && !loading);

  const [notifications, setNotifications] = useState({
    hasUnreadChat: false,
    hasUnreadComment: false,
  });

  // 알림 상태 가져오기
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isLoggedIn) return;

      try {
        const response = await NotificationAPI.getNotifications('footer');

        if (response.data.success) {
          setNotifications({
            hasUnreadChat: response.data.data.hasUnreadChat,
            hasUnreadComment: response.data.data.hasUnreadComment,
          });
        }
      } catch (error) {
        console.error('알림 상태 조회 실패:', error);
      }
    };

    fetchNotifications();

    // 주기적으로 알림 상태 업데이트 (1분마다)
    const intervalId = setInterval(fetchNotifications, 60000);

    return () => clearInterval(intervalId);
  }, [isLoggedIn, active]);

  // 채팅방 알림 삭제
  const clearChatNotification = async () => {
    if (!isLoggedIn || !notifications.hasUnreadChat) return;

    // 즉시 로컬 상태 업데이트 (UI가 즉시 반응하도록)
    setNotifications((prev) => ({
      ...prev,
      hasUnreadChat: false,
    }));

    // 서버에 삭제 요청
    try {
      await NotificationAPI.deleteNotifications('chat');
    } catch (error) {
      console.error('채팅 알림 삭제 실패:', error);
    }
  };

  // 소셜 알림 삭제
  const clearSocialNotification = async () => {
    if (!isLoggedIn || !notifications.hasUnreadComment) return;

    // 즉시 로컬 상태 업데이트 (UI가 즉시 반응하도록)
    setNotifications((prev) => ({
      ...prev,
      hasUnreadComment: false,
    }));

    // 서버에 삭제 요청
    try {
      await NotificationAPI.deleteNotifications('social');
    } catch (error) {
      console.error('소셜 알림 삭제 실패:', error);
    }
  };

  const handleNavClick = (e, item) => {
    // 로그인이 필요한 기능인지 확인
    if (!isAuthenticated && (item.name === 'DM' || item.name === 'SOCIAL')) {
      e.preventDefault(); // 기본 링크 동작 방지
      if (showToast) showToast();
      return;
    }

    // 로그인된 상태에서 알림 삭제
    if (isAuthenticated) {
      if (item.name === 'SOCIAL') {
        clearSocialNotification();
      } else if (item.name === 'DM') {
        clearChatNotification();
      }
    }
  };

  // 기본 네비게이션 아이템
  const baseNavItems = [
    { name: 'HOME', icon: Home, path: '/' },
    { name: 'RANK', icon: BarChart2, path: '/rank' },
    { name: 'DM', icon: MessageSquare, path: '/chatrooms' },
    { name: 'SOCIAL', icon: Users, path: '/social' },
  ];

  // 로그인 상태에 따라 마지막 아이템 추가
  const navItems = [
    ...baseNavItems,
    isAuthenticated
      ? { name: 'MY', icon: CircleUserRound, path: '/my' }
      : { name: 'LOGIN', icon: CircleUserRound, path: '/login' },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[390px] h-16 bg-white flex justify-between items-center px-2 border-t border-gray-100">
      {navItems.map((item) => (
        <a
          key={item.name}
          href={item.path}
          className={`flex flex-col items-center justify-center w-16 h-full ${
            active === item.name.toLowerCase()
              ? 'text-blue-500'
              : 'text-gray-500'
          } relative`}
          onClick={(e) => handleNavClick(e, item)}
        >
          <item.icon size={20} />
          <span className="mt-1 text-xs">{item.name}</span>

          {/* 채팅 알림 표시 */}
          {item.name === 'DM' && notifications.hasUnreadChat && (
            <div className="absolute top-0 w-2 h-2 bg-red-500 rounded-full right-2"></div>
          )}

          {/* 댓글 알림 표시 */}
          {item.name === 'SOCIAL' && notifications.hasUnreadComment && (
            <div className="absolute top-0 w-2 h-2 bg-red-500 rounded-full right-2"></div>
          )}
        </a>
      ))}
    </div>
  );
};

export default BottomNavBar;
