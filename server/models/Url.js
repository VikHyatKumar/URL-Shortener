/**
 * Url.js — Mongoose schema for shortened URLs.
 * Each URL is owned by a User — all CRUD operations are scoped to that owner.
 */
const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    // Foreign key to the User who created this URL
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A URL must belong to a user"],
    },
    originalUrl: {
      type: String,
      required: [true, "Original URL is required"],
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    customAlias: {
      type: String,
      default: null,
      trim: true,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    clickHistory: [
      {
        timestamp: { type: Date, default: Date.now },
        userAgent: String,
        referer: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Url", urlSchema);
