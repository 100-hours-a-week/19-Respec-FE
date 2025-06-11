import http from './http';

export const getChatsByRoom = (chatroomId, limit = 30) => {
  return http.get(`/api/chatrooms/${chatroomId}/chats`, {
    params: { limit }
  });
};

export const getChatsByRoomWithCursor = (chatroomId, cursor, limit = 20) => {
  return http.get(`/api/chatrooms/${chatroomId}/chats`, {
    params: {
      cursor,
      limit
    }
  });
};

export const getChatParticipations = () => {
  return http.get('/api/chat-participations');
};