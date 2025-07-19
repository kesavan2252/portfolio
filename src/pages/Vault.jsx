import { useState, useEffect } from 'react';
import { fetchVaultLogs } from '../lib/supabaseClient';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';
import 'highlight.js/styles/github-dark.css';

export const Vault = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedBlock, setCopiedBlock] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchVaultLogs()
      .then((data) => {
        const formatted = data.map((entry) => ({
          ...entry,
          tags: Array.isArray(entry.tags)
            ? entry.tags
            : typeof entry.tags === 'string'
            ? entry.tags.split(',').map((t) => t.trim())
            : [],
        }));
        setEntries(formatted);
      })
      .catch((error) => console.error("Supabase fetch error:", error));
  }, []);

  const filteredEntries = entries.filter((entry) =>
    (entry.text?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (entry.excerpt?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    entry.tags?.some((tag) => (tag?.toLowerCase() || '').includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    if (selectedEntry && !filteredEntries.find(e => e.id === selectedEntry.id)) {
      setSelectedEntry(null);
    }
  }, [filteredEntries, selectedEntry]);

  useEffect(() => {
    if (selectedEntry && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [selectedEntry, isMobileMenuOpen]);

  const handleBackToPortfolio = () => {
    navigate('/'); // Adjust this path to match your portfolio route
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#181c20] text-gray-100 font-sans">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-[#232946] bg-[#232946] relative">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleBackToPortfolio}
            className="text-indigo-400 hover:text-indigo-200"
            aria-label="Back to portfolio"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <span className="font-bold text-lg text-indigo-100 tracking-tight">Knowledge Vault</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFeedback(v => !v)}
            className={`p-2 rounded-md text-indigo-200 hover:text-white focus:outline-none transition-colors ${
              showFeedback ? 'bg-indigo-800/60' : ''
            }`}
            aria-label="Show feedback"
          >
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
            </svg>
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-indigo-200 hover:text-white focus:outline-none"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Feedback popover for mobile */}
      {showFeedback && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center p-4">
          <div className="bg-[#232946] rounded-xl p-6 max-w-sm w-full relative">
            <button
              onClick={() => setShowFeedback(false)}
              className="absolute top-4 right-4 text-indigo-400 hover:text-indigo-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-bold text-indigo-100">Feedback</h3>
            </div>
            <p className="text-indigo-200 text-sm">
              If you see any wrong information or have suggestions, please contact me via the Contact section in my portfolio.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleBackToPortfolio}
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded transition flex items-center gap-2"
              >
                Go to Contact
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-[320px] md:min-w-[220px] md:max-w-xs h-screen md:h-auto md:flex-1 bg-[#232946] border-r border-[#232946] flex flex-col absolute md:relative z-10`}>
        <div className="p-4 border-b border-[#232946] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span className="font-bold text-lg text-indigo-100 tracking-tight">Knowledge Vault</span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden text-indigo-400 hover:text-indigo-200 p-1"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <span className="hidden md:block text-xs text-indigo-200">Capture, organize, and connect your thoughts.</span>
        </div>
        <div className="p-4 border-b border-[#232946]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full pl-10 pr-4 py-2 rounded bg-white-100 text-white-20 border border-[#232946] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {filteredEntries.length === 0 && (
            <div className="p-6 text-center text-gray-400 text-sm">
              <svg className="mx-auto h-8 w-8 text-indigo-500/50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              No notes found
            </div>
          )}
          <ul>
            {filteredEntries.map((entry) => (
              <li key={entry.id}>
                <button
                  className={`w-full text-left px-4 py-3 border-b border-[#232946] transition flex items-center gap-2
                    ${
                      selectedEntry && selectedEntry.id === entry.id
                        ? 'bg-indigo-800/60 border-l-4 border-indigo-500 text-indigo-100 shadow'
                        : 'hover:bg-indigo-900/40 hover:text-indigo-100 text-indigo-200'
                    }
                  `}
                  onClick={() => setSelectedEntry(entry)}
                >
                  <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span className="flex-1 truncate font-medium text-base text-indigo-100">{entry.text}</span>
                  {entry.tags?.length > 0 && (
                    <span className="hidden sm:inline text-xs text-indigo-400 bg-indigo-900/30 px-1.5 py-0.5 rounded">
                      {entry.tags[0]}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-[#232946] text-xs text-gray-500 text-center flex items-center justify-center gap-1">
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {filteredEntries.length} {filteredEntries.length === 1 ? 'note' : 'notes'} in vault
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen md:h-auto overflow-y-auto bg-[#181c20]">
        {/* Header - Hidden on mobile */}
        <header className="hidden md:flex px-4 md:px-8 py-4 md:py-6 border-b border-[#232946] items-center gap-4 bg-[#232946]/80">
          <button 
            onClick={handleBackToPortfolio}
            className="text-indigo-400 hover:text-indigo-200"
            aria-label="Back to portfolio"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
          </svg>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-indigo-100">Vault Explorer</h1>
        </header>
        
        {/* Entry View */}
        <section className="flex-1 flex flex-col items-center justify-start px-0 py-0">
          {selectedEntry ? (
            <div className="w-full h-full flex flex-col items-center justify-start">
              <div className="w-full max-w-3xl bg-transparent rounded-2xl p-4 md:p-8 relative mt-0 md:mt-4">
                <div className="flex items-center gap-3 mb-4 px-0">
                  <span className="text-xs text-indigo-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {selectedEntry.date
                      ? new Date(selectedEntry.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'No date'}
                  </span>
                  <button
                    className="ml-auto text-xs bg-indigo-700 hover:bg-indigo-800 text-white px-3 py-1 rounded border border-indigo-700 transition flex items-center gap-1"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedEntry.content);
                      setCopiedBlock('all');
                      setTimeout(() => setCopiedBlock(null), 1200);
                    }}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    {copiedBlock === 'all' ? "Copied!" : "Copy All"}
                  </button>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-indigo-100 mb-4 md:mb-6 text-left px-0">{selectedEntry.text}</h2>
                
                {/* Content area with subtle background */}
                <div className="prose prose-invert max-w-none bg-[#232946]/30 rounded-xl p-4 md:p-6 border border-[#232946]/50">
                  <ReactMarkdown
                    rehypePlugins={[rehypeHighlight]}
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({node, children, ...props}) => {
                        const hasCodeBlock = node.children.some(
                          child => child.tagName === 'pre'
                        );
                        
                        if (hasCodeBlock) {
                          return <div {...props}>{children}</div>;
                        }
                        return <p className="text-gray-200 leading-relaxed my-3 md:my-4 text-left" {...props} />;
                      },
                      blockquote: ({children, ...props}) => (
                        <blockquote className="border-l-4 border-indigo-300 pl-4 italic text-indigo-200 bg-[#232946]/20 rounded-r my-4" {...props}>
                          {children}
                        </blockquote>
                      ),
                      code: ({inline, className, children, ...props}) => {
                        if (inline) {
                          return (
                            <code className="bg-[#232946] px-1.5 py-0.5 rounded text-teal-300 font-mono text-sm" {...props}>
                              {children}
                            </code>
                          );
                        }
                        return (
                          <div className="relative my-4">
                            <pre className={`${className} bg-[#0a192f] p-4 rounded-lg overflow-x-auto border border-teal-700/50`}>
                              <code className="text-teal-300 font-mono text-sm">
                                {children}
                              </code>
                            </pre>
                          </div>
                        );
                      },
                      a: ({...props}) => (
                        <a {...props} className="text-indigo-400 underline hover:text-indigo-200" target="_blank" rel="noopener noreferrer" />
                      ),
                      h2: ({...props}) => (
                        <h2 className="text-xl md:text-2xl font-semibold text-indigo-100 mt-6 md:mt-8 mb-3 md:mb-4 border-b border-[#232946]/50 pb-2 text-left" {...props} />
                      ),
                      h3: ({...props}) => (
                        <h3 className="text-lg md:text-xl font-medium text-indigo-100 mt-5 md:mt-6 mb-2 md:mb-3 text-left" {...props} />
                      ),
                      h4: ({...props}) => (
                        <h4 className="text-base md:text-lg font-medium text-indigo-100 mt-4 md:mt-5 mb-2 text-left" {...props} />
                      ),
                      ul: ({...props}) => (
                        <ul className="list-disc pl-5 md:pl-6 text-left space-y-1 my-2" {...props} />
                      ),
                      ol: ({...props}) => (
                        <ol className="list-decimal pl-5 md:pl-6 text-left space-y-1 my-2" {...props} />
                      ),
                      li: ({...props}) => (
                        <li className="text-gray-200 my-1" {...props} />
                      ),
                    }}
                  >
                    {selectedEntry.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full p-8">
              <div className="text-center max-w-md">
                <svg className="mx-auto h-12 md:h-16 w-12 md:w-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-4 text-xl md:text-2xl font-bold text-indigo-100">Your Digital Notebook</h3>
                <p className="mt-2 text-indigo-200">
                  {isMobileMenuOpen ? 'Select a note below' : 'Select a note from the sidebar'}
                </p>
                
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Feedback icon - Desktop only */}
      <div className="hidden md:flex fixed top-6 right-6 z-50 flex-col items-end gap-2">
        <button
          className="bg-[#232946]/80 hover:bg-indigo-800/80 border border-indigo-700/40 rounded-full p-2 shadow-lg text-indigo-100 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onClick={() => setShowFeedback(v => !v)}
          aria-label="Show feedback/contact info"
        >
          <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
          </svg>
        </button>
        {showFeedback && (
          <div className="mt-2 bg-[#232946]/80 backdrop-blur-md border border-indigo-700/40 rounded-xl px-4 py-3 shadow-lg text-indigo-100 text-sm flex items-center gap-2 pointer-events-auto animate-fade-in max-w-xs">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            If you see any wrong information or have suggestions, please contact me via the Contact section in my portfolio.
          </div>
        )}
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 0.25s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
    </div>
  );
};

export default Vault;