/**
 * Login.jsx — Sign-in page.
 * On success AuthContext stores the token and redirects to home.
 * On failure the caught error is shown via toast.
 */
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { LogIn, Mail, Lock, Eye, EyeOff, LinkIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm]               = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const { login, isAuthenticated }    = useAuth();
  const navigate                      = useNavigate();
  const location                      = useLocation();

  // Redirect already-logged-in users away from /login
  if (isAuthenticated) {
    navigate("/", { replace: true });
    return null;
  }

  // After login, go to the page the user was trying to reach (or home)
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">

        {/* Card */}
        <div className="card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg mb-4 hover:scale-105 transition-transform">
              <LinkIcon className="w-7 h-7 text-white" strokeWidth={2.5} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Sign in to your SnapURL account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                className="input-field pl-12"
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="input-field pl-12 pr-12"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
              Create one free
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <p className="text-center mt-4">
          <Link to="/" className="text-sm text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
