const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

export const uploadUrl = import.meta.env.VITE_UPLOAD_URL || "http://localhost:5000";
