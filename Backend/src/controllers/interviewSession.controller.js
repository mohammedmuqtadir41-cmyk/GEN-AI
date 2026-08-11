const interviewReportModel = require("../models/InterviewRepot.model");
const interviewSessionModel = require("../models/InterviewSession");
const { generateOpeningMockQuestion } = require("../services/ai.service");

async function interviewSessionController(req, res) {
  try {
    const { interviewReportId } = req.body;

    if (!interviewReportId) {
      return res.status(400).json({
        msg: "Interview report id is required",
      });
    }

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewReportId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(400).json({
        msg: "Interview report id not found",
      });
    }

    const openingQuestion = await generateOpeningMockQuestion({
      interviewReport,
    });

    const interviewSession = await interviewSessionModel.create({
      user: req.user.id,
      interviewReport: interviewReport._id,
      status: "active",
      currentQuestion: openingQuestion,
      questionsAsked: [
        {
          question: openingQuestion,
          answer: "",
          fedback: "",
        }
      ]
    });

    res.status(201).json({
      message: "Interview session created successfully",
      interviewSession,
    });
  } catch (error) {
    console.error("Interview Session Controller Error");
    console.error(error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

module.exports = interviewSessionController;
