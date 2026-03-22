const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// 1. CREATE CATEGORY
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const newCategory = new Category({
      name: req.body.name,
      type: req.body.type,
    });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category name already exists" });
    }
    res.status(500).json({ message: "Failed to create category", error: error.message });
  }
});

// 2. UPDATE CATEGORY
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedCategory) return res.status(404).json({ message: "Category not found" });
    res.status(200).json(updatedCategory);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category name already exists" });
    }
    res.status(500).json({ message: "Failed to update category", error: error.message });
  }
});

// 3. DELETE CATEGORY
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category", error: error.message });
  }
});

module.exports = router;
