require("dotenv").config();

const app = require("./src/app");
const connectToDB = require("./src/config/database");
// const invokeGeminiAi = require("./src/services/ai.service");
// const {
//   resume,
//   selfDescription,
//   jobDescription,
// } = require("./src/services/temp");
// const generateInterviewRepot = require("./src/services/ai.service");

const PORT = process.env.PORT || 3000;

connectToDB();

// generateInterviewRepot({
//   resume,
//   selfDescription,
//   jobDescription,
// });

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
