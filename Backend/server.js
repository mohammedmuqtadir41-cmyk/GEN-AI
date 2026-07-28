require("dotenv").config();

const app = require("./src/app");
const connectToDB = require("./src/config/database");
const invokeGeminiAi = require("./src/services/ai.service");
const {
  resume,
  selfDescription,
  jobDescription,
} = require("./src/services/temp");
const generateInterviewRepot = require("./src/services/ai.service");

connectToDB();

generateInterviewRepot({
  resume,
  selfDescription,
  jobDescription,
});

app.listen(3000, () => {
  console.log("The server is up and running");
});
