import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SplashScreen } from "@/components/shared/SplashScreen";
import { useAuth } from "@/hooks/useAuth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";
import { getUserRole } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

// Pages
import LandingPage from "@/pages/public/LandingPage";
import ExplorePage from "@/pages/public/ExplorePage";
import AboutPage from "@/pages/public/AboutPage";
import ContactPage from "@/pages/public/ContactPage";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import UserDashboard from "@/pages/user/UserDashboard";
import UserExplore from "@/pages/user/UserExplore";
import MyTrips from "@/pages/user/MyTrips";
import Profile from "@/pages/user/Profile";
import OwnerDashboard from "@/pages/owner/OwnerDashboard";
import MyCars from "@/pages/owner/MyCars";
import OwnerBookings from "@/pages/owner/OwnerBookings";
import Earnings from "@/pages/owner/Earnings";
import OwnerProfile from "@/pages/owner/OwnerProfile";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminBookings from "@/pages/admin/AdminBookings";
import AdminCars from "@/pages/admin/AdminCars";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminQueries from "@/pages/admin/AdminQueries";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: string }) => {
  const { isLoggedIn, user } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/explore" element={<ExplorePage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/owner-signup" element={<SignupPage />} />
    {/* User dashboard and sub-routes */}
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

    {/* Owner dashboard and sub-routes */}
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

    {/* Admin dashboard and sub-routes */}
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const { login, logout } = useAuthStore.getState();

      if (!firebaseUser) {
        logout();
        return;
      }

      try {
        const role = await getUserRole(firebaseUser.uid);

        if (!role) {
          logout();
          return;
        }

        login({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email || "User",
          email: firebaseUser.email || "",
          role,
        });
      } catch {
        logout();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
