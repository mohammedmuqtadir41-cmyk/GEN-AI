const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

async function authUser(req, res, next) {
  try {
    console.log("========== AUTH DEBUG ==========");
    console.log("METHOD:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("HEADERS:", req.headers);
    console.log("AUTH HEADER:", req.headers.authorization);
    let token;

    // 1. Try Authorization header first
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. Fallback to cookie for local development
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        message: "Token not provided",
      });
    }

    // 3. Check blacklist
    const isTokenBlacklisted =
      await tokenBlacklistModel.findOne({ token });

    if (isTokenBlacklisted) {
      return res.status(401).json({
        message: "Token is blacklisted. Please login again.",
      });
    }

    // 4. Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
    );

    req.user = decoded;

    next();

  } catch (err) {
    console.error("AUTH ERROR:", err);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = { authUser };