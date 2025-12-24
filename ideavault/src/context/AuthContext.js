"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children, initialIsLoggedIn }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      if (isLoggedIn) {
        try {
          const response = await fetch("/api/user");
          if (response.ok) {
            const data = await response.json();
            setUser(data.data);
          } else {
            // Token is invalid or expired
            setUser(null);
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error("Failed to fetch user", error);
          setUser(null);
          setIsLoggedIn(false);
        }
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, [isLoggedIn]);

  const logout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
      setIsLoggedIn(false);
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, logout, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};