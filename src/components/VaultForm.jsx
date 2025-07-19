// VaultForm.jsx
import { useState, useEffect } from "react";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import PropTypes from 'prop-types';
import 'highlight.js/styles/github-dark.css';
import remarkGfm from 'remark-gfm';

export const VaultForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    text: "",
    date: "",
    excerpt: "",
    tags: "",
    category: "react",
    content: "",
    pinned: false,
    image_url: ""
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        text: initialData.text || "",
        date: initialData.date || "",
        excerpt: initialData.excerpt || "",
        tags: initialData.tags ? initialData.tags.join(", ") : "",
        category: initialData.category || "react",
        content: initialData.content || "",
        pinned: initialData.pinned || false,
        image_url: initialData.image_url || ""
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleMarkdownChange = ({ text }) => {
    setFormData(prev => ({
      ...prev,
      content: text
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert tags string to array
    const tagsArray = formData.tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag !== "");
    
    // Prepare the data to be saved
    const dataToSave = {
      ...formData,
      tags: tagsArray
    };

    await onSave(dataToSave);
    
    // Reset form only if not editing
    if (!initialData) {
      setFormData({
        text: "",
        date: "",
        excerpt: "",
        tags: "",
        category: "react",
        content: "",
        pinned: false,
        image_url: ""
      });
    }
  };

  const markdownComponents = {
    blockquote: ({node, ...props}) => (
      <blockquote className="border-l-2 border-gray-500 pl-4 italic text-gray-300 my-4" {...props} />
    ),
    code({node, inline, className, children, ...props}) {
      if (inline) {
        return <code className="bg-gray-800 px-1.5 py-0.5 rounded text-green-400 font-mono text-sm" {...props}>{children}</code>;
      }
      return (
        <div className="my-4">
          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
            <code className={`${className} text-gray-300 font-mono text-sm`} {...props}>
              {children}
            </code>
          </pre>
        </div>
      );
    },
    a: ({node, ...props}) => (
      <a className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer" {...props} />
    ),
    h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mb-4" {...props} />,
    h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-white mb-3" {...props} />,
    h3: ({node, ...props}) => <h3 className="text-lg font-medium text-white mb-2" {...props} />,
    p: ({node, children, ...props}) => (
      <div className="text-gray-300 mb-3" {...props}>
        {children}
      </div>
    ),
    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-3" {...props} />,
    ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-3" {...props} />,
    li: ({node, ...props}) => <li className="text-gray-300 mb-1" {...props} />,
    strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
    em: ({node, ...props}) => <em className="italic text-gray-300" {...props} />,
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-6"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Title*</label>
          <input
            type="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            required
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Date*</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Excerpt</label>
          <input
            type="text"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Tags* (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            required
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            placeholder="e.g. react, javascript, web"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          >
            <option value="react">React</option>
            <option value="javascript">JavaScript</option>
            <option value="web">Web</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
          <input
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            placeholder="Optional image URL"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="pinned"
          checked={formData.pinned}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
        />
        <label className="ml-2 block text-sm text-gray-300">Pin this entry</label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Content*</label>
        <MdEditor
          value={formData.content}
          style={{ height: "300px", background: "#1e1e2e", color: "white" }}
          onChange={handleMarkdownChange}
          renderHTML={(text) => (
            <div className="bg-gray-800 rounded-lg p-4">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={markdownComponents}
              >
                {text}
              </ReactMarkdown>
            </div>
          )}
        />
      </div>

      <div className="pt-4 flex justify-end space-x-4">
        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          {initialData ? "Update Entry" : "Add Entry"}
        </button>
      </div>
    </form>
  );
};

VaultForm.propTypes = {
  initialData: PropTypes.shape({
    text: PropTypes.string,
    date: PropTypes.string,
    excerpt: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.string,
    content: PropTypes.string,
    pinned: PropTypes.bool,
    image_url: PropTypes.string
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};

export default VaultForm;