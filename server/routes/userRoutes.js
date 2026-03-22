const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken } = require("../middleware/authMiddleware");

// 1. TOGGLE BOOKMARK
// POST /api/users/bookmarks/:articleId

router.post("/bookmarks/:articleId", verifyToken, async (req, res) => {
  try {
    // req.user.id comes straight from the verified JWT token
    const user = await User.findById(req.user.id);
    const articleId = req.params.articleId;

    // Check if the article is already in the user's bookmarks
    if (user.bookmarks.includes(articleId)) {
      // If it is, remove it (un-bookmark)
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { bookmarks: articleId },
      });
      return res
        .status(200)
        .json({ message: "Article removed from bookmarks.", isBookmarked: false });
    } else {
      // If it isn't, add it
      await User.findByIdAndUpdate(req.user.id, {
        $push: { bookmarks: articleId },
      });
      return res.status(200).json({ message: "Article added to bookmarks.", isBookmarked: true });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update bookmarks.", error: error.message });
  }
});

// 2. UPDATE READ HISTORY
// POST /api/users/history/:articleId

router.post("/history/:articleId", verifyToken, async (req, res) => {
  try {
    const articleId = req.params.articleId;

    // $addToSet acts like $push, but it prevents duplicates.
    // If they read the article twice, it only saves to history once.
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { readHistory: articleId },
    });

    res.status(200).json({ message: "Article added to read history." });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update read history.",
      error: error.message,
    });
  }
});

// 3. GET USER PROFILE (Fetch their saved data)
// GET /api/users/profile

router.get("/profile", verifyToken, async (req, res) => {
  try {
    // .populate() automatically fetches the full article data for the IDs saved in their arrays
    const user = await User.findById(req.user.id)
      .populate("bookmarks")
      .populate("readHistory")
      .select("-password"); // This hides the hashed password from the response for security

    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch profile.", error: error.message });
  }
});

// 4. GET RECOMMENDATIONS (The Algorithm)
// GET /api/users/recommendations

router.get("/recommendations", verifyToken, async (req, res) => {
  try {
    // 1. Fetch the user and populate their interacted articles
    const user = await User.findById(req.user.id)
      .populate("readHistory")
      .populate("bookmarks");

    // Combine history and bookmarks into one array of interacted articles
    const interactedArticles = [...user.readHistory, ...user.bookmarks];

    // 2. The Fallback: If they are a brand new user with no history,
    // just give them the 5 newest articles.
    if (interactedArticles.length === 0) {
      const fallbackArticles = await Article.find()
        .sort({ createdAt: -1 })
        .limit(5);
      return res.status(200).json(fallbackArticles);
    }

    // 3. The Analysis: Tally up the categories from their history
    const categoryScores = {};

    interactedArticles.forEach((article) => {
      article.category.forEach((category) => {
        // If the category exists in our tally, add 1. If not, start it at 1.
        categoryScores[category] = (categoryScores[category] || 0) + 1;
      });
    });

    // 4. Sort the categories to find their top 3 favorites
    // This turns { "Meltdowns": 2, "Sleep": 5 } into an array sorted by the highest number
    const sortedCategories = Object.keys(categoryScores).sort(
      (a, b) => categoryScores[b] - categoryScores[a],
    );
    const topCategories = sortedCategories.slice(0, 3);

    // 5. The Query: Find new articles for the user
    // We map out the IDs of articles they've already seen so we don't recommend them again
    const seenArticleIds = interactedArticles.map((article) => article._id);

    const recommendations = await Article.find({
      _id: { $nin: seenArticleIds }, // $nin = "Not In" (Exclude seen articles)
      category: { $in: topCategories }, // $in = "In" (Must match top categories)
    })
      .sort({ createdAt: -1 }) // Get the newest ones first
      .limit(5); // Only send back 5 suggestions

    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate recommendations.",
      error: error.message,
    });
  }
});

module.exports = router;
