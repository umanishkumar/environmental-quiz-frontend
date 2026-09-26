import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

function LeaderboardPage() {
  const { username: currentUsername } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosClient
      .get("/leaderboard")
      .then((res) => {
        setEntries(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load leaderboard.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-forest-100 border-t-forest-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12 px-4">
        <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl">{error}</div>
      </div>
    );
  }

  const medalFor = (rank) => (rank === 0 ? "🥇" : rank === 1 ? "🥈" : rank === 2 ? "🥉" : null);
  const podium = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-forest-900">Leaderboard</h1>
        <p className="text-gray-500 mt-1">Top learners, ranked by average score.</p>
      </div>

      {entries.length === 0 ? (
        <p className="text-center text-gray-500 py-16">No attempts yet — be the first!</p>
      ) : (
        <>
          {/* Podium */}
          {podium.length > 0 && (
            <div className="flex items-end justify-center gap-3 mb-10">
              {podium[1] && <PodiumCard entry={podium[1]} rank={1} isMe={podium[1].username === currentUsername} />}
              {podium[0] && <PodiumCard entry={podium[0]} rank={0} isMe={podium[0].username === currentUsername} />}
              {podium[2] && <PodiumCard entry={podium[2]} rank={2} isMe={podium[2].username === currentUsername} />}
            </div>
          )}

          {/* Rest of list */}
          <div className="space-y-2">
            {rest.map((e, i) => {
              const rank = i + 4;
              const isMe = e.username === currentUsername;
              return (
                <div
                  key={e.username}
                  className={`flex items-center gap-4 p-4 rounded-2xl border ${
                    isMe ? "border-lime-400 bg-lime-50" : "border-gray-50 bg-white"
                  } shadow-card`}
                >
                  <span className="w-8 text-center font-bold text-gray-400">#{rank}</span>
                  <div className="w-9 h-9 rounded-full bg-forest-900 text-lime-400 flex items-center justify-center font-bold text-sm shrink-0">
                    {e.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-forest-900 truncate">
                      {e.username} {isMe && <span className="text-xs text-lime-600 font-bold">(You)</span>}
                    </div>
                    <div className="text-xs text-gray-400">{e.totalQuizzes} quizzes</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-forest-900">{e.averagePercentage.toFixed(1)}%</div>
                    <div className="text-xs text-gray-400">best {e.bestPercentage.toFixed(0)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function PodiumCard({ entry, rank, isMe }) {
  const heights = { 0: "h-40", 1: "h-32", 2: "h-28" };
  const medals = { 0: "🥇", 1: "🥈", 2: "🥉" };
  const order = { 0: "order-2", 1: "order-1", 2: "order-3" };

  return (
    <div className={`flex flex-col items-center ${order[rank]} w-28`}>
      <div className="text-3xl mb-1">{medals[rank]}</div>
      <div className="w-14 h-14 rounded-full bg-forest-900 text-lime-400 flex items-center justify-center font-bold text-lg mb-2 shadow-soft">
        {entry.username.charAt(0).toUpperCase()}
      </div>
      <div className="text-sm font-semibold text-forest-900 truncate w-full text-center">
        {entry.username}
      </div>
      {isMe && <div className="text-[10px] text-lime-600 font-bold mb-1">(You)</div>}
      <div
        className={`w-full ${heights[rank]} bg-gradient-to-t from-forest-800 to-forest-600 rounded-t-2xl mt-2 flex items-start justify-center pt-3 shadow-soft`}
      >
        <span className="text-white font-extrabold">{entry.averagePercentage.toFixed(0)}%</span>
      </div>
    </div>
  );
}

export default LeaderboardPage;