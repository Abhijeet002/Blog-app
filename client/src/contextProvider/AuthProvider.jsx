import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import API from "../utils/api";

export const AuthContextProvider = ({ children }) => {
  // Initialize with null to avoid localStorage access during SSR
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage after component mounts
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (inputs) => {
    try {
      const res = await API.post("/auth/login", inputs);
      const userData = res.data;

      // Ensure userData is serializable
      const serializableUserData = {
        ...userData,
        // Remove any non-serializable properties if they exist
      };

      setCurrentUser(serializableUserData);
      return serializableUserData;
    } catch (err) {
      console.error("Login failed:", err);

      // Create a serializable error object
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Login failed. Please try again.";

      const serializableError = {
        message: errorMessage,
        status: err.response?.status,
        code: err.code,
      };

      throw serializableError;
    }
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed:", err);
      // Don't throw here, we still want to clear local state
    } finally {
      // Always clear local state regardless of server response
      setCurrentUser(null);
      try {
        localStorage.removeItem("user");
      } catch (error) {
        console.error("Error removing user from localStorage:", error);
      }
    }
  };

  // Save user to localStorage when currentUser changes
  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem("user", JSON.stringify(currentUser));
      } catch (error) {
        console.error("Error saving user to localStorage:", error);
      }
    } else {
      try {
        localStorage.removeItem("user");
      } catch (error) {
        console.error("Error removing user from localStorage:", error);
      }
    }
  }, [currentUser]);

  // Don't render children until we've loaded the user state
  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, login, logout, setCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
