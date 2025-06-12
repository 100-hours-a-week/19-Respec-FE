import http from './http';

export const signup = (formData) =>
  http.post('/api/users', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getUserInfo = (userId) => http.get(`/api/users/${userId}`);

export const updateProfile = (formData) =>
  http.patch('/api/users/me', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateSpecVisibility = (data) =>
  http.patch('/api/users/me/visibility', data);
