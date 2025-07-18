import { useState, useEffect } from "react";
import { categories } from "../data/vaultLogs";
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
    pinned: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        tags: initialData.tags.join(", ")
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
    setFormData((prev) => ({
      ...prev,
      content: text
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    const finalData = {
      ...formData,
      tags: tagsArray
    };

    await onSave(finalData);

    setFormData({
      text: "",
      date: "",
      excerpt: "",
      tags: "",
      category: "react",
      content: "",
      pinned: false
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-[#232946]/80 to-[#121629]/80 rounded-2xl p-8 border border-[#232946] shadow-lg space-y-6 max-w-2xl mx-auto"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-indigo-300 mb-1">Title</label>
          <input
            type="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            required
            className="w-full bg-[#181f2a] text-white px-3 py-2 rounded-lg border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-indigo-300 mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full bg-[#181f2a] text-white px-3 py-2 rounded-lg border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-xs font-semibold text-indigo-300 mb-1">Excerpt</label>
        <input
          type="text"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          className="w-full bg-[#181f2a] text-white px-3 py-2 rounded-lg border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      {/* Tags & Category */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-indigo-300 mb-1">Tags</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full bg-[#181f2a] text-white px-3 py-2 rounded-lg border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="e.g. react, hooks"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-indigo-300 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-[#181f2a] text-white px-3 py-2 rounded-lg border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Markdown Editor */}
      <div>
        <label className="block text-xs font-semibold text-indigo-300 mb-1">Content (Markdown)</label>
        <MdEditor
          value={formData.content}
          style={{ height: "300px", background: "#1e1e2e", color: "white" }}
          onChange={handleMarkdownChange}
          renderHTML={(text) => (
            <div className="relative group animate-fade-in-entry">
              {/* Animated gradient border */}
              <div className="pointer-events-none absolute -inset-1 rounded-2xl z-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-700 opacity-40 blur-lg animate-border-glow" />
              {/* Floating glowing dot */}
              <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-gradient-to-tr from-indigo-400 via-purple-400 to-indigo-700 shadow-lg animate-pulse-glow z-10" />
              <div className="prose prose-invert prose-sm max-w-none relative z-10 bg-black/60 rounded-2xl p-4 shadow-xl border border-gray-700 backdrop-blur-md">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    a: ({ ...props }) => (
                      <a 
                        {...props} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                      />
                    ),
                    h1: ({ ...props }) => (
                      <h1 {...props} className="text-2xl font-bold text-white mb-2" />
                    ),
                    h2: ({ ...props }) => (
                      <h2 {...props} className="text-xl font-bold text-white mb-2" />
                    ),
                    h3: ({ ...props }) => (
                      <h3 {...props} className="text-lg font-bold text-white mb-2" />
                    ),
                    p: ({ ...props }) => (
                      <p {...props} className="text-white mb-2" />
                    ),
                    ul: ({ ...props }) => (
                      <ul {...props} className="list-disc list-inside text-white mb-2" />
                    ),
                    ol: ({ ...props }) => (
                      <ol {...props} className="list-decimal list-inside text-white mb-2" />
                    ),
                    li: ({ ...props }) => (
                      <li {...props} className="text-white" />
                    ),
                    blockquote: ({ ...props }) => (
                      <blockquote {...props} className="border-l-4 border-indigo-400 pl-4 text-indigo-200 italic my-4" />
                    ),
                    code: ({ inline, ...props }) => (
                      inline ? 
                        <code {...props} className="bg-gray-900 px-1 rounded text-green-400" /> :
                        <pre className="bg-black p-3 rounded-lg overflow-x-auto my-2 border border-green-700 shadow-inner animate-glow-code"><code className="text-green-400" {...props} /></pre>
                    ),
                    del: ({ ...props }) => (
                      <del {...props} className="line-through text-gray-400" />
                    ),
                  }}
                >
                  {text}
                </ReactMarkdown>
              </div>
              <style>{`
                @keyframes fade-in-entry {
                  from { opacity: 0; transform: translateY(30px); }
                  to { opacity: 1; transform: none; }
                }
                .animate-fade-in-entry { animation: fade-in-entry 0.7s cubic-bezier(.4,0,.2,1) both; }
                @keyframes border-glow {
                  0%, 100% { opacity: 0.4; filter: blur(8px); }
                  50% { opacity: 0.7; filter: blur(16px); }
                }
                .animate-border-glow { animation: border-glow 2.5s infinite alternate; }
                @keyframes pulse-glow {
                  0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.5); }
                  50% { box-shadow: 0 0 16px 8px rgba(99,102,241,0.7); }
                }
                .animate-pulse-glow { animation: pulse-glow 2s infinite alternate; }
                @keyframes glow-code {
                  0%, 100% { box-shadow: 0 0 0 0 #22d3ee33; }
                  50% { box-shadow: 0 0 16px 4px #22d3ee66; }
                }
                .animate-glow-code { animation: glow-code 2.2s infinite alternate; }
              `}</style>
            </div>
          )}
        />
        <p className="text-xs mt-2 text-gray-400">
          💡 Tip: Use Markdown like <code>![desc](https://...)</code> to embed images.
        </p>
      </div>

      {/* Pinned Option */}
      <div className="flex items-center space-x-4">
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            name="pinned"
            checked={formData.pinned}
            onChange={handleChange}
            className="form-checkbox text-indigo-500"
          />
          <span className="text-sm">📌 Pin this entry</span>
        </label>
      </div>

      {/* Actions */}
      <div className="pt-4 flex justify-end space-x-4">
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:from-indigo-600 hover:to-purple-700 transition"
        >
          {initialData ? "Update Entry" : "Add Entry"}
        </button>
        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        )}
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
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};

export default VaultForm;
