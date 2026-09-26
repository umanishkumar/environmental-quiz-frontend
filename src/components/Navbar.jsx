import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavBar() {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) return null; // hide nav on login/register pages

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.75rem 1.5rem",
        borderBottom: "1px solid #ddd",
        marginBottom: "1rem",
      }}
    >
      <div style={{ display: "flex", gap: "1.25rem" }}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/generate">Generate Quiz</Link>
        <Link to="/history">History</Link>
        <Link to="/leaderboard">Leaderboard</Link>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ color: "#666" }}>{username}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default NavBar;