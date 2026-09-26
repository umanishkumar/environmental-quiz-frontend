import { createContext, useContext, useState, useCallback } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [username, setUsername] = useState(() => localStorage.getItem("username"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));

  const persistSession = (data) => {
    // Backend AuthResponse shape: { token, username, role }
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("role", data.role);
    setToken(data.token);
    setUsername(data.username);
    setRole(data.role);
  };

  const login = useCallback(async (usernameOrEmail, password) => {
    const response = await axiosClient.post("/auth/login", {
      username: usernameOrEmail,
      password,
    });
    persistSession(response.data);
    return response.data;
  }, []);

  const register = useCallback(async (newUsername, email, password) => {
    const response = await axiosClient.post("/auth/register", {
      username: newUsername,
      email,
      password,
    });
    persistSession(response.data);
    return response.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setToken(null);
    setUsername(null);
    setRole(null);
  }, []);

  const value = {
    token,
    username,
    role,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}