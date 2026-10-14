import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.75rem 1.5rem",
        borderBottom: "1px solid #e0e0e0",
        marginBottom: "1.5rem",
      }}
    >
      <Link to="/" style={{ fontWeight: "bold", textDecoration: "none", color: "#222" }}>
        🌱 Environmental Quiz
      </Link>

      {isAuthenticated ? (
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link to="/">Quizzes</Link>
          <Link to="/generate">Generate</Link>
          <Link to="/history">History</Link>
          <span style={{ color: "#666" }}>Hi, {username}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
