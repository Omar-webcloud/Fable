"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { API_URL } from "@/constants";

const AuthContext = createContext(null);

function setTokenCookie(token) {
  document.cookie = `fable_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

function removeTokenCookie() {
  document.cookie = "fable_token=; path=/; max-age=0; SameSite=Lax";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("fable_token")
        : null;

    if (!token) {
      setIsPending(false);
      return;
    }

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem("fable_token");
        removeTokenCookie();
      })
      .finally(() => setIsPending(false));
  }, []);

  const login = useCallback((userData, token) => {
    localStorage.setItem("fable_token", token);
    setTokenCookie(token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("fable_token");
    removeTokenCookie();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("fable_token");
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch {
      /* silent */
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isPending, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
