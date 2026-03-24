import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { buildLoginRedirect, getDashboardPathForRole } from '@/utils/routes';
import type { UserRole } from '@/store/authStore';

type Props = {
  children: React.ReactNode;
  role?: UserRole;
};

/**
 * Requires Firebase session + optional role. Wrong role → that user’s dashboard.
 * Missing session → login with safe return URL.
 */
export function ProtectedRoute({ children, role }: Props) {
  const { isLoggedIn, user, initialized } = useAuth();
  const location = useLocation();

  if (!initialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" aria-label="Loading" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to={buildLoginRedirect(location.pathname + location.search)} replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={getDashboardPathForRole(user.role)} replace />;
  }

  return <>{children}</>;
}
