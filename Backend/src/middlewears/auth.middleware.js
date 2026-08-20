const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

async function authUser(req, res, next) {
  try {
    console.log("\n========== AUTH DEBUG ==========");
    console.log("METHOD:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("AUTH HEADER:", req.headers.authorization);

    let token;

    // 1. Try Authorization header
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
      console.log("✅ TOKEN EXTRACTED:", !!token);
    }

    // 2. Fallback to cookie
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
      console.log("🍪 TOKEN FOUND IN COOKIE");
    }

    // 3. No token
    if (!token) {
      console.log("❌ NO TOKEN RECEIVED");

      return res.status(401).json({
        message: "Token not provided",
      });
    }

    // 4. Check blacklist
    const isTokenBlacklisted =
      await tokenBlacklistModel.findOne({ token });

    if (isTokenBlacklisted) {
      console.log("❌ TOKEN BLACKLISTED");

      return res.status(401).json({
        message: "Token is blacklisted. Please login again.",
      });
    }

    // 5. Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
    );

    console.log("✅ JWT VERIFIED");
    console.log("USER ID:", decoded.id);

    req.user = decoded;

    console.log("========== AUTH SUCCESS ==========\n");

    next();

  } catch (err) {
    console.error("❌ AUTH ERROR:", err.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = { authUser };