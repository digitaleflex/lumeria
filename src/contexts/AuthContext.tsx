/* ============================================
   AUTH CONTEXT - Gestion globale de l'authentification
   Utilise Better Auth avec Magic Link
   ============================================ */

import { createContext, useContext, useCallback, useState } from 'react';
import { useSession, signOut, signIn } from '@/lib/auth-client';
import type { UserSession } from '@/types';

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const [error, setError] = useState<string | null>(null);

  // Convert Better Auth session to UserSession
  // The role comes from the database user table
  const user: UserSession | null = session?.user ? {
    id: session.user.id,
    email: session.user.email,
    role: (session.user as any).role || 'user', // Get role from DB
    name: session.user.name || session.user.email.split('@')[0],
    avatar: session.user.image || null,
  } : null;

  // Magic Link login - sends email with magic link
  const login = useCallback(async (email: string): Promise<boolean> => {
    setError(null);

    try {
      // Send magic link email via Better Auth API
      const { error } = await signIn.magicLink({
        email,
        callbackURL: '/',
      });

      if (error) {
        throw new Error(error.message || 'Failed to send magic link');
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(message);
      return false;
    }
  }, []);

  // Google login
  // Google login
  const loginWithGoogle = useCallback(async (): Promise<boolean> => {
    setError(null);

    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/", // Redirects to home on success
      });
      return true;
    } catch (err) {
      setError('Google login failed. Please try again.');
      return false;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await signOut();
      setError(null);
    } catch (err) {
      // Even if logout fails, clear local state
      setError(null);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLoading: isPending,
    error,
    login,
    loginWithGoogle,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
