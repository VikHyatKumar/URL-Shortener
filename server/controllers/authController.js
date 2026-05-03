/**
 * authController.js — Handles register, login, and profile fetch.
 *
 * JWT flow (interview-ready explanation):
 *  REGISTER: validate → hash password (in model hook) → save user → sign token → return token + user
 *  LOGIN:    find user → compare password with bcrypt → sign token → return token + user
 *  PROTECT:  every subsequent request sends the token → middleware verifies it → controller runs
 *
 * We return the same generic error ("Invalid email or password") for both
 * "user not found" AND "wrong password" — this prevents user enumeration attacks.
 */
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Signs a JWT containing only the user ID.
 * Expiry is read from env so you can change it without a code deploy.
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },             // Payload: only the user's MongoDB _id
    process.env.JWT_SECRET,     // Secret key used to sign (and later verify) the token
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// ── POST /api/auth/register ──────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Check for duplicate email before attempting to create
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    // Password is hashed automatically by the pre-save hook in User model
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("register error:", error.message);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// ── POST /api/auth/login ─────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // .select("+password") overrides the `select: false` in the schema
    // so bcrypt can compare the candidate password
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    // Generic error message — prevents revealing whether the email exists
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Logged in successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("login error:", error.message);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// ── GET /api/auth/me ─────────────────────────────────────────────────────────
// Protected route — used by the frontend on page load to restore session
const getMe = async (req, res) => {
  try {
    // req.user is attached by the protect middleware
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("getMe error:", error.message);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

module.exports = { register, login, getMe };
