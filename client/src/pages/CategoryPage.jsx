// import React from "react";
// import { useParams } from "react-router-dom";
// import { posts } from "../data/posts";

// const CategoryPage = () => {
//   const { category } = useParams();
//   const filteredPosts = posts.filter((post) => post.category === category);

  

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-6 capitalize">{category} Blogs</h1>
//       {filteredPosts.length > 0 ? (
//         filteredPosts.map((post) => (
//           <div key={post.id} className="mb-8 p-6 bg-white rounded-xl shadow">
//             <h2 className="text-2xl font-semibold">{post.title}</h2>
//             <p className="text-gray-600">{post.description}</p>
//             <img
//               src={post.img}
//               alt={post.title}
//               className="mt-4 w-full h-64 object-cover rounded-lg"
//             />
//           </div>
//         ))
//       ) : (
//         <p className="text-gray-500">No posts found for this category.</p>
//       )}
//     </div>
//   );
// };

// export default CategoryPage;


// client\src\pages\Explore.jsx

// import { posts } from "../data/posts";
// client\src\pages\Explore.jsx

import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Calendar } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const CategoryPage = () => {
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
          : await axios.get(`/posts`); // This will call getAllPost
        
        setPosts(res.data);
        console.log("Fetched posts:", res.data); // Debug log
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.response?.data?.message || "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    // Always fetch data when component mounts or category changes
    fetchData();
  }, [category]);

  if (loading) {
    return (
      <div className="font-body bg-[#f8f9fa] min-h-screen py-12 px-4 sm:px-6 lg:px-24 flex justify-center items-center">
        <div className="text-xl text-gray-600">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-body bg-[#f8f9fa] min-h-screen py-12 px-4 sm:px-6 lg:px-24 flex justify-center items-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="font-body bg-[#f8f9fa] min-h-screen py-12 px-4 sm:px-6 lg:px-24 flex justify-center items-center">
        <div className="text-xl text-gray-600">No posts found</div>
      </div>
    );
  }

  return (
    <div className="font-body bg-[#f8f9fa] min-h-screen py-12 px-4 sm:px-6 lg:px-24">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-center text-gray-900 mb-12 sm:mb-16 lg:mb-20">
        Explore the <span className="text-[#3fcd9d]">Latest Blogs</span>
      </h1>

      <div className="space-y-12 sm:space-y-16 lg:space-y-20">
        {posts.map((post, index) => (
          <div
            key={post.id || index}
            className={`flex flex-col md:flex-row items-center gap-6 sm:gap-10 ${
              index % 2 !== 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Image (Hidden on mobile) */}
            <div className="hidden md:block md:w-1/2 overflow-hidden rounded-3xl shadow-lg">
              <img
                src={post.img || "/default-blog-image.jpg"} // Add fallback image
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
                {post.description || post.content}
              </p>
              {/* Author Info - Bottom Right */}
              <div className="m-3 ml-0 flex justify-start items-center gap-3 text-sm text-gray-500">
                <img
                  src={post.authorImg || post.author_img || "/default-avatar.jpg"}
                  alt="Author"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Posted on {post.date || post.created_at}</span>
              </div>
              <Link to={`/post/${post.id}`}>
                <button className="text-sm sm:text-base font-medium text-white bg-[#3fcd9d] px-5 py-2 rounded-full hover:bg-[#2bbd8e] transition-all duration-200 shadow-sm">
                  Read More
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;