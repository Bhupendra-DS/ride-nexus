import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const { user, isLoggedIn, login, logout } = useAuthStore();

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'owner': return '/owner/dashboard';
      case 'user': return '/dashboard';
      default: return '/dashboard';
    }
  };

  return { user, isLoggedIn, login, logout, getDashboardPath };
};
