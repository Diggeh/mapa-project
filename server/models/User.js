const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user", // Defaults to a standard user with bookmark permissions
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article", // Links to the Article schema
      },
    ],
    // --- ALGORITHM DATA ---
    readHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
      },
    ],
    searchHistory: [{ type: String }], // Saves terms they've typed into the search bar
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
