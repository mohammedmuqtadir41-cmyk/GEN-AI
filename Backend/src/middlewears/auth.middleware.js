const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

async function authUser(req, res, next) {
  try {
    let token;

    // Read JWT from Authorization header first.
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // Fallback to cookie if the application uses cookies.
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // Stop the request if no authentication token exists.
    if (!token) {
      return res.status(401).json({
        message: "Token not provided",
      });
    }

    // Prevent logged-out tokens from accessing protected routes.
    const isTokenBlacklisted =
      await tokenBlacklistModel.findOne({ token });

    if (isTokenBlacklisted) {
      return res.status(401).json({
        message: "Token is blacklisted. Please login again.",
      });
    }

    // Verify the JWT and attach its payload to the request.
    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET,
    );

    next();
  } catch (error) {
    // Invalid or expired JWT.
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = { authUser };