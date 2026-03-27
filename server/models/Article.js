const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true }, // The main text the AI reads and the user sees
    sourceLink: { type: String, required: true }, // DOI, YT link, or website URL
    authors: [{ type: String, required: true }], // Array in case there are multiple
    publishedDate: { type: String },
    region: { type: String, enum: ["Local", "International"], default: "International", },
    category: [{ type: String, required: true }], // e.g., "Meltdowns", "Communication", "Trauma"
    pdfpath: { type: String },
    parsedText: { type: String },

  },
  { timestamps: true },
); // Automatically adds createdAt and updatedAt dates

module.exports = mongoose.model("Article", articleSchema);
