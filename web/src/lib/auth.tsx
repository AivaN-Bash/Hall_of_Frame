import * as React from "react";
import { api, getStoredToken, setStoredToken } from "./api";
import type { UserInfo } from "./types";

interface AuthContextValue {
  user: UserInfo | null;
  isAdmin: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserInfo | null>(null);
  const [loading, setLoading] = React.useState<boolean>(() => Boolean(getStoredToken()));

  React.useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }
    let alive = true;
    api
      .me()
      .then((info) => {
        if (alive) setUser(info);
      })
      .catch(() => {
        setStoredToken(null);
        if (alive) setUser(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const login = React.useCallback(async (username: string, password: string) => {
    const res = await api.login(username, password);
    setStoredToken(res.token);
    setUser(res.user);
  }, []);

  const logout = React.useCallback(() => {
    setStoredToken(null);
    setUser(null);
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      isAdmin: user?.role === "ADMIN",
      loading,
      login,
      logout,
    }),
    [user, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
