import type { User } from "../types";
import { request } from "./client";

const SESSION_KEY = "wallet:user";

interface UserResponse {
  user: {
    _id?: string;
    id?: string | number;
    name: string;
    login: string;
    token: string;
  };
}

function saveUser({ user }: UserResponse): User {
  const result: User = {
    id: String(user._id ?? user.id),
    name: user.name,
    login: user.login,
    token: user.token,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(result));
  return result;
}

export async function register(
  name: string,
  login: string,
  password: string,
): Promise<User> {
  return saveUser(
    await request<UserResponse>("/user", {
      method: "POST",
      body: { name, login, password },
    }),
  );
}

export async function login(login: string, password: string): Promise<User> {
  return saveUser(
    await request<UserResponse>("/user/login", {
      method: "POST",
      body: { login, password },
    }),
  );
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}
