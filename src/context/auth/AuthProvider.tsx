import { useCallback, useState, type ReactNode } from "react";
import * as api from "../../api/auth";
import type { User } from "../../types";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(api.getCurrentUser);

  const logout = useCallback(() => {
    api.logout();
    setUser(null);
  }, []);

  const value = {
    user,
    login: async (login: string, password: string) => {
      setUser(await api.login(login, password));
    },
    register: async (name: string, login: string, password: string) => {
      setUser(await api.register(name, login, password));
    },
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
