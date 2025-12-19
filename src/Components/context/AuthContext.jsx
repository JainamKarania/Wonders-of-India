import { createContext, useContext, useEffect, useState } from "react";
import {
  saveRegisteredUser,
  getRegisteredUser,
  saveSessionUser,
  getSessionUser,
  clearSessionUser,
} from "../utils/authStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Restore session on refresh
  useEffect(() => {
    const sessionUser = getSessionUser();
    if (sessionUser) setUser(sessionUser);
  }, []);

  const signup = (userData) => {
    saveRegisteredUser(userData);   // mock DB
    saveSessionUser(userData);      // auto login
    setUser(userData);
  };

  const login = (email, password) => {
    const registeredUser = getRegisteredUser();

    if (
      registeredUser &&
      registeredUser.email === email &&
      registeredUser.password === password
    ) {
      saveSessionUser(registeredUser);
      setUser(registeredUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    clearSessionUser(); // DO NOT delete registered user
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
