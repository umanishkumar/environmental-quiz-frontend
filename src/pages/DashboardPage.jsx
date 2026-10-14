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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-surface-light border-t-lime-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12 px-4">
        <div className="bg-rose-950/40 border border-rose-800/50 text-rose-300 px-4 py-3 rounded-xl">{error}</div>
      </div>
    );
  }

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
      <div className="max-w-2xl mx-auto mt-16 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-surface border border-surface-border flex items-center justify-center text-4xl mx-auto mb-6">
          🌿
        </div>
        <h1 className="text-2xl font-bold text-ink mb-2">Your dashboard is waiting</h1>
        <p className="text-ink-muted mb-8">Take your first quiz to start tracking your progress.</p>
        <button
          onClick={() => navigate("/generate")}
          className="px-6 py-3 rounded-xl bg-lime-400 text-forest-950 font-semibold hover:bg-lime-300 transition-colors shadow-glow"
        >
          Generate your first quiz
        </button>
      </div>
    );
  }

  const stats = [
    { label: "Quizzes Attempted", value: totalQuizzesAttempted, icon: "📝" },
    { label: "Average Score", value: `${averageScorePercentage.toFixed(1)}%`, icon: "📊" },
    { label: "Best Score", value: `${bestScorePercentage.toFixed(1)}%`, icon: "🏆" },
    { label: "Questions Answered", value: totalQuestionsAnswered, icon: "❓" },
    { label: "Correct Answers", value: totalCorrectAnswers, icon: "✅" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-ink">Dashboard</h1>
        <p className="text-ink-muted mt-1">Your learning progress at a glance.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-surface/80 backdrop-blur-sm rounded-2xl p-5 shadow-card border border-surface-border hover:border-lime-400/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-surface-light flex items-center justify-center text-lg mb-3">
              {s.icon}
            </div>
            <div className="text-2xl font-bold text-ink">{s.value}</div>
            <div className="text-xs text-ink-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface/80 backdrop-blur-sm rounded-2xl p-6 shadow-card border border-surface-border">
            <h3 className="font-bold text-ink mb-4">Topic-wise Performance</h3>
            <div className="space-y-4">
              {topicPerformance.length === 0 ? (
                <p className="text-sm text-ink-faint">No data yet.</p>
              ) : (
                topicPerformance.map((t) => (
                  <PerformanceBar
                    key={t.topic}
                    label={t.topic}
                    subLabel={`${t.attemptCount} attempt${t.attemptCount > 1 ? "s" : ""}`}
                    percentage={t.averagePercentage}
                  />
                ))
              )}
            </div>
          </div>

          <div className="bg-surface/80 backdrop-blur-sm rounded-2xl p-6 shadow-card border border-surface-border">
            <h3 className="font-bold text-ink mb-4">Difficulty-wise Performance</h3>
            <div className="space-y-4">
              {difficultyPerformance.length === 0 ? (
                <p className="text-sm text-ink-faint">No data yet.</p>
              ) : (
                difficultyPerformance.map((d) => (
                  <PerformanceBar
                    key={d.difficulty}
                    label={d.difficulty}
                    subLabel={`${d.attemptCount} attempt${d.attemptCount > 1 ? "s" : ""}`}
                    percentage={d.averagePercentage}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-surface/80 backdrop-blur-sm rounded-2xl p-6 shadow-card border border-surface-border">
            <h3 className="font-bold text-ink mb-4">Recent Quizzes</h3>
            <div className="space-y-2">
              {recentQuizzes.map((q) => (
                <button
                  key={q.attemptId}
                  onClick={() => openAttempt(q.attemptId)}
                  className="w-full text-left p-3 rounded-xl hover:bg-surface-light transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-ink truncate text-sm">{q.title}</div>
                    <div className="text-xs text-ink-faint">
                      {q.topic} · {new Date(q.attemptedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div
                    className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ${
                      q.percentage >= 70
                        ? "bg-emerald-500/15 text-emerald-400"
                        : q.percentage >= 40
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-rose-500/15 text-rose-400"
                    }`}
                  >
                    {q.percentage.toFixed(0)}%
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PerformanceBar({ label, subLabel, percentage }) {
  const barColor =
    percentage >= 70 ? "bg-emerald-400" : percentage >= 40 ? "bg-amber-400" : "bg-rose-400";

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="text-xs text-ink-faint">{subLabel}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-surface-light rounded-full overflow-hidden">
          <div
            className={`h-full ${barColor} rounded-full transition-all duration-700`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-ink w-12 text-right">{percentage.toFixed(0)}%</span>
      </div>
    </div>
  );
}

export default DashboardPage;