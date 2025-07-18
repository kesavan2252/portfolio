import PropTypes from 'prop-types';

export const VaultEntry = ({ entry, onClick }) => {
  return (
    <article 
      className="group relative bg-gray-900/70 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-indigo-500 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 flex flex-col h-full"
      onClick={() => onClick(entry)}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative flex flex-col h-full">
        <div className="flex justify-between items-start">
          <time className="text-sm text-indigo-400">
            {new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900/50 text-indigo-300">
            {entry.category}
          </span>
        </div>
        <div className="flex-grow mt-2">
          <h3 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition-colors duration-300">
            {entry.text}
          </h3>
          <p className="mt-4 text-gray-400">{entry.excerpt}</p>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-800/50">
          <div className="flex flex-wrap gap-2">
            {(() => {
              const safeTags = Array.isArray(entry.tags)
                ? entry.tags
                : typeof entry.tags === 'string'
                ? entry.tags.split(',').map(tag => tag.trim())
                : [];
              return safeTags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-900/30 text-indigo-300"
                >
                  #{tag}
                </span>
              ));
            })()}
          </div>
        </div>
      </div>
    </article>
  );
};

VaultEntry.propTypes = {
  entry: PropTypes.shape({
    date: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    category: PropTypes.string,
    text: PropTypes.string,
    excerpt: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default VaultEntry;