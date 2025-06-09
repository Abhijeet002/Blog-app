import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PenTool, BookOpen, Users, Star, TrendingUp, Heart, MessageCircle } from 'lucide-react';
import WriteButton from '../components/WriteButton';
import AuthPromptModal from '../components/AuthPromptModal'; // Added import
import { AuthContext } from '../contextProvider/authContext';

const Home = () => {
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

  const features = [
    {
      icon: <PenTool className="w-8 h-8" />,
      title: "Write & Create",
      description: "Share your thoughts and insights through well-crafted blog posts with our intuitive editor.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Read & Discover", 
      description: "Get inspired by reading stories and posts from our growing community of writers.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Connect & Engage",
      description: "Follow your favorite authors and interact through comments, likes, and meaningful discussions.",
      color: "from-pink-500 to-pink-600"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Writers", icon: <PenTool className="w-5 h-5" /> },
    { number: "50K+", label: "Blog Posts", icon: <BookOpen className="w-5 h-5" /> },
    { number: "100K+", label: "Readers", icon: <Users className="w-5 h-5" /> },
    { number: "500K+", label: "Interactions", icon: <Heart className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-[#f1f3f4] to-[#e8f5e8] text-[#0b0c0b] font-body overflow-x-hidden">
      {/* Auth Modal - Added this */}
      {!currentUser && (
        <AuthPromptModal
          isOpen={showAuthPrompt}
          onClose={() => setShowAuthPrompt(false)}
        />
      )}

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#3fcd9d]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#3fcd9d]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8 shadow-lg">
            <Star className="w-4 h-4 text-[#3fcd9d]" />
            <span className="text-sm font-medium text-gray-700">Join thousands of storytellers</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold mb-6 leading-tight animate-fade-in">
            Welcome to{' '}<br></br>
            <span className="relative">
              <span className="text-[#3fcd9d]">Echoes and Edits</span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#3fcd9d] to-[#2bbd8e] rounded-full transform scale-x-0 animate-scale-x"></div>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl max-w-3xl mb-12 text-gray-700 leading-relaxed animate-fade-in-delay">
            Discover stories, ideas, and personal experiences shared by people just like you. 
            <span className="block mt-2 text-[#3fcd9d] font-medium">Your voice matters. Your story inspires.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-delay-2">
            <Link
              to="/explore"
              className="group relative overflow-hidden bg-gradient-to-r from-[#3fcd9d] to-[#2bbd8e] hover:from-[#2bbd8e] hover:to-[#239d73] text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#3fcd9d]/25 transform hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Blogs
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Link>
            
            <Link
              to="/write"
              onClick={handleRestrictedAction}
              className="group bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 font-semibold py-4 px-8 rounded-full transition-all duration-300 border border-gray-200 hover:border-[#3fcd9d] shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              <span className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-[#3fcd9d] transition-transform duration-200 group-hover:rotate-12" />
                Start Writing
              </span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in-delay-3">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex justify-center mb-3 text-[#3fcd9d] group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6 text-gray-900">
              Everything You Need to{' '}
              <span className="text-[#3fcd9d]">Share Your Story</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join a community where creativity meets connection, and every story finds its audience.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group relative"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
                  
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} text-white rounded-2xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    {feature.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl lg:text-2xl font-bold mb-4 text-gray-800 group-hover:text-[#3fcd9d] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 border-2 border-[#3fcd9d] rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#3fcd9d]/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 bg-white/60 backdrop-blur-md border border-white/20 rounded-3xl p-12 shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-[#3fcd9d] to-[#2bbd8e] p-4 rounded-2xl shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6 text-gray-900">
              Start Your Writing Journey{' '}
              <span className="text-[#3fcd9d]">Today</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Join thousands of writers who are already sharing their stories, building their audience, 
              and making meaningful connections through the power of words.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="group relative overflow-hidden bg-gradient-to-r from-[#0b0c0b] to-[#1f1f1f] hover:from-[#1f1f1f] hover:to-[#333] text-white py-4 px-8 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Join Our Community
                  <Users className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Link>
              
              <Link
                to="/explore"
                className="group bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 font-semibold py-4 px-8 rounded-full transition-all duration-300 border border-gray-200 hover:border-[#3fcd9d] shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#3fcd9d] transition-transform duration-200 group-hover:rotate-12" />
                  Browse Stories
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Create Button */}
      <WriteButton />

      {/* Custom Styles */}
      <style jsx="true">{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-x {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s both;
        }
        
        .animate-fade-in-delay-3 {
          animation: fade-in 0.8s ease-out 0.6s both;
        }
        
        .animate-scale-x {
          animation: scale-x 1s ease-out 0.5s both;
        }
      `}</style>
    </div>
  );
};

export default Home;