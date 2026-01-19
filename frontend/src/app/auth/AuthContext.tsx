// src/app/auth/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthState {
  isLoggedIn: boolean;
  user: any | null;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  const refreshAuth = () => {
    const token = localStorage.getItem("accessToken");
    const userStr = localStorage.getItem("user");

    setIsLoggedIn(!!token);
    setUser(userStr ? JSON.parse(userStr) : null);
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
