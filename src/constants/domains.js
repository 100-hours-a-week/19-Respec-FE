const isLocal = false;

export const DOMAINS = {
  COOKIE_DOMAIN: isLocal ? 'localhost' : '.specranking.net', // 서브도메인 포함 쿠키용

  FRONTEND_DOMAIN: isLocal ? 'localhost:3000' : 'dev.specranking.net',

  BACKEND_DOMAIN: isLocal ? 'localhost:8080' : 'api.dev.specranking.net',
};

export const COOKIE_CONFIG = {
  DEFAULT_PATH: '/',
  SECURE: !isLocal,
  SAME_SITE: isLocal ? 'lax' : 'none',
};
