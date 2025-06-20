import { DOMAINS, COOKIE_CONFIG } from '../constants/domains';

export const getCookie = (name) => {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
};

export const setCookie = (
  name,
  value,
  maxAgeSecs,
  path = COOKIE_CONFIG.DEFAULT_PATH,
  domain = DOMAINS.COOKIE_DOMAIN
) => {
  let cookie = `${name}=${value}; path=${path}`;
  if (maxAgeSecs !== undefined) cookie += `; Max-Age=${maxAgeSecs}`;
  if (domain) cookie += `; domain=${domain}`;
  if (COOKIE_CONFIG.SECURE)
    cookie += `; secure; samesite=${COOKIE_CONFIG.SAME_SITE}`;
  document.cookie = cookie;
};

export const deleteCookie = (
  name,
  path = COOKIE_CONFIG.DEFAULT_PATH,
  domain = DOMAINS.COOKIE_DOMAIN
) => {
  let cookie = `${name}=; Max-Age=0; path=${path}`;
  if (domain) cookie += `; domain=${domain}`;
  if (COOKIE_CONFIG.SECURE)
    cookie += `; secure; samesite=${COOKIE_CONFIG.SAME_SITE}`;
  document.cookie = cookie;
};
