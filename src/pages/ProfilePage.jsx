import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosClient
      .get("/auth/profile")
      .then((res) => setProfile(res.data))
      .catch(() => setError("Failed to load profile."));
  }, []);

  if (error) {
    return (
      <div className="max-w-lg mx-auto mt-12 px-4">
        <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-forest-100 border-t-forest-700 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-3xl p-8 shadow-card border border-gray-50 text-center">
        <div className="w-20 h-20 rounded-full bg-forest-900 text-lime-400 flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-soft">
          {profile.username.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-2xl font-bold text-forest-900">{profile.username}</h1>
        <span className="inline-block mt-2 px-3 py-1 rounded-full bg-forest-50 text-forest-700 text-xs font-bold">
          {profile.role}
        </span>

        <div className="mt-8 space-y-4 text-left">
          <ProfileRow label="Email" value={profile.email} />
          <ProfileRow label="Member since" value={new Date(profile.memberSince).toLocaleDateString()} />
          <ProfileRow label="User ID" value={`#${profile.id}`} />
        </div>

        <button
          onClick={logout}
          className="mt-8 w-full py-3 rounded-xl border-2 border-rose-200 text-rose-600 font-semibold hover:bg-rose-50 transition-colors"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-forest-900">{value}</span>
    </div>
  );
}

export default ProfilePage;