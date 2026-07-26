const express = require("express")

const app = express();

app.use(express.json());

// require all the routes here
const authRouter = require("./src/routes/auth.routes")

// using all the routes here
auth.use("/api/auth", authRouter)

module.exports = app;