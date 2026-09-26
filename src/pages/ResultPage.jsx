import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  const [explanations, setExplanations] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  if (!result) {
    return (
      <div className="max-w-lg mx-auto mt-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl mx-auto mb-4">
          📭
        </div>
        <h2 className="font-bold text-forest-900 mb-1">No result to show</h2>
        <p className="text-gray-500 text-sm mb-6">Take a quiz first to see your results here.</p>
        <button
          onClick={() => navigate("/generate")}
          className="px-6 py-3 rounded-xl bg-forest-900 text-white font-semibold hover:bg-forest-800 transition-colors"
        >
          Generate a Quiz
        </button>
      </div>
    );
  }

  const questionResults = Array.isArray(result.questionResults) ? result.questionResults : [];
  const percentage = result.percentage;

  const scoreColor =
    percentage >= 80 ? "emerald" : percentage >= 50 ? "amber" : "rose";
  const scoreRing = {
    emerald: "stroke-emerald-400",
    amber: "stroke-amber-400",
    rose: "stroke-rose-400",
  }[scoreColor];
  const scoreText = {
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    rose: "text-rose-600",
  }[scoreColor];
  const scoreBg = {
    emerald: "bg-emerald-50",
    amber: "bg-amber-50",
    rose: "bg-rose-50",
  }[scoreColor];

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (percentage / 100) * circumference;

  const handleExplain = async (qr) => {
    if (explanations[qr.questionId]) return;
    setLoadingId(qr.questionId);
    try {
      const response = await axiosClient.post("/ai/explain", {
        questionId: qr.questionId,
        selectedOptionId: null,
      });
      setExplanations((prev) => ({ ...prev, [qr.questionId]: response.data.explanation }));
    } catch (err) {
      console.error(err);
      setExplanations((prev) => ({ ...prev, [qr.questionId]: "Explanation unavailable right now." }));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Score hero */}
      <div className="bg-white rounded-3xl p-8 shadow-card border border-gray-50 mb-6 text-center">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#F1F5F4" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              className={scoreRing}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1s ease-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-forest-900">{percentage.toFixed(0)}%</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-forest-900 mb-1">
          {result.score} / {result.total} Correct
        </h2>
        <p className="text-gray-500 text-sm mb-4">{result.performanceSummary}</p>

        <div className="flex justify-center gap-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${scoreBg} ${scoreText}`}>
            ✅ {result.correct} correct
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600">
            ❌ {result.incorrect} incorrect
          </span>
          {result.timeTakenSeconds != null && (
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-sky-50 text-sky-600">
              ⏱ {result.timeTakenSeconds}s
            </span>
          )}
        </div>
      </div>

      {/* Question review */}
      <h3 className="font-bold text-forest-900 mb-3 px-1">Question Review</h3>
      <div className="space-y-3 mb-6">
        {questionResults.map((qr, i) => (
          <div
            key={qr.questionId}
            className={`bg-white rounded-2xl p-5 shadow-card border-l-4 ${
              qr.correct ? "border-l-emerald-400" : "border-l-rose-400"
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              <span
                className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  qr.correct ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                }`}
              >
                {qr.correct ? "✓" : "✕"}
              </span>
              <p className="font-medium text-forest-900 text-sm leading-snug">{qr.questionText}</p>
            </div>

            <div className="ml-9 space-y-1 text-sm">
              <p className="text-gray-500">
                Your answer:{" "}
                <span className={qr.correct ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
                  {qr.selectedOptionText ?? "(skipped)"}
                </span>
              </p>
              {!qr.correct && (
                <p className="text-gray-500">
                  Correct answer: <span className="text-emerald-600 font-medium">{qr.correctOptionText}</span>
                </p>
              )}
              <p className="text-gray-400 italic mt-2">{qr.explanation}</p>
            </div>

            <div className="ml-9 mt-3">
              {!explanations[qr.questionId] ? (
                <button
                  onClick={() => handleExplain(qr)}
                  disabled={loadingId === qr.questionId}
                  className="text-xs font-semibold text-forest-700 hover:text-lime-600 transition-colors flex items-center gap-1.5 disabled:opacity-60"
                >
                  {loadingId === qr.questionId ? (
                    <>
                      <span className="w-3 h-3 border-2 border-forest-200 border-t-forest-700 rounded-full animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    <>🤖 Explain further</>
                  )}
                </button>
              ) : (
                <div className="bg-forest-50 text-forest-800 text-xs px-3 py-2.5 rounded-xl flex gap-2">
                  <span>🤖</span>
                  <span>{explanations[qr.questionId]}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate("/generate")}
          className="flex-1 py-3 rounded-xl bg-forest-900 text-white font-semibold hover:bg-forest-800 transition-colors"
        >
          Generate New Quiz
        </button>
        <button
          onClick={() => navigate("/history")}
          className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-forest-900 font-semibold hover:bg-gray-50 transition-colors"
        >
          View History
        </button>
      </div>
    </div>
  );
}

export default ResultPage;