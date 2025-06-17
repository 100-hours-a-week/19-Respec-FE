import http from './http';

export const addBookmark = (specId) => {
  return http.post(`/api/bookmarks/specs/${specId}`);
};

export const removeBookmark = (specId) => {
  return http.delete(`/api/bookmarks/specs/${specId}`);
};

export const getBookmarks = ({ cursor, limit }) => {
  return http.get('/api/bookmarks', {
    params: {
      cursor,
      limit,
    },
  });
};
