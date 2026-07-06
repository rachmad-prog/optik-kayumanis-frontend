"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = Cookies.get("ok_token");
    if (stored) {
      setToken(stored);
      api
        .get("/auth/me", stored)
        .then((data) => setUser(data.user))
        .catch(() => Cookies.remove("ok_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function login(email, password) {
    const data = await api.post("/auth/login", { email, password });
    Cookies.set("ok_token", data.token, { expires: 7 });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function register(payload) {
    const data = await api.post("/auth/register", payload);
    Cookies.set("ok_token", data.token, { expires: 7 });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    Cookies.remove("ok_token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
