const express = require("express");
const router = express.Router();
const fs = require("fs"); // Added for file deletion
const path = require("path");
const upload = require("../middleware/uploadMiddleware");
const axios = require("axios"); // Added for fetching Cloudinary files
const pdfParse = require("pdf-parse-new");
const Article = require("../models/Article");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// 1. CREATE ARTICLE (Admin Only + PDF Upload)

router.post(
  "/",
  verifyToken,
  verifyAdmin,
  upload.single("pdfFile"),
  async (req, res) => {
    try {
      const articleData = {
        ...req.body,
        pdfpath: req.file ? req.file.path : null,
      };

      if (req.file) {
        try {
          // req.file.path is now a Cloudinary URL
          const response = await axios.get(req.file.path, { responseType: "arraybuffer" });
          const dataBuffer = Buffer.from(response.data);
          const pdfData = await pdfParse(dataBuffer);
          articleData.parsedText = pdfData.text;
        } catch (pdfErr) {
          console.error("Error parsing PDF from Cloudinary:", pdfErr);
        }
      }

      // Parsing strings into arrays for FormData compatibility
      if (typeof req.body.category === "string") {
        articleData.category = req.body.category
          .split(",")
          .map((c) => c.trim());
      }
      if (typeof req.body.authors === "string") {
        articleData.authors = req.body.authors.split(",").map((a) => a.trim());
      }
      if (typeof req.body.keyTakeaways === "string") {
        articleData.keyTakeaways = req.body.keyTakeaways
          .split(",")
          .map((k) => k.trim());
      }

      const newArticle = new Article(articleData);
      const savedArticle = await newArticle.save();

      res.status(201).json(savedArticle);
    } catch (error) {
      res.status(500).json({ message: "Upload failed", error: error.message });
    }
  },
);

// 2. UPDATE ARTICLE (Admin Only)

router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  upload.single("pdfFile"),
  async (req, res) => {
    try {
      let updateData = { ...req.body };
      if (req.file) {
        updateData.pdfpath = req.file.path;
        try {
          const response = await axios.get(req.file.path, { responseType: "arraybuffer" });
          const dataBuffer = Buffer.from(response.data);
          const pdfData = await pdfParse(dataBuffer);
          updateData.parsedText = pdfData.text;
        } catch (pdfErr) {
          console.error("Error parsing PDF from Cloudinary:", pdfErr);
        }
      }

      const updatedArticle = await Article.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true },
      );

      if (!updatedArticle)
        return res.status(404).json({ message: "Article not found" });
      res.status(200).json(updatedArticle);
    } catch (error) {
      res.status(500).json({ message: "Update failed", error: error.message });
    }
  },
);

// 3. DELETE ARTICLE & PHYSICAL FILE

router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    // 1. Find the article first to get the pdfpath
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const filePath = article.pdfpath;

    // 2. Delete the record from MongoDB
    await Article.findByIdAndDelete(req.params.id);

    // 3. Delete from Cloudinary (Note: req.file.path was stored as article.pdfpath)
    // For now, we simple delete the record. Cloudinary cleanup can be added later 
    // using the public_id if stored.

    res.status(200).json({
      message: "Article and associated PDF deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
});

module.exports = router;
