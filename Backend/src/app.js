const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors({origin:process.env.CLIENT_URL||"http://localhost:5173",
    credentials:true
}))

app.use((req, res, next) => {
  console.log("Request:", req.method, req.originalUrl);
  console.log("Origin:", req.headers.origin);
  next();
});

// require all the routes here
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes");
const { AppErr } = require("./middlewears/error.middleware");

// using all the routes here
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

app.use(AppErr);

module.exports = app;