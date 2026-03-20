const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// CREATE
// POST /api/admin/articles

router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create article", error: error.message });
  }
});

// UPDATE
// PUT /api/admin/articles/:id

router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );

    if (!updatedArticle)
      return res.status(404).json({ message: "Article not found" });
    res.status(200).json(updatedArticle);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update article", error: error.message });
  }
});

// DELETE
// DELETE /api/admin/articles/:id

router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    if (!deletedArticle)
      return res.status(404).json({ message: "Article not found" });

    res.status(200).json({ message: "Article has been deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete article", error: error.message });
  }
});

module.exports = router;
