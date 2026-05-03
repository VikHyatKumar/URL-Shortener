/**
 * Register.jsx — Sign-up page with name, email, password + confirm password.
 * Client-side validation runs before the API call to give instant feedback.
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserPlus, User, Mail, Lock, Eye, EyeOff, LinkIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const { register, isAuthenticated }   = useAuth();
  const navigate                        = useNavigate();

  if (isAuthenticated) {
    navigate("/", { replace: true });
    return null;
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ── Client-side validation ──────────────────────────────────────────────
    if (!form.name.trim()) {
      return toast.error("Name is required");
    }
    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    if (form.password !== form.confirm) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const strength = (() => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6)  return { label: "Too short", color: "bg-red-500",    w: "w-1/4" };
    if (p.length < 8)  return { label: "Weak",      color: "bg-orange-400", w: "w-2/4" };
    if (!/[A-Z]/.test(p) || !/[0-9]/.test(p))
                       return { label: "Fair",       color: "bg-yellow-400", w: "w-3/4" };
    return              { label: "Strong",    color: "bg-emerald-500", w: "w-full" };
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">

        <div className="card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg mb-4 hover:scale-105 transition-transform">
              <LinkIcon className="w-7 h-7 text-white" strokeWidth={2.5} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                className="input-field pl-12"
                autoComplete="name"
                required
              />
            </div>

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
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password (min. 6 characters)"
                  className="input-field pl-12 pr-12"
                  autoComplete="new-password"
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
              
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                name="confirm"
                type={showPassword ? "text" : "password"}
                value={form.confirm}
                onChange={handleChange}
                placeholder="Confirm password"
                className={`input-field pl-12 ${
                  form.confirm && form.confirm !== form.password
                    ? "border-red-400 focus:ring-red-400"
                    : form.confirm && form.confirm === form.password
                    ? "border-emerald-400 focus:ring-emerald-400"
                    : ""
                }`}
                autoComplete="new-password"
                required
              />
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating account…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center mt-4">
          <Link to="/" className="text-sm text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
