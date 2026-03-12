import { useEffect, useState } from 'react';
import { LayoutDashboard, Car, Clock, User } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CarCard, Car as CarType } from '@/components/shared/CarCard';
import { BookingModal } from '@/components/shared/BookingModal';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatCurrency';
import { db } from '@/services/firebase';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { subscribeApprovedCars } from '@/services/carService';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Explore Cars', href: '/dashboard/explore', icon: <Car size={16} /> },
  { label: 'My Trips', href: '/dashboard/trips', icon: <Clock size={16} /> },
  { label: 'Profile', href: '/dashboard/profile', icon: <User size={16} /> },
];

export default function UserDashboard() {
  const { user } = useAuth();
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const [activeBooking, setActiveBooking] = useState<any | null>(null);
  const [recentTrips, setRecentTrips] = useState<any[]>([]);
  const [recommendedCars, setRecommendedCars] = useState<CarType[]>([]);
  const [stats, setStats] = useState({
    totalTrips: 0,
    activeTrips: 0,
    completedTrips: 0,
  });

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;

      // Bookings for this user
      const bookingsQ = query(
        collection(db, 'bookings'),
        where('userId', '==', user.id),
        orderBy('createdAt', 'desc'),
      );
      const bookingsSnap = await getDocs(bookingsQ);
      const bookings = bookingsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

      const active = bookings.find((b) => b.status === 'active') || null;
      setActiveBooking(active);

      setRecentTrips(bookings.slice(0, 5));

      const totalTrips = bookings.length;
      const activeTrips = bookings.filter((b) => b.status === 'active').length;
      const completedTrips = bookings.filter((b) => b.status === 'completed').length;

      setStats({ totalTrips, activeTrips, completedTrips });
    };

    load();
  }, [user?.id]);

  useEffect(() => {
    const unsubscribe = subscribeApprovedCars((cars) => {
      setRecommendedCars(cars as CarType[]);
    });
    return () => unsubscribe();
  }, []);

  return (
    <DashboardLayout navItems={navItems} title="Renter Dashboard">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8 pb-20 md:pb-0">
        {/* Welcome */}
        <motion.div variants={fadeInUp}>
          <h1 className="font-display text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-muted-foreground mt-1">Find your next drive or manage your bookings.</p>
        </motion.div>

        {/* Trip stats */}
        <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Trips', value: stats.totalTrips, icon: <Car size={18} className="text-primary" /> },
            { label: 'Active Trips', value: stats.activeTrips, icon: <Clock size={18} className="text-primary" /> },
            { label: 'Completed Trips', value: stats.completedTrips, icon: <User size={18} className="text-primary" /> },
          ].map((stat, i) => (
            <div key={i} className="bg-card rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="label-caps text-muted-foreground">{stat.label}</span>
                {stat.icon}
              </div>
              <p className="font-display font-bold text-3xl tabular-nums">{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Active booking */}
        <motion.div variants={fadeInUp}>
          <h2 className="font-display font-semibold text-lg mb-4">Active Booking</h2>
          {activeBooking ? (
            <div className="bg-card rounded-xl shadow-md p-5 border border-primary/20">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-48 aspect-video md:aspect-auto md:h-32 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  {/* Optional image field; ignore if not present */}
                  {activeBooking.image && (
                    <img
                      src={activeBooking.image}
                      alt={activeBooking.carName}
                      className="w-full h-full object-cover car-image-frame"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-display font-bold text-lg">{activeBooking.carName}</h3>
                      <p className="text-sm text-muted-foreground">{activeBooking.city}</p>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-primary/30 label-caps">
                      {activeBooking.status}
                    </Badge>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <p className="label-caps text-muted-foreground mb-0.5">Start</p>
                      <p className="font-medium">{activeBooking.startDate}</p>
                    </div>
                    <div>
                      <p className="label-caps text-muted-foreground mb-0.5">Return</p>
                      <p className="font-medium">{activeBooking.endDate}</p>
                    </div>
                    <div>
                      <p className="label-caps text-muted-foreground mb-0.5">Total</p>
                      <p className="font-bold tabular-nums text-primary">
                        {formatCurrency(activeBooking.totalPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-xl shadow-md p-5 text-sm text-muted-foreground">
              No active trips.
            </div>
          )}
        </motion.div>

        {/* Recommended cars */}
        <motion.div variants={fadeInUp}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg">Recommended for You</h2>
          </div>
          {recommendedCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendedCars.map((car) => (
                <CarCard key={car.id} car={car} onBook={setSelectedCar} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No cars available yet. Check back soon.</p>
          )}
        </motion.div>

        {/* Trip history */}
        <motion.div variants={fadeInUp}>
          <h2 className="font-display font-semibold text-lg mb-4">Recent Trips</h2>
          {recentTrips.length > 0 ? (
            <div className="space-y-3">
              {recentTrips.map((booking) => (
                <div key={booking.id} className="bg-card rounded-xl shadow-md p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{booking.carName}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.startDate} → {booking.endDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold tabular-nums">
                      {formatCurrency(booking.totalPrice)}
                    </p>
                    <Badge variant="secondary" className="label-caps text-[10px]">
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No trips yet. Start exploring cars!
            </p>
          )}
        </motion.div>
      </motion.div>

      {selectedCar && <BookingModal car={selectedCar} onClose={() => setSelectedCar(null)} />}
    </DashboardLayout>
  );
}
