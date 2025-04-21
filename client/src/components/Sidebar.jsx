import React from "react";
import { posts } from "../data/posts";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="lg:col-span-4 w-full shadow-xl bg-gray-50">
      <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Recommended Posts</h2>
      </div>
      <div>
        {posts.map((post) => (
          <div className="flex flex-wrap flex-col justify-evenly m-5 bg-yellow-400 ">
            <Link>
              {/* <div>{post.id}</div> */}

              <div className="hidden md:block md:w-full overflow-hidden rounded-s-lg">
                <img
                  className="relative w-full object-cover h-40 transition-transform duration-300 hover:scale-105"
                  src={post.img}
                ></img>
              </div>
              <div>{post.title}</div>
              {/* <div>{post.description}</div> */}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
