import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  getUserIdFromToken,
} from '../utils/token';
import { HttpAPI, AuthAPI, UserAPI } from '../api';

const AUTHORIZATION = 'authorization';

let refreshTimer = null;

export const useAuthStore = create((set, get) => ({
  isLoggedIn: false,
  user: null,
  token: getAccessToken(),
  loading: true,

  /** 최초 실행 (App 진입 시 1회) */
  init: async () => {
    try {
      set({ loading: true });

      // 토큰 가져오기
      const token = getAccessToken();

      if (!token) {
        console.log('토큰이 없습니다.');
        set({ loading: false });
        return;
      }

      HttpAPI.setAuthToken(token);
      HttpAPI.setupInterceptors(
        token,
        (t) => get().setToken(t),
        () => get().logout()
      );

      // 토큰이 있으면 유저 정보 가져오기
      try {
        const userId = getUserIdFromToken(token);
        const response = await UserAPI.getUserInfo(userId, token);

        if (response.data.isSuccess) {
          const userData = response.data.data.user;
          set({ user: userData, isLoggedIn: true, token: token });

          // 토큰 갱신 타이머 시작
          get()._startRefreshTimer(token);
        } else {
          console.error('유저 정보 조회 실패:', response.data.message);
          // 토큰이 있지만 유저 정보를 가져오지 못한 경우 토큰 삭제
          removeAccessToken();
          HttpAPI.setAuthToken(null);
          set({ user: null, isLoggedIn: false, token: null });
        }
      } catch (error) {
        console.error('유저 정보 조회 중 오류:', error);
        // 에러 발생 시 토큰 삭제
        removeAccessToken();
        HttpAPI.setAuthToken(null);
        set({ user: null, isLoggedIn: false, token: null });
      }
    } catch (error) {
      console.error('초기화 중 오류:', error);
      set({ user: null, isLoggedIn: false, token: null });
    } finally {
      set({ loading: false });
    }
  },

  /** 로그인 성공 후 호출 (헤더에 access 토큰 포함) */
  login: (me, accessToken) => {
    if (accessToken) {
      setAccessToken(accessToken);
      HttpAPI.setAuthToken(accessToken);
      HttpAPI.setupInterceptors(
        accessToken,
        (t) => get().setToken(t),
        () => get().logout()
      );
      get()._startRefreshTimer(accessToken);
      set({ token: accessToken });
    }
    set({ user: me, isLoggedIn: true, loading: false });
  },

  /** 로그아웃 */
  logout: () => {
    if (refreshTimer) clearTimeout(refreshTimer);
    removeAccessToken();
    HttpAPI.setAuthToken(null);
    set({ isLoggedIn: false, user: null, token: null, loading: false });
  },

  /** 내부용: 토큰 상태만 교체 (인터셉터에서 호출됨) */
  setToken: (newToken) => {
    if (!newToken) return get().logout();
    setAccessToken(newToken);
    HttpAPI.setAuthToken(newToken);
    set({ token: newToken });
    get()._startRefreshTimer(newToken);
  },

  /* ─────────── private helpers ─────────── */
  _startRefreshTimer: (token) => {
    if (refreshTimer) clearTimeout(refreshTimer);
    try {
      const { exp } = jwtDecode(token); // sec
      const now = Math.floor(Date.now() / 1000); // 현재 시간을 초 단위로 변환
      const delay = (exp - now - 60) * 1000; // 만료 1분 전에 리프레시

      if (delay <= 0) {
        console.log('토큰이 곧 만료되어 즉시 리프레시를 시도합니다.');
        return get().refreshAuthToken();
      }

      console.log(`토큰 리프레시 타이머 설정: ${delay / 1000}초 후 실행`);
      refreshTimer = setTimeout(() => {
        console.log('토큰 리프레시 타이머 실행');
        get().refreshAuthToken();
      }, delay);
    } catch (e) {
      console.error('[timer] decode fail', e);
    }
  },

  /** access 토큰 재발급 */
  refreshAuthToken: async () => {
    try {
      console.log('토큰 리프레시 요청 시작');
      const res = await AuthAPI.refreshToken();
      console.log('토큰 리프레시 응답:', res.data);

      if (res.status === 200) {
        const authHeader = res.headers[AUTHORIZATION];
        const newToken = authHeader?.replace('Bearer ', '');

        if (!newToken) {
          console.error('리프레시 응답에 authorization 헤더가 없습니다:', res);
          throw new Error('no authorization header');
        }
        get().setToken(newToken);
      } else {
        throw new Error('status ' + res.status);
      }
    } catch (err) {
      console.error('[refresh] fail', err);
      get().logout();
    }
  },
}));
