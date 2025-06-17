import http from './http';

export const refreshToken = () => http.post('/api/auth/token/refresh');

export const deleteUser = () => http.delete('/api/users/me');
