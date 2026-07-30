import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateResumePdf,
} from "../services/interview.api";
import { useCallback, useContext, useEffect, useState } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";

export const useInterview = ({ autoFetch = true } = {}) => {
  const context = useContext(InterviewContext);
  const { interviewId } = useParams();
  const [error, setError] = useState(null);

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

  const generateReport = useCallback(
    async ({ jobDescription, selfDescription, resumeFile }) => {
      setError(null);
      setLoading(true);
      try {
        const response = await generateInterviewReport({
          jobDescription,
          selfDescription,
          resumeFile,
        });
        const interviewReport = response?.interviewReport || null;
        setReport(interviewReport);
        return interviewReport;
      } catch (error) {
        console.error(error);
        setError("Unable to generate interview strategy.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setReport],
  );

  const getReportById = useCallback(
    async (interviewId) => {
      if (!interviewId) {
        return null;
      }
      setError(null);
      setReport(null);
      setLoading(true);
      try {
        const response = await getInterviewReportById(interviewId);
        const interviewReport = response?.interviewReport || null;
        if (!interviewReport) {
          setError("Interview report not found.");
          return null;
        }
        setReport(interviewReport);
        return interviewReport;
      } catch (error) {
        console.error(error);
        setError("Unable to load interview report.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setReport],
  );

  const getReports = useCallback(async () => {
    setError(null);
    setReports([]);
    setLoading(true);
    try {
      const response = await getAllInterviewReports();
      const interviewReports = response?.interviewReports || [];
      setReports(interviewReports);
      return interviewReports;
    } catch (error) {
      console.error(error);
      setError("Unable to load interview history.");
      return [];
    } finally {
      setLoading(false);
    }
  }, [setLoading, setReports]);

  const getResumePdf = useCallback(async (interviewReportId) => {
    try {
      const response = await generateResumePdf({ interviewReportId });
      const url = window.URL.createObjectURL(
        new Blob([response], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${interviewReportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      setError("Unable to download resume PDF.");
    }
  }, []);

  useEffect(() => {
    if (!autoFetch) {
      return;
    }

    const loadReport = async () => {
      if (interviewId) {
        await getReportById(interviewId);
      } else {
        await getReports();
      }
    };

    loadReport();
  }, [autoFetch, interviewId, getReportById, getReports]);

  return {
    loading,
    report,
    reports,
    error,
    generateReport,
    getReportById,
    getReports,
    getResumePdf,
  };
};
