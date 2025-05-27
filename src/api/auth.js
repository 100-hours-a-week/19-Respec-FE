import http from './http';

export const refreshToken = () => http.post('/api/auth/token/refresh');

export const signup = (formData) => http.post('/api/users', formData, {
    headers: { 'Content-Type': 'multipart/form-data'}
});

export const deleteUser = () => http.delete('/api/users/me');

export const updateVisibility = (data) => http.put('/api/users/me/visibility', data);