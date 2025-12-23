"use client";

import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";

export default function AuthLayout({ initialIsLoggedIn, children }) {
  return (
    <AuthProvider initialIsLoggedIn={initialIsLoggedIn}>
      <Header />
      {children}
    </AuthProvider>
  );
}
