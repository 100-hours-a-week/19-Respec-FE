import http from './http';

export const getChatsByRoom = (chatroomId, limit = 30) => {
  console.log(`채팅 목록 요청: chatroomId=${chatroomId}, limit=${limit}`);
  return http.get(`/api/chatrooms/${chatroomId}/chats`, {
    params: { limit }
  });
};

export const getChatsByRoomWithCursor = (chatroomId, cursor, limit = 20) => {
  console.log(`추가 채팅 목록 요청: chatroomId=${chatroomId}, cursor=${cursor}, limit=${limit}`);
  return http.get(`/api/chatrooms/${chatroomId}/chats`, {
    params: {
      cursor,
      limit
    }
  });
};

export const getChatParticipations = () => {
  console.log('채팅방 목록 요청');
  return http.get('/api/chat-participations');
};