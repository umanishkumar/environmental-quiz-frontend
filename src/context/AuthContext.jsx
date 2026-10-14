import { createContext, useContext, useState } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  const login = async (usernameInput, password) => {
    const response = await axiosClient.post("/auth/login", { username: usernameInput, password });
    const { token: newToken, username: returnedUsername, role: returnedRole } = response.data;

    localStorage.setItem("token", newToken);
    localStorage.setItem("username", returnedUsername);
    localStorage.setItem("role", returnedRole);
    setToken(newToken);
    setUsername(returnedUsername);
    setRole(returnedRole);
  };

  const register = async (usernameInput, email, password) => {
    const response = await axiosClient.post("/auth/register", { username: usernameInput, email, password });
    const { token: newToken, username: returnedUsername, role: returnedRole } = response.data;

    localStorage.setItem("token", newToken);
    localStorage.setItem("username", returnedUsername);
    localStorage.setItem("role", returnedRole);
    setToken(newToken);
    setUsername(returnedUsername);
    setRole(returnedRole);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setToken(null);
    setUsername(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, username, role, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}