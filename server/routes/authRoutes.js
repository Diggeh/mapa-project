const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Pulling in the User schema we defined earlier

// ==========================================
// 1. SIGNUP (Register)
// POST /api/auth/register
// ==========================================
router.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const newUser = new User({
      email,
      password: hashedPassword,
      role: role || "user", // Defaults to 'user' if not specified
    });

    const savedUser = await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({
      message: "Server error during registration.",
      error: error.message,
    });
  }
});

// ==========================================
// 2. LOGIN
// POST /api/auth/login
// ==========================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials." });
    }

    // Compare the submitted password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate the JSON Web Token (JWT)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }, // Token expires in 1 day
    );

    // Send the token and user data back to the frontend
    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error during login.", error: error.message });
  }
});

module.exports = router;
