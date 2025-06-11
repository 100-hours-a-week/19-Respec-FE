import http from './http';

export const addBookmark = (specId) => {
  return http.post(`/api/specs/${specId}/bookmarks`);
};

export const removeBookmark = (specId, bookmarkId) => {
  return http.delete(`/api/specs/${specId}/bookmarks/${bookmarkId}`);
};

export const getBookmarks = ({ cursor, limit }) => {
  return http.get('/api/bookmarks', {
    params: {
      cursor,
      limit,
    },
  });
};
