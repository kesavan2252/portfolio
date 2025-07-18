import { useState, useEffect } from 'react';
import VaultForm from '../components/VaultForm';
import {
  fetchVaultLogs,
  addVaultLog,
  updateVaultLog,
  deleteVaultLog
} from '../lib/supabaseClient';
import { toast } from '../hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github-dark.css';

export const VaultEditor = () => {
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);

  // Fetch entries from Firebase
  useEffect(() => {
    fetchVaultLogs()
      .then(setEntries)
      .catch(console.error);
  }, []);

  // Handle Save (Add or Update)
  const handleSave = async (newEntry) => {
    if (editingEntry) {
      await updateVaultLog(editingEntry.id, newEntry);
      toast({
        title: 'Entry Updated',
        description: 'The entry was updated successfully.',
      });
    } else {
      await addVaultLog(newEntry);
      toast({
        title: 'Entry Added',
        description: 'A new entry was added successfully.',
      });
    }
    const updated = await fetchVaultLogs();
    setEntries(updated);
    setEditingEntry(null);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    toast({
      title: 'Delete Entry?',
      description: 'Are you sure you want to delete this entry?',
      action: (
        <div className="flex gap-2 mt-2">
          <button
            className="px-3 py-1 rounded bg-red-600 text-white-20 hover:bg-red-700 text-xs"
            onClick={async (e) => {
              e.stopPropagation();
              await deleteVaultLog(id);
              toast({
                title: 'Entry Deleted',
                description: 'The entry was deleted successfully.',
              });
              const updated = await fetchVaultLogs();
              setEntries(updated);
            }}
          >
            Delete
          </button>
          <button
            className="px-3 py-1 rounded bg-gray-700 text-white-00 hover:bg-gray-600 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              toast.dismiss();
            }}
          >
            Cancel
          </button>
        </div>
      ),
      variant: 'destructive',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a192f] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Vault Editor</h1>
          <a
            href="/messages"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-700 text-white font-semibold shadow-lg hover:shadow-indigo-500/30 border-2 border-indigo-400/40 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            style={{ boxShadow: '0 2px 16px 0 rgba(80,80,180,0.15)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-300 drop-shadow-glow">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l-1.414-1.414M6.05 6.05L4.636 4.636" />
            </svg>
            View Messages
          </a>
        </div>

        <VaultForm
          initialData={editingEntry}
          onSave={handleSave}
          onCancel={() => setEditingEntry(null)}
        />

        {/* Entry List */}
        <div className="mt-10 grid gap-6">
          {entries.map((entry, idx) => (
            <div
              key={entry.id}
              className="bg-gradient-to-br from-[#232946]/80 to-[#121629]/80 border border-[#232946] rounded-2xl p-6 shadow-lg hover:shadow-indigo-700/30 transition-all duration-200 hover:scale-[1.01] flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-indigo-100">{entry.text}</h2>
                  <p className="text-xs text-indigo-400">{entry.date?.toDate?.().toLocaleDateString()}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {Array.isArray(entry.tags) && entry.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs bg-indigo-700/30 text-indigo-200 px-2 py-0.5 rounded-full font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingEntry(entry)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded shadow hover:from-indigo-600 hover:to-purple-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-semibold px-3 py-1 rounded shadow hover:from-red-600 hover:to-pink-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {entry.imageUrl && (
                <img
                  src={entry.imageUrl}
                  alt="entry"
                  className="mt-4 rounded-lg max-w-xs object-contain border border-[#232946]"
                />
              )}
              {entry.content && (
                <div className="mt-4 pt-4 border-t border-[#232946]">
                  <h4 className="text-xs font-semibold text-indigo-400 mb-2 uppercase tracking-wider">Content Preview</h4>
                  <div className="prose prose-invert max-w-none bg-[#232946]/30 rounded-xl p-6 border border-[#232946]/50">
                    <ReactMarkdown
                      rehypePlugins={[rehypeHighlight]}
                      remarkPlugins={[remarkGfm]}
                      breaks={true}
                      components={{
                        blockquote: ({children, ...props}) => (
                          <blockquote className="border-l-4 border-indigo-300 pl-4 italic text-indigo-200 bg-[#232946]/20 rounded-r my-4 text-left" {...props}>
                            {children}
                          </blockquote>
                        ),
                        code: ({inline, children, ...props}) =>
                          inline ? (
                            <span className="relative group">
                              <code className="bg-[#232946] px-1.5 py-0.5 rounded text-teal-300 font-mono text-sm text-left" {...props}>{children}</code>
                            </span>
                          ) : (
                            <div className="relative group my-4">
                              <pre className="bg-[#0a192f] p-4 rounded-lg overflow-x-auto border border-teal-700/50 text-left"><code className="text-teal-300 font-mono text-sm text-left" {...props}>{children}</code></pre>
                            </div>
                          ),
                        a: ({...props}) => (
                          <a {...props} className="text-indigo-400 underline hover:text-indigo-200 text-left" target="_blank" rel="noopener noreferrer" />
                        ),
                        h2: ({...props}) => (
                          <h2 className="text-2xl font-semibold text-indigo-100 mt-8 mb-4 border-b border-[#232946]/50 pb-2 text-left" {...props} />
                        ),
                        h3: ({...props}) => (
                          <h3 className="text-xl font-medium text-indigo-100 mt-6 mb-3 text-left" {...props} />
                        ),
                        h4: ({...props}) => (
                          <h4 className="text-lg font-medium text-indigo-100 mt-5 mb-2 text-left" {...props} />
                        ),
                        p: ({...props}) => (
                          <p className="text-gray-200 leading-relaxed my-4 text-left" {...props} />
                        ),
                        ul: ({...props}) => (
                          <ul className="list-disc pl-6 text-left space-y-1 my-2" {...props} />
                        ),
                        ol: ({...props}) => (
                          <ol className="list-decimal pl-6 text-left space-y-1 my-2" {...props} />
                        ),
                        li: ({...props}) => (
                          <li className="text-gray-200 my-1 text-left" {...props} />
                        ),
                      }}
                    >
                      {entry.content.length > 300 
                        ? entry.content.substring(0, 300) + '...' 
                        : entry.content
                      }
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            localStorage.removeItem('vault_pin_authenticated');
            window.location.reload();
          }}
          className="text-xs text-red-400 underline ml-4"
        >
          Logout
        </button>
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
  );
};

export default VaultEditor;
