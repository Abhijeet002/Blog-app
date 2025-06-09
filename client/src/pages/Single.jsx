// Enhanced Professional Single.jsx with premium UI/UX improvements
import React, { useEffect, useState } from "react";
import { Pencil, Trash2, AlertTriangle, X, Calendar, User, Eye, Share2, BookOpen, Clock, Heart, Bookmark, MessageCircle, ArrowUp } from "lucide-react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment"
import Sidebar from "../components/Sidebar";
import { useContext } from "react";
import { AuthContext } from "../contextProvider/authContext";
import BackButton from "../components/BackButton";

// Enhanced Delete Confirmation Dialog Component with glassmorphism
const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, postTitle, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-500">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-lg w-full mx-4 transform transition-all duration-500 scale-100 animate-in zoom-in-95 border border-white/20">
        {/* Header with gradient */}
        <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-r from-red-50 via-pink-50 to-red-50 p-6 border-b border-red-100/50">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Delete Post</h3>
                <p className="text-sm text-red-600 font-medium">This action is irreversible</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="text-gray-400 hover:text-gray-600 hover:bg-white/60 p-2.5 rounded-xl transition-all duration-300 disabled:opacity-50 backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-200/30 rounded-full blur-xl"></div>
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-pink-200/40 rounded-full blur-lg"></div>
        </div>

        {/* Body with enhanced styling */}
        <div className="p-8">
          <div className="mb-6">
            <p className="text-gray-700 mb-6 leading-relaxed text-lg">
              Are you absolutely sure you want to permanently delete this post? This action cannot be undone and all associated data will be lost forever.
            </p>
            {postTitle && (
              <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl p-6 mb-6 border border-gray-200 shadow-sm">
                <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Post Title</p>
                <p className="font-bold text-gray-900 text-xl leading-tight">{postTitle}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer with gradient buttons */}
        <div className="flex justify-end gap-4 p-8 border-t border-gray-100 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50 rounded-b-3xl">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-8 py-3.5 text-gray-700 bg-white border-2 border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-xl hover:shadow-red-300 transform hover:scale-105"
          >
            {isDeleting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5" />
                Delete Forever
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Premium Toast Notification Component
const Toast = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const styles = {
    success: 'bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 shadow-2xl shadow-green-300/50',
    error: 'bg-gradient-to-r from-red-500 via-pink-500 to-red-600 shadow-2xl shadow-red-300/50',
    info: 'bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 shadow-2xl shadow-blue-300/50'
  };

  return (
    
    <div className={`fixed top-8 right-8 ${styles[type]} text-white px-8 py-5 rounded-2xl z-50 animate-in slide-in-from-top duration-500 backdrop-blur-xl border border-white/20 max-w-md`}>
    
      <div className="flex items-center gap-4">
        <span className="font-semibold text-lg flex-1">{message}</span>
        <button 
          onClick={onClose} 
          className="ml-3 hover:bg-white/20 p-2 rounded-xl transition-all duration-300 transform hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Scroll to Top Button Component
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      className={`fixed bottom-8 right-8 z-40 p-4 bg-gradient-to-r from-[#3fcd9d] to-[#2bbd8e] text-white rounded-2xl shadow-2xl hover:shadow-teal-300/50 transition-all duration-300 transform hover:scale-110 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
      }`}
      onClick={scrollToTop}
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
};

// Reading Time Calculator
const calculateReadingTime = (content) => {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

const Single = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const postFromState = location.state?.post;

  // Show toast notification
  const showToast = (message, type = 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  useEffect(() => {
    if (postFromState) {
      setPost(postFromState);
      setLoading(false);
    } else if (id) {
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
      setError("No post ID provided");
      setLoading(false);
    }
  }, [postFromState, id]);

  const handleDeleteClick = () => {
    if (!currentUser) {
      showToast("You must be logged in to delete posts", 'error');
      return;
    }

    if (currentUser.username !== post.author_username) {
      showToast("You can only delete your own posts", 'error');
      return;
    }

    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    
    try {
      await axios.delete(`/posts/${id}`, {
        withCredentials: true
      });
      
      showToast("Post deleted successfully!", 'success');
      
      setTimeout(() => {
        navigate("/explore");
      }, 1500);
      
    } catch (err) {
      console.error("Error deleting post:", err);
      
      let errorMessage = "Failed to delete post. Please try again.";
      
      if (err.response?.status === 401) {
        errorMessage = "You must be logged in to delete posts";
      } else if (err.response?.status === 403) {
        errorMessage = "You can only delete your own posts";
      } else if (err.response?.status === 404) {
        errorMessage = "Post not found";
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description || 'Check out this amazing blog post!',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    showToast(isLiked ? 'Removed from favorites' : 'Added to favorites', 'success');
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    showToast(isBookmarked ? 'Bookmark removed' : 'Post bookmarked', 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Post Content Skeleton */}
            <div className="lg:col-span-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                {/* Image skeleton with shimmer */}
                <div className="relative w-full h-96 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
                </div>
                
                <div className="p-10">
                  {/* Title skeleton */}
                  <div className="space-y-4 mb-8">
                    <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-2xl animate-pulse"></div>
                    <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-2xl w-3/4 animate-pulse"></div>
                  </div>
                  
                  {/* Author info skeleton */}
                  <div className="flex items-center gap-6 mb-10 pb-8 border-b border-gray-100">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse"></div>
                    <div className="space-y-3 flex-1">
                      <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl w-40 animate-pulse"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl w-32 animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Content skeleton */}
                  <div className="space-y-5">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className={`h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-pulse ${i % 4 === 3 ? 'w-2/3' : 'w-full'}`}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right: Sidebar skeleton */}
            <div className="lg:col-span-4">
              <div className="h-[600px] bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl animate-pulse border border-white/20"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white/90 backdrop-blur-xl p-12 rounded-3xl shadow-2xl max-w-lg mx-4 border border-white/20">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">{error}</p>
          <Link 
            to="/explore" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#3fcd9d] to-[#2bbd8e] text-white rounded-2xl hover:from-[#2bbd8e] hover:to-[#1ea87a] transition-all duration-300 font-semibold shadow-2xl hover:shadow-teal-300/50 transform hover:scale-105"
          >
            ← Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  if (!loading && !post && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white/90 backdrop-blur-xl p-12 rounded-3xl shadow-2xl max-w-lg mx-4 border border-white/20">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <BookOpen className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Post not found</h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">The post you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/explore" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#3fcd9d] to-[#2bbd8e] text-white rounded-2xl hover:from-[#2bbd8e] hover:to-[#1ea87a] transition-all duration-300 font-semibold shadow-2xl hover:shadow-teal-300/50 transform hover:scale-105"
          >
            ← Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(post.description || post.content);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background decoration */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-gradient-to-br from-green-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse"></div>
      </div>
      <BackButton fallbackPath="/explore" />
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Post Content */}
          <div className="lg:col-span-8">
            <article className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 border border-white/20 group">
              {/* Hero Image */}
              {/* <BackButton  text="Back to Explore" fallbackPath="/explore" /> */}
              <div className="relative overflow-hidden">
                <img
                  src={post.img}
                  alt={post.title}
                  className={`w-full h-96 object-cover transition-all duration-1000 group-hover:scale-105 ${imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                {/* Category Badge */}
                {post.category && (
                  <div className="absolute top-8 left-8">
                    <span className="inline-block bg-gradient-to-r from-[#3fcd9d] to-[#2bbd8e] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-2xl backdrop-blur-sm border border-white/20 transform hover:scale-105 transition-all duration-300">
                      {post.category}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute top-8 right-8 flex gap-3">
                  <button
                    onClick={handleShare}
                    className="p-4 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl hover:bg-white hover:shadow-3xl transition-all duration-300 group/btn transform hover:scale-110 border border-white/20"
                    title="Share post"
                  >
                    <Share2 className="w-5 h-5 text-gray-600 group-hover/btn:text-[#3fcd9d] transition-colors duration-300" />
                  </button>
                  
                  {currentUser && currentUser.username === post.author_username && (
                    <>
                      <Link 
                        to={`/write?edit=${post.id}`} state={post}
                        className="p-4 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl hover:bg-white hover:shadow-3xl transition-all duration-300 group/btn transform hover:scale-110 border border-white/20"
                        title="Edit post"
                      >
                        <Pencil className="w-5 h-5 text-gray-600 group-hover/btn:text-[#3fcd9d] transition-colors duration-300" />
                      </Link>
                      <button
                        onClick={handleDeleteClick}
                        className="p-4 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl hover:bg-white hover:shadow-3xl transition-all duration-300 group/btn transform hover:scale-110 border border-white/20"
                        title="Delete post"
                      >
                        <Trash2 className="w-5 h-5 text-gray-600 group-hover/btn:text-red-500 transition-colors duration-300" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-10">
                {/* Title */}
                <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text">{post.title}</h1>
                
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-8 mb-10 pb-8 border-b border-gray-100">
                  {/* Author Info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={post.author_img || "https://randomuser.me/api/portraits/men/11.jpg"}
                      alt="Author"
                      className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-xl hover:scale-105 transition-transform duration-300"
                    />
                    <div>
                      <p className="font-bold text-gray-900 flex items-center gap-3 text-lg">
                        <User className="w-5 h-5 text-[#3fcd9d]" />
                        {post.author_username || "Anonymous"}
                      </p>
                      <p className="text-gray-500 flex items-center gap-3 mt-1">
                        <Calendar className="w-4 h-4" />
                        {moment(post.date).format('MMMM DD, YYYY') || post.date || post.created_at || "Unknown date"}
                      </p>
                    </div>
                  </div>

                  {/* Reading Time */}
                  <div className="flex items-center gap-3 text-gray-500 bg-gray-50 px-4 py-2 rounded-xl">
                    <Clock className="w-5 h-5 text-[#3fcd9d]" />
                    <span className="font-medium">{readingTime} min read</span>
                  </div>

                  {/* Posted Time Ago */}
                  <div className="flex items-center gap-3 text-gray-500 bg-gray-50 px-4 py-2 rounded-xl">
                    <Pencil className="w-5 h-5 text-[#3fcd9d]" />
                    <span className="font-medium">{moment(post.date).fromNow()}</span>
                  </div>
                </div>

                {/* Engagement Buttons */}
                <div className="flex items-center gap-4 mb-10">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 ${
                      isLiked 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{isLiked ? 'Liked' : 'Like'}</span>
                  </button>
                  
                  <button
                    onClick={handleBookmark}
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 ${
                      isBookmarked 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                    <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                  </button>
                  
                  <button className="flex items-center gap-3 px-6 py-3 rounded-2xl font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                    <MessageCircle className="w-5 h-5" />
                    <span>Comment</span>
                  </button>
                </div>

                {/* Article Content */}
                <div className="prose prose-xl max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-a:text-[#3fcd9d] prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-3 prose-code:py-1 prose-code:rounded-lg prose-code:text-base prose-blockquote:border-l-4 prose-blockquote:border-[#3fcd9d] prose-blockquote:bg-gray-50 prose-blockquote:p-6 prose-blockquote:rounded-r-xl">
                  {post.content ? (
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                  ) : (
                    <p className="text-xl leading-relaxed text-gray-700" dangerouslySetInnerHTML={{ __html: post.description|| "No content available" }} />
                  )}
                </div>
              </div>
            </article>
          </div>

          {/* Right: Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <Sidebar category={post.category} />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        postTitle={post?.title}
        isDeleting={isDeleting}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default Single;