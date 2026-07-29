const pdfParse = require("pdf-parse");
const generateInterviewReport = require("../services/ai.service");
const interviewReportModel = require("../models/InterviewRepot.model");

async function generateInterviewReportController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Resume PDF is required",
      });
    }

    const resumeContent = await pdfParse(req.file.buffer);

    const { selfDescription, jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({
        message: "Job description is required",
      });
    }

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
    });

    console.dir(interviewReportByAi, { depth: null });

    //   const interviewReport = await interviewReportModel.create({
    //     user: req.user.id,
    //     jobDescription: jobDescription,
    //     resume: resumeContent.text,
    //     selfDescription,
    //     ...interviewReportByAi,
    //   });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      jobDescription,
      resume: resumeContent.text,
      selfDescription,

      matchScore: interviewReportByAi.matchScore,

      technicalQuestion: interviewReportByAi.technicalQuestion,

      behavioralQuestion: interviewReportByAi.behavioralQuestion,

      skillsGaps: interviewReportByAi.skillsGaps,

      preparationPlan: interviewReportByAi.preparationPlan,
    });

    res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport,
    });
  } catch (error) {
    console.error("Interview Controller Error");
    console.error(error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

module.exports = { generateInterviewReportController };
