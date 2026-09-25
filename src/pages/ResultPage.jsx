import { useLocation, useNavigate } from "react-router-dom";

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div style={{ maxWidth: 600, margin: "2rem auto" }}>
        <p>No result to show. Take a quiz first.</p>
        <button onClick={() => navigate("/")}>Back to Quizzes</button>
      </div>
    );
  }

  const questionResults = Array.isArray(result.questionResults)
    ? result.questionResults
    : [];

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h1>Quiz Result</h1>
      <p>
        Score: {result.score} / {result.total} ({result.percentage}%)
      </p>
      <p>
        Correct: {result.correct} — Incorrect: {result.incorrect}
      </p>
      <p><em>{result.performanceSummary}</em></p>

      <h3>Question Review</h3>
      {questionResults.length === 0 ? (
        <p>No question-level results available.</p>
      ) : (
        <ul>
          {questionResults.map((qr) => (
            <li key={qr.questionId} style={{ marginBottom: "1rem" }}>
              <strong>{qr.questionText}</strong>
              <br />
              Your answer: {qr.selectedOptionText ?? "(skipped)"} —{" "}
              {qr.correct ? "✅ Correct" : "❌ Incorrect"}
              <br />
              Correct answer: {qr.correctOptionText}
              <br />
              <em>{qr.explanation}</em>
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => navigate("/")}>Back to Quizzes</button>
    </div>
  );
}

export default ResultPage;