import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavBar() {
  const { isAuthenticated, username, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) return null;

  const navItem = "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap";
  const activeClass = "bg-lime-400 text-forest-950 shadow-sm";
  const inactiveClass = "text-ink-muted hover:text-ink hover:bg-surface-light";

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/generate", label: "Generate" },
    { to: "/history", label: "History" },
    { to: "/leaderboard", label: "Leaderboard" },
    { to: "/profile", label: "Profile" },
    ...(role === "ADMIN" ? [{ to: "/admin", label: "Admin" }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-surface-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer shrink-0"
          onClick={() => navigate(role === "ADMIN" ? "/admin" : "/dashboard")}
        >
          <div className="w-8 h-8 rounded-lg bg-lime-400 flex items-center justify-center text-forest-950 font-bold text-sm">
            🌱
          </div>
          <span className="font-bold text-ink hidden sm:block">EcoQuiz</span>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `${navItem} ${isActive ? activeClass : inactiveClass}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* User + logout */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 pl-3 pr-1 py-1 rounded-full bg-surface-light">
            <div className="w-6 h-6 rounded-full bg-lime-400 flex items-center justify-center text-forest-950 text-xs font-bold">
              {username?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-ink pr-1">{username}</span>
            {role === "ADMIN" && (
              <span className="text-[10px] font-bold text-lime-400 bg-lime-400/10 px-1.5 py-0.5 rounded-full mr-1">
                ADMIN
              </span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-full text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;