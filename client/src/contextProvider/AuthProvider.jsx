// client\src\contextProvider\AuthProvider.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    try {
      const res = await axios.post("/auth/login", inputs, {
        withCredentials: true,
      });
      setCurrentUser(res.data);
      return res.data; // Return user data for success handling
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
      setCurrentUser(null);
      localStorage.removeItem("user");
    } catch (err) {
      console.error("Logout failed:", err);
      // Even if server logout fails, clear local state
      setCurrentUser(null);
      localStorage.removeItem("user");
      throw err;
    }
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user"); // Clear when user is null
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};