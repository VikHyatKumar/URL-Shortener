/**
 * urlRoutes.js — All URL routes are now protected by JWT middleware.
 * The redirect (GET /:shortCode) lives in server.js and stays public.
 */
const express = require("express");
const router = express.Router();
const { shortenUrl, getAllUrls, deleteUrl, editUrl } = require("../controllers/urlController");
const validateUrl = require("../middleware/validateUrl");
const { protect } = require("../middleware/authMiddleware");

// All routes below require a valid Bearer token
router.post("/shorten", protect, validateUrl, shortenUrl);
router.get("/all",      protect, getAllUrls);
router.delete("/:id",   protect, deleteUrl);
router.put("/:id",      protect, validateUrl, editUrl);

module.exports = router;
