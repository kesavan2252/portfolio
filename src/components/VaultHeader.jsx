export const VaultHeader = () => {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-gray-900/30 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              The Vault
            </h1>
            <p className="mt-4 text-xl text-indigo-200 max-w-3xl mx-auto">
              Thoughts, notes, and discoveries from my journey in development and design.
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default VaultHeader;