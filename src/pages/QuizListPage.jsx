import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

function QuizListPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosClient
      .get("/quizzes")
      .then((response) => {
        setQuizzes(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load quizzes. Is the backend running?");
        setLoading(false);
        console.error(err);
      });
  }, []);

  if (loading) return <p>Loading quizzes...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Environmental Quizzes</h1>
      {quizzes.length === 0 ? (
        <p>No quizzes yet.</p>
      ) : (
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz.id}>
              <strong>{quiz.title}</strong> — {quiz.topic} ({quiz.difficulty}) —{" "}
              {quiz.numberOfQuestions} questions
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default QuizListPage;