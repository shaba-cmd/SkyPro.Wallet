import { createContext } from "react";
import type { User } from "../../types";

export interface AuthContextValue {
  user: User | null;
  login: (login: string, password: string) => Promise<void>;
  register: (name: string, login: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
