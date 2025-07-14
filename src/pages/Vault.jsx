import { useState } from 'react';
import { vaultData } from '../data/vaultLogs';
import { VaultHeader } from '../components/VaultHeader';
import { VaultEntry } from '../components/VaultEntry';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

export const Vault = () => {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Sort pinned entries first, then apply filtering
  const sortedEntries = [...vaultData]
    .sort((a, b) => Number(b.pinned) - Number(a.pinned))
    .filter(entry =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const handleBackToList = () => {
    setSelectedEntry(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
      <VaultHeader />

      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {selectedEntry ? (
          <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <button
              onClick={handleBackToList}
              className="mb-6 flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to all entries
            </button>

            <article className="flex flex-col min-h-[70vh]">
              <div className="flex-grow">
                <time className="text-sm text-indigo-400">
                  {new Date(selectedEntry.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <h1 className="mt-2 text-3xl font-bold text-white">{selectedEntry.title}</h1>
                <div className="mt-6 prose prose-invert max-w-none">
                    <ReactMarkdown>{selectedEntry.content}</ReactMarkdown>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-800/50">
                <div className="flex flex-wrap gap-2">
                  {selectedEntry.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-900/30 text-indigo-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-md mx-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search entries..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-800 rounded-lg bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Entries Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedEntries.map((entry) => (
                <VaultEntry
                  key={entry.id}
                  entry={entry}
                  onClick={setSelectedEntry}
                />
              ))}
            </div>

            {/* No Results */}
            {sortedEntries.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No entries found. Try a different search term.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Vault;
