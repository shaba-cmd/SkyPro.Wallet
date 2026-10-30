export const API_URL = "https://wedev-api.sky.pro/api";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  token?: string;
  body?: unknown;
}

export async function request<T>(
  path: string,
  { method = "GET", token, body }: RequestOptions = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.error ?? data?.message ?? `Ошибка сервера: ${response.status}`;
    throw new ApiError(response.status, message);
  }

  return data as T;
}
