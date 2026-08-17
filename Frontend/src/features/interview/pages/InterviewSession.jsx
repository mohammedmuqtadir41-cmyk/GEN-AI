import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  createInterviewSession,
  submitInterviewAnswer,
} from "../services/interview.api";

const InterviewSession = () => {
  const { interviewId } = useParams();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  const handleSubmitAnswer = () => {
    const mockResponse = {
      score: 8,
      feedback:
        "Good answer. You explained the project clearly and showed a solid understanding of the architecture. Try to structure your explanation more confidently and mention the technologies used at each stage.",
    };

    console.log("Mock answer response:", mockResponse);

    setFeedback(mockResponse);
  };

  useEffect(() => {
    const startSession = async () => {
      try {
        setLoading(true);

        const data = await createInterviewSession(interviewId);

        console.log("Session created:", data);

        setSession(data.interviewSession);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    startSession();
  }, [interviewId]);

  if (loading) {
    return <h1>Starting interview...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
  <main className="interview-session">
    <header className="session-header">
      <div>
        <p className="session-header__eyebrow">
          AI MOCK INTERVIEW
        </p>

        <h1>Interview Session</h1>
      </div>

      <div className="session-progress">
        <span className="session-progress__label">
          Question
        </span>

        <strong>1 of 5</strong>
      </div>
    </header>

    <section className="session-container">

      <div className="question-card">
        <div className="question-card__top">
          <div className="interviewer">
            <div className="interviewer__avatar">
              AI
            </div>

            <div>
              <span className="interviewer__label">
                YOUR INTERVIEWER
              </span>

              <h3>AI Interviewer</h3>
            </div>
          </div>

          <span className="question-number">
            01
          </span>
        </div>

        <h2 className="question-card__text">
          {session?.currentQuestion}
        </h2>
      </div>

      <div className="answer-card">
        <div className="answer-card__header">
          <div>
            <span className="answer-card__label">
              YOUR RESPONSE
            </span>

            <h3>Your Answer</h3>
          </div>

          <span className="character-count">
            {answer.length} characters
          </span>
        </div>

        <textarea
          className="answer-input"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Start typing your answer here..."
        />

        <div className="answer-card__footer">
          <p>
            Take your time and explain your answer clearly.
          </p>

          <button
            className="submit-answer-btn"
            onClick={handleSubmitAnswer}
            disabled={!answer.trim()}
          >
            Submit Answer
            <span>→</span>
          </button>
        </div>
      </div>

      {feedback && (
        <section className="feedback-card">
          <div className="feedback-card__header">
            <div>
              <span>AI EVALUATION</span>
              <h3>Feedback on your answer</h3>
            </div>

            <div className="feedback-score">
              <strong>{feedback.score}</strong>
              <span>/10</span>
            </div>
          </div>

          <p className="feedback-text">
            {feedback.feedback}
          </p>
        </section>
      )}

    </section>
  </main>
);
};

export default InterviewSession;
