const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "mapa_pdfs",
    format: async (req, file) => "pdf", // Cloudinary usually detects format, but we can force pdf
    public_id: (req, file) => {
        const uniqueName = `${Date.now()}-${file.originalname.replace(/\..+$/, "").replace(/\s+/g, "_")}`;
        return uniqueName;
    },
    resource_type: "raw", // Needed for PDFs in some Cloudinary setups
  },
});

module.exports = { cloudinary, storage };
