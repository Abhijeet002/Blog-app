// Simple and elegant BackButton component - Recommended for best UX
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ 
  text = "Back", 
  fallbackPath = "/explore",
  className = "",
  showIcon = true 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Check if there's browser history to go back to
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to explore page if no history
      navigate(fallbackPath);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="
        inline-flex items-center gap-3 px-4 py-3 
        text-gray-700 
        rounded-2xl font-semibold
        hover:text-[#3fcd9d]
        transition-all duration-300 transform hover:scale-105"
      title="Go back to previous page"
    >
      {showIcon && <ArrowLeft className="w-5 h-5" />}
      <span>{text}</span>
    </button>
  );
};

export default BackButton;