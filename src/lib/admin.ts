/** Server-only helpers for the admin UI. The admin session cookie is set by a
 *  Server Action after proxying login to the backend, then forwarded on every
 *  admin API call — the backend URL and token never reach the browser JS. */

import { cookies } from "next/headers";

const API_BASE = process.env.BACKEND_API_URL ?? "http://localhost:8000";
export const ADMIN_COOKIE = process.env.ADMIN_COOKIE_NAME ?? "portfolio_admin";

export async function adminFetch(path: string, init?: RequestInit) {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return fetch(`${API_BASE}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Cookie: `${ADMIN_COOKIE}=${token}` } : {}),
      ...init?.headers,
    },
  });
}

export async function getAdminUser(): Promise<string | null> {
  const res = await adminFetch("/api/admin/me");
  if (!res.ok) return null;
  const body = (await res.json()) as { username: string };
  return body.username;
}

/** Proxies login to the backend and returns the session token on success. */
export async function backendLogin(
  username: string,
  password: string,
): Promise<string | null> {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) return null;
  const setCookie = res.headers.get("set-cookie") ?? "";
  const match = setCookie.match(new RegExp(`${ADMIN_COOKIE}=([^;]+)`));
  return match ? match[1] : null;
}
