const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

async function authUser(req, res, next) {
  console.log("AUTH 1: auth middleware started");

  const token = req.cookies.token;

  console.log("AUTH 2: token exists?", !!token);

  if (!token) {
    console.log("AUTH FAILED: No token");

    return res.status(401).json({
      message: "Token not provided",
    });
  }

  try {
    console.log("AUTH 3: Checking blacklist");

    const isTokenBlacklisted =
      await tokenBlacklistModel.findOne({ token });

    console.log("AUTH 4: Blacklist check completed");

    if (isTokenBlacklisted) {
      console.log("AUTH FAILED: Token blacklisted");

      return res.status(401).json({
        message: "Token is blacklisted. Please login again.",
      });
    }

    console.log("AUTH 5: Verifying JWT");

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
    );

    console.log("AUTH 6: JWT verified");

    req.user = decoded;

    console.log("AUTH 7: Moving to next middleware");

    next();

  } catch (err) {
    console.error("AUTH ERROR:", err);

    return res.status(401).json({
      message: "Invalid token.",
    });
  }
}

module.exports = { authUser };