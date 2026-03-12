import { useState } from 'react';
import { LayoutDashboard, Car, Clock, MessageCircle, User } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CarCard } from '@/components/shared/CarCard';
import { BookingModal } from '@/components/shared/BookingModal';
import { mockCars, mockBookings } from '@/lib/mockData';
import { Car as CarType } from '@/components/shared/CarCard';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Explore Cars', href: '/explore', icon: <Car size={16} /> },
  { label: 'My Trips', href: '/dashboard/trips', icon: <Clock size={16} /> },
  { label: 'Messages', href: '/dashboard/messages', icon: <MessageCircle size={16} /> },
  { label: 'Profile', href: '/dashboard/profile', icon: <User size={16} /> },
];

export default function UserDashboard() {
  const { user } = useAuth();
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);

  const activeBooking = mockBookings.find(b => b.status === 'active');
  const recentTrips = mockBookings.filter(b => b.status === 'completed').slice(0, 2);

  return (
    <DashboardLayout navItems={navItems} title="Renter Dashboard">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8 pb-20 md:pb-0">
        {/* Welcome */}
        <motion.div variants={fadeInUp}>
          <h1 className="font-display text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-muted-foreground mt-1">Find your next drive or manage your bookings.</p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Trips', value: '12', icon: <Car size={18} className="text-primary" /> },
            { label: 'Hours Driven', value: '347', icon: <Clock size={18} className="text-primary" /> },
            { label: 'Saved Cars', value: '5', icon: <User size={18} className="text-primary" /> },
            { label: 'Avg. Rating', value: '4.9', icon: <span className="text-primary">★</span> },
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
        {activeBooking && (
          <motion.div variants={fadeInUp}>
            <h2 className="font-display font-semibold text-lg mb-4">Active Booking</h2>
            <div className="bg-card rounded-xl shadow-md p-5 border border-primary/20">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-48 aspect-video md:aspect-auto md:h-32 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  <img src={activeBooking.car.image} alt={activeBooking.car.brand} className="w-full h-full object-cover car-image-frame" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-display font-bold text-lg">{activeBooking.car.brand} {activeBooking.car.model}</h3>
                      <p className="text-sm text-muted-foreground">{activeBooking.pickupLocation}</p>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-primary/30 label-caps">Active</Badge>
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
                      <p className="font-bold tabular-nums text-primary">${activeBooking.total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recommended cars */}
        <motion.div variants={fadeInUp}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg">Recommended for You</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockCars.filter(c => c.status === 'approved').slice(0, 3).map((car) => (
              <CarCard key={car.id} car={car} onBook={setSelectedCar} />
            ))}
          </div>
        </motion.div>

        {/* Trip history */}
        {recentTrips.length > 0 && (
          <motion.div variants={fadeInUp}>
            <h2 className="font-display font-semibold text-lg mb-4">Recent Trips</h2>
            <div className="space-y-3">
              {recentTrips.map((booking) => (
                <div key={booking.id} className="bg-card rounded-xl shadow-md p-4 flex items-center gap-4">
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img src={booking.car.image} alt={booking.car.brand} className="w-full h-full object-cover car-image-frame" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{booking.car.brand} {booking.car.model}</p>
                    <p className="text-xs text-muted-foreground">{booking.startDate} → {booking.endDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold tabular-nums">${booking.total.toLocaleString()}</p>
                    <Badge variant="secondary" className="label-caps text-[10px]">Completed</Badge>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {selectedCar && <BookingModal car={selectedCar} onClose={() => setSelectedCar(null)} />}
    </DashboardLayout>
  );
}
