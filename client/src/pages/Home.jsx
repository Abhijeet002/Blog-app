import React from "react";
import { posts } from "../data/posts";
import { Pencil, Trash2 } from "lucide-react";

const Home = () => {
  return (
    <div className="font-body bg-[#f9fafb] min-h-screen py-14 px-5 md:px-20">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16">
        Explore Our <span className="text-teal-600">Latest Posts</span>
      </h1>

      <div className="space-y-20">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className={`flex flex-col md:flex-row items-center gap-8 ${
              index % 2 !== 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Image */}
            <div className="md:w-1/2 w-full overflow-hidden rounded-xl shadow-sm">
              <img
                src={post.img}
                alt={post.title}
                className="w-full h-64 md:h-80 object-cover rounded-xl transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="md:w-1/2 w-full bg-white rounded-xl p-8 shadow-md relative">
              {/* Edit/Delete Icons */}
              <div className="absolute top-4 right-4 flex gap-3 text-gray-400">
                <Pencil
                  className="w-5 h-5 cursor-pointer hover:text-teal-600 transition"
                  title="Edit"
                />
                <Trash2
                  className="w-5 h-5 cursor-pointer hover:text-red-500 transition"
                  title="Delete"
                />
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {post.title}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {post.description}
              </p>
              <button className="mt-6 text-sm font-medium text-teal-600 border border-teal-600 px-4 py-1.5 rounded-full hover:bg-teal-600 hover:text-white transition">
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
