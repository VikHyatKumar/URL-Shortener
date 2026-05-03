/**
 * urlController.js — URL business logic, now scoped per authenticated user.
 *
 * Auth changes explained:
 *  - req.user is injected by the protect middleware (JWT verification)
 *  - Every write operation tags the URL with req.user._id
 *  - Every read filters by req.user._id so users only see their own links
 *  - Delete/Edit check ownership before mutating (prevents IDOR attacks)
 *  - redirectUrl stays fully PUBLIC — anyone clicking a short link gets redirected
 */
const { nanoid } = require("nanoid");
const Url = require("../models/Url");

// POST /api/url/shorten — Create a short URL for the logged-in user
const shortenUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias } = req.body;

    let shortCode = customAlias ? customAlias.trim() : nanoid(7);

    if (customAlias) {
      const existing = await Url.findOne({ shortCode });
      if (existing) {
        return res.status(409).json({ error: "Custom alias already in use. Try another." });
      }
    }

    const url = await Url.create({
      user: req.user._id,   // ← tag URL with the owner's ID
      originalUrl,
      shortCode,
      customAlias: customAlias || null,
    });

    res.status(201).json({
      message: "Short URL created successfully",
      data: { ...url.toObject(), shortUrl: `${process.env.BASE_URL}/${shortCode}` },
    });
  } catch (error) {
    console.error("shortenUrl error:", error.message);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// GET /:shortCode — PUBLIC redirect (no auth needed — anyone can follow a link)
const redirectUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });

    if (!url) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    url.clickCount += 1;
    url.clickHistory.push({
      userAgent: req.headers["user-agent"] || "Unknown",
      referer: req.headers["referer"] || "Direct",
    });
    await url.save();

    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error("redirectUrl error:", error.message);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// GET /api/url/all — Return only the current user's URLs
const getAllUrls = async (req, res) => {
  try {
    const { search } = req.query;

    // Base filter: always restrict to the logged-in user's URLs
    let query = { user: req.user._id };

    if (search) {
      query.$or = [
        { originalUrl: { $regex: search, $options: "i" } },
        { shortCode:   { $regex: search, $options: "i" } },
      ];
    }

    const urls = await Url.find(query).sort({ createdAt: -1 });

    const data = urls.map((url) => ({
      ...url.toObject(),
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
    }));

    res.status(200).json({ count: data.length, data });
  } catch (error) {
    console.error("getAllUrls error:", error.message);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// DELETE /api/url/:id — Delete only if the URL belongs to the current user
const deleteUrl = async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    // IDOR protection: compare stored owner ID vs logged-in user ID
    if (url.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to delete this URL" });
    }

    await url.deleteOne();
    res.status(200).json({ message: "URL deleted successfully" });
  } catch (error) {
    console.error("deleteUrl error:", error.message);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// PUT /api/url/:id — Edit only if the URL belongs to the current user
const editUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: "New URL is required" });
    }

    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    if (url.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to edit this URL" });
    }

    url.originalUrl = originalUrl;
    await url.save();

    res.status(200).json({
      message: "URL updated successfully",
      data: { ...url.toObject(), shortUrl: `${process.env.BASE_URL}/${url.shortCode}` },
    });
  } catch (error) {
    console.error("editUrl error:", error.message);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

module.exports = { shortenUrl, redirectUrl, getAllUrls, deleteUrl, editUrl };
