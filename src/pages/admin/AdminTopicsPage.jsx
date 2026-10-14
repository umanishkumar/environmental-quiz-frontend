import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import AdminLayout from "../../components/AdminLayout";

function AdminTopicsPage() {
  const [topics, setTopics] = useState([]);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicDesc, setNewTopicDesc] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadTopics = () => {
    axiosClient
      .get("/admin/topics")
      .then((res) => {
        setTopics(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load topics.");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTopics();
  }, []);

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;
    try {
      await axiosClient.post("/admin/topics", { name: newTopicName, description: newTopicDesc });
      setNewTopicName("");
      setNewTopicDesc("");
      loadTopics();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create topic.");
    }
  };

  const handleDeleteTopic = async (id) => {
    try {
      await axiosClient.delete(`/admin/topics/${id}`);
      loadTopics();
    } catch (err) {
      setError("Failed to delete topic.");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-surface-light border-t-lime-400 rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-8 py-10">
        <h1 className="text-2xl font-extrabold text-ink mb-1">Topics</h1>
        <p className="text-ink-muted mb-8">{topics.length} topics available for quiz generation.</p>

        {error && (
          <div className="bg-rose-950/40 border border-rose-800/50 text-rose-300 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="bg-surface/80 rounded-2xl p-6 border border-surface-border mb-6">
          <h3 className="font-bold text-ink mb-4 text-sm">Add New Topic</h3>
          <form onSubmit={handleCreateTopic} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Topic name"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-surface-light border border-surface-border text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newTopicDesc}
              onChange={(e) => setNewTopicDesc(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-surface-light border border-surface-border text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-lime-400 text-forest-950 font-semibold hover:bg-lime-300 transition-colors whitespace-nowrap"
            >
              + Add
            </button>
          </form>
        </div>

        <div className="bg-surface/80 rounded-2xl border border-surface-border overflow-hidden">
          {topics.map((t, i) => (
            <div
              key={t.id}
              className={`flex items-center justify-between p-4 ${i !== topics.length - 1 ? "border-b border-surface-border" : ""} hover:bg-surface-light transition-colors`}
            >
              <div>
                <div className="font-medium text-ink text-sm">{t.name}</div>
                {t.description && <div className="text-xs text-ink-faint mt-0.5">{t.description}</div>}
              </div>
              <button
                onClick={() => handleDeleteTopic(t.id)}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminTopicsPage;