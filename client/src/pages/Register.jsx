import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score += 1;
    else feedback.push("at least 8 characters");

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push("lowercase letter");

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push("uppercase letter");

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push("number");

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push("special character");

    const strengthLevels = [
      { score: 0, text: '', color: '' },
      { score: 1, text: 'Very Weak', color: 'text-red-600' },
      { score: 2, text: 'Weak', color: 'text-orange-600' },
      { score: 3, text: 'Fair', color: 'text-yellow-600' },
      { score: 4, text: 'Good', color: 'text-green-600' },
      { score: 5, text: 'Strong', color: 'text-green-700' }
    ];

    return {
      ...strengthLevels[score],
      feedback: feedback.length > 0 ? `Add: ${feedback.join(', ')}` : 'Great password!'
    };
  };

  // Check form validity
  useEffect(() => {
    const isEmailValid = inputs.email.trim() !== '' && validateEmail(inputs.email);
    const isValid = 
      inputs.username.trim() !== '' && 
      isEmailValid && 
      inputs.password.trim() !== '' && 
      passwordStrength.score >= 3 && 
      agreeToTerms;
    setIsFormValid(isValid);
  }, [inputs, passwordStrength.score, agreeToTerms]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
    
    // Check password strength
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
    
    // Validate email format
    if (name === 'email') {
      if (value.trim() !== '' && !validateEmail(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError('');
      }
    }
    
    // Clear error when user starts typing
    if (err) setErr(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Additional validation before submission
    if (!validateEmail(inputs.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    if (!isFormValid) return;
    
    setIsLoading(true);
    try {
      await axios.post("/auth/register", inputs);
      // Keep loading state active during redirect delay
      setTimeout(() => {
        navigate("/login");
        // Don't set loading to false here - let the component unmount
      }, 1000);
    } catch (err) {
      setErr(err.response.data);
      if (err.response.status == 409) {
        // Keep loading state for redirect to login
        setTimeout(() => {
          navigate("/login");
          // Don't set loading to false here - let the component unmount
        }, 1000);
      } else {
        // Only set loading to false if we're not redirecting
        setIsLoading(false);
      }
    }
  };

  console.log(inputs);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d4f7eb] to-[#b8f2d8] px-4 sm:px-6 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#3fcd9d] to-[#35c090] rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 font-heading">Create Account</h1>
          <p className="text-gray-600 text-sm sm:text-base font-body">Join us and start your journey today</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/30 transition-all duration-300 hover:shadow-3xl transform hover:scale-[1.01]">
          <div className="space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 font-body">
                Username
              </label>
              <div className="relative group">
                <input
                  required
                  onChange={handleChange}
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-[#84eac6]/30 focus:border-[#3fcd9d] transition-all duration-200 bg-white/70 backdrop-blur-sm group-hover:border-gray-300"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#3fcd9d] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 font-body">
                Email Address
              </label>
              <div className="relative group">
                <input
                  required
                  onChange={handleChange}
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-3 focus:ring-[#84eac6]/30 transition-all duration-200 bg-white/70 backdrop-blur-sm group-hover:border-gray-300 ${
                    emailError ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#3fcd9d]'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className={`h-5 w-5 transition-colors ${
                    emailError ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#3fcd9d]'
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              </div>
              {/* Email Error Message */}
              {emailError && (
                <p className="text-sm text-red-600 font-body">{emailError}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 font-body">
                Password
              </label>
              <div className="relative group">
                <input
                  required
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-[#84eac6]/30 focus:border-[#3fcd9d] transition-all duration-200 bg-white/70 backdrop-blur-sm pr-12 group-hover:border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-[#3fcd9d] transition-colors"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m-3.122-3.122L3 3m9 6l6 6m-6-6l6-6" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {inputs.password && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600 font-body">Password Strength</span>
                    <span className={`text-xs font-semibold ${passwordStrength.color} font-body`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.score <= 1 ? 'bg-red-500' :
                        passwordStrength.score <= 2 ? 'bg-orange-500' :
                        passwordStrength.score <= 3 ? 'bg-yellow-500' :
                        passwordStrength.score <= 4 ? 'bg-green-500' : 'bg-green-600'
                      }`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  {passwordStrength.feedback && passwordStrength.score < 5 && (
                    <p className="text-xs text-gray-600 font-body">{passwordStrength.feedback}</p>
                  )}
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-[#3fcd9d] focus:ring-[#3fcd9d] border-gray-300 rounded transition-colors"
                />
                <label htmlFor="terms" className="text-sm text-gray-700 font-body leading-relaxed">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-[#3fcd9d] hover:text-[#35c090] underline transition-colors"
                  >
                    Terms and Conditions
                  </button>
                  {" "}and{" "}
                  <a href="/privacy" className="text-[#3fcd9d] hover:text-[#35c090] underline transition-colors">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            {/* Error Message */}
            {err && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm animate-fade-in font-body">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {/* {JSON.stringify(err)} */}
                  <p>Something went wrong</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              name="button"
              onClick={handleSubmit}
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full bg-gradient-to-r from-[#3fcd9d] to-[#35c090] hover:from-[#35c090] hover:to-[#2da882] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center font-body"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Registering User...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm font-body">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#3fcd9d] hover:text-[#35c090] font-semibold transition-colors hover:underline"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 font-heading">Terms and Conditions</h2>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh] font-body">
              <div className="prose prose-sm max-w-none text-gray-600">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h3>
                <p className="mb-4">By creating an account, you agree to be bound by these terms and conditions.</p>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3">2. User Responsibilities</h3>
                <p className="mb-4">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3">3. Privacy Policy</h3>
                <p className="mb-4">Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your information.</p>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3">4. Content Guidelines</h3>
                <p className="mb-4">Users must not post content that is illegal, harmful, threatening, abusive, or violates any applicable laws.</p>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3">5. Termination</h3>
                <p className="mb-4">We reserve the right to terminate accounts that violate these terms or for any other reason at our discretion.</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-body"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setAgreeToTerms(true);
                  setShowTermsModal(false);
                }}
                className="px-6 py-2 bg-[#3fcd9d] hover:bg-[#35c090] text-white rounded-lg transition-colors font-body"
              >
                Accept Terms
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;