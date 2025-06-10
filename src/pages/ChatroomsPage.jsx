import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

const ChatroomsPage = () => {
  const navigate = useNavigate();
  const [chatrooms, setChatrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API를 통해 채팅방 목록 가져오기
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/chat-participations');
        
        if (response.data.success) {
          // API 응답 데이터 형식에 맞게 상태 업데이트
          setChatrooms(response.data.data.chatRooms.map(room => ({
            id: room.roomId,
            username: room.partnerNickname,
            lastMessage: room.lastMessage,
            profileImage: room.partnerProfileImageUrl,
            timestamp: formatTimestamp(room.lastMessageTime),
            partnerId: room.partnerId // 파트너 ID 추가
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
    };

    fetchChatRooms();
  }, []);

  // 날짜 형식 변환 함수
  const formatTimestamp = (timestamp) => {
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
    // 세션 스토리지에 채팅방 정보 저장
    sessionStorage.setItem('chatroomId', chatroomId);
    
    // partnerId도 저장 (DM 기능을 위해)
    if (partnerId) {
      sessionStorage.setItem('partnerId', partnerId);
    }
    
    // URL 파라미터 없이 채팅 페이지로 이동
    navigate('/chat');
  };

  // 로딩 중 표시
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-126px)] text-gray-500 pt-14">
        <p className="text-center">로딩 중...</p>
      </div>
    );
  }

  // 에러 발생 시
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-126px)] text-gray-500 pt-14">
        <p className="text-center text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          새로고침
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 pt-16">
      {/* 채팅방 목록 */}
      <div className="flex-1 p-5 space-y-4">
        {chatrooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-center text-sm font-medium text-gray-400">아직 채팅방이 없습니다.</p>
            <p className="text-center text-xs text-gray-300 mt-1">새로운 대화를 시작해보세요!</p>
          </div>
        ) : (
          chatrooms.map((room) => (
            <div 
              key={room.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md hover:bg-gray-50 transition-all duration-300 cursor-pointer"
              onClick={() => handleChatroomClick(room.id, room.partnerId)}
            >
              {/* 프로필 이미지 */}
              <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                {room.profileImage ? (
                  <img 
                    src={room.profileImage} 
                    alt={`${room.username} 프로필`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>

              {/* 채팅방 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 truncate text-base">
                    {room.username}
                  </h3>
                  <span className="text-xs text-gray-400 font-medium">{room.timestamp}</span>
                </div>
                <p className="text-sm text-gray-500 truncate leading-relaxed">{room.lastMessage}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatroomsPage;