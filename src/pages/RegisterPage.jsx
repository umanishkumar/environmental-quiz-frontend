import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      navigate("/", { replace: true });
    } catch (err) {
      const details = err.response?.data?.details;
      setError(
        (Array.isArray(details) && details.join(" ")) ||
          err.response?.data?.message ||
          "Registration failed. Please try again."
      );
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
              Join thousands
              <br />
              learning sustainably.
            </h1>
            <p className="text-forest-100/80 text-lg leading-relaxed">
              Create your account to start generating AI-powered quizzes,
              track your growth on the dashboard, and see how you rank
              against other learners.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap max-w-md">
            {["Climate Change", "Biodiversity", "Renewable Energy", "Pollution"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm text-forest-50 border border-white/10"
              >
                {tag}
              </span>
            ))}
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

          <h2 className="text-2xl font-bold text-forest-900 mb-1">Create your account</h2>
          <p className="text-gray-500 mb-8 text-sm">Start your environmental learning journey.</p>

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
                minLength={3}
                placeholder="your_username"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white
                           focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
                           transition-shadow shadow-sm placeholder:text-gray-400"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white
                           focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
                           transition-shadow shadow-sm placeholder:text-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
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
                  minLength={8}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white
                             focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
                             transition-shadow shadow-sm placeholder:text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirm
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white
                             focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
                             transition-shadow shadow-sm placeholder:text-gray-400"
                />
              </div>
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
                  Creating account...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-forest-700 font-semibold hover:text-lime-500 transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;