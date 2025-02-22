// utils/auth.js
export const isAuthenticated = () => {
  // Check if the token exists in localStorage (or cookie/session storage)
  return !!localStorage.getItem("authToken");
};

export const logout = () => {
  localStorage.removeItem("authToken"); // Remove token from localStorage
};
