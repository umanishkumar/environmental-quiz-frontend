import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

function DashboardPage() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosClient
      .get("/dashboard")
      .then((res) => {
        setDashboard(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load dashboard.");
        setLoading(false);
      });
  }, []);

  const openAttempt = async (attemptId) => {
    try {
      const response = await axiosClient.get(`/quizzes/attempts/${attemptId}`);
      navigate("/result", { state: { result: response.data } });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!dashboard) return null;

  const {
    totalQuizzesAttempted,
    averageScorePercentage,
    bestScorePercentage,
    totalQuestionsAnswered,
    totalCorrectAnswers,
    recentQuizzes,
    topicPerformance,
    difficultyPerformance,
  } = dashboard;

  if (totalQuizzesAttempted === 0) {
    return (
      <div style={{ maxWidth: 700, margin: "2rem auto" }}>
        <h1>Dashboard</h1>
        <p>You haven't attempted any quizzes yet.</p>
        <button onClick={() => navigate("/generate")}>Generate your first quiz</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h1>Dashboard</h1>

      {/* Summary cards */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <StatCard label="Quizzes Attempted" value={totalQuizzesAttempted} />
        <StatCard label="Average Score" value={`${averageScorePercentage.toFixed(1)}%`} />
        <StatCard label="Best Score" value={`${bestScorePercentage.toFixed(1)}%`} />
        <StatCard label="Questions Answered" value={totalQuestionsAnswered} />
        <StatCard label="Correct Answers" value={totalCorrectAnswers} />
      </div>

      {/* Topic performance */}
      <h3>Topic-wise Performance</h3>
      {topicPerformance.length === 0 ? (
        <p>No data yet.</p>
      ) : (
        <div style={{ marginBottom: "2rem" }}>
          {topicPerformance.map((t) => (
            <PerformanceBar
              key={t.topic}
              label={`${t.topic} (${t.attemptCount} attempt${t.attemptCount > 1 ? "s" : ""})`}
              percentage={t.averagePercentage}
            />
          ))}
        </div>
      )}

      {/* Difficulty performance */}
      <h3>Difficulty-wise Performance</h3>
      {difficultyPerformance.length === 0 ? (
        <p>No data yet.</p>
      ) : (
        <div style={{ marginBottom: "2rem" }}>
          {difficultyPerformance.map((d) => (
            <PerformanceBar
              key={d.difficulty}
              label={`${d.difficulty} (${d.attemptCount} attempt${d.attemptCount > 1 ? "s" : ""})`}
              percentage={d.averagePercentage}
            />
          ))}
        </div>
      )}

      {/* Recent quizzes */}
      <h3>Recent Quizzes</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {recentQuizzes.map((q) => (
          <li
            key={q.attemptId}
            onClick={() => openAttempt(q.attemptId)}
            style={{
              padding: "0.75rem",
              border: "1px solid #eee",
              borderRadius: "4px",
              marginBottom: "0.5rem",
              cursor: "pointer",
            }}
          >
            <strong>{q.title}</strong> — {q.topic} — {q.percentage.toFixed(1)}%
            <span style={{ float: "right", color: "#666" }}>
              {new Date(q.attemptedAt).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div
      style={{
        flex: "1 1 140px",
        padding: "1rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{value}</div>
      <div style={{ fontSize: "0.85rem", color: "#666" }}>{label}</div>
    </div>
  );
}

function PerformanceBar({ label, percentage }) {
  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
        <span>{label}</span>
        <span>{percentage.toFixed(1)}%</span>
      </div>
      <div style={{ background: "#eee", borderRadius: "4px", height: "10px" }}>
        <div
          style={{
            width: `${Math.min(percentage, 100)}%`,
            background: percentage >= 70 ? "#4caf50" : percentage >= 40 ? "#ff9800" : "#f44336",
            height: "100%",
            borderRadius: "4px",
          }}
        />
      </div>
    </div>
  );
}

export default DashboardPage;