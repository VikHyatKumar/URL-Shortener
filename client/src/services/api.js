/**
 * api.js — Axios instance for all URL API calls.
 *
 * Auth additions:
 *  Request interceptor  → reads the JWT from localStorage and attaches it as
 *                         "Authorization: Bearer <token>" on every request.
 *  Response interceptor → on 401 (expired/invalid token) clears localStorage
 *                         and redirects to /login.
 */
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api/url";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor — attach JWT ────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor — handle token expiry globally ─────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    // 401 = unauthenticated (token missing/invalid/expired)
    if (status === 401) {
      localStorage.removeItem("token");
      // Only redirect when not already on an auth page (prevent loops)
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ── API helpers ──────────────────────────────────────────────────────────────
export const shortenUrl = (originalUrl, customAlias = "") =>
  api.post("/shorten", { originalUrl, customAlias: customAlias.trim() || undefined });

export const getAllUrls = (search = "") =>
  api.get("/all", { params: search ? { search } : {} });

export const deleteUrl = (id) => api.delete(`/${id}`);

export const editUrl = (id, originalUrl) => api.put(`/${id}`, { originalUrl });

export default api;
