"use client";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children, initialIsLoggedIn }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);

  const logout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logout, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
