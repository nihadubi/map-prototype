import { useEffect, useMemo, useState } from 'react';
import {
  initializeAuthPersistence,
  login,
  logout,
  observeAuthState,
  signUp,
} from '../../lib/backend/authClient';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};

    async function initializeAuth() {
      try {
        await initializeAuthPersistence();
      } catch (error) {
        console.error('Failed to set auth persistence:', error);
      }

      unsubscribe = observeAuthState((authUser) => {
        setUser(authUser);
        setIsAuthLoading(false);
      });
    }

    initializeAuth();

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAuthLoading,
      signUp,
      login,
      logout,
    }),
    [user, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
