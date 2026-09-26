import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import AnimatedBackground from "./components/AnimatedBackground";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import QuizListPage from "./pages/QuizListPage";
import GenerateQuizPage from "./pages/GenerateQuizPage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import QuizHistoryPage from "./pages/QuizHistoryPage";
import DashboardPage from "./pages/DashboardPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function App() {
  return (
    <BrowserRouter>
      <AnimatedBackground />
      <NavBar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<QuizListPage />} />
        <Route path="/generate" element={<GenerateQuizPage />} />
        <Route path="/quiz/:id" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/history" element={<QuizHistoryPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;