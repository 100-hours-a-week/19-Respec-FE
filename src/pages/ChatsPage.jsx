import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ChatsPage = () => {
  const { chatroomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
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
  const socketRef = useRef(null);
  // 스크롤 위치 기억을 위한 ref
  const scrollPositionRef = useRef(null);
  const lastLoadedMessagesRef = useRef([]);
  
  // WebSocket 연결 설정
  useEffect(() => {
    // 사용자 정보가 없으면 연결하지 않음
    if (!user || !partnerId) return;
    
    // 환경 변수 이름 출력 (디버깅용)
    console.log('All env variables:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
    
    const socketUrl = process.env.REACT_APP_WEB_SOCKET_URL;
    console.log('Socket URL from env:', socketUrl);
    
    if (!socketUrl) {
      console.error('WebSocket URL is not defined in environment variables');
      // 환경 변수를 찾을 수 없는 경우 하드코딩된 값 사용
      const fallbackUrl = 'ws://localhost:8080/ws/chat';
      console.log('Using fallback WebSocket URL:', fallbackUrl);
      initWebSocket(fallbackUrl);
    } else {
      // WebSocket 초기화
      initWebSocket(socketUrl);
    }
    
    // 컴포넌트 언마운트 시 WebSocket 연결 종료
    return () => {
      if (socketRef.current) {
        console.log('컴포넌트 언마운트: WebSocket 연결 종료');
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [user, partnerId]);
  
  // WebSocket 초기화 함수
  const initWebSocket = (url) => {
    // 기존 연결 닫기
    if (socketRef.current) {
      socketRef.current.close();
    }
    
    // 새 WebSocket 연결
    socketRef.current = new WebSocket(url);
    
    // 연결 성공 이벤트
    socketRef.current.onopen = () => {
      console.log('WebSocket 연결이 열렸습니다.');
    };
    
    // 메시지 수신 이벤트
    socketRef.current.onmessage = (event) => {
      try {
        const receivedMessage = JSON.parse(event.data);
        
        // 새 메시지를 상태에 추가
        setMessages(prevMessages => [
          {
            messageId: receivedMessage.messageId || `temp-${Date.now()}`,
            senderId: receivedMessage.senderId,
            content: receivedMessage.content,
            createdAt: receivedMessage.createdAt || new Date().toISOString()
          },
          ...prevMessages
        ]);
      } catch (error) {
        console.error('WebSocket 메시지 처리 오류:', error);
      }
    };
    
    // 오류 발생 이벤트
    socketRef.current.onerror = (error) => {
      console.error('WebSocket 오류:', error);
    };
    
    // 연결 종료 이벤트
    socketRef.current.onclose = () => {
      console.log('WebSocket 연결이 닫혔습니다.');
    };
  };

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

  // 스크롤 위치 저장 함수
  const saveScrollPosition = useCallback(() => {
    if (!messageContainerRef.current) return;
    
    const container = messageContainerRef.current;
    
    // 첫 번째 완전히 보이는 메시지 찾기
    const messageElements = Array.from(container.querySelectorAll('.message-item'));
    const containerRect = container.getBoundingClientRect();
    
    for (const element of messageElements) {
      const elementRect = element.getBoundingClientRect();
      
      // 메시지가 컨테이너 안에 완전히 보이는지 확인
      if (elementRect.top >= containerRect.top && 
          elementRect.bottom <= containerRect.bottom) {
        
        scrollPositionRef.current = {
          messageId: element.dataset.messageId,
          topOffset: elementRect.top - containerRect.top,
          timestamp: element.dataset.timestamp // 타임스탬프 추가
        };
        
        break;
      }
    }
    
    // 메시지 ID 목록 저장
    lastLoadedMessagesRef.current = messages.map(msg => msg.messageId);
  }, [messages]);

  // 스크롤 위치 복원 함수
  const restoreScrollPosition = useCallback(() => {
    if (!messageContainerRef.current || !scrollPositionRef.current) return;
    
    const container = messageContainerRef.current;
    const { messageId, topOffset, timestamp } = scrollPositionRef.current;
    
    // 저장된 메시지 ID를 기준으로 요소 찾기
    const targetElement = container.querySelector(`[data-message-id="${messageId}"]`);
    
    if (targetElement) {
      // 원래 위치로 스크롤 조정
      const elementRect = targetElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const newScrollTop = container.scrollTop + (elementRect.top - containerRect.top) - topOffset;
      container.scrollTop = newScrollTop;
    } else if (timestamp) {
      // 메시지를 찾을 수 없는 경우 타임스탬프가 비슷한 메시지로 스크롤
      const messageElements = Array.from(container.querySelectorAll('.message-item[data-timestamp]'));
      const targetTime = new Date(timestamp).getTime();
      
      // 타임스탬프 차이가 가장 작은 메시지 찾기
      let closestElement = null;
      let minTimeDiff = Infinity;
      
      for (const element of messageElements) {
        const elementTime = new Date(element.dataset.timestamp).getTime();
        const timeDiff = Math.abs(elementTime - targetTime);
        
        if (timeDiff < minTimeDiff) {
          minTimeDiff = timeDiff;
          closestElement = element;
        }
      }
      
      if (closestElement) {
        const elementRect = closestElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        const newScrollTop = container.scrollTop + (elementRect.top - containerRect.top) - topOffset;
        container.scrollTop = newScrollTop;
      }
    }
  }, []);

  // 무한 스크롤 구현
  useEffect(() => {
    if (!hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          saveScrollPosition();
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
  }, [messages, hasMore, loading, loadingMore, saveScrollPosition]);

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
        // 새 메시지 추가
        setMessages(prevMessages => [...prevMessages, ...response.data.data.messages]);
        setHasMore(response.data.data.hasNext);
        setNextCursor(response.data.data.nextCursor);
        
        // DOM 업데이트 후 스크롤 위치 복원
        setTimeout(() => {
          restoreScrollPosition();
        }, 50);
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
    if (!newMessage.trim() || !socketRef.current || !user || !partnerId) return;

    try {
      // 메시지 객체 생성
      const messageToSend = {
        senderId: user.id,
        receiverId: partnerId,
        content: newMessage.trim()
      };
      
      // WebSocket을 통해 메시지 전송
      socketRef.current.send(JSON.stringify(messageToSend));
      
      // 화면에 즉시 메시지 표시 (낙관적 UI 업데이트)
      setMessages(prevMessages => [
        {
          messageId: `temp-${Date.now()}`,
          senderId: user.id,
          content: newMessage.trim(),
          createdAt: new Date().toISOString()
        },
        ...prevMessages
      ]);
      
      // 입력창 초기화
      setNewMessage('');
      
      // 메시지 영역을 맨 위로 스크롤 (최신 메시지 표시)
      if (messageContainerRef.current) {
        messageContainerRef.current.scrollTop = 0;
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
              data-message-id={message.messageId}
              data-timestamp={message.createdAt}
              className={`flex my-1 message-item ${isMyMessage ? 'justify-end' : 'justify-start'}`}
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