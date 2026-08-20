const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const interviewRoutes = require("./routes/interview.routes");

const app = express();

// List every frontend origin allowed to access this backend.
const allowedOrigins = [
  "http://localhost:5173",

  // Your production Vercel URL.
  "https://gen-ai-sepia-nu.vercel.app",

  // Your current Vercel deployment URL.
  "https://gen-d2dqe8wtf-mohammedmuqtadir41-cmyks-projects.vercel.app",
];

// Configure CORS so the backend accepts requests
// only from our allowed frontend applications.
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header,
      // such as Postman or direct server requests.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },

    // Required because authentication uses cookies.
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Authentication routes.
app.use("/api/auth", authRoutes);

// Interview report routes.
app.use("/api/interview", interviewRoutes);

module.exports = app;