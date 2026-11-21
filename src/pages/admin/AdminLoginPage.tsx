import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BrandLogo } from '../../components/BrandLogo';

export const AdminLoginPage: React.FC = () => {
  const { isConfigured, isAuthenticated, isLoading, login, error } = useAdminAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!password) {
      setLocalError('Please enter the administrator password.');
      return;
    }

    setSubmitting(true);
    const success = await login(password);
    setSubmitting(false);

    if (success) {
      navigate('/admin', { replace: true });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#060a14]">
      <div className="max-w-md w-full space-y-8 bg-[#0d1527] border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/15 rounded-full blur-[60px] pointer-events-none" />

        <div className="text-center relative z-10">
          <div className="flex justify-center mb-5">
            <BrandLogo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Owner & Admin Portal
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Local prototype submissions inbox. Enter the administrator password to inspect student registrations.
          </p>
        </div>

        {/* Configuration Notice if admin password / session secret is not configured in .env */}
        {!isConfigured && (
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs leading-relaxed">
            <p className="font-semibold mb-1">Local Admin Setup Required</p>
            <p className="mb-2">
              The administrator prototype password or session secret is missing in your local <code className="bg-black/40 px-1 py-0.5 rounded text-amber-200">.env</code> file.
            </p>
            <p>
              Please configure <code className="bg-black/40 px-1 py-0.5 rounded text-amber-200">ADMIN_PASSWORD</code> and <code className="bg-black/40 px-1 py-0.5 rounded text-amber-200">ADMIN_SESSION_SECRET</code> in your local <code className="bg-black/40 px-1 py-0.5 rounded text-amber-200">.env</code> to activate this portal.
            </p>
          </div>
        )}

        {(error || localError) && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-2.5">
            <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10" noValidate>
          <div>
            <label htmlFor="adminPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Administrator Password
            </label>
            <input
              id="adminPassword"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter prototype password"
              disabled={!isConfigured || submitting}
              className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={!isConfigured || submitting}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In as Owner</span>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-500 leading-relaxed">
          Local prototype authenticated session. Submissions are stored in local SQLite database (<code className="text-slate-400">data/aedvix.db</code>).
        </div>
      </div>
    </div>
  );
};
