// client/src/components/TextEditor.jsx

import React, { useRef, useState, useEffect } from 'react';
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

  const [focusedField, setFocusedField] = useState(null);

  // Update state when initialData changes (for edit mode)
  useEffect(() => {
    setTitle(initialData.title || '');
    setCategory(initialData.category || '');
    setContent(initialData.content || '');
  }, [initialData.title, initialData.category, initialData.content]);

  const config = {
    readonly: false,
    height: 450,
    showPoweredBy: false,
    toolbarSticky: false,
    theme: 'default',
    toolbar: true,
    spellcheck: true,
    language: 'en',
    toolbarButtonSize: 'medium',
    buttons: [
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'font', 'fontsize', '|',
      'brush', 'paragraph', '|',
      'align', '|',
      'link', 'image', 'video', '|',
      'table', 'hr', '|',
      'fullsize', 'source', '|',
      'undo', 'redo'
    ],
    uploader: {
      insertImageAsBase64URI: true,
    },
    beautifyHTML: true,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_clear_html',
    placeholder: 'Start writing your amazing content here...',
    style: {
      font: '16px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#374151'
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
    return !hasError;
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

  const categories = [
    { value: 'technology', label: 'Technology', icon: '💻' },
    { value: 'lifestyle', label: 'Lifestyle', icon: '✨' },
    { value: 'travel', label: 'Travel', icon: '✈️' },
    { value: 'art', label: 'Art', icon: '🎨' },
    { value: 'health', label: 'Health', icon: '🏥' },
    { value: 'food', label: 'Food', icon: '🍳' },
    { value: 'business', label: 'Business', icon: '💼' },
    { value: 'education', label: 'Education', icon: '📚' },
    { value: 'entertainment', label: 'Entertainment', icon: '🎭' },
    { value: 'politics', label: 'Politics', icon: '🎭' },
    { value: 'sports', label: 'Sports', icon: '⚽' },
    
  ];

  return (
    <div className="space-y-6">
      {/* Title Section */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
          <span>Post Title</span>
          <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={title}
            onChange={(e) => handleChange('title', e.target.value)}
            onFocus={() => setFocusedField('title')}
            onBlur={(e) => {
              setFocusedField(null);
              validate('title', e.target.value);
            }}
            placeholder="Enter an engaging title for your post..."
            className={`w-full px-4 py-3 text-lg font-medium border-2 rounded-xl transition-all duration-200 
              ${errors.title 
                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                : focusedField === 'title'
                ? 'border-blue-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
              } 
              focus:outline-none bg-white placeholder-slate-400`}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-400">
            {title.length}/100
          </div>
        </div>
        {errors.title && (
          <p className="text-red-500 text-sm flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Please enter a title for your post</span>
          </p>
        )}
      </div>

      {/* Category Section */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
          <span>Category</span>
          <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => handleChange('category', e.target.value)}
            onFocus={() => setFocusedField('category')}
            onBlur={(e) => {
              setFocusedField(null);
              validate('category', e.target.value);
            }}
            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 appearance-none bg-white
              ${errors.category 
                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                : focusedField === 'category'
                ? 'border-blue-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
              } 
              focus:outline-none text-slate-700`}
          >
            <option value="" className="text-slate-400">Choose a category for your post...</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {errors.category && (
          <p className="text-red-500 text-sm flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Please select a category for your post</span>
          </p>
        )}
      </div>

      {/* Content Editor Section */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
          <span>Content</span>
          <span className="text-red-500">*</span>
        </label>
        <div className="border-2 border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all duration-200">
          <JoditEditor
            ref={editor}
            value={content}
            config={config}
            onBlur={(newContent) => handleChange('content', newContent)}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-4">
            <span>💡 Tip: Use headings, lists, and images to make your content engaging</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Words: {content.replace(/<[^>]*>/g, '').split(' ').filter(word => word.length > 0).length}</span>
          </div>
        </div>
      </div>

      {/* Writing Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Writing Tips
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Keep your title clear and engaging (under 60 characters for SEO)</li>
          <li>• Use subheadings to break up long content</li>
          <li>• Add images to make your post visually appealing</li>
          <li>• Write in a conversational tone to connect with readers</li>
        </ul>
      </div>
    </div>
  );
};

export default TextEditor;