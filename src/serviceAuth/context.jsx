import { createContext, useContext, useEffect, useState } from "react";
import api from "./axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(localStorage.getItem("authToken") || null);
  const [user, setUser] = useState(null);

  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("authToken", newToken);
      setTokenState(newToken);
    } else {
      localStorage.removeItem("authToken");
      setTokenState(null);
      setUser(null);
    }
  };

  // ✅ FETCH PROFILE
  const fetchProfile = async () => {
    if (!token) return; // 🚫 no token → no API

    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setToken(null);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, setToken, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
