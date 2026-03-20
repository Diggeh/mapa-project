const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

// ==========================================
// READ ALL (Guests, Users, Admins)
// GET /api/articles
// ==========================================
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch articles", error: error.message });
  }
});

// ==========================================
// READ ONE (Guests, Users, Admins)
// GET /api/articles/:id
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    res.status(200).json(article);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch the article", error: error.message });
  }
});

module.exports = router;
