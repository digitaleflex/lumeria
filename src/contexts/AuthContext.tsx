/* ============================================
   AUTH CONTEXT - Gestion globale de l'authentification
   Utilise Better Auth avec Magic Link
   ============================================ */

import { createContext, useContext, useCallback, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { authClient, useSession, signOut } from '@/lib/auth-client';
import type { UserSession } from '@/types';

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string) => Promise<boolean>;
  loginWithGoogle: (credential: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = ['admin@lumora.com'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [googleUser, setGoogleUser] = useState<UserSession | null>(null);

  // Convert Better Auth session to UserSession
  const user: UserSession | null = googleUser || (session?.user ? {
    id: session.user.id,
    email: session.user.email,
    role: ADMIN_EMAILS.includes(session.user.email) ? 'admin' : 'user',
    name: session.user.name || session.user.email.split('@')[0],
    avatar: session.user.image || null,
  } : null);

  // Magic Link login - sends email with magic link
  const login = useCallback(async (email: string): Promise<boolean> => {
    setError(null);
    
    try {
      // Send magic link email via Better Auth API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/sign-in/magic-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          callbackURL: '/',
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send magic link');
      }
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(message);
      return false;
    }
  }, []);

  // Google login
  const loginWithGoogle = useCallback(async (credential: string): Promise<boolean> => {
    setError(null);

    try {
      const decoded = jwtDecode<GoogleUser>(credential);
      
      const isAdmin = ADMIN_EMAILS.includes(decoded.email);
      
      const userSession: UserSession = {
        id: decoded.sub,
        email: decoded.email,
        role: isAdmin ? 'admin' : 'user',
        name: decoded.name,
        avatar: decoded.picture,
      };

      setGoogleUser(userSession);
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
      setGoogleUser(null);
      setError(null);
    } catch (err) {
      // Even if logout fails, clear local state
      setGoogleUser(null);
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
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
