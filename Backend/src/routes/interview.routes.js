const express = require("express");
const authMiddlewear = require("../middlewears/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewears/file.middlewear");
const {interviewSessionController, submitInterviewAnswerController, completeInterviewSessionController  } = require("../controllers/interviewSession.controller");

const interviewRouter = express.Router();

/**
 * @route   POST /api/interview
 * @description generate new interview report on the basis of the user's self description, resume pdf and job description
 * @access  private
 */
interviewRouter.post(
  "/",
  authMiddlewear.authUser,
  upload.single("resume"),
  interviewController.generateInterviewReportController,
);

/**
 * @route   POST /api/interview/session
 * @description create a new mock interview session for an existing interview report
 * @access  private
 */

interviewRouter.post(
  "/session",
  authMiddlewear.authUser,
  interviewSessionController,
);

interviewRouter.post(
  "/session/:sessionId/answer", authMiddlewear.authUser, submitInterviewAnswerController
)

interviewRouter.patch(
  "/session/:sessionId/complete",
  authMiddlewear.authUser,
  completeInterviewSessionController
);

/**
 * @route   GET /api/interview/report/:id
 * @description fetch a single interview report by id
 * @access  private
 */
interviewRouter.get(
  "/report/:id",
  authMiddlewear.authUser,
  interviewController.getInterviewReportByIdController,
);

/**
 * @route   GET /api/interview
 * @description fetch all interview reports for the logged in user
 * @access  private
 */
interviewRouter.get(
  "/",
  authMiddlewear.authUser,
  interviewController.getAllInterviewReportsController,
);

/**
 * @route   POST /api/interview/resume/pdf/:id
 * @description generate a resume PDF from the stored interview report data
 * @access  private
 */
interviewRouter.post(
  "/resume/pdf/:id",
  authMiddlewear.authUser,
  interviewController.generateResumePdfController,
);

module.exports = interviewRouter;
