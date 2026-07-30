const mongoose = require("mongoose");
const pdfParse = require("pdf-parse");
const generateInterviewReport = require("../services/ai.service");
const interviewReportModel = require("../models/InterviewRepot.model");

function escapePdfString(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\r\n|\r|\n/g, "\\n");
}

function buildSimplePdf(title, body) {
  const words = body.split(/\r?\n/).slice(0, 40);
  const escapedTitle = escapePdfString(title);
  const escapedLines = words.map((line) => escapePdfString(line));
  const textStream = [
    "BT",
    "/F1 12 Tf",
    "50 760 Td",
    `(${escapedTitle}) Tj`,
    "0 -18 Td",
    ...escapedLines.flatMap((line) => [`(${line}) Tj`, "0 -16 Td"]),
    "ET",
  ].join("\n");

  const obj1 = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
  const obj2 = "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";
  const obj3 =
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>\nendobj\n";
  const stream = `4 0 obj\n<< /Length ${Buffer.byteLength(textStream, "utf8")} >>\nstream\n${textStream}\nendstream\nendobj\n`;
  const obj5 =
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n";

  const header = "%PDF-1.1\n";
  const bodyPdf = header + obj1 + obj2 + obj3 + stream + obj5;
  const offsets = [];
  let cursor = 0;
  const parts = [header, obj1, obj2, obj3, stream, obj5];
  for (const part of parts) {
    offsets.push(cursor);
    cursor += Buffer.byteLength(part, "utf8");
  }

  const xref =
    [
      "xref\n0 6",
      "0000000000 65535 f ",
      ...offsets
        .slice(1)
        .map((offset) => `${String(offset).padStart(10, "0")} 00000 n `),
    ].join("\n") + "\n";

  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${cursor}\n%%EOF`;
  return Buffer.from(bodyPdf + xref + trailer, "utf8");
}

async function generateInterviewReportController(req, res) {
  try {
    const { selfDescription, jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({
        message: "Job description is required",
      });
    }

    if (!req.file && !selfDescription) {
      return res.status(400).json({
        message: "Provide a resume file or a self description.",
      });
    }

    const resumeContent = req.file
      ? (await pdfParse(req.file.buffer)).text
      : "";

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      jobDescription,
      resume: resumeContent,
      selfDescription,
      ...interviewReportByAi,
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

async function getInterviewReportByIdController(req, res) {
  try {
    const interviewId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({
        message: "Invalid interview report id.",
      });
    }

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found.",
      });
    }

    res.status(200).json({ interviewReport });
  } catch (error) {
    console.error("Interview Controller Error");
    console.error(error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

async function getAllInterviewReportsController(req, res) {
  try {
    const interviewReports = await interviewReportModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({ interviewReports });
  } catch (error) {
    console.error("Interview Controller Error");
    console.error(error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

async function generateResumePdfController(req, res) {
  try {
    const interviewId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({
        message: "Invalid interview report id.",
      });
    }

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found.",
      });
    }

    const title = `Interview Resume ${interviewReport._id}`;
    const body = `Job Description:\n${interviewReport.jobDescription || "N/A"}\n\nSelf Description:\n${interviewReport.selfDescription || "N/A"}\n\nResume:\n${interviewReport.resume || "N/A"}`;
    const pdfBuffer = buildSimplePdf(title, body);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=resume_${interviewReport._id}.pdf`,
    );
    res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error("Interview Controller Error");
    console.error(error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
};
