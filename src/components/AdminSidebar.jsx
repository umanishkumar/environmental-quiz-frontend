import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminSidebar() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: "/admin", label: "Overview", icon: "📊", end: true },
    { to: "/admin/users", label: "Users", icon: "👥" },
    { to: "/admin/topics", label: "Topics", icon: "🗂️" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0D1512] border-r border-surface-border flex flex-col z-40">
      {/* Header */}
      <div className="p-6 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-lime-400 flex items-center justify-center text-forest-950 font-bold">
            🛡️
          </div>
          <div>
            <div className="font-bold text-ink text-sm leading-tight">EcoQuiz</div>
            <div className="text-[10px] text-lime-400 font-bold tracking-wide">ADMIN PANEL</div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-lime-400/10 text-lime-400 border border-lime-400/20"
                  : "text-ink-muted hover:bg-surface-light hover:text-ink"
              }`
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-surface-border">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-ink-muted hover:bg-surface-light hover:text-ink transition-all"
          >
            <span>🌱</span>
            Back to App
          </NavLink>
        </div>
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-surface-border">
        <div className="flex items-center gap-2 px-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-forest-800 text-lime-400 flex items-center justify-center text-xs font-bold">
            {username?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-ink truncate">{username}</div>
            <div className="text-[10px] text-ink-faint">Administrator</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;