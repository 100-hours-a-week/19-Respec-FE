import http from './http';

export const getUserById = (userId) => http.get(`/api/users/${userId}`);