import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const Statsbar = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { category } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = category
          ? await axios.get(`/posts/category/${category}`)
          : await axios.get(`/posts`);

        setPosts(res.data || []);
        console.log("Fetched stats:", res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err.response?.data?.message || err.message || "Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  // Retry function for error state
  const handleRetry = () => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = category
          ? await axios.get(`/posts/category/${category}`)
          : await axios.get(`/posts`);

        setPosts(res.data || []);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err.response?.data?.message || err.message || "Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  };

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
        <div>
          <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-32"></div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="mb-6">
        <div className="h-3 bg-slate-200 rounded w-20 mb-3"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                <div className="h-4 bg-slate-200 rounded w-20"></div>
              </div>
              <div className="h-6 bg-slate-200 rounded w-8"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200 my-5"></div>

      {/* Topics Skeleton */}
      <div>
        <div className="h-3 bg-slate-200 rounded w-24 mb-3"></div>
        <div className="flex flex-wrap gap-2 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 bg-slate-200 rounded-full w-16"></div>
          ))}
        </div>
        <div className="pt-3 border-t border-slate-100">
          <div className="h-4 bg-slate-200 rounded w-32"></div>
        </div>
      </div>
    </div>
  );

  // Error Component
  const ErrorState = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 className="font-semibold text-slate-900 mb-2">Failed to load stats</h3>
      <p className="text-slate-600 text-sm mb-4 max-w-xs mx-auto">
        {error}
      </p>
      <button
        onClick={handleRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
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
        Try again
      </button>
    </div>
  );

  // Empty State Component
  const EmptyState = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="font-semibold text-slate-900 mb-2">No posts found</h3>
      <p className="text-slate-600 text-sm">
        {category ? `No posts in "${category}" category yet.` : "No posts have been published yet."}
      </p>
    </div>
  );

  // Stats Content Component
  const StatsContent = () => {
    const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))];
    const authors = [...new Set(posts.map((p) => p.author_email || p.username).filter(Boolean))];

    return (
      <>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              Blog Overview
            </h3>
            <p className="text-slate-500 text-sm">
              {category ? `Stats for "${category}"` : "Stats & popular topics"}
            </p>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="mb-6">
          <h4 className="font-semibold text-slate-700 mb-3 text-sm uppercase tracking-wide">
            Quick Stats
          </h4>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <span className="text-slate-600 font-medium">
                  Total Posts
                </span>
              </div>
              <span className="font-bold text-emerald-600 text-lg">
                {posts.length}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <span className="text-slate-600 font-medium">Categories</span>
              </div>
              <span className="font-bold text-blue-600 text-lg">
                {categories.length}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <span className="text-slate-600 font-medium">Authors</span>
              </div>
              <span className="font-bold text-purple-600 text-lg">
                {authors.length}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 my-5"></div>

        {/* Popular Topics Section */}
        <div>
          <h4 className="font-semibold text-slate-700 mb-3 text-sm uppercase tracking-wide">
            Popular Topics
          </h4>
          {categories.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.slice(0, 6).map((cat) => (
                  <Link
                    key={cat}
                    to={`/explore/${cat}`}
                    className="group bg-gradient-to-r from-slate-100 to-slate-50 hover:from-emerald-50 hover:to-emerald-100 text-slate-700 hover:text-emerald-700 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-105 border border-transparent hover:border-emerald-200"
                  >
                    <span className="flex items-center gap-1">
                      {cat}
                      <svg
                        className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
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
                    </span>
                  </Link>
                ))}
              </div>

              {/* View All Link */}
              <div className="pt-3 border-t border-slate-100">
                <Link
                  to="/categories"
                  className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium group transition-colors"
                >
                  View all categories
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
                </Link>
              </div>
            </>
          ) : (
            <p className="text-slate-500 text-sm italic">No categories available</p>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-6 max-h-[calc(100vh-48px)] overflow-y-auto scrollbar-hide">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
          <style jsx="true">{`
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {loading && <LoadingSkeleton />}
          {error && !loading && <ErrorState />}
          {!loading && !error && posts.length === 0 && <EmptyState />}
          {!loading && !error && posts.length > 0 && <StatsContent />}
        </div>
      </div>
    </div>
  );
};

export default Statsbar;