import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Sidebar = ({ category }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`/posts${category ? `/category/${category}` : ''}`);
        setPosts(res.data);
        console.log("Fetched posts:", res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.response?.data?.message || "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  // Retry function for error handling
  const handleRetry = () => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`/posts${category ? `/category/${category}` : ''}`);
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.response?.data?.message || "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-5">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse"
        >
          <div className="bg-slate-300 h-32 w-full"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-slate-300 rounded w-3/4"></div>
            <div className="h-3 bg-slate-300 rounded w-1/2"></div>
            <div className="flex justify-between items-center">
              <div className="h-3 bg-slate-300 rounded w-1/4"></div>
              <div className="h-3 bg-slate-300 rounded w-4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error component
  const ErrorDisplay = () => (
    <div className="p-6 text-center space-y-4">
      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-slate-600 text-sm mb-4">
          {JSON.stringify(error) || "An unexpected error occurred while fetching posts."}
        </p>
        <button
          onClick={handleRetry}
          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="p-6 text-center space-y-4">
      <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          No Posts Available
        </h3>
        <p className="text-slate-600 text-sm">
          {category ? `No posts found in "${category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}" category.` : "No posts available at the moment."}
        </p>
      </div>
    </div>
  );

  return (
    <div className="lg:col-span-4 w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            loading ? 'bg-yellow-400 animate-pulse' : 
            error ? 'bg-red-400' : 
            'bg-emerald-400 animate-pulse'
          }`}></div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()} Posts` : 'Recommended Posts'}
          </h2>
        </div>
        <p className="text-slate-300 text-sm mt-2 opacity-90">
          {loading ? 'Loading articles...' : 
           error ? 'Failed to load articles' : 
           'Discover trending articles'}
        </p>
      </div>

      {/* Posts Container */}
      <div className="bg-white rounded-b-xl shadow-2xl border border-slate-100">
        <div className="p-6">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorDisplay />
          ) : posts.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-5">
              {posts.map((post, index) => (
                <article
                  key={post.id}
                  className="group relative bg-white rounded-xl border border-slate-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg overflow-hidden"
                >
                  <Link to={`/post/${post.id}`} className="block">
                    {/* Image Container */}
                    <div className="relative overflow-hidden rounded-t-xl">
                      <img
                        className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                        src={post.img}
                        alt={post.title}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/400/200'; // Fallback image
                        }}
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Post Number Badge */}
                      <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        #{index + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <span className="text-xs text-slate-500 font-medium">
                            {post.category ? post.category.charAt(0).toUpperCase() + post.category.slice(1).toLowerCase() : 'Trending'}
                          </span>
                        </div>

                        {/* Read More Arrow */}
                        <div className="text-emerald-500 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Border Animation */}
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 group-hover:w-full transition-all duration-500"></div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Only show when posts are loaded successfully */}
        {!loading && !error && posts.length > 0 && (
          <div className="px-6 pb-6">
            <div className="border-t border-slate-100 pt-4 text-center">
              <Link to="/explore">
                <button className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 text-sm font-semibold hover:bg-emerald-50 px-4 py-2 rounded-lg transition-all duration-300">
                  <span>View All Posts</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                  </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;