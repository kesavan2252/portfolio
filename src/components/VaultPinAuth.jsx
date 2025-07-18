import { useState } from 'react';

export function VaultPinAuth({ onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace '123456' with your real PIN or fetch from env/secure source
    if (pin === import.meta.env.VITE_VAULT_PIN) {
      localStorage.setItem('vault_pin_authenticated', 'true');
      onSuccess();
    } else {
      setError('Incorrect PIN. Try again.');
      setPin('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 animate-fade-in">
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col items-center gap-6 p-10 rounded-2xl shadow-2xl max-w-xs w-full backdrop-blur-md bg-white/10 border border-indigo-500/30 animate-fade-in-up"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
      >
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-700 rounded-full blur-xl opacity-60 animate-pulse" />
        <h2 className="text-2xl font-extrabold text-white drop-shadow mb-2 tracking-wider animate-fade-in">🔒 Vault Access</h2>
        <p className="text-indigo-200 text-sm mb-2 animate-fade-in-slow">Enter your 6-digit PIN to unlock the editor</p>
        <input
          type="password"
          maxLength={6}
          pattern="[0-9]*"
          inputMode="numeric"
          value={pin}
          onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
          className="text-center text-3xl px-6 py-3 rounded-xl border border-indigo-400 bg-indigo-950/60 text-indigo-100 tracking-widest shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200 animate-fade-in"
          autoFocus
        />
        {error && <div className="text-red-400 text-sm animate-shake">{error}</div>}
        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white px-8 py-2 rounded-full font-semibold shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 animate-fade-in"
        >
          Unlock
        </button>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-indigo-300 opacity-60 animate-fade-in-slow">Vault is protected for your privacy ✨</div>
      </form>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in { animation: fade-in 0.8s cubic-bezier(.4,0,.2,1) both; }
        .animate-fade-in-up { animation: fade-in 1.2s cubic-bezier(.4,0,.2,1) both; }
        .animate-fade-in-slow { animation: fade-in 1.8s cubic-bezier(.4,0,.2,1) both; }
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.4s; }
      `}</style>
    </div>
  );
}
