
import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

const ChatsPage = () => {
  const { chatroomId } = useParams();
  const [message, setMessage] = useState('');
  const chatContainerRef = useRef(null);
  const topSentinelRef = useRef(null);
  const bottomSentinelRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [partnerInfo, setPartnerInfo] = useState({
    nickname: '',
    profileImageUrl: null,
    partnerId: null
  });
  const [messages, setMessages] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [isInitialScrollDone, setIsInitialScrollDone] = useState(false);
  const [isAdjustingScroll, setIsAdjustingScroll] = useState(false);
  // 버튼 클릭 후 자동 로드를 일시적으로 비활성화하기 위한 플래그
  const [manualLoadTimestamp, setManualLoadTimestamp] = useState(null);

  // 날짜 포맷 변환 (먼저 정의)
  const formatTimestamp = (timestamp) => {
    try {
      const date = parseISO(timestamp);
      const now = new Date();
      
      if (date.toDateString() === now.toDateString()) {
        return format(date, 'a h:mm', { locale: ko });
      }
      
      return format(date, 'MM월 dd일 a h:mm', { locale: ko });
    } catch (e) {
      console.error('날짜 변환 오류:', e);
      return '알 수 없음';
    }
  };

  // 이전 메시지 로드 (먼저 정의하여 순환 참조 문제 해결)
  const loadMoreMessages = useCallback(async (isButtonClick = false) => {
    if (!nextCursor || loadingMore || !hasNext || isAdjustingScroll) {
      console.log("🚫 이전 메시지 로드 무시:", { 
        cursor: nextCursor ? "있음" : "없음", 
        로딩중: loadingMore, 
        더있음: hasNext,
        스크롤조정중: isAdjustingScroll
      });
      return;
    }
    
    try {
      setLoadingMore(true);
      console.log("📤 이전 메시지 로드 시작, cursor:", nextCursor, "버튼클릭:", isButtonClick);
      
      // 현재 스크롤 상태 저장
      const container = chatContainerRef.current;
      const prevHeight = container.scrollHeight;
      
      // API 호출 - 버튼 클릭 시 20개, 자동 로드 시 10개
      const limit = isButtonClick ? 20 : 10;
      console.log("📡 API 요청:", `/api/chatrooms/${chatroomId}/chats?cursor=${nextCursor}&limit=${limit}`);
      
      const response = await axiosInstance.get(
        `/api/chatrooms/${chatroomId}/chats?cursor=${nextCursor}&limit=${limit}`
      );
      
      console.log("📥 API 응답:", response.data);
      
      if (response.data.success) {
        const { messages: chatMessages, hasNext: moreMessages, nextCursor: cursor } = response.data.data;
        
        console.log(`📥 이전 메시지 ${chatMessages.length}개 로드됨, 더 있음: ${moreMessages}, 새 커서: ${cursor}`);
        
        if (chatMessages.length === 0) {
          console.log("⭐ 더 이상 메시지 없음");
          setHasNext(false);
          return;
        }
        
        // 새 메시지 처리
        const newMessages = chatMessages.map(msg => ({
          id: msg.messageId,
          sender: msg.senderId === partnerInfo.partnerId ? 'other' : 'me',
          content: msg.content,
          timestamp: formatTimestamp(msg.createdAt),
          createdAt: msg.createdAt
        }));
        
        console.log("🧩 새 메시지 처리 완료:", newMessages.length);
        
        // 기존 높이 저장
        const prevScrollHeight = container.scrollHeight;
        const prevScrollTop = container.scrollTop;
        
        console.log("📏 DOM 업데이트 전:", {
          scrollHeight: prevScrollHeight,
          scrollTop: prevScrollTop
        });
        
        // 스크롤 조정 중 플래그 설정
        setIsAdjustingScroll(true);
        
        // 메시지 배열 업데이트 (기존 메시지 앞에 추가)
        setMessages(prev => {
          const combined = [...newMessages, ...prev];
          console.log(`🔄 메시지 배열 업데이트: ${prev.length} → ${combined.length}`);
          return combined;
        });
        
        // 페이지네이션 정보 업데이트
        setHasNext(moreMessages);
        setNextCursor(cursor);
        
        // 여러 시점에 스크롤 위치 조정 시도
        const adjustScrollPosition = () => {
          // 현재 높이와 이전 높이의 차이 계산
          const newScrollHeight = container.scrollHeight;
          const diff = newScrollHeight - prevScrollHeight;
          
          console.log("📏 DOM 업데이트 후:", {
            이전스크롤높이: prevScrollHeight,
            새스크롤높이: newScrollHeight,
            높이차이: diff
          });
          
          // 차이만큼 스크롤 위치 조정
          container.scrollTop = prevScrollTop + diff;
          
          console.log("📏 스크롤 위치 조정 완료:", {
            이전위치: prevScrollTop,
            조정후위치: container.scrollTop
          });
        };
        
        // DOM 업데이트 타이밍에 맞춰 스크롤 조정 시도
        const adjustmentAttempts = [0, 10, 50, 100, 200];
        
        // requestAnimationFrame으로 첫 번째 시도
        requestAnimationFrame(() => {
          adjustScrollPosition();
          
          // 추가 시도
          adjustmentAttempts.forEach(delay => {
            setTimeout(() => {
              adjustScrollPosition();
              
              // 마지막 시도 후 플래그 해제
              if (delay === adjustmentAttempts[adjustmentAttempts.length - 1]) {
                setIsAdjustingScroll(false);
                console.log("📏 스크롤 조정 완료, 플래그 해제");
              }
            }, delay);
          });
        });
      }
    } catch (err) {
      console.error("❌ 이전 메시지 로드 오류:", err);
      setIsAdjustingScroll(false); // 오류 발생 시에도 플래그 해제
    } finally {
      setTimeout(() => {
        setLoadingMore(false);
        console.log("✅ 로딩 상태 해제");
      }, 300);
    }
  }, [chatroomId, hasNext, loadingMore, nextCursor, partnerInfo.partnerId, isAdjustingScroll]);

  // 초기 메시지 로드
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        setLoading(true);
        console.log("🚀 채팅 데이터 가져오기 시작");
        
        // 메시지 가져오기 (30개)
        const messagesResponse = await axiosInstance.get(`/api/chatrooms/${chatroomId}/chats?limit=30`);
        
        if (messagesResponse.data.success) {
          const { messages: chatMessages, hasNext, nextCursor, partnerId } = messagesResponse.data.data;
          
          console.log(`📥 초기 메시지 ${chatMessages.length}개 로드됨, 더 있음: ${hasNext}`);
          
          // 파트너 ID 저장
          setPartnerInfo(prev => ({ ...prev, partnerId }));
          
          // 메시지 저장
          setMessages(chatMessages.map(msg => ({
            id: msg.messageId,
            sender: msg.senderId === partnerId ? 'other' : 'me',
            content: msg.content,
            timestamp: formatTimestamp(msg.createdAt),
            createdAt: msg.createdAt
          })));
          
          // 페이지네이션 정보 저장
          setHasNext(hasNext);
          setNextCursor(nextCursor);
          
          // 채팅방 정보(상대방) 가져오기
          const roomResponse = await axiosInstance.get('/api/chat-participations');
          if (roomResponse.data.success) {
            const chatRoom = roomResponse.data.data.chatRooms.find(
              room => room.roomId === parseInt(chatroomId)
            );
            
            if (chatRoom) {
              setPartnerInfo(prev => ({
                ...prev,
                nickname: chatRoom.partnerNickname,
                profileImageUrl: chatRoom.partnerProfileImageUrl
              }));
            }
          }
        } else {
          setError('채팅 메시지를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('❌ 채팅 데이터 조회 오류:', err);
        setError('채팅 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (chatroomId) {
      fetchChatData();
    }
  }, [chatroomId]);

  // 맨 아래로 스크롤하는 함수
  const scrollToBottom = useCallback(() => {
    if (bottomSentinelRef.current) {
      bottomSentinelRef.current.scrollIntoView({ block: 'end', behavior: 'auto' });
      console.log("🔽 맨 아래로 스크롤");
    }
  }, []);

  // 초기 메시지 로드 후 맨 아래로 스크롤
  useEffect(() => {
    if (!loading && messages.length > 0 && !isInitialScrollDone) {
      console.log("🎯 초기 로딩 완료, 맨 아래로 스크롤");
      
      // DOM 업데이트 후 스크롤 (여러번 시도)
      const scrollTimes = [0, 50, 100, 300];
      scrollTimes.forEach(time => {
        setTimeout(() => {
          scrollToBottom();
        }, time);
      });
      
      setIsInitialScrollDone(true);
    }
  }, [loading, messages, isInitialScrollDone, scrollToBottom]);

  // IntersectionObserver로 상단 감지 - 새로운 메시지 로드
  useEffect(() => {
    if (!topSentinelRef.current || !hasNext) return;
    
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !loadingMore && !isAdjustingScroll) {
          // 수동 로드 후 3초 이내에는 자동 로드 비활성화
          const now = Date.now();
          const isRecentlyManualLoaded = manualLoadTimestamp && (now - manualLoadTimestamp < 3000);
          
          if (isRecentlyManualLoaded) {
            console.log("🔒 최근 수동 로드 후 3초 이내라 자동 로드 건너뜀");
            return;
          }
          
          console.log("👁️ 상단 sentinel 감지됨, 이전 메시지 로드");
          if (nextCursor) {
            loadMoreMessages(false);
          }
        }
      },
      { 
        root: chatContainerRef.current, 
        threshold: 0.1,
        rootMargin: "150px 0px 0px 0px"  // 상단 여유공간
      }
    );
    
    io.observe(topSentinelRef.current);
    console.log("👁️ 상단 IntersectionObserver 설정");
    
    return () => {
      if (topSentinelRef.current) {
        io.unobserve(topSentinelRef.current);
      }
      io.disconnect();
    };
  }, [hasNext, loadingMore, nextCursor, isAdjustingScroll, manualLoadTimestamp]);

  // 스크롤 이벤트를 통한 상단 감지 (백업 방법)
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container || !hasNext) return;

    // 마지막 스크롤 위치 저장
    let lastScrollTop = container.scrollTop;
    
    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
      // 스크롤 방향 확인 (위로 스크롤하는 중인지)
      const scrollTop = container.scrollTop;
      const isScrollingUp = scrollTop < lastScrollTop;
      lastScrollTop = scrollTop;
      
      // 맨 위에 가까울 때 (150px 이내) + 위로 스크롤 중 + 로딩 중이 아님 + 더 불러올 메시지가 있음
      if (scrollTop < 150 && isScrollingUp && !loadingMore && hasNext) {
        // 수동 로드 후 3초 이내에는 자동 로드 비활성화
        const now = Date.now();
        const isRecentlyManualLoaded = manualLoadTimestamp && (now - manualLoadTimestamp < 3000);
        
        if (isRecentlyManualLoaded) {
          console.log("🔒 최근 수동 로드 후 3초 이내라 자동 로드 건너뜀");
          return;
        }
        
        console.log("📜 스크롤 이벤트로 맨 위 감지:", scrollTop);
        // 직접 loadMoreMessages를 호출하는 대신 커서 값을 사용하여 조건 확인
        if (nextCursor && !isAdjustingScroll) {
          console.log("📜 스크롤 이벤트에서 이전 메시지 로드 시도");
          loadMoreMessages(false);
        }
      }
    };
    
    // 쓰로틀링 적용 (성능 최적화)
    const throttledScroll = () => {
      let isThrottled = false;
      return () => {
        if (!isThrottled) {
          handleScroll();
          isThrottled = true;
          setTimeout(() => {
            isThrottled = false;
          }, 200); // 200ms 간격으로 제한
        }
      };
    };

    const throttled = throttledScroll();
    container.addEventListener('scroll', throttled, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', throttled);
    };
  }, [hasNext, loadingMore, nextCursor, isAdjustingScroll, manualLoadTimestamp]);

  // 메시지 전송
  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(), // 임시 ID
        sender: 'me',
        content: message,
        timestamp: '방금 전'
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // 메시지 전송 후 맨 아래로 스크롤
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // 컨테이너 스크롤 동작 설정 - 자연스러운 스크롤 위해
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.style.scrollBehavior = 'auto';
    }
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* 상단 프로필 헤더 */}
      <div className="fixed top-14 left-0 right-0 mx-auto max-w-[390px] z-10 bg-white border-b border-gray-200 p-4 flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          {partnerInfo.profileImageUrl ? (
            <img 
              src={partnerInfo.profileImageUrl} 
              alt={`${partnerInfo.nickname} 프로필`}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <h1 className="font-semibold text-gray-900">{partnerInfo.nickname}</h1>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto pt-32 pb-24 px-4"
        style={{ height: 'calc(100vh - 14rem)' }}
      >
        {/* 상단 감지 요소 - 보이지 않게 처리 */}
        <div 
          ref={topSentinelRef} 
          className="h-1 -mt-1 opacity-0"
        />
        
        {/* 로딩 표시 */}
        {loadingMore ? (
          <div className="flex justify-center py-2 mb-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-sm">
              <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-blue-500 animate-spin"></div>
              <span className="text-xs text-gray-500">이전 메시지 불러오는 중...</span>
            </div>
          </div>
        ) : hasNext && (
          <div className="flex justify-center py-2 mb-4">
            <button 
              onClick={() => {
                // 수동 로드 타임스탬프 설정 (3초 동안 자동 로드 비활성화)
                setManualLoadTimestamp(Date.now());
                loadMoreMessages(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span className="text-xs font-medium">이전 메시지 불러오기</span>
            </button>
          </div>
        )}
        
        {/* 대화 시작 표시 */}
        {!hasNext && messages.length > 0 && (
          <div className="flex items-center justify-center py-2 mb-4">
            <div className="bg-black text-white px-4 py-1 rounded-full text-xs font-medium">
              대화 시작
            </div>
          </div>
        )}

        {/* 메시지 목록 */}
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} data-message-id={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
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
        </div>
        
        {/* 하단 감지 요소 (초기 스크롤 용) */}
        <div ref={bottomSentinelRef} className="h-1 mt-4" />
      </div>

      {/* 메시지 입력 영역 */}
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