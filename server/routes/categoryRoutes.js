// server/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// GET /api/categories
// Fetches all categories, sorted alphabetically
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch categories", error: error.message });
    }
});

module.exports = router;