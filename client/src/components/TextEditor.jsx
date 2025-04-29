import React, { useRef, useState } from 'react';
import JoditEditor from 'jodit-react';

const TextEditor = ({ value, onChange }) => {
  const editor = useRef(null);
  const [content, setContent] = useState(value || '');

  const config = {
    readonly: false,
    height: 400,
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

  return (
    <div className="border rounded p-2 bg-white">
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1}
        onBlur={(newContent) => {
          setContent(newContent);
          onChange && onChange(newContent);
        }}
      />
    </div>
  );
};

export default TextEditor;
