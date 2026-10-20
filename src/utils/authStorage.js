const TOKEN_KEY = "authToken";

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event("authChange"));
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const logoutUser = () => {
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("authChange"));
};