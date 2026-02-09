import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // ✅ Init immediately from localStorage (fix refresh redirect)
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    try {
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  function login(payload) {
    const t = payload?.token;
    const role = payload?.role ?? null;
    const fullName = payload?.fullName ?? null;
    const userId = payload?.userId ?? 0;

    if (!t) {
      throw new Error("Token missing. Login response is invalid.");
    }

    setToken(t);
    setUser({ role, fullName, userId });

    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify({ role, fullName, userId }));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  const value = useMemo(
    () => ({ token, user, login, logout }),
    [token, user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
