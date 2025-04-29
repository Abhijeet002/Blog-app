import React, { useState } from 'react'

import TextEditor from '../components/TextEditor';




const Write = () => {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    console.log('Submitted content:', content);
    // You can send this HTML content to your backend or store it
  };

   return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Blog Post</h1>
      <TextEditor value={content} onChange={setContent} />
      <button
        onClick={handleSubmit}
        className="mt-4 bg-[#3fcd9d] text-white px-4 py-2 rounded hover:bg-teal-500 cursor-pointer"
      >
        Submit
      </button>
    </div>
  );
}

export default Write