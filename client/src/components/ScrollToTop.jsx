// src/components/ScrollToTop.jsx - Enhanced Version
import { useEffect, useState, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop({ 
  showLoadingIndicator = true, 
  loadingDuration = 300,
  enablePageTransition = true,
  scrollBehavior = 'instant', // 'instant' | 'smooth'
  preserveScrollOnSamePage = true 
}) {
  const { pathname, hash } = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const previousPathname = useRef(pathname);
  const timeoutRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Memoize the page change detection
  const hasPageChanged = useMemo(() => {
    return previousPathname.current !== pathname;
  }, [pathname]);

  useEffect(() => {
    // Only proceed if page actually changed (not just hash changes)
    if (!hasPageChanged && preserveScrollOnSamePage) {
      // Handle hash navigation within same page
      if (hash) {
        const element = document.getElementById(hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      return;
    }

    // Update previous pathname
    previousPathname.current = pathname;

    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setIsNavigating(true);

    // Use requestAnimationFrame for smoother animation
    animationFrameRef.current = requestAnimationFrame(() => {
      // Scroll to top based on behavior preference
      if (scrollBehavior === 'smooth') {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } else {
        window.scrollTo(0, 0);
      }

      // Handle hash navigation after scroll
      if (hash) {
        timeoutRef.current = setTimeout(() => {
          const element = document.getElementById(hash.slice(1));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, scrollBehavior === 'smooth' ? 500 : 100);
      }

      // Page transition effect
      if (enablePageTransition) {
        const body = document.body;
        const originalTransition = body.style.transition;
        
        body.style.opacity = '0.85';
        body.style.transition = 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)';
        
        timeoutRef.current = setTimeout(() => {
          body.style.opacity = '1';
          
          // Clean up after transition
          setTimeout(() => {
            body.style.transition = originalTransition;
            setIsNavigating(false);
          }, 200);
        }, loadingDuration * 0.3);
      } else {
        timeoutRef.current = setTimeout(() => {
          setIsNavigating(false);
        }, loadingDuration);
      }
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Ensure we clean up any stuck states
      setIsNavigating(false);
      const body = document.body;
      body.style.opacity = '1';
      body.style.transition = '';
    };
  }, [pathname, hash, hasPageChanged, preserveScrollOnSamePage, scrollBehavior, enablePageTransition, loadingDuration]);

  // Don't render loading indicator if disabled or not navigating
  if (!showLoadingIndicator || !isNavigating) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-none"
      role="banner"
      aria-live="polite"
      aria-label="Page loading"
    >
      {/* Subtle backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-[0.5px]" />
      
      {/* Modern loading indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 sm:top-6">
        <div className="bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg border border-slate-200/30 flex items-center gap-3 min-w-max">
          {/* Animated loading spinner */}
          <div className="relative">
            <div className="w-4 h-4 border-2 border-slate-200 rounded-full" />
            <div className="absolute inset-0 w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
          
          {/* Loading text with typing animation */}
          <div className="flex items-center">
            <span className="text-sm text-slate-700 font-medium">
              Loading
            </span>
            <span className="text-sm text-slate-700 font-medium animate-pulse ml-0.5">
              <span className="inline-block animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden ml-2">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transform origin-left animate-pulse"
              style={{
                animation: `progressBar ${loadingDuration}ms ease-out forwards`
              }}
            />
          </div>
        </div>
      </div>

      {/* Custom keyframes for progress bar */}
      <style jsx>{`
        @keyframes progressBar {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
        
        /* Smooth fade-in animation */
        .fade-in {
          animation: fadeIn 200ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// Enhanced version with additional features
export function AdvancedScrollToTop(props) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Show different behavior when offline
  return (
    <ScrollToTop 
      {...props}
      loadingDuration={isOnline ? props.loadingDuration || 300 : 150}
      showLoadingIndicator={isOnline ? props.showLoadingIndicator : false}
    />
  );
}

export default ScrollToTop;