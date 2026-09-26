import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavBar() {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) return null;

  const navItem =
    "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap";
  const activeClass = "bg-forest-900 text-white shadow-sm";
  const inactiveClass = "text-gray-600 hover:text-forest-900 hover:bg-forest-50";

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/generate", label: "Generate" },
    { to: "/history", label: "History" },
    { to: "/leaderboard", label: "Leaderboard" },
    { to: "/profile", label: "Profile" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer shrink-0"
          onClick={() => navigate("/dashboard")}
        >
          <div className="w-8 h-8 rounded-lg bg-forest-900 flex items-center justify-center text-lime-400 font-bold text-sm">
            🌱
          </div>
          <span className="font-bold text-forest-900 hidden sm:block">EcoQuiz</span>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeClass : inactiveClass}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* User + logout */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 pl-3 pr-1 py-1 rounded-full bg-forest-50">
            <div className="w-6 h-6 rounded-full bg-lime-400 flex items-center justify-center text-forest-900 text-xs font-bold">
              {username?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-forest-900 pr-1">{username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-full text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;