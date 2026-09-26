import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FAF9F6]">
      {/* Left: branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-eco-gradient">
        <div className="absolute inset-0 bg-eco-glow" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-lime-400/90 flex items-center justify-center text-forest-900 font-bold text-lg shadow-soft">
              🌱
            </div>
            <span className="font-bold text-xl tracking-tight">EcoQuiz</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl font-extrabold leading-tight mb-4">
              Learn the planet.
              <br />
              One quiz at a time.
            </h1>
            <p className="text-forest-100/80 text-lg leading-relaxed">
              AI-generated environmental quizzes tailored to your level —
              track your progress, climb the leaderboard, and actually
              understand the science behind the headlines.
            </p>
          </div>

          <div className="flex gap-8 text-sm text-forest-100/70">
            <div>
              <div className="text-2xl font-bold text-white">16+</div>
              <div>Topics</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">AI</div>
              <div>Generated</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">RAG</div>
              <div>Grounded</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl bg-forest-900 flex items-center justify-center text-lime-400 font-bold">
              🌱
            </div>
            <span className="font-bold text-xl text-forest-900">EcoQuiz</span>
          </div>

          <h2 className="text-2xl font-bold text-forest-900 mb-1">Welcome back</h2>
          <p className="text-gray-500 mb-8 text-sm">Log in to continue your progress.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="your_username"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white
                           focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
                           transition-shadow shadow-sm placeholder:text-gray-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white
                           focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
                           transition-shadow shadow-sm placeholder:text-gray-400"
              />
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-forest-900 text-white font-semibold
                         hover:bg-forest-800 active:scale-[0.98] transition-all
                         shadow-soft disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            No account?{" "}
            <Link to="/register" className="text-forest-700 font-semibold hover:text-lime-500 transition-colors">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;