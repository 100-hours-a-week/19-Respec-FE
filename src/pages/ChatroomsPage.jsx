import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatroomsPage = () => {
  const navigate = useNavigate();
  
  // 더미 채팅방 데이터
  const [chatrooms, setChatrooms] = useState([
    {
      id: 1,
      username: 'User1',
      lastMessage: '최근 대화한 메시지를 나타냅니다.',
      profileImage: null,
      timestamp: '오후 3:20'
    },
    {
      id: 2,
      username: 'User2',
      lastMessage: '최근 대화한 메시지를 나타냅니다.',
      profileImage: null,
      timestamp: '오후 2:15'
    },
    {
      id: 3,
      username: 'User3',
      lastMessage: '최근 대화한 메시지를 나타냅니다.',
      profileImage: null,
      timestamp: '오후 1:30'
    },
    {
      id: 4,
      username: 'User4',
      lastMessage: '최근 대화한 메시지를 나타냅니다.',
      profileImage: null,
      timestamp: '오전 11:45'
    },
    {
      id: 5,
      username: 'User5',
      lastMessage: '최근 대화한 메시지를 나타냅니다.',
      profileImage: null,
      timestamp: '오전 9:20'
    }
  ]);

  // 채팅방 클릭 핸들러
  const handleChatroomClick = (chatroomId) => {
    // 개별 채팅방으로 이동
    navigate(`/chat/${chatroomId}`);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
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
              onClick={() => handleChatroomClick(room.id)}
            >
              {/* 프로필 이미지 */}
              <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
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