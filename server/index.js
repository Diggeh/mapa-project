const express = require("express");
const mongoose = require("mongoose"); // Added this to handle the database connection
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 1. Import your newly separated route files
const authRoutes = require("./routes/authRoutes");
const articleRoutes = require("./routes/articleRoutes");
const adminArticleRoutes = require("./routes/adminArticleRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const adminCategoryRoutes = require("./routes/adminCategoryRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");

dotenv.config();

const app = express();

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. DATABASE CONNECTION

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// 4. MOUNT ROUTES

app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/articles", articleRoutes); // Public API (Guests & Users)
app.use("/api/admin/articles", adminArticleRoutes); // Admin API (Create, Update, Delete)
app.use("/api/users", userRoutes); // User-specific routes
app.use("/api/categories", categoryRoutes); // Category routes
app.use("/api/admin/categories", adminCategoryRoutes); // Admin Category routes
app.use("/api/admin/users", adminUserRoutes); // Admin User routes

// 5. GEMINI AI CHATBOT ROUTE

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  try {
    const { userQuestion, paperText } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        "You are the MAPA Research Assistant. Help parents understand the provided research paper using simple, supportive language. If the answer isn't in the text, say you don't know.",
    });

    const prompt = `Research Paper Content: ${paperText}\n\nParent Question: ${userQuestion}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    res.json({ answer: response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to translate research." });
  }
});

// 6. START SERVER

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`MAPA Server running on port ${PORT}`));
