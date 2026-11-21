import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

interface AdminAuthContextType {
  isConfigured: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkStatus: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConfigured, setIsConfigured] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/status', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setIsConfigured(Boolean(data.isConfigured));
        setIsAuthenticated(Boolean(data.isAuthenticated));
      } else {
        setIsConfigured(false);
        setIsAuthenticated(false);
      }
    } catch {
      setIsConfigured(false);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const login = async (password: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        return true;
      } else {
        setError(data.message || 'Login failed.');
        setIsAuthenticated(false);
        return false;
      }
    } catch {
      setError('Network or server error during sign in.');
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setIsAuthenticated(false);
    }
  };

  const value = useMemo(
    () => ({
      isConfigured,
      isLoading,
      isAuthenticated,
      error,
      login,
      logout,
      checkStatus,
    }),
    [isConfigured, isLoading, isAuthenticated, error, checkStatus]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
