import http from './http';

export const getComments = (specId, { page = 0, size = 10 } = {}) => {
  return http.get(`/api/specs/${specId}/comments`, {
    params: {
      page,
      size,
    },
  });
};

export const createComment = (specId, content) => {
  return http.post(`/api/specs/${specId}/comments`, {
    content,
  });
};

export const createReply = (specId, commentId, content) => {
  return http.post(`/api/specs/${specId}/comments/${commentId}/replies`, {
    content,
  });
};

export const updateComment = (specId, commentId, content) => {
  return http.patch(`/api/specs/${specId}/comments/${commentId}`, {
    content,
  });
};

export const deleteComment = (specId, commentId) => {
  return http.delete(`/api/specs/${specId}/comments/${commentId}`);
};
