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

// Check for required environment variables
const requiredEnv = ["MONGODB_URI", "JWT_SECRET", "GEMINI_API_KEY"];
requiredEnv.forEach((env) => {
  if (!process.env[env]) {
    console.error(`CRITICAL ERROR: Environment variable ${env} is missing!`);
    process.exit(1);
  }
});

const app = express();

// 2. Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || "*", // Fallback to * for development
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));
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
      model: "gemini-2.5-flash",
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
