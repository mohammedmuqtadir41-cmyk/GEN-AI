const express = require("express")
const authMiddlewear = require("../middlewears/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewears/file.middlewear")

const interviewRouter = express.Router();


/**
 * @Route POST /api/interview
 * @description generate new interview report on the basis of the user's self description, resume pdf and ob description
 * @access private
 */

interviewRouter.post("/", authMiddlewear.authUser,upload.single("resume"), interviewController.generateInterviewReportController)

module.exports = interviewRouter;