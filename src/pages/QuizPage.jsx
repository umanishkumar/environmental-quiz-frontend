import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOptionId }
  const [submitting, setSubmitting] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    axiosClient
      .get(`/quizzes/${id}`)
      .then((res) => setQuiz(res.data))
      .catch(() => setError("Could not load this quiz."));
  }, [id]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!quiz) return <p>Loading quiz...</p>;

  const currentQuestion = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;

  const handleSelectOption = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    const timeTakenSeconds = Math.round((Date.now() - startTime) / 1000);

    const payload = {
      answers: quiz.questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: answers[q.id] ?? null,
      })),
      timeTakenSeconds,
    };

    try {
      const response = await axiosClient.post(`/quizzes/${id}/submit`, payload);
      // Result page comes properly in a later phase — for now, pass data via navigation state
      navigate(`/result`, { state: { result: response.data } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h1>{quiz.title}</h1>
      <p>
        Question {currentIndex + 1} / {totalQuestions}
      </p>

      <div style={{ margin: "1.5rem 0" }}>
        <h3>{currentQuestion.questionText}</h3>
        {currentQuestion.options.map((opt) => (
          <label
            key={opt.id}
            style={{
              display: "block",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginBottom: "0.5rem",
              cursor: "pointer",
              background: answers[currentQuestion.id] === opt.id ? "#e0f0ff" : "white",
            }}
          >
            <input
              type="radio"
              name={`question-${currentQuestion.id}`}
              checked={answers[currentQuestion.id] === opt.id}
              onChange={() => handleSelectOption(currentQuestion.id, opt.id)}
              style={{ marginRight: "0.5rem" }}
            />
            {opt.optionText}
          </label>
        ))}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={handlePrevious} disabled={currentIndex === 0}>
          Previous
        </button>

        {currentIndex < totalQuestions - 1 ? (
          <button onClick={handleNext}>Next</button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        )}
      </div>

      <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}>
        Answered: {answeredCount} / {totalQuestions}
      </p>
    </div>
  );
}

export default QuizPage;