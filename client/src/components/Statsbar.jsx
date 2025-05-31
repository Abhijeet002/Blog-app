import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const Statsbar = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { category } = useParams();
//   const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = category
          ? await axios.get(`/posts/category/${category}`)
          : await axios.get(`/posts`);

        setPosts(res.data);
        console.log("Fetched stats:", res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err.response?.data?.message || "Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-6 max-h-[calc(100vh-48px)] overflow-y-auto scrollbar-hide">
        {/* Combined Stats & Categories Card */}
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
              <p className="text-slate-500 text-sm">Stats & popular topics</p>
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
                  {new Set(posts.map((p) => p.category)).size}
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
                  {new Set(posts.map((p) => p.author || p.username)).size}
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
            <div className="flex flex-wrap gap-2 mb-4">
              {[...new Set(posts.map((p) => p.category).filter(Boolean))]
                .slice(0, 6)
                .map((cat) => (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statsbar;
