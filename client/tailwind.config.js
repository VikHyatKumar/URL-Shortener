/** @type {import('tailwindcss').Config} */
export default {
  // Enable class-based dark mode so the ThemeContext can toggle it
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Custom gradient colors used throughout the UI
      backgroundImage: {
        "gradient-main":
          "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        "gradient-card":
          "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        "gradient-btn":
          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
