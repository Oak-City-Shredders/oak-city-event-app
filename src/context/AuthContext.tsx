import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  FirebaseAuthentication,
  User,
} from '@capacitor-firebase/authentication';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  clearError: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user from Firebase
      await FirebaseAuthentication.reload();
      const result = await FirebaseAuthentication.getCurrentUser();
      setUser(result.user ?? null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to refresh authentication state'
      );
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Listen for authentication state changes
    const setupAuthListener = async () => {
      try {
        FirebaseAuthentication.addListener('authStateChange', (state) => {
          try {
            console.log('Auth state changed:', state);
            setUser(state.user ?? null);
            setLoading(false);
            setError(null);
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : 'An error occurred while processing auth state'
            );
            setLoading(false);
          }
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to initialize authentication listener'
        );
        setLoading(false);
      }
    };

    setupAuthListener();

    // Cleanup listener on unmount
    return () => {
      try {
        FirebaseAuthentication.removeAllListeners();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to cleanup authentication listeners'
        );
        setLoading(false);
      }
    };
  }, []);

  // Sign out function with error handling
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await FirebaseAuthentication.signOut();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  // Function to clear error state
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, signOut, clearError, refreshAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
