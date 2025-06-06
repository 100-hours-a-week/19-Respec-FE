import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Send } from 'lucide-react';

const ChatsPage = () => {
  const { chatroomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [partnerId, setPartnerId] = useState(null);
  const [partnerInfo, setPartnerInfo] = useState({
    nickname: '',
    profileImageUrl: ''
  });
  
  const messageContainerRef = useRef(null);
  const observerRef = useRef(null);
  const firstMessageRef = useRef(null);

  // 최초 메시지 로드
  useEffect(() => {
    const fetchInitialMessages = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/chatrooms/${chatroomId}/chats`, {
          params: { limit: 30 }
        });
        
        if (response.data.success) {
          setMessages(response.data.data.messages);
          setHasMore(response.data.data.hasNext);
          setNextCursor(response.data.data.nextCursor);
          setPartnerId(response.data.data.partnerId);
          
          // 상대방 정보 가져오기
          fetchPartnerInfo(response.data.data.partnerId);
        } else {
          setError('채팅 내용을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('채팅 내용 조회 오류:', err);
        setError('채팅 내용을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialMessages();
  }, [chatroomId]);

  // 상대방 정보 가져오기
  const fetchPartnerInfo = async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/users/${userId}`);
      if (response.data.isSuccess) {
        setPartnerInfo({
          nickname: response.data.data.user.nickname,
          profileImageUrl: response.data.data.user.profileImageUrl
        });
      }
    } catch (err) {
      console.error('상대방 정보 조회 오류:', err);
    }
  };

  // 무한 스크롤 구현
  useEffect(() => {
    if (!hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreMessages();
        }
      },
      { threshold: 0.5 }
    );

    if (firstMessageRef.current) {
      observer.observe(firstMessageRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [messages, hasMore, loading, loadingMore]);

  // 추가 메시지 로드 함수
  const loadMoreMessages = async () => {
    if (!hasMore || loadingMore) return;

    try {
      setLoadingMore(true);
      const response = await axiosInstance.get(`/api/chatrooms/${chatroomId}/chats`, {
        params: {
          cursor: nextCursor,
          limit: 20
        }
      });

      if (response.data.success) {
        // 스크롤 위치 기억
        const currentHeight = messageContainerRef.current?.scrollHeight || 0;
        
        // 새 메시지 추가
        setMessages(prevMessages => [...prevMessages, ...response.data.data.messages]);
        setHasMore(response.data.data.hasNext);
        setNextCursor(response.data.data.nextCursor);
        
        // 스크롤 위치 복원
        if (messageContainerRef.current) {
          const newHeight = messageContainerRef.current.scrollHeight;
          messageContainerRef.current.scrollTop = newHeight - currentHeight;
        }
      }
    } catch (err) {
      console.error('추가 메시지 로드 오류:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // 메시지 전송 핸들러
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await axiosInstance.post(`/api/chatrooms/${chatroomId}/chats`, {
        content: newMessage
      });

      if (response.data.success) {
        // 새 메시지 추가
        setMessages(prevMessages => [
          {
            messageId: response.data.data.messageId,
            senderId: response.data.data.senderId,
            content: newMessage,
            createdAt: new Date().toISOString()
          },
          ...prevMessages
        ]);
        setNewMessage('');
      }
    } catch (err) {
      console.error('메시지 전송 오류:', err);
    }
  };

  // 날짜 형식 변환 함수
  const formatMessageTime = (timestamp) => {
    try {
      const date = parseISO(timestamp);
      return format(date, 'a h:mm', { locale: ko });
    } catch (e) {
      console.error('날짜 형식 변환 오류:', e);
      return '알 수 없음';
    }
  };

  // 로딩 중 표시
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-126px)] pt-14 text-gray-500">
        <p className="text-center">로딩 중...</p>
      </div>
    );
  }

  // 에러 발생 시
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-126px)] pt-14 text-gray-500">
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
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden pt-16 relative">
      {/* 채팅방 상단 프로필 */}
      <div className="flex items-center p-3 border-b border-gray-200 bg-white">
        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
          {partnerInfo.profileImageUrl ? (
            <img 
              src={partnerInfo.profileImageUrl} 
              alt={`${partnerInfo.nickname} 프로필`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>
        <h3 className="text-lg font-medium">{partnerInfo.nickname}</h3>
      </div>

      {/* 메시지 영역 */}
      <div 
        ref={messageContainerRef}
        className="flex-1 p-4 mb-4 overflow-y-auto flex flex-col-reverse"
      >
        {loadingMore && (
          <div className="text-center py-2">
            <p className="text-sm text-gray-500">메시지 불러오는 중...</p>
          </div>
        )}
        
        {messages.map((message, index) => {
          const isMyMessage = message.senderId !== partnerId;
          
          return (
            <div 
              key={message.messageId}
              ref={index === messages.length - 1 ? firstMessageRef : null}
              className={`flex my-1 ${isMyMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${isMyMessage ? 'order-1' : 'order-2'}`}>
                <div 
                  className={`p-3 rounded-2xl ${
                    isMyMessage 
                      ? 'bg-blue-500 text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <p className={`text-xs text-gray-500 mt-1 ${isMyMessage ? 'text-right' : 'text-left'}`}>
                  {formatMessageTime(message.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 메시지 입력 영역 */}
      <div className="px-4 py-3 bg-white border-t border-gray-200 fixed bottom-16 left-0 right-0 mx-auto max-w-[390px] z-10">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력해 주세요"
            className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            className="ml-2 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center"
            disabled={!newMessage.trim()}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatsPage; 