// frontend/src/utils/auth.js
export const saveUserSession = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUserSession = () => {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
};

export const clearUserSession = () => {
  localStorage.removeItem("user");
};
