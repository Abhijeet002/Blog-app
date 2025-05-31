import React from "react";
import { posts } from "../data/posts";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="lg:col-span-4 w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            Recommended Posts
          </h2>
        </div>
        <p className="text-slate-300 text-sm mt-2 opacity-90">
          Discover trending articles
        </p>
      </div>

      {/* Posts Container */}
      <div className="bg-white rounded-b-xl shadow-2xl border border-slate-100">
        <div className="p-6 space-y-5">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="group relative bg-white rounded-xl border border-slate-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg overflow-hidden"
            >
              <Link 
                to={`/post/${post.id}`}
                className="block"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden rounded-t-xl">
                  <img
                    className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                    src={post.img}
                    alt={post.title}
                    loading="lazy"
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
                        Trending
                      </span>
                    </div>
                    
                    {/* Read More Arrow */}
                    <div className="text-emerald-500 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="border-t border-slate-100 pt-4 text-center">
            <button className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 text-sm font-semibold hover:bg-emerald-50 px-4 py-2 rounded-lg transition-all duration-300">
              <span>View All Posts</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;