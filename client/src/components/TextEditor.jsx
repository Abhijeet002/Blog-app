import React, { useRef, useState } from 'react';
import JoditEditor from 'jodit-react';

const TextEditor = ({ initialData = {}, onChange }) => {
  const editor = useRef(null);
  const [title, setTitle] = useState(initialData.title || '');
  const [category, setCategory] = useState(initialData.category || '');
  const [content, setContent] = useState(initialData.content || '');

  // Validation state
  const [errors, setErrors] = useState({
    title: false,
    category: false,
  });

  const config = {
    readonly: false,
    height: 400,
    showPoweredBy: false,
    toolbarSticky: false,
    buttons: [
      'bold', 'italic', 'underline', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'link', 'image', '|',
      'source', 'undo', 'redo'
    ],
    uploader: {
      insertImageAsBase64URI: true,
    }
  };

  const validate = (field, value) => {
    let hasError = false;
    if (field === 'title' && value.trim() === '') {
      hasError = true;
    }
    if (field === 'category' && value.trim() === '') {
      hasError = true;
    }

    setErrors((prev) => ({ ...prev, [field]: hasError }));
  };

  const handleChange = (field, value) => {
    if (field === 'title') {
      setTitle(value);
    } else if (field === 'category') {
      setCategory(value);
    } else if (field === 'content') {
      setContent(value);
    }

    validate(field, value);

    if (onChange) {
      onChange({
        title: field === 'title' ? value : title,
        category: field === 'category' ? value : category,
        content: field === 'content' ? value : content,
      });
    }
  };

  return (
    <div className="space-y-4 border rounded p-4 bg-white">
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleChange('title', e.target.value)}
          onBlur={(e) => validate('title', e.target.value)}
          placeholder="Enter post title"
          className={`w-full px-3 py-2 border rounded ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">Title is required.</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Category</label>
        <select
          value={category}
          onChange={(e) => handleChange('category', e.target.value)}
          onBlur={(e) => validate('category', e.target.value)}
          className={`w-full px-3 py-2 border rounded ${
            errors.category ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select category</option>
          <option value="tech">Tech</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="travel">Travel</option>
          <option value="art">Art</option>
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">Category is required.</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Content</label>
        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          onBlur={(newContent) => handleChange('content', newContent)}
        />
      </div>
    </div>
  );
};

export default TextEditor;
