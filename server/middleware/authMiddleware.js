/**
 * authMiddleware.js — JWT verification middleware.
 *
 * How it works (explain this in interviews):
 *  1. Client sends: "Authorization: Bearer <token>" in every protected request header
 *  2. We extract the token from the header
 *  3. jwt.verify() decodes AND validates the signature + expiry
 *  4. We look up the user from the DB to ensure the account still exists
 *  5. We attach the user object to req.user so controllers can use it
 *
 * Why not store user data in the token itself?
 *  Tokens are signed but NOT encrypted — anyone can decode the payload.
 *  We store only the user ID in the token, fetch fresh data from DB each time.
 */
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Expect "Bearer <token>" format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Not authorized. Please log in." });
    }

    const token = authHeader.split(" ")[1]; // Extract the token part

    // jwt.verify throws if signature is invalid OR token is expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user — ensures account wasn't deleted after token was issued
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User no longer exists." });
    }

    req.user = user; // Attach to request — controllers read from here
    next();
  } catch (error) {
    // Differentiate JWT-specific errors for clear client messages
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token. Please log in again." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }
    res.status(500).json({ error: "Server error during authentication." });
  }
};

module.exports = { protect };
