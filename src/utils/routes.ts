import type { UserRole } from '@/store/authStore';

/** App route paths — single source of truth for navigation */
export const ROUTES = {
  home: '/',
  explore: '/explore',
  about: '/about',
  contact: '/contact',
  login: '/login',
  signup: '/signup',
  ownerSignup: '/owner-signup',
  userDashboard: '/dashboard',
  userExplore: '/dashboard/explore',
  userTrips: '/dashboard/trips',
  userProfile: '/dashboard/profile',
  ownerDashboard: '/owner/dashboard',
  ownerCars: '/owner/cars',
  ownerBookings: '/owner/bookings',
  ownerEarnings: '/owner/earnings',
  ownerProfile: '/owner/profile',
  adminDashboard: '/admin/dashboard',
  adminBookings: '/admin/bookings',
  adminCars: '/admin/cars',
  adminUsers: '/admin/users',
  adminAnalytics: '/admin/analytics',
  adminQueries: '/admin/queries',
} as const;

export function getDashboardPathForRole(role: UserRole | string | undefined): string {
  switch (role) {
    case 'admin':
      return ROUTES.adminDashboard;
    case 'owner':
      return ROUTES.ownerDashboard;
    case 'user':
    default:
      return ROUTES.userDashboard;
  }
}

/**
 * Only allow same-origin path redirects after login (open redirect protection).
 */
export function isSafeRedirectPath(path: string | null | undefined): path is string {
  if (!path || typeof path !== 'string') return false;
  if (!path.startsWith('/')) return false;
  if (path.startsWith('//')) return false;
  if (path.includes('://')) return false;
  // Block auth loops
  if (path.startsWith('/login') || path.startsWith('/signup')) return false;
  return true;
}

export function buildLoginRedirect(path: string): string {
  return `${ROUTES.login}?redirect=${encodeURIComponent(path)}`;
}
