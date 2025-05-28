import axios from 'axios';
import { getAccessToken, setAccessToken } from '../utils/token';
import { refreshToken } from './auth';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const AUTHORIZATION = 'Authorization';

const http = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

export const setAuthToken = (token) => {
  if (token) {
    http.defaults.headers.common[AUTHORIZATION] = `Bearer ${token}`;
  } else {
    delete http.defaults.headers.common[AUTHORIZATION];
  }
}

export const setupInterceptors = (token, setToken, logout) => {
  if (http.interceptors.request.handlers.length) return;

  http.interceptors.request.use((config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers[AUTHORIZATION] = `Bearer ${accessToken}`;
    }
    return config;
  });

  http.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const prevRequest = error?.config;

      const tokenError = error?.response?.headers?.['token-error'];
      
      if (error?.response?.status === 401 && !prevRequest?.sent) {
        prevRequest.sent = true;
        
        try {
          if (tokenError === 'Expired') {
            console.log('토큰이 만료되어 리프레시를 시도합니다...');
            const res = await refreshToken();
            
            if (res.status === 200) {
              const authHeader = res.headers[AUTHORIZATION];
              const newAccessToken = authHeader?.replace('Bearer ', '');
              
              if (!newAccessToken) {
                console.error('리프레시 응답에 authorization 헤더가 없습니다:', res);
                throw new Error('no authorization header');
              }

              setAccessToken(newAccessToken);
              setToken(newAccessToken);
              setAuthToken(newAccessToken);
              prevRequest.headers[AUTHORIZATION] = `Bearer ${newAccessToken}`;

              console.log('토큰이 성공적으로 갱신되었습니다.');
              return http(prevRequest);
            }
          }
          
          console.log('토큰이 유효하지 않거나 리프레시에 실패했습니다.');
          logout();
          return Promise.reject(error);
          
        } catch (refreshError) {
          console.error('토큰 리프레시 중 오류가 발생했습니다:', refreshError);
          logout();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  setAuthToken(token);
};

export default http;