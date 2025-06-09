import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Custom Toolbar Configuration
const toolbarOptions = [
    [{ header: [1, 2, false] }], // Header levels
    ['bold', 'italic', 'underline'], // Basic text formatting
    [{ list: 'ordered' }, { list: 'bullet' }], // Lists (ordered and bullet)
    ['blockquote', 'code-block'], // Blockquote and code block
    ['link'], // Insert link and image
    [{ align: [] }], // Text alignment
    ['clean'], // Clear formatting
];

interface QuillEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange }) => {
    return (
        <div className="quill-wrapper bg-white rounded-md">
            <ReactQuill
                value={value}
                onChange={onChange}
                modules={{
                    toolbar: toolbarOptions, // Attach the custom toolbar configuration
                }}
                formats={[
                    'header',
                    'bold',
                    'italic',
                    'underline',
                    'list',
                    'bullet',
                    'blockquote',
                    'code-block',
                    'link',
                    'align',
                ]} // Define the supported formats
                theme="snow" // Quill's default theme (snow)
            />
        </div>
    );
};

export default QuillEditor;
