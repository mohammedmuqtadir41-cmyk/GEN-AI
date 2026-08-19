import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const API_URL = `${BASE_URL}/api/interview`

/**
 * @description Service to generate interview report based on user self description, resume and job description.
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

  const response = await api.post("/api/interview/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/api/interview/report/${interviewId}`);

  return response.data;
};

/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
  const response = await api.get("/api/interview/");

  return response.data;
};

/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
  const response = await api.post(
    `/api/interview/resume/pdf/${interviewReportId}`,
    null,
    {
      responseType: "blob",
    },
  );

  return response.data;
};


export const createInterviewSession = async (interviewReportId) => {
  const response = await fetch(`${API_URL}/session`, {
    method: "POST",
    credentials: "include",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ interviewReportId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || "Failed to start interview");
  }

  return data;
};

export const submitInterviewAnswer = async(sessionId, answer) => {
    const response = await fetch (`${API_URL}/session/${sessionId}/answer`, 
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({answer}),
        },
    );

    const data = await response.json();

    if(!response.ok){
        throw new Error (data.msg || "Failed to submit answer")
    }

    return data;
}

export const getInterviewSession = async(sessionId) => {
  const response = await api.get(`/api/interview/session/${sessionId}`);

  return response.data;
}

export const getInterviewSessionSummary = async (sessionId) => {
  const response = await api.get(`/api/interview/session/${sessionId}/summary`);

  return response.data;
}