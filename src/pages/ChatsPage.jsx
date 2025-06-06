import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Send } from 'lucide-react';

const ChatsPage = () => {
  const { chatroomId } = useParams();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  // 더미 채팅 데이터
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'other',
      username: `User${chatroomId}`,
      content: '안녕하세요!\n스펙랭킹에서 프로필 보고 궁금해서 DM 드렸어요!\n혹시 간단히 질문 드려도 괜찮을까요?',
      timestamp: '오후 8:00'
    },
    {
      id: 2,
      sender: 'me',
      content: '네, 물론이죠. 편하게 질문해 주세요!',
      timestamp: '오후 8:05'
    },
    {
      id: 3,
      sender: 'other',
      username: `User${chatroomId}`,
      content: '대외활동 경험에 대해\n관심이 있습니다.\n혹시 대외 활동에 관련된\n정보나 팁을 갖고 여쭤봐도 괜찮을까요?',
      timestamp: '오후 8:07'
    },
    {
      id: 4,
      sender: 'me',
      content: '대외활동 관련해서 궁금하신 점\n있으시면 편하게 질문 주세요.\n제가 도와드릴 수 있는 부분이라면\n최대한 상세히 말씀드릴게요!',
      timestamp: '오후 8:10'
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'me',
        content: message,
        timestamp: '방금 전'
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // 새 메시지가 추가될 때 스크롤 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* 상단 프로필 헤더 - TopBar 아래 고정 */}
      <div className="fixed top-14 left-0 right-0 mx-auto max-w-[390px] z-10 bg-white border-b border-gray-200 p-4 flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="flex-1">
          <h1 className="font-semibold text-gray-900">라이언</h1>
        </div>
      </div>

      {/* 메시지 영역 - 헤더와 입력창 사이 */}
      <div className="flex-1 overflow-y-auto pt-32 pb-24 px-4 space-y-4">
        {/* Today 구분선 */}
        <div className="flex items-center justify-center py-2">
          <div className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium">
            Today
          </div>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className="flex flex-col max-w-xs lg:max-w-md">
              <div className={`px-4 py-3 rounded-2xl ${
                msg.sender === 'me' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}>
                <p className="text-sm whitespace-pre-line">{msg.content}</p>
              </div>
              <p className={`text-xs mt-1 ${
                msg.sender === 'me' ? 'text-right text-gray-500' : 'text-left text-gray-500'
              }`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 영역 - 푸터 바로 위에 고정 */}
      <div className="fixed bottom-16 left-0 right-0 mx-auto max-w-[390px] bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력해 주세요"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-sm"
          />
          <button
            onClick={handleSendMessage}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;