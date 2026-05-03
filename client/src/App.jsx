/**
 * App.jsx — Root component.
 * AuthProvider wraps everything so every page can read auth state.
 * ProtectedRoute guards / and /dashboard — redirects to /login if unauthenticated.
 */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: "12px", fontFamily: "inherit", fontSize: "14px" },
              success: { iconTheme: { primary: "#7c3aed", secondary: "#fff" } },
              error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
            }}
          />

          <Navbar />

          <main>
            <Routes>
              {/* ── Public routes ── */}
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* ── Protected routes — require valid JWT ── */}
              <Route path="/" element={
                <ProtectedRoute><Home /></ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />

              {/* ── 404 ── */}
              <Route path="*" element={
                <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50 dark:bg-gray-950">
                  <p className="text-7xl mb-4">🔗</p>
                  <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">404</h1>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Page not found.</p>
                  <a href="/" className="btn-primary">Go Home</a>
                </div>
              } />
            </Routes>
          </main>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
