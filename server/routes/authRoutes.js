/**
 * authRoutes.js — Public + protected auth endpoints.
 * Mounted at /api/auth in server.js.
 */
const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes — no token required
router.post("/register", register);
router.post("/login", login);

// Protected route — requires valid Bearer token
router.get("/me", protect, getMe);

module.exports = router;
