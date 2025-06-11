import React, { useState, useEffect } from "react";
import TextEditor from "../components/TextEditor";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import API from "../utils/api";

const cleanContent = (content) => {
  if (!content) return "";

  let cleaned = content
    .replace(/^<p\s+data-cur="cursor">(.*)<\/p>$/s, "$1")
    .replace(/\s*data-cur="[^"]*"/g, "")
    .replace(/<p\s*><\/p>/g, "")
    .trim();

  cleaned = cleaned.replace(/<img[^>]*>/g, "");

  cleaned = cleaned.replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();

  cleaned = cleaned
    .replace(/^(\s*<p>\s*<\/p>\s*)+/, "")
    .replace(/(\s*<p>\s*<\/p>\s*)+$/, "")
    .trim();

  return cleaned;
};

// Toast Notification Component
const Toast = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    const baseStyles =
      "fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border border-slate-200 p-4 transform transition-all duration-300 ease-in-out";

    if (type === "success") {
      return `${baseStyles} border-l-4 border-l-green-500`;
    } else if (type === "error") {
      return `${baseStyles} border-l-4 border-l-red-500`;
    }
    return `${baseStyles} border-l-4 border-l-blue-500`;
  };

  const getIconColor = () => {
    if (type === "success") return "text-green-500";
    if (type === "error") return "text-red-500";
    return "text-blue-500";
  };

  const getIcon = () => {
    if (type === "success") {
      return (
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
            d="M5 13l4 4L19 7"
          />
        </svg>
      );
    } else if (type === "error") {
      return (
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      );
    }
    return (
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
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    );
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-start">
        <div className={`${getIconColor()} mr-3 mt-0.5`}>{getIcon()}</div>
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-900">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-3 text-slate-400 hover:text-slate-600 transition-colors"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const Write = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditing = Boolean(editId);
  const navigate = useNavigate();

  const stateData = React.useMemo(() => location.state || {}, [location.state]);

  const [postData, setPostData] = useState({
    title: stateData?.title || "",
    category: stateData?.category || "",
    content: stateData?.content || stateData?.description || "",
    image: stateData?.img || "",
    imageFile: null,
  });

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isDraft, setIsDraft] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState({
    message: "",
    type: "info",
    isVisible: false,
  });

  const showToast = (message, type = "info") => {
    setToast({
      message,
      type,
      isVisible: true,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  useEffect(() => {
    if (isEditing && !stateData?.title) {
      const fetchPostData = async () => {
        try {
          const response = await API.get(`/posts/${editId}`);
          const post = response.data;

          setPostData({
            title: post.title || "",
            category: post.category || "",
            content: post.content || post.description || "",
            image: post.img || "",
            imageFile: null,
          });
          setIsInitialLoad(false);
        } catch (error) {
          console.error("Error fetching post data:", error);
          showToast("Error loading post data", "error");
        }
      };

      fetchPostData();
    } else {
      setIsInitialLoad(false);
    }
  }, [isEditing, editId, stateData]);

  const base64ToFile = (base64String, filename) => {
    const arr = base64String.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const extractFirstImageUrl = (html) => {
    const match = html.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : "";
  };

  const handleEditorChange = ({ title, category, content }) => {
    const image = extractFirstImageUrl(content) || postData.image;
    setPostData({
      ...postData,
      title,
      category,
      content,
      image,
    });
  };

  const validateForm = () => {
    const hasTitle = postData.title.trim().length > 0;
    const hasCategory = postData.category.trim().length > 0;
    const hasContent = postData.content.trim().length > 0;

    return hasTitle && hasCategory && hasContent;
  };

  const handleSubmit = async (e, saveAsDraft = false) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadResponse = null;
      let uploadedFilename = null;

      if (postData.image && postData.image.startsWith("data:image/")) {
        const imageFile = base64ToFile(postData.image, "uploaded_image.jpg");

        if (imageFile.size > 5 * 1024 * 1024) {
          // 5MB limit
          showToast(
            "Image is too large. Please upload an image smaller than 5MB.",
            "error"
          );
          setIsSubmitting(false); // reset submitting state
          return; // cancel the submission
        }

        const formData = new FormData();
        formData.append("file", imageFile);

        uploadResponse = await API.post("/uploads", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        uploadedFilename = uploadResponse.data.filename;
        showToast("Image uploaded successfully", "success");
      }

      const cleanedContent = cleanContent(postData.content);

      const submitData = {
        title: postData.title,
        category: postData.category,
        description: cleanedContent,
        img: uploadedFilename || postData.image,
        status: saveAsDraft ? "draft" : "published",
      };

      if (isEditing) {
        await API.put(`/posts/${editId}`, submitData);

        showToast(
          `Post ${saveAsDraft ? "saved as draft" : "updated"} successfully!`,
          "success"
        );

        // Navigate after a short delay to let user see the toast
        setTimeout(() => {
          navigate(`/post/${editId}`);
        }, 1500);
      } else {
        const response = await API.post("/posts", submitData);
        showToast(
          `Post ${saveAsDraft ? "saved as draft" : "published"} successfully!`,
          "success"
        );

        // Navigate after a short delay to let user see the toast
        setTimeout(() => {
          navigate(`/post/${response.data.post.id}`);
        }, 1500);
      }
    } catch (err) {
      console.error("Error submitting post:", err);

      if (err.response) {
        const errorMessage =
          err.response.data?.error ||
          err.response.data?.message ||
          "Unknown error occurred";
        showToast(`Error: ${errorMessage}`, "error");
      } else if (err.request) {
        showToast(
          "Network error. Please check your connection and ensure the backend server is running on port 5000.",
          "error"
        );
      } else {
        showToast("Error submitting post. Please try again.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isInitialLoad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-slate-300"></div>
              <h1 className="text-2xl font-bold text-slate-900">
                {isEditing ? "Edit Post" : "Create New Post"}
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {showPreview ? "Hide Preview" : "Show Preview"}
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Draft
                </button>
                <button
                  onClick={(e) => handleSubmit(e, false)}
                  disabled={isSubmitting}
                  className="px-6 py-2 text-sm font-medium text-white bg-[#3fcd9d] hover:bg-[#48e6b1] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <span>{isEditing ? "Update Post" : "Publish Post"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6">
                <TextEditor
                  onChange={handleEditorChange}
                  initialData={postData}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Status */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Post Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Status:</span>
                  <span className="text-sm font-medium text-green-600">
                    {isDraft ? "Draft" : "Ready to Publish"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Word Count:</span>
                  <span className="text-sm font-medium text-slate-900">
                    {
                      postData.content
                        .replace(/<[^>]*>/g, "")
                        .split(" ")
                        .filter((word) => word.length > 0).length
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Characters:</span>
                  <span className="text-sm font-medium text-slate-900">
                    {postData.content.replace(/<[^>]*>/g, "").length}
                  </span>
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {postData.image && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Featured Image
                </h3>
                <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                  <img
                    src={postData.image}
                    alt="Featured"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  This image will be used as the post thumbnail
                </p>
              </div>
            )}

            {/* SEO Preview */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                SEO Preview
              </h3>
              <div className="space-y-2">
                <h4 className="text-blue-600 text-sm font-medium line-clamp-1">
                  {postData.title || "Untitled Post"}
                </h4>
                <p className="text-green-600 text-xs">
                  yoursite.com/post/{editId || "new-post"}
                </p>
                <p className="text-slate-600 text-sm line-clamp-2">
                  {postData.content.replace(/<[^>]*>/g, "").substring(0, 160) ||
                    "No description available"}
                  {postData.content.replace(/<[^>]*>/g, "").length > 160 &&
                    "..."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {showPreview && postData.content && (
          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">
                  Content Preview
                </h3>
              </div>
              <div className="p-6">
                <div className="prose prose-slate max-w-none">
                  <h1 className="text-3xl font-bold mb-2">{postData.title}</h1>
                  <div className="flex items-center space-x-4 mb-6 text-sm text-slate-600">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {postData.category}
                    </span>
                    <time>{new Date().toLocaleDateString()}</time>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: cleanContent(postData.content),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Bar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
        <div className="flex space-x-3">
          <button
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={(e) => handleSubmit(e, false)}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isSubmitting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>{isEditing ? "Update" : "Publish"}</span>
          </button>
        </div>
      </div>

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

export default Write;
