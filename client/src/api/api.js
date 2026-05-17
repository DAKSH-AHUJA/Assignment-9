const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000" : "");
const API_PREFIX = "/api";

export function getUser() {
  return JSON.parse(localStorage.getItem("user") || "null");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

export async function api(path, options = {}) {
  const headers = options.headers || {};
  const token = getToken();

  if (token) headers.Authorization = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";

  const fullPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_BASE}${API_PREFIX}${fullPath}`;

  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

export const uploadUrl = import.meta.env.VITE_UPLOAD_URL || (import.meta.env.DEV ? "http://localhost:5000" : "");
