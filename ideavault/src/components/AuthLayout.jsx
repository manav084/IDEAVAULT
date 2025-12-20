"use client";

import { AuthProvider } from "@/context/AuthContext";
import { NavigationMenuDemo } from "@/components/Header";

export default function AuthLayout({ initialIsLoggedIn, children }) {
  return (
    <AuthProvider initialIsLoggedIn={initialIsLoggedIn}>
      <NavigationMenuDemo />
      {children}
    </AuthProvider>
  );
}
