export const getCookie = (name) => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1];
  };
  
  export const setCookie = (name, value, maxAgeSecs, path = "/") => {
    let cookie = `${name}=${value}; path=${path}`;
    if (maxAgeSecs !== undefined) cookie += `; Max-Age=${maxAgeSecs}`;
    document.cookie = cookie;
  };
  
  export const deleteCookie = (name, path = "/") => {
    document.cookie = `${name}=; Max-Age=0; path=${path}`;
  };