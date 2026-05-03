/**
 * db.js — MongoDB connection using Mongoose.
 * Called once at server startup; logs success or exits on failure.
 */
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit process so the error is obvious in logs
  }
};

module.exports = connectDB;
