import http from './http';

export const getNotifications = (type) => {
  return http.get('/api/notifications', {
    params: { type }
  });
};

export const deleteNotifications = (type) => {
  return http.delete('/api/notifications', {
    params: { type }
  });
};