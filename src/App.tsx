import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SplashScreen } from '@/components/shared/SplashScreen';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { auth } from '@/services/firebase';
import { getUserProfile } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';

// Pages
import LandingPage from '@/pages/public/LandingPage';
import ExplorePage from '@/pages/public/ExplorePage';
import AboutPage from '@/pages/public/AboutPage';
import ContactPage from '@/pages/public/ContactPage';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import UserDashboard from '@/pages/user/UserDashboard';
import UserExplore from '@/pages/user/UserExplore';
import MyTrips from '@/pages/user/MyTrips';
import Profile from '@/pages/user/Profile';
import OwnerDashboard from '@/pages/owner/OwnerDashboard';
import MyCars from '@/pages/owner/MyCars';
import OwnerBookings from '@/pages/owner/OwnerBookings';
import Earnings from '@/pages/owner/Earnings';
import OwnerProfile from '@/pages/owner/OwnerProfile';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminBookings from '@/pages/admin/AdminBookings';
import AdminCars from '@/pages/admin/AdminCars';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminQueries from '@/pages/admin/AdminQueries';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/explore" element={<ExplorePage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/owner-signup" element={<SignupPage />} />

    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
    <Route path="/owner" element={<Navigate to="/owner/dashboard" replace />} />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute role="user">
          <UserDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/explore"
      element={
        <ProtectedRoute role="user">
          <UserExplore />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/trips"
      element={
        <ProtectedRoute role="user">
          <MyTrips />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/profile"
      element={
        <ProtectedRoute role="user">
          <Profile />
        </ProtectedRoute>
      }
    />

    <Route
      path="/owner/dashboard"
      element={
        <ProtectedRoute role="owner">
          <OwnerDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/owner/cars"
      element={
        <ProtectedRoute role="owner">
          <MyCars />
        </ProtectedRoute>
      }
    />
    <Route
      path="/owner/bookings"
      element={
        <ProtectedRoute role="owner">
          <OwnerBookings />
        </ProtectedRoute>
      }
    />
    <Route
      path="/owner/earnings"
      element={
        <ProtectedRoute role="owner">
          <Earnings />
        </ProtectedRoute>
      }
    />
    <Route
      path="/owner/profile"
      element={
        <ProtectedRoute role="owner">
          <OwnerProfile />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute role="admin">
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/bookings"
      element={
        <ProtectedRoute role="admin">
          <AdminBookings />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/cars"
      element={
        <ProtectedRoute role="admin">
          <AdminCars />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/users"
      element={
        <ProtectedRoute role="admin">
          <AdminUsers />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/analytics"
      element={
        <ProtectedRoute role="admin">
          <AdminAnalytics />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/queries"
      element={
        <ProtectedRoute role="admin">
          <AdminQueries />
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => {
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    const { login, logout } = useAuthStore.getState();

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        logout();
        return;
      }

      try {
        const profile = await getUserProfile(firebaseUser.uid);

        if (!profile?.role) {
          await signOut(auth);
          logout();
          return;
        }

        const displayName =
          profile.name ||
          firebaseUser.displayName?.trim() ||
          firebaseUser.email?.split('@')[0] ||
          'User';

        login({
          id: firebaseUser.uid,
          name: displayName,
          email: profile.email || firebaseUser.email || '',
          role: profile.role,
        });
      } catch {
        try {
          await signOut(auth);
        } catch {
          /* ignore */
        }
        logout();
      }
    });

    /** If token refresh fails (e.g. user disabled, revoked), end session */
    const onVisibility = () => {
      if (document.visibilityState !== 'visible' || !auth.currentUser) return;
      auth.currentUser.getIdToken(true).catch(async () => {
        try {
          await signOut(auth);
        } catch {
          /* ignore */
        }
      });
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      unsub();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}
          {splashDone && <AppRoutes />}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
