/**
 * server.js — Application entry point.
 * Auth routes added at /api/auth; everything else unchanged.
 */
// Use __dirname so dotenv finds .env relative to this file,
// regardless of which directory the process is started from.
require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const urlRoutes = require("./routes/urlRoutes");
const { redirectUrl } = require("./controllers/urlController");

const app = express();

connectDB();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);   // POST /register, POST /login, GET /me
app.use("/api/url",  urlRoutes);    // All protected CRUD routes

// Public redirect — must be after /api/* so it doesn't shadow them
app.get("/:shortCode", redirectUrl);

app.get("/", (req, res) => res.json({ message: "URL Shortener API is running 🚀" }));

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ error: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
