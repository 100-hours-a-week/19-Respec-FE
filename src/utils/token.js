import { jwtDecode } from "jwt-decode";

export const AUTH_KEY = 'Authorization'

export const getAccessToken = () => localStorage.getItem(AUTH_KEY);
export const setAccessToken = (token) => localStorage.setItem(AUTH_KEY, token);
export const removeAccessToken = () => localStorage.removeItem(AUTH_KEY);

export const getUserIdFromToken = () => {
    try {
      const token = getAccessToken();
      if (!token) return null;
      const payload = jwtDecode(token);
      return payload.userId ?? payload.loginId ?? null;
    } catch {
      return null;
    }
  };