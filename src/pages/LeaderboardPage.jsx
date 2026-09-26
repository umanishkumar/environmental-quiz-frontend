import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

function LeaderboardPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosClient
      .get("/leaderboard")
      .then((res) => {
        setEntries(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load leaderboard.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading leaderboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h1>Leaderboard</h1>
      {entries.length === 0 ? (
        <p>No attempts yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #ccc" }}>
              <th style={{ padding: "0.5rem" }}>#</th>
              <th style={{ padding: "0.5rem" }}>Username</th>
              <th style={{ padding: "0.5rem" }}>Quizzes</th>
              <th style={{ padding: "0.5rem" }}>Avg Score</th>
              <th style={{ padding: "0.5rem" }}>Best Score</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr key={e.username} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "0.5rem" }}>{i + 1}</td>
                <td style={{ padding: "0.5rem" }}>{e.username}</td>
                <td style={{ padding: "0.5rem" }}>{e.totalQuizzes}</td>
                <td style={{ padding: "0.5rem" }}>{e.averagePercentage.toFixed(1)}%</td>
                <td style={{ padding: "0.5rem" }}>{e.bestPercentage.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LeaderboardPage;