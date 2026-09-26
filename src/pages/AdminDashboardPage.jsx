import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [topics, setTopics] = useState([]);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicDesc, setNewTopicDesc] = useState("");
  const [error, setError] = useState(null);

  const loadData = () => {
    axiosClient.get("/admin/stats").then((res) => setStats(res.data)).catch(() => setError("Failed to load stats."));
    axiosClient.get("/admin/topics").then((res) => setTopics(res.data)).catch(() => setError("Failed to load topics."));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;
    try {
      await axiosClient.post("/admin/topics", { name: newTopicName, description: newTopicDesc });
      setNewTopicName("");
      setNewTopicDesc("");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create topic.");
    }
  };

  const handleDeleteTopic = async (id) => {
    try {
      await axiosClient.delete(`/admin/topics/${id}`);
      loadData();
    } catch (err) {
      setError("Failed to delete topic.");
    }
  };

  if (!stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-forest-100 border-t-forest-700 rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: "👥" },
    { label: "Total Quizzes", value: stats.totalQuizzes, icon: "📝" },
    { label: "Total Attempts", value: stats.totalAttempts, icon: "🎯" },
    { label: "Total Questions", value: stats.totalQuestions, icon: "❓" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-forest-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">System-wide statistics and topic management.</p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-card border border-gray-50">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold text-forest-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50 mb-6">
        <h3 className="font-bold text-forest-900 mb-4">Add Topic</h3>
        <form onSubmit={handleCreateTopic} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Topic name"
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lime-400"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newTopicDesc}
            onChange={(e) => setNewTopicDesc(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lime-400"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-forest-900 text-white font-semibold hover:bg-forest-800 transition-colors whitespace-nowrap"
          >
            + Add
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50">
        <h3 className="font-bold text-forest-900 mb-4">Topics ({topics.length})</h3>
        <div className="space-y-2">
          {topics.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50">
              <div>
                <div className="font-medium text-forest-900 text-sm">{t.name}</div>
                {t.description && <div className="text-xs text-gray-400">{t.description}</div>}
              </div>
              <button
                onClick={() => handleDeleteTopic(t.id)}
                className="text-xs font-semibold text-rose-500 hover:text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;