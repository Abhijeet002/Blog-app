import React from "react";
import { useParams } from "react-router-dom";
import { posts } from "../data/posts";

const CategoryPage = () => {
  const { category } = useParams();
  const filteredPosts = posts.filter((post) => post.category === category);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">{category} Blogs</h1>
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <div key={post.id} className="mb-8 p-6 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-semibold">{post.title}</h2>
            <p className="text-gray-600">{post.description}</p>
            <img
              src={post.img}
              alt={post.title}
              className="mt-4 w-full h-64 object-cover rounded-lg"
            />
          </div>
        ))
      ) : (
        <p className="text-gray-500">No posts found for this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;
