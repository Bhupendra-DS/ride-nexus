import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const { user, isLoggedIn, initialized, login, logout } = useAuthStore();

  // Treat user as logged in only after Firebase auth has been checked at least once.
  const effectiveLoggedIn = initialized && isLoggedIn;

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'owner': return '/owner/dashboard';
      case 'user': return '/dashboard';
      default: return '/dashboard';
    }
  };

  return { user, isLoggedIn: effectiveLoggedIn, login, logout, getDashboardPath };
};
