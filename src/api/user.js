import http from './http';

export const signup = (formData) =>
  http.post('/api/users', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateProfile = (formData) =>
  http.patch('/api/users/me', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getUserById = (userId) => http.get(`/api/users/${userId}`);
