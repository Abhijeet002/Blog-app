import React, { useContext, useState } from "react";
import { AuthContext } from "../contextProvider/AuthContext";
import AuthPromptModal from "./AuthPromptModal";
import { Link } from "react-router-dom";

const WriteButton = () => {
  const [showAuthPrompt, setShowAuthPrompt] = useState(false); // Changed to false
  const { currentUser } = useContext(AuthContext);
  
  // Function to handle restricted actions
  const handleRestrictedAction = (e) => {
    if (!currentUser) {
      e.preventDefault(); // Prevent default link behavior
      setShowAuthPrompt(true);
      return false;
    }
    return true;
  };

  return (
    <div>
      {/* Show modal only when user is not authenticated and showAuthPrompt is true */}
      {!currentUser && (
        <AuthPromptModal
          isOpen={showAuthPrompt}
          onClose={() => setShowAuthPrompt(false)}
        />
      )}
      
      <Link
        to="/write"
        onClick={handleRestrictedAction}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-[#3fcd9d] to-[#2bbd8e] hover:from-[#2bbd8e] hover:to-[#239d73] text-white rounded-full p-4 shadow-lg hover:shadow-xl hover:shadow-[#3fcd9d]/25 transition-all duration-300 group z-50 transform hover:scale-110"
        title="Write a new blog"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>

        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-[#3fcd9d] animate-ping opacity-20"></div>
      </Link>
    </div>
  );
};

export default WriteButton;