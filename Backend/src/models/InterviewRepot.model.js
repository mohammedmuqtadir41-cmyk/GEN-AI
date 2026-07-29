const mongoose = require("mongoose");

/**
 * Job description Schema : String
 * Resume text : String
 * Self description : String
 *
 * overallScore : Number
 *
 * Technical Questions: [{
 * question : ""
 * intention : ""
 * answer: ""
 * }]
 * Behavioral Questions: [{
 * question : ""
 * intention : ""
 * answer: ""
 * }]
 *
 * Skill gaps: [{
 * skill: "",
 * severity: {
 * type: string,
 * enum: ["low","medium","high"]
 * }
 * }]
 *
 * Preparation plan : [{
 * day: Number,
 * focus: String,
 * tasks: [String],
 * }]
 */

const skillGapsSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "Skill is required"],
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "Severity is required"],
    },
  },
  {
    _id: false,
  },
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: [true, "Day is required"],
    },
    focus: {
      type: String,
      required: [true, "focus is required"],
    },
    tasks: [
      {
        type: String,
        required: [true, "Tasks is required"],
      },
    ],
  },
  {
    _id: false,
  },
);

const behavioralQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Behavioral Quesiton is required"],
    },
    intention: {
      type: String,
      required: [true, "Intention is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  {
    _id: false,
  },
);

const technicalQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Technical question is required"],
    },
    intention: {
      type: String,
      required: [true, "Intention is reqired"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  {
    _id: false,
  },
);

const interviewReportSchema = new mongoose.Schema(
  {
    jobDescription: {
      type: String,
      required: [true, "job description is required"],
    },
    resume: {
      type: String,
    },
    selfDescription: {
      type: String,
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    technicalQuestion: [technicalQuestionSchema],
    behavioralQuestion: [behavioralQuestionSchema],
    skillsGaps: [skillGapsSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  },
);

const interviewReportModel = mongoose.model(
  "InterviewReport",
  interviewReportSchema,
);

module.exports = interviewReportModel;
