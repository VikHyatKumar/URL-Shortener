/**
 * User.js — Mongoose schema for registered users.
 *
 * Security choices explained:
 *  - password has `select: false` → never returned in queries unless you explicitly ask (.select("+password"))
 *  - bcrypt hashing happens in a pre-save hook, NOT in the controller, so it runs
 *    every time regardless of which code path saves the user
 *  - comparePassword is a schema method so the hashing logic stays co-located with the model
 */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,           // MongoDB unique index
      lowercase: true,        // Normalize so "USER@mail.com" and "user@mail.com" are the same
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,          // ← NEVER included in query results by default
    },
  },
  { timestamps: true }
);

/**
 * Pre-save hook: hash the password before writing to DB.
 * `isModified("password")` check prevents re-hashing on every save()
 * (e.g., when you update only the name).
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // 12 salt rounds: good balance of security vs. CPU cost (10–12 is production-standard)
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/**
 * Instance method: compare a plain-text password against the stored hash.
 * bcrypt.compare is timing-safe — it prevents timing attacks.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
