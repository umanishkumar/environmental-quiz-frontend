import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loginAs, setLoginAs] = useState("user"); // "user" | "admin"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await axiosClient.post("/auth/login", { username, password });
      const { token, username: returnedUsername, role } = response.data;

      if (loginAs === "admin" && role !== "ADMIN") {
        setError("This account doesn't have admin access. Try the User tab instead.");
        setLoading(false);
        return;
      }
      if (loginAs === "user" && role === "ADMIN") {
        setError("This is an admin account. Please use the Admin tab to log in.");
        setLoading(false);
        return;
      }

      // Manually persist session (mirroring what AuthContext.login does internally)
      localStorage.setItem("token", token);
      localStorage.setItem("username", returnedUsername);
      localStorage.setItem("role", role);
      window.location.href = role === "ADMIN" ? "/admin" : (location.state?.from?.pathname || "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password.");
      setLoading(false);
    }
  };

  const stats = [
    { value: "1.1°C", label: "Global warming since pre-industrial times", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { value: "8M", label: "Tonnes of plastic entering oceans yearly", color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
    { value: "10%", label: "Of global emissions from deforestation", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { value: "70%", label: "Of freshwater used by agriculture", color: "text-lime-400", bg: "bg-lime-500/10", border: "border-lime-500/20" },
  ];

  const topics = [
    { icon: "🌡️", name: "Climate Change" },
    { icon: "🦋", name: "Biodiversity" },
    { icon: "⚡", name: "Renewable Energy" },
    { icon: "🌊", name: "Ocean Pollution" },
    { icon: "🌳", name: "Deforestation" },
    { icon: "🏭", name: "Air Pollution" },
    { icon: "💧", name: "Water Conservation" },
    { icon: "♻️", name: "Waste Management" },
  ];

  const features = [
    {
      icon: "🤖",
      title: "AI-Generated Quizzes",
      desc: "Every quiz is freshly generated — pick a topic, difficulty, and question count, and get a completely unique set of questions built just for you.",
      accent: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20",
    },
    {
      icon: "💡",
      title: "Hints & Explanations",
      desc: "Stuck on a question? Get an AI hint without spoiling the answer. Got it wrong? Get a clear explanation of what actually happened and why.",
      accent: "from-amber-500/20 to-amber-500/5 border-amber-500/20",
    },
    {
      icon: "📊",
      title: "Track Your Growth",
      desc: "A real dashboard breaks down your performance by topic and difficulty, so you know exactly where you're strong and where to focus next.",
      accent: "from-sky-500/20 to-sky-500/5 border-sky-500/20",
    },
    {
      icon: "🏆",
      title: "Global Leaderboard",
      desc: "See how you stack up against other learners worldwide. Climb the ranks as your average score improves quiz after quiz.",
      accent: "from-lime-500/20 to-lime-500/5 border-lime-500/20",
    },
  ];

  return (
    <div className="min-h-screen w-full px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-11 h-11 rounded-xl bg-lime-400 flex items-center justify-center text-forest-950 font-bold text-xl shadow-glow">
            🌱
          </div>
          <span className="font-bold text-2xl text-ink tracking-tight">EcoQuiz</span>
        </div>

        {/* Headline */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-lime-500/10 border border-lime-500/20 text-lime-400 text-xs font-bold tracking-wide uppercase mb-6">
            The climate crisis won't wait for us to catch up
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ink leading-tight mb-6">
            Our planet needs you
            <br />
            <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-sky-400 bg-clip-text text-transparent">
              to know more.
            </span>
          </h1>
          <p className="text-ink-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Rising seas. Vanishing species. Record-breaking heat. These aren't distant
            headlines — they're happening now, and the people who understand them best
            are the ones who can actually do something about them. EcoQuiz turns
            environmental literacy into something genuinely engaging: sharp, AI-generated
            questions that challenge what you think you know and fill in what you don't.
          </p>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {stats.map((s) => (
            <div key={s.label} className={`${s.bg} border ${s.border} backdrop-blur-sm rounded-2xl p-5 text-center`}>
              <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-ink-muted mt-2 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {features.map((f) => (
            <div key={f.title} className={`bg-gradient-to-br ${f.accent} backdrop-blur-sm border rounded-2xl p-6`}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <div className="text-base font-bold text-ink mb-2">{f.title}</div>
              <div className="text-sm text-ink-muted leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Topics */}
        <div className="text-center mb-12">
          <h3 className="text-ink-muted text-sm font-semibold uppercase tracking-wide mb-4">
            Explore topics that matter
          </h3>
          <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto">
            {topics.map((t) => (
              <span
                key={t.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface/70 border border-surface-border text-ink text-sm font-medium hover:border-lime-400/40 transition-colors"
              >
                <span>{t.icon}</span>
                {t.name}
              </span>
            ))}
          </div>
        </div>

        {/* Login form */}
        <div className="w-full max-w-sm mx-auto bg-surface/80 backdrop-blur-sm border border-surface-border rounded-3xl p-8 shadow-card">
          {/* User / Admin toggle */}
          <div className="flex bg-surface-light rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => { setLoginAs("user"); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                loginAs === "user" ? "bg-lime-400 text-forest-950 shadow-sm" : "text-ink-muted hover:text-ink"
              }`}
            >
              👤 User
            </button>
            <button
              type="button"
              onClick={() => { setLoginAs("admin"); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                loginAs === "admin" ? "bg-lime-400 text-forest-950 shadow-sm" : "text-ink-muted hover:text-ink"
              }`}
            >
              🛡️ Admin
            </button>
          </div>

          <h2 className="text-xl font-bold text-ink mb-1">
            {loginAs === "admin" ? "Admin Login" : "Welcome back"}
          </h2>
          <p className="text-ink-muted text-sm mb-6">
            {loginAs === "admin"
              ? "Sign in to manage topics and view system stats."
              : "Log in to continue your progress."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-ink-muted mb-1.5">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="your_username"
                className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-border text-ink
                           focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
                           transition-shadow placeholder:text-ink-faint"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink-muted mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-border text-ink
                           focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
                           transition-shadow placeholder:text-ink-faint"
              />
            </div>

            {error && (
              <div className="bg-rose-950/40 border border-rose-800/50 text-rose-300 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-lime-400 text-forest-950 font-bold
                         hover:bg-lime-300 active:scale-[0.98] transition-all
                         shadow-glow disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-forest-950/40 border-t-forest-950 rounded-full animate-spin" />
                  Logging in...
                </>
              ) : loginAs === "admin" ? (
                "Log In as Admin"
              ) : (
                "Log In"
              )}
            </button>
          </form>

          {loginAs === "user" && (
            <p className="mt-6 text-center text-sm text-ink-muted">
              No account?{" "}
              <Link to="/register" className="text-lime-400 font-semibold hover:text-lime-300 transition-colors">
                Register
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;