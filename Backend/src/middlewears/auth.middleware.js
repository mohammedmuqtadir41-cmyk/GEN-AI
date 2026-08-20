async function authUser(req, res, next) {
  try {
    console.log("\n========== AUTH DEBUG ==========");
    console.log("METHOD:", req.method);
    console.log("URL:", req.originalUrl);

    console.log(
      "AUTHORIZATION RAW:",
      req.get("Authorization")
    );

    console.log(
      "HEADERS AUTHORIZATION:",
      req.headers.authorization
    );

    console.log(
      "ALL HEADER KEYS:",
      Object.keys(req.headers)
    );

    let token;

    const authHeader = req.get("Authorization");

    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      token = authHeader.substring(7);
    }

    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    console.log(
      "TOKEN EXTRACTED:",
      token ? "YES" : "NO"
    );

    if (!token) {
      return res.status(401).json({
        message: "Token not provided",
      });
    }

    const isTokenBlacklisted =
      await tokenBlacklistModel.findOne({ token });

    if (isTokenBlacklisted) {
      return res.status(401).json({
        message: "Token is blacklisted. Please login again.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("JWT VERIFIED:", decoded);

    req.user = decoded;

    next();

  } catch (err) {
    console.error("AUTH ERROR:", err);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}