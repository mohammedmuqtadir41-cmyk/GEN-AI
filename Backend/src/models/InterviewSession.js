const mongoose = require("mongoose");

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    interviewReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "interviewReports",
      required: true,
    },
    currentQuestion: {
      type: String,
      default: "",
    },
    questionsAsked: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          default: "",
        },
        feedback: {
          type: String,
          default: "",
        },
        score: {
          type: Number,
          min: 0,
          max: 10,
        },
      },
    ],

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    finalScore: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  },
);

const interviewSessionModel = mongoose.model(
  "interviewSession",
  interviewSessionSchema,
);

module.exports = interviewSessionModel;