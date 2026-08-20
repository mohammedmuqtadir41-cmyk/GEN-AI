import api from "../../auth/Services/api";

/**
 * Generate interview report based on job description,
 * self description and optional resume.
 */
export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  const formData = new FormData();

  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription || "");

  if (resumeFile) {
    formData.append("resume", resumeFile);
  }

  const response = await api.post("/interview/", formData);

  return response.data;
};


/**
 * Get interview report by ID.
 */
export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(
    `/interview/report/${interviewId}`,
  );

  return response.data;
};


/**
 * Get all interview reports of logged-in user.
 */
export const getAllInterviewReports = async () => {
  const response = await api.get("/interview/");

  return response.data;
};


/**
 * Generate resume PDF.
 */
export const generateResumePdf = async ({
  interviewReportId,
}) => {
  const response = await api.post(
    `/interview/resume/pdf/${interviewReportId}`,
    null,
    {
      responseType: "blob",
    },
  );

  return response.data;
};


/**
 * Create interview session.
 */
export const createInterviewSession = async (
  interviewReportId,
) => {
  const response = await api.post(
    "/interview/session",
    {
      interviewReportId,
    },
  );

  return response.data;
};


/**
 * Submit answer for interview session.
 */
export const submitInterviewAnswer = async (
  sessionId,
  answer,
) => {
  const response = await api.post(
    `/interview/session/${sessionId}/answer`,
    {
      answer,
    },
  );

  return response.data;
};


/**
 * Get interview session.
 */
export const getInterviewSession = async (
  sessionId,
) => {
  const response = await api.get(
    `/interview/session/${sessionId}`,
  );

  return response.data;
};


/**
 * Get interview session summary.
 */
export const getInterviewSessionSummary = async (
  sessionId,
) => {
  const response = await api.get(
    `/interview/session/${sessionId}/summary`,
  );

  return response.data;
};