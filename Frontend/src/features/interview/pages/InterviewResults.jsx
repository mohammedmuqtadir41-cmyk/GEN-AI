import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  getInterviewSession,
  getInterviewSessionSummary,
} from "../services/interview.api";
import "../style/interviewResults.css";

const InterviewResults = () => {
  const navigate = useNavigate();
  const params = useParams();

  console.log("RESULTS PARAMS:", params);

  const { sessionId } = params;

  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [session, setSession] = useState(null);
  const [summary, setSummary] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        console.log("FETCHING WITH sessionId:", sessionId);
        
        setLoading(true);
        setError("");

        const [sessionData, summaryData] = await Promise.all([
          getInterviewSession(sessionId),
          getInterviewSessionSummary(sessionId),
        ]);

        console.log("Interview Session:", sessionData);
        console.log("Interview Summary:", summaryData);

        setSession(sessionData.interviewSession);
        setSummary(summaryData.summary);
      } catch (err) {
        console.error("Results error:", err);

        setError(err.message || "Failed to load interview results");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchResults();
    }
  }, [sessionId]);

  const handleStartNewInterview = () => {
    if (!session?.interviewReport) {
      return;
    }

    navigate(`/interview/${session.interviewReport}/session`);
  };

  const handleBackToDashboard = () => {
    navigate("/");
  };

  const toggleQuestion = (index) => {
    setExpandedQuestion((current) => (current === index ? null : index));
  };

  if (loading) {
    return (
      <main className="interview-results">
        <section className="results-container">
          <p>Loading your interview results...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="interview-results">
        <section className="results-container">
          <h2>Unable to load results</h2>
          <p>{error}</p>
        </section>
      </main>
    );
  }

  if (!session || !summary) {
    return null;
  }

  const questions = session.questionsAsked.filter(
    (question) => question.answer && question.answer.trim(),
  );

  const overallScore = Math.round(summary.averageScore * 10);

  let performance = "Needs Improvement";

  if (summary.averageScore >= 8) {
    performance = "Strong Performance";
  } else if (summary.averageScore >= 6) {
    performance = "Good Performance";
  } else if (summary.averageScore >= 4) {
    performance = "Average Performance";
  }

  return (
    <main className="interview-results">
      <section className="results-container">
        {/* HEADER */}

        <header className="results-header">
          <p className="results-eyebrow">INTERVIEW COMPLETED</p>

          <h1>Your Interview Results</h1>

          <p>
            Here is a breakdown of your performance and areas you can focus on
            improving.
          </p>
        </header>

        {/* OVERALL SCORE */}

        <section className="overall-score-card">
          <div className="overall-score-card__content">
            <span className="score-label">OVERALL PERFORMANCE</span>

            <h2>{performance}</h2>

            <p>Based on your answers across all interview questions.</p>
          </div>

          <div className="overall-score">
            <strong>{overallScore}</strong>
            <span>/100</span>
          </div>
        </section>

        {/* SUMMARY */}

        <section className="results-summary-card">
          <span className="section-label">INTERVIEW SUMMARY</span>

          <h2>Overall Assessment</h2>

          <p>
            You completed {summary.totalQuestionsAnswered} questions with an
            average score of {summary.averageScore}/10.
          </p>
        </section>

        {/* PERFORMANCE INSIGHTS */}

        <section className="insights-grid">
          <div className="insight-card insight-card--strengths">
            <div className="insight-card__header">
              <div className="insight-icon">💪</div>

              <div>
                <span className="section-label">BEST PERFORMANCE</span>

                <h2>Highest Score</h2>
              </div>
            </div>

            <ul>
              <li>
                <span>✓</span>
                Your highest score was{" "}
                <strong>{summary.highestScore}/10</strong>.
              </li>

              <li>
                <span>✓</span>
                Continue building on the topics where you demonstrated strong
                understanding.
              </li>
            </ul>
          </div>

          <div className="insight-card insight-card--improvements">
            <div className="insight-card__header">
              <div className="insight-icon">🎯</div>

              <div>
                <span className="section-label">AREA TO IMPROVE</span>

                <h2>Lowest Score</h2>
              </div>
            </div>

            <ul>
              <li>
                <span>→</span>
                Your lowest score was <strong>{summary.lowestScore}/10</strong>.
              </li>

              <li>
                <span>→</span>
                Review the feedback for lower-scoring answers and practice those
                topics.
              </li>
            </ul>
          </div>
        </section>

        {/* QUESTION BREAKDOWN */}

        <section className="question-breakdown">
          <div className="question-breakdown__header">
            <div>
              <span className="section-label">DETAILED ANALYSIS</span>

              <h2>Question Breakdown</h2>
            </div>

            <span className="question-count">{questions.length} Questions</span>
          </div>

          <div className="question-list">
            {questions.map((item, index) => {
              const isExpanded = expandedQuestion === index;

              return (
                <article
                  className={`result-question ${
                    isExpanded ? "result-question--expanded" : ""
                  }`}
                  key={item._id || index}
                >
                  <button
                    className="result-question__button"
                    onClick={() => toggleQuestion(index)}
                  >
                    <div className="result-question__number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="result-question__content">
                      <h3>{item.question}</h3>

                      <span>Click to view feedback</span>
                    </div>

                    <div className="result-question__score">
                      <strong>{item.score}</strong>

                      <span>/10</span>
                    </div>

                    <span className="result-question__arrow">
                      {isExpanded ? "−" : "+"}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="result-question__feedback">
                      <span>AI FEEDBACK</span>

                      <p>{item.feedback}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* ACTIONS */}

        <section className="results-actions">
          <button className="dashboard-btn" onClick={handleBackToDashboard}>
            ← Back to Dashboard
          </button>

          <button
            className="new-interview-btn"
            onClick={handleStartNewInterview}
          >
            Start New Interview
            <span>→</span>
          </button>
        </section>
      </section>
    </main>
  );
};

export default InterviewResults;
