import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { PREDEFINED_TOPICS } from "../constants/topics";

const TOPIC_ICONS = {
  "Climate Change": "🌡️",
  "Global Warming": "🔥",
  "Renewable Energy": "⚡",
  "Biodiversity": "🦋",
  "Ecosystems": "🌳",
  "Pollution": "🏭",
  "Water Conservation": "💧",
  "Waste Management": "🗑️",
  "Deforestation": "🪓",
  "Sustainable Development": "🌍",
  "Air Pollution": "💨",
  "Ocean Pollution": "🌊",
  "Wildlife Conservation": "🐾",
  "Green Technology": "🔋",
  "Environmental Health": "🏥",
  "Carbon Footprint": "👣",
};

function GenerateQuizPage() {
  const navigate = useNavigate();

  const [topicMode, setTopicMode] = useState("predefined");
  const [topic, setTopic] = useState(PREDEFINED_TOPICS[0]);
  const [customTopic, setCustomTopic] = useState("");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [questionType] = useState("MCQ");
  const [language] = useState("English");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const effectiveTopic = topicMode === "custom" ? customTopic.trim() : topic;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!effectiveTopic) {
      setError("Please select or enter a topic.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post("/quizzes/generate", {
        topic: effectiveTopic,
        difficulty,
        numberOfQuestions,
        questionType,
        language,
      });
      navigate(`/quiz/${response.data.id}`);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to generate quiz. The AI may be temporarily unavailable — please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const difficulties = [
    { value: "EASY", label: "Easy", desc: "Basic facts & definitions", color: "emerald" },
    { value: "MEDIUM", label: "Medium", desc: "Cause, effect & concepts", color: "amber" },
    { value: "HARD", label: "Hard", desc: "Scenarios & reasoning", color: "rose" },
  ];

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-forest-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-lime-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-3xl">🌱</div>
        </div>
        <h2 className="text-xl font-bold text-forest-900 mb-2">Generating your quiz...</h2>
        <p className="text-gray-500 text-sm text-center max-w-sm">
          Our AI is crafting {numberOfQuestions} {difficulty.toLowerCase()} questions about{" "}
          <span className="font-medium text-forest-700">{effectiveTopic}</span>. This usually
          takes a few seconds.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-forest-900">Generate a Quiz</h1>
        <p className="text-gray-500 mt-1">Pick a topic and let AI build your quiz.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Topic selection */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="font-semibold text-forest-900">Topic</label>
            <button
              type="button"
              onClick={() => setTopicMode(topicMode === "predefined" ? "custom" : "predefined")}
              className="text-sm text-forest-600 font-medium hover:text-lime-600 transition-colors"
            >
              {topicMode === "predefined" ? "Use custom topic instead →" : "← Choose from list instead"}
            </button>
          </div>

          {topicMode === "predefined" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PREDEFINED_TOPICS.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTopic(t)}
                  className={`flex flex-col items-start gap-2 p-4 rounded-2xl border-2 text-left transition-all ${
                    topic === t
                      ? "border-forest-700 bg-forest-50 shadow-sm"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <span className="text-2xl">{TOPIC_ICONS[t] || "🌿"}</span>
                  <span className="text-sm font-medium text-forest-900 leading-tight">{t}</span>
                </button>
              ))}
            </div>
          ) : (
            <input
              type="text"
              placeholder="e.g. Microplastics in freshwater lakes"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white
                         focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
                         shadow-sm placeholder:text-gray-400"
            />
          )}
        </div>

        {/* Difficulty */}
        <div>
          <label className="font-semibold text-forest-900 block mb-3">Difficulty</label>
          <div className="grid grid-cols-3 gap-3">
            {difficulties.map((d) => {
              const isActive = difficulty === d.value;
              const colorClasses = {
                emerald: "border-emerald-400 bg-emerald-50 text-emerald-700",
                amber: "border-amber-400 bg-amber-50 text-amber-700",
                rose: "border-rose-400 bg-rose-50 text-rose-700",
              };
              return (
                <button
                  type="button"
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    isActive ? colorClasses[d.color] : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <div className={`font-bold ${isActive ? "" : "text-forest-900"}`}>{d.label}</div>
                  <div className="text-xs text-gray-500 mt-1 leading-snug">{d.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question count */}
        <div>
          <label className="font-semibold text-forest-900 block mb-3">
            Number of Questions: <span className="text-lime-600">{numberOfQuestions}</span>
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="5"
              max="20"
              step="5"
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none bg-gray-200 accent-forest-700 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1 px-0.5">
            <span>5</span>
            <span>10</span>
            <span>15</span>
            <span>20</span>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-forest-900 text-white font-bold text-lg
                     hover:bg-forest-800 active:scale-[0.98] transition-all shadow-soft
                     flex items-center justify-center gap-2"
        >
          ✨ Generate Quiz
        </button>
      </form>
    </div>
  );
}

export default GenerateQuizPage;