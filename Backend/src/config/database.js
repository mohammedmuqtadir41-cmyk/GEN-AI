const mongoose = require("mongoose");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ Connected to database");
  } catch (error) {
    console.error("❌ MongoDB connection failed");
    console.error(error.message);

    throw error;
  }
}

module.exports = connectToDB;