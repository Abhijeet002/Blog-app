import React from "react";
import { posts } from "../data/posts";
import { Pencil, Trash2, Calendar } from "lucide-react";
import {Link} from "react-router-dom";
const Explore = () => {
  return (
    <div className="font-body bg-[#f8f9fa] min-h-screen py-12 px-4 sm:px-6 lg:px-24">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-center text-gray-900 mb-12 sm:mb-16 lg:mb-20">
        Explore the <span className="text-[#3fcd9d]">Latest Blogs</span>
      </h1>

      <div className="space-y-12 sm:space-y-16 lg:space-y-20">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className={`flex flex-col md:flex-row items-center gap-6 sm:gap-10 ${
              index % 2 !== 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Image (Hidden on mobile) */}
            <div className="hidden md:block md:w-1/2 overflow-hidden rounded-3xl shadow-lg">
              <img
                src={post.img}
                alt={post.title}
                className="w-full h-64 md:h-80 object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="w-full md:w-1/2 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-md relative transition-all hover:shadow-lg">
              {/* Edit/Delete Icons */}
              <div className="absolute top-4 right-4 flex gap-3 text-gray-400">
                <Pencil
                  className="w-5 h-5 cursor-pointer hover:text-[#3fcd9d] transition"
                  title="Edit"
                />
                <Trash2
                  className="w-5 h-5 cursor-pointer hover:text-red-500 transition"
                  title="Delete"
                />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 font-heading">
                {post.title}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-5 font-body">
                {post.description}
              </p>
              {/* Author Info - Bottom Right */}
              <div className="m-3 ml-0  flex justify-start items-center gap-3 text-sm text-gray-500">
                <img
                  src={post.authorImg}
                  alt="Author"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Posted on {post.date}</span>
              </div>
              <button className="text-sm sm:text-base font-medium text-white bg-[#3fcd9d] px-5 py-2 rounded-full hover:bg-[#2bbd8e] transition-all duration-200 shadow-sm">
                Read More
              </button>

              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
