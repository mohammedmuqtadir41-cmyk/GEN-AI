const pdfParse = require("pdf-parse");
console.log(pdfParse);


const generateInterviewReport = require("../services/ai.service");
const interviewReportModel = require("../models/InterviewRepot.model");

async function generateInterviewReportController(req, res) {

  const resumeContent = await pdfParse(req.file.buffer);
  const { selfDescription, jobDescription } = req.body;

  const interviewReportByAi = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
  });

  console.log(interviewReportByAi);

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
}

module.exports = { generateInterviewReportController };
