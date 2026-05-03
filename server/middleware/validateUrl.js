/**
 * validateUrl.js — Express middleware to validate incoming URL strings.
 * Rejects requests early before they reach the controller.
 */
const validUrl = require("valid-url");

const validateUrl = (req, res, next) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: "URL is required" });
  }

  // valid-url checks for a well-formed http/https URI
  if (!validUrl.isWebUri(originalUrl)) {
    return res.status(400).json({
      error: "Invalid URL. Please include http:// or https://",
    });
  }

  next();
};

module.exports = validateUrl;
