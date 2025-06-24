import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChatAPI } from '../api';
import { useAuthStore } from '../stores/useAuthStore';

const ChatroomsPage = () => {
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading, init } = useAuthStore();
  const [chatrooms, setChatrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API를 통해 채팅방 목록 가져오기
  useEffect(() => {
    const fetchChatRooms = async () => {
      // authUser가 없고 인증 로딩이 완료되었으면 로그인 페이지로 이동
      if (!authUser && !authLoading) {
        console.log("사용자가 로그인하지 않았습니다. 로그인 페이지로 이동합니다.");
        navigate('/login');
        return;
      }

      // 인증 로딩 중이면 기다림
      if (authLoading) {
        console.log("인증 정보 로딩 중...");
        return;
      }

      // authUser가 있을 때만 채팅방 목록 요청
      if (authUser) {
        console.log("채팅방 목록을 요청합니다.", authUser.id);
        
        try {
          setLoading(true);
          const response = await ChatAPI.getChatParticipations();
          console.log("채팅방 목록 응답:", response);
          
          if (response.data.isSuccess) {
            // API 응답 데이터 형식에 맞게 상태 업데이트
            const chatRooms = response.data.data.chatRooms || [];
            setChatrooms(chatRooms.map(room => ({
              id: room.roomId,
              username: room.partnerNickname,
              lastMessage: room.lastMessage,
              profileImage: room.partnerProfileImageUrl,
              timestamp: formatTimestamp(room.lastMessageTime),
              partnerId: room.partnerId
            })));
          } else {
            setError('채팅방 목록을 불러오는데 실패했습니다.');
          }
        } catch (err) {
          console.error('채팅방 목록 조회 오류:', err);
          setError('채팅방 목록을 불러오는데 실패했습니다.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchChatRooms();
  }, [authUser, authLoading, navigate]);

  // 날짜 형식 변환 함수
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '알 수 없음';
    
    try {
      const date = parseISO(timestamp);
      const now = new Date();
      
      // 오늘 날짜인 경우 시간만 표시
      if (date.toDateString() === now.toDateString()) {
        return format(date, 'a h:mm', { locale: ko });
      }
      
      // 다른 날짜인 경우 날짜 형식으로 표시
      return format(date, 'MM월 dd일', { locale: ko });
    } catch (e) {
      console.error('날짜 형식 변환 오류:', e);
      return '알 수 없음';
    }
  };

  // 채팅방 클릭 핸들러
  const handleChatroomClick = (chatroomId, partnerId) => {
    // 세션 스토리지에 채팅방 정보와 파트너 ID 저장
    sessionStorage.setItem('chatroomId', chatroomId);
    sessionStorage.setItem('partnerId', partnerId);
    
    // URL 파라미터 없이 채팅 페이지로 이동
    navigate('/chat');
  };

  // 로딩 중 표시
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p className="text-center">로딩 중...</p>
      </div>
    );
  }

  // 에러 발생 시
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p className="text-center text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg"
        >
          새로고침
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* 채팅방 목록 */}
      <div className="flex-1 p-5 space-y-4">
        {chatrooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <div className="flex items-center justify-center w-20 h-20 mb-6 bg-gray-200 rounded-full">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-center text-gray-400">아직 채팅방이 없습니다.</p>
            <p className="mt-1 text-xs text-center text-gray-300">새로운 대화를 시작해보세요!</p>
          </div>
        ) : (
          chatrooms.map((room) => (
            <div 
              key={room.id}
              className="flex items-center p-5 space-x-4 transition-all duration-300 bg-white border border-gray-100 shadow-sm cursor-pointer rounded-2xl hover:shadow-md hover:bg-gray-50"
              onClick={() => handleChatroomClick(room.id, room.partnerId)}
            >
              {/* 프로필 이미지 */}
              <div className="flex items-center justify-center flex-shrink-0 overflow-hidden bg-gray-200 rounded-full w-14 h-14">
                {room.profileImage ? (
                  <img 
                    src={room.profileImage} 
                    alt={`${room.username} 프로필`}
                    className="object-cover w-full h-full rounded-full"
                  />
                ) : (
                  <svg className="text-gray-400 w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>

              {/* 채팅방 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold text-gray-800 truncate">
                    {room.username}
                  </h3>
                  <span className="text-xs font-medium text-gray-400">{room.timestamp}</span>
                </div>
                <p className="text-sm leading-relaxed text-gray-500 truncate">{room.lastMessage}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatroomsPage;