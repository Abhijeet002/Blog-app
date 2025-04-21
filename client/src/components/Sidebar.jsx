import React from "react";
import { posts } from "../data/posts";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="lg:col-span-4 w-full shadow-xl bg-gray-50">
      <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Recommended Posts</h2>
      </div>
      <div className="p-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="mb-6 bg-white rounded-s-lg overflow-hidden shadow hover:shadow-lg transition-all"
          >
            <Link to={`/post/${post.id}`}>
              <img
                className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
                src={post.img}
                alt={post.title}
              />
              <div className="p-3">
                <h3 className="text-lg font-semibold text-gray-800 hover:text-[#3fcd9d] transition">
                  {post.title}
                </h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;