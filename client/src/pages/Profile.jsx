import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contextProvider/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const Profile = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(
    currentUser?.image || ""
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState({
    message: "",
    type: "info",
    isVisible: false,
  });

  const showToast = React.useCallback((message, type = "info") => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => hideToast(), 3000);
  }, []);

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type - Updated to match backend validation
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showToast("Please select a valid image file (JPEG, PNG, GIF, or WebP)", "error");
      return;
    }

    // Validate file size (max 10MB to match backend)
    if (file.size > 10 * 1024 * 1024) {
      showToast("File size must be less than 10MB", "error");
      return;
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

const handleUpload = async () => {
  if (!selectedFile) {
    showToast("Please select an image first", "error");
    return;
  }

  setIsUploading(true);
  setUploadProgress(0);

  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    console.log("Starting upload...", selectedFile.name);
    
    // Upload image to Cloudinary
    const uploadRes = await axios.post("/uploads", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
      timeout: 120000, // 2 minutes timeout to match backend
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
        console.log(`Upload progress: ${percentCompleted}%`);
      },
    });

    console.log("Upload response:", uploadRes.data);

    // Check if upload was successful
    if (!uploadRes.data.url) {
      throw new Error("No image URL returned from server");
    }

    console.log("Upload successful! Image URL:", uploadRes.data.url);
    console.log("Current user ID:", currentUser.id);

    // Update user profile with new image URL
    console.log("Updating user profile with image URL:", uploadRes.data.url);
    
    const updateRes = await axios.put(
      `http://localhost:5000/user/${currentUser.id}`,
      {
        image: uploadRes.data.url,
      },
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 seconds for profile update
      }
    );

    console.log("Profile update response:", updateRes.data);
    console.log("Profile update status:", updateRes.status);

    // Check if profile update was successful
    if (updateRes.status === 200 || updateRes.status === 201) {
      // Update the current user context with new image
      const updatedUser = {
        ...currentUser,
        image: uploadRes.data.url
      };
      
      console.log("Updating currentUser context:", updatedUser);
      setCurrentUser(updatedUser);

      // Update local storage if you're using it for persistence
      try {
        const existingUserData = localStorage.getItem('user');
        if (existingUserData) {
          const userData = JSON.parse(existingUserData);
          userData.image = uploadRes.data.url;
          localStorage.setItem('user', JSON.stringify(userData));
          console.log("Updated localStorage with new image");
        }
      } catch (localStorageError) {
        console.warn("Could not update localStorage:", localStorageError);
      }

      // Update the preview
      setImagePreview(uploadRes.data.url);
      
      showToast("Profile picture updated successfully!", "success");

      // Clear the selected file
      setSelectedFile(null);
      setUploadProgress(0);

      // Clean up the object URL to prevent memory leaks
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }

      console.log("Profile update completed successfully");
    } else {
      throw new Error(`Profile update failed with status: ${updateRes.status}`);
    }

  } catch (err) {
    console.error("Upload/Update error details:", err);
    console.error("Error response:", err.response?.data);
    console.error("Error status:", err.response?.status);
    console.error("Error message:", err.message);
    
    // Handle different types of errors with more specific logging
    if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
      console.error("Timeout error occurred");
      showToast("Upload timeout. Please try again with a smaller file.", "error");
    } else if (err.response?.status === 408) {
      console.error("Server timeout (408)");
      showToast("Upload timeout. Please try again.", "error");
    } else if (err.response?.status === 401) {
      console.error("Authentication error (401)");
      showToast("Please log in again to update your profile", "error");
    } else if (err.response?.status === 403) {
      console.error("Permission error (403)");
      showToast("You don't have permission to update this profile", "error");
    } else if (err.response?.status === 400) {
      console.error("Bad request (400):", err.response.data);
      showToast(err.response.data?.error || "Invalid file or request", "error");
    } else if (err.response?.status === 404) {
      console.error("User not found (404)");
      showToast("User profile not found. Please try logging in again.", "error");
    } else if (err.response?.status === 500) {
      console.error("Server error (500):", err.response.data);
      showToast("Server error. Please try again later.", "error");
    } else if (err.response?.data?.error) {
      console.error("Server returned error:", err.response.data.error);
      showToast(err.response.data.error, "error");
    } else if (err.message === "No image URL returned from server") {
      console.error("No image URL in server response");
      showToast("Server error: No image URL received", "error");
    } else if (err.message.includes("Profile update failed")) {
      console.error("Profile update failed after successful upload");
      showToast("Image uploaded but profile update failed. Please refresh the page.", "error");
    } else {
      console.error("Generic error:", err);
      showToast("Upload failed. Please try again.", "error");
    }
    
    // Reset image preview to original on error
    setImagePreview(currentUser?.image || "");
  } finally {
    setIsUploading(false);
    setUploadProgress(0);
  }
};

  const fetchUserPosts = React.useCallback(async () => {
    if (!currentUser?.username) return;
    
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/posts/user/${currentUser.username}`, {
        withCredentials: true,
      });
      setUserPosts(res.data);
    } catch (err) {
      console.error("Error fetching user posts:", err);
      showToast("Failed to load your posts", "error");
    } finally {
      setLoading(false);
    }
  }, [currentUser?.username, showToast]);

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleEditPost = (postId, e) => {
    e.stopPropagation();
    navigate(`/write?edit=${postId}`);
  };

  const stripHtml = (html) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  // Default avatar placeholder
  const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f1f5f9'/%3E%3Ccircle cx='100' cy='75' r='35' fill='%23cbd5e1'/%3E%3Cpath d='M100 120c-25 0-45 15-45 35v45h90v-45c0-20-35-45-35z' fill='%23cbd5e1'/%3E%3C/svg%3E";

  useEffect(() => {
    if (currentUser?.username) {
      fetchUserPosts();
    }
  }, [currentUser, fetchUserPosts]);

  // Update image preview when currentUser changes
  useEffect(() => {
    console.log("Current user image:", currentUser?.image);
    setImagePreview(currentUser?.image || "");
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Access Denied
          </h2>
          <p className="text-red-600">Please log in to view your profile.</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Toast Notification */}
      {toast.isVisible && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 
          toast.type === 'error' ? 'bg-red-500 text-white' : 
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            <span>{toast.message}</span>
            <button onClick={hideToast} className="ml-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Profile
          </h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                
                <img
                  src={imagePreview || defaultAvatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-emerald-500 shadow-emerald-50 from-blue-400 to-purple-400 shadow-lg transition-transform group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = defaultAvatar;
                  }}
                />
                <div className="absolute inset-0 rounded-full bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                <label className="cursor-pointer w-full">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                    disabled={isUploading}
                  />
                  <span className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Choose Photo
                  </span>
                </label>

                {selectedFile && (
                  <div className="flex flex-col items-center gap-2 w-full">
                    <div className="text-sm text-slate-600 text-center truncate w-full">
                      {selectedFile.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                    {isUploading && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {isUploading
                          ? `${uploadProgress}%`
                          : "Save"}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setImagePreview(currentUser?.image || "");
                        }}
                        disabled={isUploading}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User Info Section */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br  p-4 rounded-xl shadow-blue-50 border-blue-200">
                  <label className="text-blue-600 font-medium text-sm uppercase tracking-wide">
                    Username
                  </label>
                  <p className="text-xl font-bold text-blue-900 mt-1">
                    {currentUser?.username}
                  </p>
                </div>
                <div className="bg-gradient-to-br p-4 rounded-xl  border-purple-200">
                  <label className="text-purple-600 font-medium text-sm uppercase tracking-wide">
                    Email
                  </label>
                  <p className="text-lg text-purple-900 mt-1">
                    {currentUser?.email || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br p-4 rounded-xl">
                <label className="text-green-600 font-medium text-sm uppercase tracking-wide">
                  Member Since
                </label>
                <p className=" text-green-900 mt-1">
                  {currentUser?.created_at
                    ? moment(currentUser.created_at).format("MMMM DD, YYYY")
                    : "Recently joined"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <svg
                className="w-6 h-6 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Your Posts
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {userPosts.length}
              </span>
            </h2>

            <button
              onClick={() => navigate("/write")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Post
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          ) : userPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => handlePostClick(post.id)}
                  className="group bg-gradient-to-br border-2 border-gray-50 shadow-gray-300 bg-white rounded-xl p-6 pb-2 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-emerald-200"
                >
                  {/* Post Image */}
                  {post.img && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <img
                        src={post.img}
                        alt={post.title}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-500 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {moment(post.date).format("MMM DD, YYYY")}
                      </span>
                      {post.category && (
                        <span className="bg-slate-200 text-slate-600 px-2 py-1 rounded-full text-xs font-medium  group-hover:text-emerald-500 ">
                          {post.category}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 text-sm line-clamp-3">
                      {stripHtml(post.description)}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleEditPost(post.id, e)}
                      className="p-2 text-emerald-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit post"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 text-slate-300 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                No posts yet
              </h3>
              <p className="text-slate-500 mb-6">
                Start sharing your thoughts with the world!
              </p>
              <button
                onClick={() => navigate("/write")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-purple-500 text-white font-semibold rounded-lg hover:from-emerald-500 hover:to-purple-600 transition-all duration-200 shadow-md"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Write Your First Post
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;