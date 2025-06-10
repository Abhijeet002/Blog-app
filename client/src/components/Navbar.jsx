import React, { useState, useEffect, useRef } from "react";
import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contextProvider/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenGenres, setIsOpenGenres] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const lastScrollY = useRef(0);
  const scrollDirection = useRef('up');
  const navbarRef = useRef(null);

  const { currentUser, logout } = useContext(AuthContext);

  // Enhanced logout function with smooth redirection
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Close all menus
      setIsOpen(false);
      setIsOpenGenres(false);
      
      // Apply fade-out effect to the whole page
      document.documentElement.classList.add('fade-out');
      
      // Wait for animation to complete (500ms matches CSS animation)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Call logout function
      await logout();
      
      // Smooth redirect to home page
      navigate('/', { 
        replace: true,
        state: { from: location.pathname }
      });
      
    } catch (error) {
      console.error('Logout error:', error);
      document.documentElement.classList.remove('fade-out');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Enhanced scroll effect with navbar hide/show functionality
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollThreshold = 10;
          const hideThreshold = 100;
          
          // Determine scroll direction
          const direction = currentScrollY > lastScrollY.current ? 'down' : 'up';
          scrollDirection.current = direction;
          
          // Set scrolled state for styling
          setScrolled(currentScrollY > scrollThreshold);
          
          // Handle navbar visibility
          if (currentScrollY <= scrollThreshold) {
            // Always show navbar at the top
            setVisible(true);
          } else if (direction === 'down' && currentScrollY > hideThreshold) {
            // Hide navbar when scrolling down past threshold
            setVisible(false);
            // Close mobile menu when hiding
            setIsOpen(false);
          } else if (direction === 'up') {
            // Show navbar when scrolling up
            setVisible(true);
          }
          
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Enhanced mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
    };

    if (isHovering) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isHovering]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.hamburger-btn')) {
        setIsOpen(false);
        setIsOpenGenres(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  // Add navbar height as padding to body to prevent content overlap
  useEffect(() => {
    if (navbarRef.current) {
      const navbarHeight = navbarRef.current.offsetHeight;
      document.body.style.paddingTop = `${navbarHeight}px`;
    }

    return () => {
      document.body.style.paddingTop = '';
    };
  }, [isOpen, visible]);

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const isCategoryActive = (category) => {
    return location.pathname === `/category/${category}`;
  };

  const genres = [
    { name: "Entertainment", path: "entertainment", icon: "🎬", color: "from-purple-500 to-pink-500" },
    { name: "Lifestyle", path: "lifestyle", icon: "🌿", color: "from-green-500 to-emerald-500" },
    { name: "Technology", path: "technology", icon: "💻", color: "from-blue-500 to-cyan-500" },
    { name: "Travel", path: "travel", icon: "✈️", color: "from-orange-500 to-red-500" },
    { name: "Education", path: "education", icon: "📚", color: "from-red-500 to-amber-500" },
    { name: "Health", path: "health", icon: "🏥", color: "from-red-500 to-pink-500" },
    { name: "Politics", path: "politics", icon: "🗳️", color: "from-emerald-500 to-green-500" },
    { name: "Sports", path: "sports", icon: "🏅", color: "from-blue-500 to-green-500" },
    { name: "Food", path: "food", icon: "🍔", color: "from-yellow-500 to-orange-500" },
    { name: "Art", path: "art", icon: "🎨", color: "from-pink-500 to-purple-500" },
  ];

  return (
    <>
      {/* Ambient background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-teal-50/20 via-transparent to-cyan-50/20 pointer-events-none z-0" />
      
      <header 
        ref={navbarRef}
        className={`fixed w-full top-0 z-50 transition-all duration-500 ease-out transform ${
          visible ? 'translate-y-0' : '-translate-y-full'
        } ${
          scrolled 
            ? "bg-white/80 backdrop-blur-xl shadow-2xl border-b border-white/20" 
            : "bg-white/95 backdrop-blur-md shadow-lg"
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Animated top border */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 opacity-60" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Enhanced Logo with animation */}
            <div className="flex-shrink-0 group">
              <Link 
                to="/" 
                className="flex items-center gap-3 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 transition-all duration-300"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl shadow-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-white font-bold text-lg">E</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-pulse" />
                </div>
                <span className="tracking-tight">
                  Echoes & Edits
                  <span className="text-teal-400 animate-pulse">.</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {/* Navigation Links */}
              <Link 
                to="/explore" 
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 overflow-hidden group ${
                  isActiveLink('/explore') 
                    ? 'text-white bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg' 
                    : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50/70'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Explore
                </span>
                {!isActiveLink('/explore') && (
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                )}
              </Link>

              {/* Enhanced Genres Dropdown with Two Columns */}
              <div className="relative group">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50/70 rounded-lg transition-all duration-300 flex items-center gap-2 group">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14-7l2 2-2 2m-2-2H9m10 0a1 1 0 01-1 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3a1 1 0 011-1h3z" />
                  </svg>
                  Genres
                  <svg 
                    className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div className="absolute left-0 mt-3 w-96 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transform translate-y-4 transition-all duration-500 z-30 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-cyan-50/50" />
                  <div className="relative p-3">
                    <div className="grid grid-cols-2 gap-1">
                      {genres.map((genre, index) => (
                        <Link
                          key={genre.path}
                          to={`/category/${genre.path}`}
                          className={`group/item flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 hover:bg-white/80 hover:shadow-lg ${
                            isCategoryActive(genre.path) ? 'bg-white/80 shadow-md' : ''
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${genre.color} flex items-center justify-center shadow-sm group-hover/item:shadow-md group-hover/item:scale-110 transition-all duration-300 flex-shrink-0`}>
                            <span className="text-sm">{genre.icon}</span>
                          </div>
                          <span className={`text-sm font-medium ${isCategoryActive(genre.path) ? 'text-teal-600' : 'text-gray-700'} group-hover/item:text-teal-600 transition-colors duration-200 truncate`}>
                            {genre.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* User Profile with enhanced avatar */}
              {currentUser && (
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50/70 rounded-lg transition-all duration-300 group"
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      {currentUser.image ? (
                        <img src={currentUser.image} alt={currentUser.username} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        currentUser.username.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm" />
                  </div>
                  <span className="hidden lg:block">{currentUser.username}</span>
                </Link>
              )}

              {/* Enhanced Auth Buttons */}
              <div className="flex items-center gap-3 ml-6 pl-6 border-l border-gray-200/50">
                {currentUser ? (
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`relative overflow-hidden px-6 py-2.5 text-sm font-medium transition-all duration-300 group shadow-lg hover:shadow-xl hover:-translate-y-0.5 rounded-xl border ${
                      isLoggingOut 
                        ? 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed' 
                        : 'text-teal-600 bg-white/80 backdrop-blur-sm border-teal-200/50 hover:border-teal-300'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isLoggingOut ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Logging out...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </>
                      )}
                    </span>
                    {!isLoggingOut && (
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-cyan-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    )}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="relative overflow-hidden px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 group shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <svg className="w-4 h-4 group-hover:-rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Login
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  </Link>
                )}
              </div>
            </nav>

            {/* Enhanced Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="hamburger-btn relative p-3 rounded-xl text-teal-600 hover:bg-teal-50 transition-all duration-300 group"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-0.5' : ''}`} />
                  <span className={`block w-6 h-0.5 bg-current transition-all duration-300 mt-1 ${isOpen ? 'opacity-0' : ''}`} />
                  <span className={`block w-6 h-0.5 bg-current transition-all duration-300 mt-1 ${isOpen ? '-rotate-45 -translate-y-0.5' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        <div 
          className={`mobile-menu md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100/50 transition-all duration-500 ease-out overflow-hidden ${
            isOpen 
              ? 'max-h-screen opacity-100 visible shadow-2xl' 
              : 'max-h-0 opacity-0 invisible'
          }`}
        >
          <div className="px-4 py-6 space-y-2">
            <Link 
              to="/explore" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActiveLink('/') 
                  ? 'text-white bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg' 
                  : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Explore
            </Link>

            {/* Enhanced Mobile Genres with Two Columns */}
            <div>
              <button
                onClick={() => setIsOpenGenres(!isOpenGenres)}
                className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14-7l2 2-2 2m-2-2H9m10 0a1 1 0 01-1 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3a1 1 0 011-1h3z" />
                  </svg>
                  Genres
                </div>
                <svg 
                  className={`w-5 h-5 transition-transform duration-300 ${isOpenGenres ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className={`overflow-hidden transition-all duration-500 ${isOpenGenres ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="ml-4 mt-2">
                  <div className="grid grid-cols-2 gap-1">
                    {genres.map((genre, index) => (
                      <Link
                        key={genre.path}
                        to={`/category/${genre.path}`}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                          isCategoryActive(genre.path) ? 'bg-teal-50 text-teal-600' : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
                        }`}
                        onClick={() => setIsOpen(false)}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${genre.color} flex items-center justify-center shadow-sm flex-shrink-0`}>
                          <span className="text-xs">{genre.icon}</span>
                        </div>
                        <span className="text-sm font-medium truncate">{genre.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile User Profile */}
            {currentUser && (
              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm" />
                </div>
                {currentUser.username}
              </Link>
            )}

            {/* Mobile Auth Button */}
            <div className="pt-4 border-t border-gray-100 mt-4">
              {currentUser ? (
                <button 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                    isLoggingOut 
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                      : 'text-teal-600 bg-teal-50 hover:bg-teal-100'
                  }`}
                >
                  {isLoggingOut ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Logging out...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </>
                  )}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;