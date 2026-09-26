import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [startTime] = useState(Date.now());

  const [hints, setHints] = useState({});
  const [hintLoading, setHintLoading] = useState(false);

  useEffect(() => {
    axiosClient
      .get(`/quizzes/${id}`)
      .then((res) => setQuiz(res.data))
      .catch(() => setError("Could not load this quiz."));
  }, [id]);

  if (error) {
    return (
      <div className="max-w-lg mx-auto mt-16 px-4 text-center">
        <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl">{error}</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-forest-100 border-t-forest-700 rounded-full animate-spin" />
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const handleSelectOption = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleGetHint = async () => {
    if (hints[currentQuestion.id]) return;
    setHintLoading(true);
    try {
      const response = await axiosClient.post("/ai/hint", { questionId: currentQuestion.id });
      setHints((prev) => ({ ...prev, [currentQuestion.id]: response.data.hint }));
    } catch (err) {
      console.error(err);
      setHints((prev) => ({ ...prev, [currentQuestion.id]: "Hint unavailable right now." }));
    } finally {
      setHintLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    const timeTakenSeconds = Math.round((Date.now() - startTime) / 1000);

    const payload = {
      answers: quiz.questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: answers[q.id] ?? null,
      })),
      timeTakenSeconds,
    };

    try {
      const response = await axiosClient.post(`/quizzes/${id}/submit`, payload);
      navigate(`/result`, { state: { result: response.data } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to submit quiz.");
      setSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const currentHint = hints[currentQuestion.id];
  const optionLetters = ["A", "B", "C", "D"];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header + progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-bold text-forest-900 truncate pr-4">{quiz.title}</h1>
          <span className="text-sm font-medium text-gray-400 shrink-0">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-forest-600 to-lime-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-gray-50 mb-6">
        <h2 className="text-xl font-bold text-forest-900 mb-6 leading-snug">
          {currentQuestion.questionText}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((opt, i) => {
            const isSelected = answers[currentQuestion.id] === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                  isSelected
                    ? "border-forest-700 bg-forest-50"
                    : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    isSelected ? "bg-forest-900 text-lime-400" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {optionLetters[i]}
                </span>
                <span className={`text-sm ${isSelected ? "font-medium text-forest-900" : "text-gray-700"}`}>
                  {opt.optionText}
                </span>
              </button>
            );
          })}
        </div>

        {/* Hint */}
        <div className="mt-5">
          {!currentHint ? (
            <button
              type="button"
              onClick={handleGetHint}
              disabled={hintLoading}
              className="flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors disabled:opacity-60"
            >
              {hintLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
                  Getting hint...
                </>
              ) : (
                <>💡 Get a hint</>
              )}
            </button>
          ) : (
            <div className="bg-amber-50 border border-amber-100 text-amber-800 text-sm px-4 py-3 rounded-xl flex gap-2">
              <span>💡</span>
              <span>{currentHint}</span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>

        <span className="text-xs text-gray-400">
          {answeredCount} / {totalQuestions} answered
        </span>

        {!isLastQuestion ? (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl font-semibold bg-forest-900 text-white hover:bg-forest-800 transition-colors"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl font-semibold bg-lime-500 text-forest-900 hover:bg-lime-400 disabled:opacity-60 transition-colors flex items-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-forest-900/30 border-t-forest-900 rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Quiz ✓"
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default QuizPage;