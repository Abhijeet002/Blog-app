// client/src/components/AuthPromptModal.jsx

import React from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthPromptModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative animate-in fade-in zoom-in-95 border border-gray-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">You're not logged in</h2>
          <p className="text-gray-600 mb-6">
            Please log in or register to continue using this feature.
          </p>

          <div className="flex justify-center gap-4">
            <Link 
              to="/login" 
              className="px-6 py-2 rounded-xl bg-[#3fcd9d] text-white font-semibold hover:bg-[#48e6b1] transition"
              onClick={onClose}
            >
              Log In
            </Link>
            <Link 
              to="/register" 
              className="px-6 py-2 rounded-xl bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
              onClick={onClose}
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPromptModal;
