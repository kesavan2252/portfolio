// VaultEditor.jsx
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

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const data = await fetchVaultLogs();
        if (data && typeof data === 'object') {
          setEntries(data);
        } else {
          console.error('Invalid data format received:', data);
          setEntries([]);
        }
      } catch (error) {
        console.error('Error loading entries:', error);
      }
    };
    loadEntries();
  }, []);

  const handleSave = async (newEntry) => {
    try {
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
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to save entry. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id) => {
    toast({
      title: 'Delete Entry?',
      description: 'Are you sure you want to delete this entry?',
      action: (
        <div className="flex gap-2 mt-2">
          <button
            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-xs"
            onClick={async (e) => {
              e.stopPropagation();
              try {
                await deleteVaultLog(id);
                toast({
                  title: 'Entry Deleted',
                  description: 'The entry was deleted successfully.',
                });
                const updated = await fetchVaultLogs();
                setEntries(updated);
              } catch (error) {
                console.error('Error deleting entry:', error);
                toast({
                  title: 'Error',
                  description: 'Failed to delete entry.',
                  variant: 'destructive',
                });
              }
            }}
          >
            Delete
          </button>
          <button
            className="px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 text-xs"
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
    h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-gray-100 mt-8 mb-4" {...props} />,
    h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-gray-100 mt-6 mb-3" {...props} />,
    h3: ({node, ...props}) => <h3 className="text-lg font-medium text-gray-100 mt-5 mb-2" {...props} />,
    p: ({node, children, ...props}) => (
      <div className="text-gray-300 leading-relaxed my-3" {...props}>
        {children}
      </div>
    ),
    ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-1 my-2" {...props} />,
    ol: ({node, ...props}) => <ol className="list-decimal pl-6 space-y-1 my-2" {...props} />,
    li: ({node, ...props}) => <li className="text-gray-300 my-1" {...props} />,
    strong: ({node, ...props}) => <strong className="font-semibold text-gray-100" {...props} />,
    em: ({node, ...props}) => <em className="italic text-gray-300" {...props} />,
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Vault Editor</h1>
          <a
            href="/messages"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gray-800 text-white font-medium hover:bg-gray-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l-1.414-1.414M6.05 6.05L4.636 4.636" />
            </svg>
            View Messages
          </a>
        </div>

        <div className="mb-10">
          <VaultForm
            initialData={editingEntry}
            onSave={handleSave}
            onCancel={() => setEditingEntry(null)}
          />
        </div>

        <div className="grid gap-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 hover:border-gray-600 transition"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-white">{entry.text}</h2>
                  <p className="text-xs text-gray-400 mt-1">
                    {entry.date?.toDate?.().toLocaleDateString() || new Date(entry.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingEntry(entry)}
                    className="px-3 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="px-3 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {entry.content && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <ReactMarkdown
                      rehypePlugins={[rehypeHighlight]}
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {entry.content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              localStorage.removeItem('vault_pin_authenticated');
              window.location.reload();
            }}
            className="text-xs text-red-400 underline hover:text-red-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default VaultEditor;