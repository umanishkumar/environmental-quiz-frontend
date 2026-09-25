import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { PREDEFINED_TOPICS } from "../constants/topics";

function GenerateQuizPage() {
  const navigate = useNavigate();

  const [topicMode, setTopicMode] = useState("predefined"); // "predefined" | "custom"
  const [topic, setTopic] = useState(PREDEFINED_TOPICS[0]);
  const [customTopic, setCustomTopic] = useState("");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [questionType, setQuestionType] = useState("MCQ");
  const [language, setLanguage] = useState("English");

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
      // TEMPORARY: hits the manual test-create endpoint with a placeholder question.
      // Phase 12 replaces this call with POST /api/quizzes/generate (real AI).
      const response = await axiosClient.post("/quizzes/test-create", {
        topic: effectiveTopic,
        difficulty,
        questionType,
        language,
        questions: [
          {
            questionText: `[Placeholder] Sample question about ${effectiveTopic}?`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctIndex: 1,
            explanation: "This is placeholder data until AI generation is wired in (Phase 12).",
            hint: "This is a temporary hint.",
          },
        ],
      });

      const quizId = response.data.id;
      navigate(`/quiz/${quizId}`);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to generate quiz. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "2rem auto" }}>
      <h1>Generate a Quiz</h1>

      <form onSubmit={handleSubmit}>
        <fieldset style={{ marginBottom: "1rem" }}>
          <legend>Topic</legend>
          <label>
            <input
              type="radio"
              checked={topicMode === "predefined"}
              onChange={() => setTopicMode("predefined")}
            />
            Choose from list
          </label>
          <label style={{ marginLeft: "1rem" }}>
            <input
              type="radio"
              checked={topicMode === "custom"}
              onChange={() => setTopicMode("custom")}
            />
            Custom topic
          </label>

          {topicMode === "predefined" ? (
            <select value={topic} onChange={(e) => setTopic(e.target.value)} style={{ display: "block", marginTop: "0.5rem", width: "100%" }}>
              {PREDEFINED_TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              placeholder="Enter your own topic"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              style={{ display: "block", marginTop: "0.5rem", width: "100%" }}
            />
          )}
        </fieldset>

        <div style={{ marginBottom: "1rem" }}>
          <label>Difficulty</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{ display: "block", width: "100%" }}>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Number of Questions</label>
          <select
            value={numberOfQuestions}
            onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
            style={{ display: "block", width: "100%" }}
          >
            {[5, 10, 15, 20].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Question Type</label>
          <select value={questionType} onChange={(e) => setQuestionType(e.target.value)} style={{ display: "block", width: "100%" }}>
            <option value="MCQ">Multiple Choice</option>
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ display: "block", width: "100%" }}>
            <option value="English">English</option>
          </select>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ width: "100%", padding: "0.5rem" }}>
          {loading ? "Generating..." : "Generate Quiz"}
        </button>
      </form>
    </div>
  );
}

export default GenerateQuizPage;