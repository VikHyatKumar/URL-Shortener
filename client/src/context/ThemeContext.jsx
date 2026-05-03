/**
 * ThemeContext.jsx — Provides dark/light mode state to the entire app.
 * Persists preference in localStorage and toggles a "dark" class on <html>.
 */
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Read persisted preference; fall back to light mode
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return false; // default: light
  });

  useEffect(() => {
    // Tailwind's class-based dark mode expects "dark" on <html>
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for easy consumption
export const useTheme = () => useContext(ThemeContext);
