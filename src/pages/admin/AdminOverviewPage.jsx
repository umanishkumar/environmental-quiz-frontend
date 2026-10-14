import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import AdminLayout from "../../components/AdminLayout";

function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [topicStats, setTopicStats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosClient.get("/admin/stats").then((res) => setStats(res.data)).catch(() => setError("Failed to load stats."));
    axiosClient.get("/admin/topics/stats").then((res) => setTopicStats(res.data)).catch(() => setError("Failed to load topic stats."));
  }, []);

  if (!stats) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-surface-light border-t-lime-400 rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: "👥", color: "text-sky-400", bg: "bg-sky-500/10" },
    { label: "Total Quizzes", value: stats.totalQuizzes, icon: "📝", color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Total Attempts", value: stats.totalAttempts, icon: "🎯", color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Total Questions", value: stats.totalQuestions, icon: "❓", color: "text-lime-400", bg: "bg-lime-500/10" },
  ];

  const maxAttempts = Math.max(...topicStats.map((t) => t.totalAttempts), 1);

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-8 py-10">
        <h1 className="text-2xl font-extrabold text-ink mb-1">Overview</h1>
        <p className="text-ink-muted mb-8">Platform-wide statistics at a glance.</p>

        {error && (
          <div className="bg-rose-950/40 border border-rose-800/50 text-rose-300 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((s) => (
            <div key={s.label} className="bg-surface/80 rounded-2xl p-5 border border-surface-border">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center text-lg mb-3`}>
                {s.icon}
              </div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-ink-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-surface/80 rounded-2xl p-6 border border-surface-border">
          <h3 className="font-bold text-ink mb-1">Performance by Topic — All Users</h3>
          <p className="text-xs text-ink-faint mb-5">Aggregate attempt volume and average score across every user.</p>
          <div className="space-y-4">
            {topicStats.length === 0 ? (
              <p className="text-sm text-ink-faint">No attempts recorded yet.</p>
            ) : (
              topicStats.map((t) => (
                <div key={t.topic}>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-sm font-medium text-ink">{t.topic}</span>
                    <span className="text-xs text-ink-faint">
                      {t.totalAttempts} attempts · {t.uniqueUsers} users · avg {t.averagePercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-surface-light rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-700"
                      style={{ width: `${(t.totalAttempts / maxAttempts) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminOverviewPage;