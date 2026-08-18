import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import "../style/interviewResults.css";

const mockResults = {
  overallScore: 80,
  performance: "Strong Performance",

  summary:
    "You demonstrated a solid understanding of full-stack development concepts and explained your project experience clearly. Your strongest areas were practical reasoning and technical understanding. Focus on structuring some answers more clearly and going deeper into backend scalability concepts.",

  strengths: [
    "Good understanding of full-stack application architecture.",
    "Strong practical problem-solving approach.",
    "Clear knowledge of authentication and protected routes.",
    "Able to connect technical concepts with real projects.",
  ],

  improvements: [
    "Structure answers in a clearer step-by-step format.",
    "Explain backend scalability concepts in more depth.",
    "Include more technical examples when answering.",
    "Be more specific when describing project challenges.",
  ],

  questions: [
    {
      question:
        "Could you walk me through your AI Interview Report Generator project and explain its architecture?",
      score: 8,
      feedback:
        "Good explanation of the overall architecture. You clearly described the backend flow and AI integration. A more structured explanation would make your answer even stronger.",
    },

    {
      question:
        "How do you handle authentication and protect private routes in your application?",
      score: 7,
      feedback:
        "You explained the authentication flow well. You could improve by discussing token verification and how unauthorized requests are handled.",
    },

    {
      question:
        "How would you improve backend performance if your application started receiving a large number of requests?",
      score: 8,
      feedback:
        "Strong practical thinking. Consider discussing caching, rate limiting, and database optimization in more detail.",
    },

    {
      question:
        "What is the difference between client-side rendering and server-side rendering?",
      score: 9,
      feedback:
        "Excellent answer. You clearly explained both rendering approaches and provided good examples of when each one should be used.",
    },

    {
      question:
        "What was the most difficult technical challenge you faced while building your project?",
      score: 8,
      feedback:
        "Good problem-solving explanation. Including the alternative solutions you considered would make the answer more compelling.",
    },
  ],
};

const InterviewResults = () => {
  const navigate = useNavigate();
  const { interviewId } = useParams();

  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const handleStartNewInterview = () => {
    navigate("/");
  };

  const handleBackToDashboard = () => {
    navigate("/");
  };

  const toggleQuestion = (index) => {
    setExpandedQuestion((current) =>
      current === index ? null : index
    );
  };

  return (
    <main className="interview-results">
      <section className="results-container">

        {/* HEADER */}

        <header className="results-header">
          <p className="results-eyebrow">
            INTERVIEW COMPLETED
          </p>

          <h1>Your Interview Results</h1>

          <p>
            Here is a breakdown of your performance and
            areas you can focus on improving.
          </p>
        </header>


        {/* OVERALL SCORE */}

        <section className="overall-score-card">
          <div className="overall-score-card__content">
            <span className="score-label">
              OVERALL PERFORMANCE
            </span>

            <h2>{mockResults.performance}</h2>

            <p>
              Based on your answers across all interview
              questions.
            </p>
          </div>

          <div className="overall-score">
            <strong>
              {mockResults.overallScore}
            </strong>

            <span>/100</span>
          </div>
        </section>


        {/* SUMMARY */}

        <section className="results-summary-card">
          <span className="section-label">
            AI SUMMARY
          </span>

          <h2>Overall Assessment</h2>

          <p>
            {mockResults.summary}
          </p>
        </section>


        {/* STRENGTHS + IMPROVEMENTS */}

        <section className="insights-grid">

          <div className="insight-card insight-card--strengths">
            <div className="insight-card__header">
              <div className="insight-icon">
                💪
              </div>

              <div>
                <span className="section-label">
                  WHAT YOU DID WELL
                </span>

                <h2>Strengths</h2>
              </div>
            </div>

            <ul>
              {mockResults.strengths.map((strength) => (
                <li key={strength}>
                  <span>✓</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>


          <div className="insight-card insight-card--improvements">
            <div className="insight-card__header">
              <div className="insight-icon">
                🎯
              </div>

              <div>
                <span className="section-label">
                  AREAS TO IMPROVE
                </span>

                <h2>Focus Areas</h2>
              </div>
            </div>

            <ul>
              {mockResults.improvements.map((improvement) => (
                <li key={improvement}>
                  <span>→</span>
                  {improvement}
                </li>
              ))}
            </ul>
          </div>

        </section>


        {/* QUESTION BREAKDOWN */}

        <section className="question-breakdown">
          <div className="question-breakdown__header">
            <div>
              <span className="section-label">
                DETAILED ANALYSIS
              </span>

              <h2>Question Breakdown</h2>
            </div>

            <span className="question-count">
              {mockResults.questions.length} Questions
            </span>
          </div>


          <div className="question-list">
            {mockResults.questions.map(
              (item, index) => {
                const isExpanded =
                  expandedQuestion === index;

                return (
                  <article
                    className={`result-question ${
                      isExpanded
                        ? "result-question--expanded"
                        : ""
                    }`}
                    key={index}
                  >
                    <button
                      className="result-question__button"
                      onClick={() =>
                        toggleQuestion(index)
                      }
                    >
                      <div className="result-question__number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <div className="result-question__content">
                        <h3>
                          {item.question}
                        </h3>

                        <span>
                          Click to view feedback
                        </span>
                      </div>

                      <div className="result-question__score">
                        <strong>
                          {item.score}
                        </strong>

                        <span>/10</span>
                      </div>

                      <span className="result-question__arrow">
                        {isExpanded ? "−" : "+"}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="result-question__feedback">
                        <span>
                          AI FEEDBACK
                        </span>

                        <p>
                          {item.feedback}
                        </p>
                      </div>
                    )}
                  </article>
                );
              }
            )}
          </div>
        </section>


        {/* ACTIONS */}

        <section className="results-actions">
          <button
            className="dashboard-btn"
            onClick={handleBackToDashboard}
          >
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