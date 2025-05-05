// pages/Write.jsx
import React, { useState } from 'react';
import TextEditor from '../components/TextEditor';

const Write = () => {
  const [postData, setPostData] = useState({
    title: '',
    category: '',
    content: '',
    image: '',
  });

  const [errors, setErrors] = useState({
    title: false,
    category: false,
    content: false,
  });

  // Extracts first image from content HTML
  const extractFirstImageUrl = (html) => {
    const match = html.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : '';
  };

  // Handle editor updates
  const handleEditorChange = ({ title, category, content }) => {
    const image = extractFirstImageUrl(content);
    setPostData({ title, category, content, image });
  };

  // Validate before submitting
  const validateForm = () => {
    const newErrors = {
      title: !postData.title.trim(),
      category: !postData.category.trim(),
      content: !postData.content.trim(),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fill in all required fields.');
      return;
    }

    console.log('Submitting post:', postData);
    // TODO: Send to backend using fetch/axios here

    alert('Post submitted successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6">Create a New Blog Post</h2>

      <TextEditor onChange={handleEditorChange} initialData={postData} />

      {/* Live image preview */}
      {postData.image && (
        <div className="mt-4">
          <p className="font-semibold mb-1">Thumbnail Preview:</p>
          <img src={postData.image} alt="Thumbnail" className="max-w-xs rounded shadow" />
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
      >
        Publish Post
      </button>
    </div>
  );
};

export default Write;
