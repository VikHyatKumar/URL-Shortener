/**
 * ProtectedRoute.jsx — Wraps any route that requires authentication.
 *
 * How it works:
 *  1. While the token is being verified on first load, show a spinner.
 *  2. If verified → render the page (children).
 *  3. If not authenticated → redirect to /login (replace removes the
 *     protected URL from history so Back button doesn't loop).
 */
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Still verifying stored token — don't flash the login redirect
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Verifying session…</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
