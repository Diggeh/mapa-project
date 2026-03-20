const jwt = require("jsonwebtoken");

// 1. Check if the user has a valid token (Are they logged in?)
const verifyToken = (req, res, next) => {
  // Tokens are usually sent in the headers as "Bearer <token>"
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Remove the word "Bearer " to isolate just the token string
    const token = authHeader.replace("Bearer ", "");

    // Verify the token using your secret key from the .env file
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded token data (id and role) to the request object
    req.user = verified;

    // Pass control to the next function (or the route itself)
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
};

// 2. Check if the verified user has the 'admin' role
const verifyAdmin = (req, res, next) => {
  // We can check req.user.role because verifyToken attached it in the step above!
  if (req.user && req.user.role === "admin") {
    next(); // They are an admin, let them proceed
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

module.exports = { verifyToken, verifyAdmin };
