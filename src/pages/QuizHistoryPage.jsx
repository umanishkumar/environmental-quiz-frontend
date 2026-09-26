import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

function QuizHistoryPage() {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/quizzes/history?page=${page}&size=10`)
      .then((res) => {
        setAttempts(res.data.content);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load quiz history.");
        setLoading(false);
      });
  }, [page]);

  const openAttempt = async (attemptId) => {
    try {
      const response = await axiosClient.get(`/quizzes/attempts/${attemptId}`);
      navigate("/result", { state: { result: response.data } });
    } catch (err) {
      console.error(err);
      setError("Failed to load this attempt.");
    }
  };

  if (loading) return <p>Loading history...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto" }}>
      <h1>Quiz History</h1>

      {attempts.length === 0 ? (
        <p>You haven't attempted any quizzes yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #ccc" }}>
              <th style={{ padding: "0.5rem" }}>Title</th>
              <th style={{ padding: "0.5rem" }}>Topic</th>
              <th style={{ padding: "0.5rem" }}>Difficulty</th>
              <th style={{ padding: "0.5rem" }}>Score</th>
              <th style={{ padding: "0.5rem" }}>Date</th>
              <th style={{ padding: "0.5rem" }}></th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((a) => (
              <tr key={a.attemptId} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "0.5rem" }}>{a.title}</td>
                <td style={{ padding: "0.5rem" }}>{a.topic}</td>
                <td style={{ padding: "0.5rem" }}>{a.difficulty}</td>
                <td style={{ padding: "0.5rem" }}>
                  {a.score}/{a.total} ({a.percentage}%)
                </td>
                <td style={{ padding: "0.5rem" }}>
                  {new Date(a.attemptedAt).toLocaleDateString()}
                </td>
                <td style={{ padding: "0.5rem" }}>
                  <button onClick={() => openAttempt(a.attemptId)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizHistoryPage;