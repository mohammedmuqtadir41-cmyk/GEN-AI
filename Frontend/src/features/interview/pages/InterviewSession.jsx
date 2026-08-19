import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  createInterviewSession,
  submitInterviewAnswer,
} from "../services/interview.api";
import "../style/InterviewSession.css";

const InterviewSession = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState("");

  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [questionNumber, setQuestionNumber] = useState(1);

  useEffect(() => {
    const startSession = async () => {
      try {
        setLoading(true);
        setSessionError("");

        const data = await createInterviewSession(interviewId);

        console.log("Session created:", data);

        setSession(data.interviewSession);
      } catch (err) {
        console.error("Session error:", err);
        setSessionError(err.message);
      } finally {
        setLoading(false);
      }
    };

    startSession();
  }, [interviewId]);

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || !session?._id || submitting) {
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      const data = await submitInterviewAnswer(session._id, answer);

      console.log("Answer response:", data);

      /*
        Adjust these property names only if your backend
        returns a different response structure.
      */
      setFeedback(data.evaluation);
      setSession(data.interviewSession);
    } catch (err) {
      console.error("Submit answer error:", err);
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    setQuestionNumber((previousNumber) => previousNumber + 1);

    setAnswer("");
    setFeedback(null);
    setSubmitError("");
  };

  const handleFinishInterview = () => {
  console.log("SESSION OBJECT:", session);
  console.log("SESSION ID:", session?._id);

  console.log(
    "NAVIGATE URL:",
    `/interview/${interviewId}/session/${session?._id}/results`
  );

  if (!session?._id) {
    console.error("Cannot finish interview: session._id is missing");
    return;
  }

  navigate(
    `/interview/${interviewId}/session/${session._id}/results`
  );
};

  if (loading) {
    return (
      <main className="interview-session">
        <section className="interview-loading">
          <p>Starting your interview...</p>
        </section>
      </main>
    );
  }

  if (sessionError) {
    return (
      <main className="interview-session">
        <section className="interview-error">
          <h2>Unable to start interview</h2>
          <p>{sessionError}</p>
        </section>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  const isInterviewComplete = feedback?.isCompleted === true;

  return (
    <main className="interview-session">
      <header className="session-header">
        <div>
          <p className="session-header__eyebrow">AI MOCK INTERVIEW</p>

          <h1>Interview Session</h1>
        </div>

        <div className="session-progress">
          <span className="session-progress__label">Question</span>

          <strong>{questionNumber}</strong>
        </div>
      </header>

      <section className="session-container">
        <section className="question-card">
          <div className="question-card__top">
            <div className="interviewer">
              <div className="interviewer__avatar">AI</div>

              <div>
                <span className="interviewer__label">YOUR INTERVIEWER</span>

                <h3>AI Interviewer</h3>
              </div>
            </div>

            <span className="question-number">
              {String(questionNumber).padStart(2, "0")}
            </span>
          </div>

          <h2 className="question-card__text">{session.currentQuestion}</h2>
        </section>

        {!feedback && (
          <section className="answer-card">
            <div className="answer-card__header">
              <div>
                <span className="answer-card__label">YOUR RESPONSE</span>

                <h3>Your Answer</h3>
              </div>

              <span className="character-count">
                {answer.length} characters
              </span>
            </div>

            <textarea
              className="answer-input"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Take your time and explain your answer clearly..."
              disabled={submitting}
            />

            {submitError && <p className="submit-error">{submitError}</p>}

            <div className="answer-card__footer">
              <p>Take your time and explain your answer clearly.</p>

              <button
                className="submit-answer-btn"
                onClick={handleSubmitAnswer}
                disabled={!answer.trim() || submitting}
              >
                {submitting ? "Evaluating..." : "Submit Answer"}

                {!submitting && <span>→</span>}
              </button>
            </div>
          </section>
        )}

        {feedback && (
          <section className="feedback-card">
            <div className="feedback-card__header">
              <div>
                <span>AI FEEDBACK</span>

                <h3>Quick Feedback</h3>
              </div>

              {feedback.score !== undefined && (
                <div className="feedback-score">
                  <strong>{feedback.score}</strong>
                  <span>/10</span>
                </div>
              )}
            </div>

            <p className="feedback-text">{feedback.feedback}</p>

            <div className="feedback-actions">
              {isInterviewComplete ? (
                <button
                  className="finish-interview-btn"
                  onClick={handleFinishInterview}
                >
                  Finish Interview
                  <span>✓</span>
                </button>
              ) : (
                <button
                  className="next-question-btn"
                  onClick={handleNextQuestion}
                >
                  Next Question
                  <span>→</span>
                </button>
              )}
            </div>
          </section>
        )}
      </section>
    </main>
  );
};

export default InterviewSession;
