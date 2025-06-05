import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contextProvider/authContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(currentUser?.profile_img || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post("http://localhost:5000/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      await axios.put(`http://localhost:5000/users/${currentUser.id}`, {
        profile_img: res.data.url,
      }, { withCredentials: true });

      alert("Profile picture updated!");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };

  const fetchUserPosts = async () => {
    try {
      const res = await axios.get(`/posts/user/${currentUser.username}`);
      setUserPosts(res.data);
    } catch (err) {
      console.error("Error fetching user posts:", err);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-teal-600 hover:text-teal-800 font-semibold bg-teal-50 px-4 py-2 rounded-lg shadow hover:shadow-md transition"
      >
        ← Back
      </button>

      <div className="bg-white p-6 rounded-3xl shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Image */}
          <img
            src={imagePreview || "/default-avatar.jpg"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-teal-300 shadow-md"
          />
          <div className="flex flex-col gap-3">
            <input type="file" onChange={handleFileChange} className="text-sm" />
            {selectedFile && (
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg shadow hover:from-blue-600 hover:to-cyan-600 transition"
              >
                Save Profile Picture
              </button>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-2">
          <div>
            <span className="text-gray-500 font-medium">Username:</span>
            <p className="text-lg font-bold text-gray-800">{currentUser?.username}</p>
          </div>
          <div>
            <span className="text-gray-500 font-medium">Email:</span>
            <p className="text-gray-700">{currentUser?.email || "Not provided"}</p>
          </div>
        </div>

        {/* Post Stats */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Your Posts ({userPosts.length})
          </h3>

          {userPosts.length > 0 ? (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-white transition shadow-sm hover:shadow-md"
                >
                  <h4 className="text-lg font-semibold text-teal-700 mb-1">
                    {post.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {moment(post.date).format("MMMM DD, YYYY")}
                  </p>
                  <p className="text-gray-700 line-clamp-2">
                    {post.description || post.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You haven’t posted anything yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
