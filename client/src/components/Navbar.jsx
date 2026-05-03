/**
 * Navbar.jsx — Top bar with auth-aware links.
 * Shows Login/Register when logged out; user name + Logout when logged in.
 */
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, LinkIcon, LogOut, LayoutDashboard, Home, LogIn, UserPlus } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isDark, toggleTheme }             = useTheme();
  const { isAuthenticated, user, logout }   = useAuth();
  const { pathname }                        = useLocation();
  const navigate                            = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLink = (to, label, Icon) => (
    <Link
      to={to}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        pathname === to
          ? "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300"
          : "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to={isAuthenticated ? "/" : "/login"} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <LinkIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            SnapURL
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-1">
          {isAuthenticated ? (
            /* ── Logged-in nav ── */
            <>
              {navLink("/", "Home", Home)}
              {navLink("/dashboard", "Dashboard", LayoutDashboard)}

              {/* User avatar + name */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 mx-1 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
                  {user?.name}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                title="Logout"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            /* ── Logged-out nav ── */
            <>
              {navLink("/login",    "Login",    LogIn)}
              {navLink("/register", "Register", UserPlus)}
            </>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="ml-1 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
          >
            {isDark ? <Sun className="w-5 h-5" strokeWidth={2} /> : <Moon className="w-5 h-5" strokeWidth={2} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
