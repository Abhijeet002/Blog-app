import React, { useContext, useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  TrendingUp,
  Filter,
  Search,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contextProvider/AuthContext";
import Statsbar from "../components/Statsbar";
import moment from "moment";
import AuthPromptModal from "../components/AuthPromptModal";

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const { category } = useParams();
  const [showAuthPrompt, setShowAuthPrompt] = useState(true);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = category
          ? await axios.get(`/posts/category/${category}`)
          : await axios.get(`/posts`);

        setPosts(res.data);
        console.log("Fetched posts:", res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.response?.data?.message || "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  // Filter and sort posts
  const filteredAndSortedPosts = posts
    .filter(
      (post) =>
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.date || a.created_at) - new Date(b.date || b.created_at)
          );
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return (
            new Date(b.date || b.created_at) - new Date(a.date || a.created_at)
          );
      }
    });

  // Enhanced Loading Skeleton
  const PostSkeleton = ({ variant = "default" }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-pulse">
      {variant === "featured" ? (
        <div className="p-8">
          <div className="h-6 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded-lg mb-4 w-3/4"></div>
          <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded mb-3"></div>
          <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded mb-6 w-4/5"></div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded-full"></div>
            <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded w-32"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="h-48 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] animate-shimmer"></div>
          <div className="p-6">
            <div className="h-5 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded mb-3"></div>
            <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded mb-2 w-4/5"></div>
            <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded mb-4 w-3/5"></div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded-full"></div>
              <div className="h-3 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded w-24"></div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Header Skeleton */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="h-12 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded-lg mx-auto w-96 mb-4"></div>
              <div className="h-6 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded mx-auto w-80"></div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="mb-8">
                <PostSkeleton variant="featured" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <PostSkeleton key={i} />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded-lg"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-3xl p-12 shadow-2xl border border-slate-200 max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">
            Something went wrong
          </h3>
          <p className="text-slate-600 mb-8">
          {/* {JSON.stringify(error)} */}
          <p>Something went wrong</p>
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-3xl p-12 shadow-2xl border border-slate-200 max-w-lg">
          <div className="w-24 h-24 mx-auto mb-8 bg-slate-50 rounded-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            No posts found
          </h3>
          <p className="text-slate-600 mb-8">
            {category
              ? `No posts found in the "${category}" category.`
              : "Be the first to share your story!"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/write"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Write First Post
            </Link>
            {category && (
              <Link
                to="/explore"
                className="bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-slate-300 px-8 py-3 rounded-full font-semibold transition-all duration-300"
              >
                View All Posts
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  const featuredPost = filteredAndSortedPosts[0];
  const regularPosts = filteredAndSortedPosts.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Enhanced Header */}
      {!currentUser && (
        <AuthPromptModal
          isOpen={showAuthPrompt}
          onClose={() => setShowAuthPrompt(false)}
        />
      )}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                {category ? (
                  <>
                    Explore{" "}
                    <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent capitalize">
                      {category}
                    </span>{" "}
                    Stories
                  </>
                ) : (
                  <>
                    Discover{" "}
                    <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                      Amazing
                    </span>{" "}
                    Stories
                  </>
                )}
              </h1>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                {category
                  ? `Curated collection of ${category} articles and insights`
                  : "Explore thought-provoking articles from our community of writers"}
              </p>
            </div>

            {/* Enhanced Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between max-w-4xl mx-auto">
              <div className="relative flex-1 w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-full focus:border-emerald-500 focus:outline-none transition-colors bg-white/80 backdrop-blur-sm"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-600" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border-2 border-slate-200 rounded-full px-4 py-2 focus:border-emerald-500 focus:outline-none transition-colors bg-white/80 backdrop-blur-sm text-sm"
                  >
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                    <option value="title">Title A-Z</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-4 py-2 rounded-full">
                  <TrendingUp className="w-4 h-4" />
                  <span>{filteredAndSortedPosts.length} posts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Featured Post */}
            {featuredPost && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">
                    Featured Post
                  </span>
                </div>

                <article className="group bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative overflow-hidden">
                      <img
                        src={featuredPost?.img}
                        alt={featuredPost.title}
                        className="w-full h-64 md:h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      {featuredPost.category && (
                        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm text-slate-800 px-4 py-2 rounded-full text-sm font-semibold">
                          {featuredPost.category.toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="p-8 flex flex-col justify-center">
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {featuredPost.title}
                      </h2>

                      <p className="text-slate-600 mb-6 line-clamp-3 text-lg leading-relaxed">
                        {featuredPost.content ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: featuredPost.content,
                            }}
                          />
                        ) : (
                          <p
                            className="text-xl leading-relaxed text-gray-700"
                            dangerouslySetInnerHTML={{
                              __html:
                                featuredPost.description ||
                                "No content available",
                            }}
                          />
                        )}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              featuredPost.author_img || "/default-avatar.jpg"
                            }
                            alt="Author"
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-lg"
                          />
                          <div>
                            <p className="font-semibold text-slate-800">
                              {featuredPost.author || featuredPost.username}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Clock className="w-3 h-3 ml-2" />
                              <span>8 min read</span>
                            </div>
                          </div>
                        </div>

                        <Link to={`/post/${featuredPost.id}`}>
                          <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                            Read
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            )}

            {/* Regular Posts Grid */}
            {regularPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {regularPosts.map((post) => (
                  <article
                    key={post.id}
                    className="group bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={post.img}
                        alt={post.title}
                        className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      {post.category && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {post.category.toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-slate-600 mb-4 line-clamp-2">
                        {post.content ? (
                          <div
                            dangerouslySetInnerHTML={{ __html: post.content }}
                          />
                        ) : (
                          <p
                            className="text-xl leading-relaxed text-gray-700"
                            dangerouslySetInnerHTML={{
                              __html:
                                post.description || "No content available",
                            }}
                          />
                        )}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={post.author_img || "/default-avatar.jpg"}
                            alt="Author"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              {post.author || post.username}
                            </p>

                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Calendar className="w-3 h-3" />
                              <span>{moment(post.date).fromNow()}</span>
                            </div>
                          </div>
                        </div>

                        <Link to={`/post/${post.id}`}>
                          <button className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center gap-1 group/btn p-3">
                            Read More
                            <svg
                              className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
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
                          </button>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <Statsbar />
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white p-4 rounded-full shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-110 z-50"
        title="Back to top"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </div>
  );
};

export default Explore;
