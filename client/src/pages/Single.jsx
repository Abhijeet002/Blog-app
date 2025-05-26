// client\src\pages\Single.jsx

import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const Single = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);
  
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Get post data from router state (passed from Explore/Category page)
  const postFromState = location.state?.post;

  useEffect(() => {
    if (postFromState) {
      // If post data is passed through state, use it directly
      setPost(postFromState);
      setLoading(false);
    } else if (id) {
      // Fallback: fetch from API if no state data (e.g., direct URL access)
      const fetchPost = async () => {
        try {
          setLoading(true);
          setError(null);
          
          console.log(`Making API call to: /posts/${id}`);
          const res = await axios.get(`/posts/${id}`);
          setPost(res.data);
          console.log("Fetched post from API:", res.data);
        } catch (err) {
          console.error("Error fetching post:", err);
          console.error("Error response:", err.response);
          setError(err.response?.data?.message || `Failed to fetch post with ID: ${id}`);
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
    } else {
      // No ID provided at all
      setError("No post ID provided");
      setLoading(false);
    }
  }, [postFromState, id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`/posts/${id}`);
        alert("Post deleted successfully!");
        navigate("/explore");
      } catch (err) {
        console.error("Error deleting post:", err);
        alert("Failed to delete post");
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Post Content Skeleton */}
          <div className="lg:col-span-8">
            {/* Image skeleton */}
            <div className="w-full h-64 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
            
            {/* Title skeleton */}
            <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
            
            {/* Author info skeleton */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
            
            {/* Content skeleton */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
          
          {/* Right: Sidebar skeleton */}
          <div className="lg:col-span-4">
            <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 flex justify-center items-center min-h-96">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  // Only show "Post not found" if we're done loading AND there's no post AND no error
  if (!loading && !post && !error) {
    return (
      <div className="max-w-7xl mx-auto p-4 flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="text-xl text-gray-600 mb-4">Post not found</div>
          <Link 
            to="/explore" 
            className="text-[#3fcd9d] hover:text-[#2bbd8e] underline"
          >
            ← Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Post Content (spans 8 out of 12 columns on large screens) */}
      <div className="lg:col-span-8">
        <img
          src={post.img || "https://images.unsplash.com/photo-1741648711665-e1a8003b7891"}
          alt={post.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />

        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>

        <div className="m-3 ml-0 flex justify-between items-center gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-3">
            <img
              src={post.authorImg || post.author_img || "https://randomuser.me/api/portraits/men/11.jpg"}
              alt="Author"
              className="w-8 h-8 rounded-full object-cover mt-0.5"
            />
            <p className="text-gray-600 mt-0 mb-0 relative flex flex-col">
              <span className="font-medium">By {post.author || post.username || "Anonymous"}</span>
              <span>{post.date || post.created_at || "Unknown date"}</span>
            </p>
          </div>
          
          {/* Edit/Delete buttons */}
          <div className="flex gap-3 text-gray-400">
            <Link to={`/write?edit=${post.id}`}>
              <Pencil
                className="w-5 h-5 cursor-pointer hover:text-[#3fcd9d] transition"
                title="Edit"
              />
            </Link>
            <Trash2
              className="w-5 h-5 cursor-pointer hover:text-red-500 transition"
              title="Delete"
              onClick={handleDelete}
            />
          </div>
        </div>

        <div className="text-gray-800 leading-relaxed space-y-4">
          {/* Display the post content */}
          <div className="prose max-w-none">
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <p>{post.description || "No content available"}</p>
            )}
          </div>
          
          {/* Display category if available */}
          {post.category && (
            <div className="mt-6">
              <span className="inline-block bg-[#3fcd9d] text-white px-3 py-1 rounded-full text-sm">
                {post.category}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Sidebar Recommendations */}
      <div className="lg:col-span-4">
        <Sidebar />
      </div>
    </div>
  );
};

export default Single;