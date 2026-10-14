import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import AdminLayout from "../../components/AdminLayout";
import { useAuth } from "../../context/AuthContext";

function AdminUsersPage() {
  const { username: currentUsername } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUsers = () => {
    axiosClient
      .get("/admin/users")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load users.");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      await axiosClient.delete(`/admin/users/${id}`);
      setConfirmDeleteUser(null);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user.");
      setConfirmDeleteUser(null);
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
        <h1 className="text-2xl font-extrabold text-ink mb-1">Users</h1>
        <p className="text-ink-muted mb-8">{users.length} registered accounts.</p>

        {error && (
          <div className="bg-rose-950/40 border border-rose-800/50 text-rose-300 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="bg-surface/80 rounded-2xl border border-surface-border overflow-hidden">
          {users.map((u, i) => (
            <div
              key={u.id}
              className={`flex items-center gap-4 p-4 ${i !== users.length - 1 ? "border-b border-surface-border" : ""} hover:bg-surface-light transition-colors`}
            >
              <div className="w-10 h-10 rounded-full bg-forest-800 text-lime-400 flex items-center justify-center font-bold text-sm shrink-0">
                {u.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-ink text-sm">{u.username}</span>
                  {u.role === "ADMIN" && (
                    <span className="text-[10px] font-bold text-lime-400 bg-lime-400/10 px-1.5 py-0.5 rounded-full">
                      ADMIN
                    </span>
                  )}
                  {u.username === currentUsername && (
                    <span className="text-[10px] font-bold text-sky-400 bg-sky-400/10 px-1.5 py-0.5 rounded-full">
                      YOU
                    </span>
                  )}
                </div>
                <div className="text-xs text-ink-faint truncate">{u.email}</div>
              </div>
              <div className="text-right shrink-0 hidden sm:block">
                <div className="text-sm font-semibold text-ink">{u.quizzesAttempted} quizzes</div>
                <div className="text-xs text-ink-faint">avg {u.averagePercentage.toFixed(0)}%</div>
              </div>

              {confirmDeleteUser === u.id ? (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500 text-white hover:bg-rose-600 transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmDeleteUser(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-ink-muted hover:bg-surface transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  disabled={u.username === currentUsername}
                  onClick={() => setConfirmDeleteUser(u.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminUsersPage;