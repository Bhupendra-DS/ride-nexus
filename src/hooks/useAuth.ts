import { useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { signOutUser } from '@/services/authService';
import { getDashboardPathForRole } from '@/utils/routes';

export const useAuth = () => {
  const { user, isLoggedIn, initialized, login, logout: clearStore } = useAuthStore();

  const effectiveLoggedIn = initialized && isLoggedIn;

  const getDashboardPath = useCallback(() => {
    if (!user) return '/login';
    return getDashboardPathForRole(user.role);
  }, [user]);

  /** Clears Firebase session and local mirror state (production-safe). */
  const logout = useCallback(async () => {
    try {
      await signOutUser();
    } catch {
      // Still clear UI state if Firebase signOut fails (e.g. offline)
    } finally {
      clearStore();
    }
  }, [clearStore]);

  return {
    user,
    isLoggedIn: effectiveLoggedIn,
    initialized,
    login,
    logout,
    getDashboardPath,
  };
};
