/**
 * authApi.js — Axios calls for register, login, and profile fetch.
 * Kept separate from api.js so auth endpoints never accidentally
 * go through the URL-interceptor (which would redirect on 401 loops).
 */
import axios from "axios";

const AUTH_BASE = import.meta.env.VITE_AUTH_BASE_URL || "/api/auth";

const authApi = axios.create({
  baseURL: AUTH_BASE,
  headers: { "Content-Type": "application/json" },
});

/** POST /api/auth/register */
export const registerUser = (name, email, password) =>
  authApi.post("/register", { name, email, password });

/** POST /api/auth/login */
export const loginUser = (email, password) =>
  authApi.post("/login", { email, password });

/** GET /api/auth/me — verify a stored token is still valid on page load */
export const getMe = (token) =>
  authApi.get("/me", { headers: { Authorization: `Bearer ${token}` } });
