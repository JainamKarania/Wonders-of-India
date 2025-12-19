// Mock database (all registered users)
export const saveRegisteredUser = (user) => {
  localStorage.setItem("registered_user", JSON.stringify(user));
};

export const getRegisteredUser = () => {
  return JSON.parse(localStorage.getItem("registered_user"));
};

// Current session user
export const saveSessionUser = (user) => {
  localStorage.setItem("session_user", JSON.stringify(user));
};

export const getSessionUser = () => {
  return JSON.parse(localStorage.getItem("session_user"));
};

export const clearSessionUser = () => {
  localStorage.removeItem("session_user");
};
