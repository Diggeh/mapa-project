const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configuration for where and how files are saved
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 1. Get the category from the request body (e.g., "Behavior")
    // Note: On the frontend, the 'category' text field MUST come before the 'file' field
    const category = req.body.category || "Uncategorized";

    // 2. Define the path: uploads/category_name
    const dir = `uploads/${category.replace(/\s+/g, "_")}`; // Replaces spaces with underscores

    // 3. Create the folder if it doesn't exist yet
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // 4. Clean up the filename (Date + original name) to prevent duplicates
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, uniqueName);
  },
});

// Filter to only allow PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
});

module.exports = upload;
