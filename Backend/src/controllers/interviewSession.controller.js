const interviewReportModel = require("../models/InterviewRepot.model");
const interviewSessionModel = require("../models/InterviewSession");
const {
  generateOpeningMockQuestion,
  evaluateInterviewAnswer,
  generateNextQuestion,
} = require("../services/ai.service");

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
          feedback: "",
        },
      ],
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

async function submitInterviewAnswerController(req, res) {
  try {
    const { sessionId } = req.params;
    const { answer } = req.body;

    if (!answer || !answer.trim()) {
      return res.status(400).json({
        message: "Answer is required",
      });
    }

    if (answer.trim().length < 10) {
      return res.status(400).json({
        message: "Answer must be at least 10 characters long",
      });
    }

    const interviewSession = await interviewSessionModel.findOne({
      _id: sessionId,
      user: req.user.id,
    });

    if (!interviewSession) {
      return res.status(404).json({
        message: "Interview session not found",
      });
    }

    if (interviewSession.status !== "active") {
      return res.status(400).json({
        message: "Interview session is not active",
      });
    }

    const currentQuestion = interviewSession.currentQuestion;

    if (!currentQuestion) {
      return res.status(400).json({
        message: "No current question found",
      });
    }

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewSession.interviewReport,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found",
      });
    }

    const evaluation = await evaluateInterviewAnswer({
      question: currentQuestion,
      answer,
      interviewReport,
    });

    const currentQuestionEntry =
      interviewSession.questionsAsked[
        interviewSession.questionsAsked.length - 1
      ];

    currentQuestionEntry.answer = answer;
    currentQuestionEntry.feedback = evaluation.feedback;
    currentQuestionEntry.score = evaluation.score;

    const nextQuestion = await generateNextQuestion({
      interviewReport,
      questionsAsked: interviewSession.questionsAsked,
    });

    interviewSession.questionsAsked.push({
      question: nextQuestion,
      answer: "",
      feedback: "",
    });

    interviewSession.currentQuestion = nextQuestion;

    // await interviewSession.save();

    await interviewSession.save();

    return res.status(200).json({
      message: "Answer evaluated successfully",
      evaluation,
      interviewSession,
    });
  } catch (error) {
    console.error("Submit Interview Answer Error");
    console.error(error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

module.exports = {
  interviewSessionController,
  submitInterviewAnswerController,
};
