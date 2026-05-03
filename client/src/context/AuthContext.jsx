/**
 * AuthContext.jsx — Global authentication state for the entire app.
 *
 * What this context provides (interview explanation):
 *  - user      : the logged-in user object { id, name, email } or null
 *  - token     : the JWT string stored in localStorage
 *  - loading   : true while we're verifying a stored token on first load
 *  - isAuthenticated : boolean shorthand for !!user
 *  - register / login / logout : functions that update state + localStorage
 *
 * Token storage choice — localStorage vs. httpOnly cookie:
 *  We use localStorage for simplicity. In a production app you'd prefer
 *  httpOnly cookies (XSS-safe), but they require CORS+credentials config.
 *  For this project localStorage is fine — document this tradeoff in interviews.
 */
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { loginUser, registerUser, getMe } from "../services/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true); // true until /me check completes

  /**
   * On first render, verify any token that's already in localStorage.
   * This restores the session after a browser refresh without requiring re-login.
   */
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const res = await getMe(token);
        setUser(res.data.user);
      } catch {
        // Token is invalid or expired — clear it silently
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, []); // runs only on mount

  /** Called from Register.jsx */
  const register = async (name, email, password) => {
    const res = await registerUser(name, email, password); // throws on error
    const { token: t, user: u } = res.data;
    localStorage.setItem("token", t);
    setToken(t);
    setUser(u);
    toast.success(`Welcome, ${u.name}! 🎉`);
    return res;
  };

  /** Called from Login.jsx */
  const login = async (email, password) => {
    const res = await loginUser(email, password); // throws on error
    const { token: t, user: u } = res.data;
    localStorage.setItem("token", t);
    setToken(t);
    setUser(u);
    toast.success(`Welcome back, ${u.name}!`);
    return res;
  };

  /** Logout — wipes token from memory and localStorage */
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isAuthenticated: !!user, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/** Custom hook — import this instead of useContext(AuthContext) */
export const useAuth = () => useContext(AuthContext);
