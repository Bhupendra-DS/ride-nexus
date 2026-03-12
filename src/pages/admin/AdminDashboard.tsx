import { useEffect, useState } from 'react';
import { LayoutDashboard, Car, Calendar, Users, BarChart3, Check, X, HelpCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { subscribeAllCars } from '@/services/carService';
import {
  getRecentBookings,
  getAllUsers,
  updateCarStatus,
  updateBookingStatus,
} from '@/services/adminService';
import { formatCurrency } from '@/utils/formatCurrency';
import { db } from '@/services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Bookings', href: '/admin/bookings', icon: <Calendar size={16} /> },
  { label: 'Cars', href: '/admin/cars', icon: <Car size={16} /> },
  { label: 'Users', href: '/admin/users', icon: <Users size={16} /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 size={16} /> },
  { label: 'Queries', href: '/admin/queries', icon: <HelpCircle size={16} /> },
];

export default function AdminDashboard() {
  const [cars, setCars] = useState<any[]>([]);
  const [stats, setStats] = useState({
    users: 0,
    cars: 0,
    bookings: 0,
    pendingBookings: 0,
    revenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeAllCars(setCars);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAdminStats = async () => {
      // Total users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersCount = usersSnapshot.size;

      // Total cars
      const carsSnapshot = await getDocs(collection(db, 'cars'));
      const carsCount = carsSnapshot.size;

      // Total bookings
      const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
      const bookingsCount = bookingsSnapshot.size;

      // Pending bookings
      const pendingQuery = query(
        collection(db, 'bookings'),
        where('status', '==', 'pending'),
      );
      const pendingSnapshot = await getDocs(pendingQuery);
      const pendingCount = pendingSnapshot.size;

      // Revenue from approved bookings
      const approvedQuery = query(
        collection(db, 'bookings'),
        where('status', '==', 'approved'),
      );
      const approvedSnapshot = await getDocs(approvedQuery);
      let revenue = 0;
      approvedSnapshot.forEach((d) => {
        const data = d.data() as any;
        revenue += data.totalPrice || 0;
      });

      setStats({
        users: usersCount,
        cars: carsCount,
        bookings: bookingsCount,
        pendingBookings: pendingCount,
        revenue,
      });
    };

    fetchAdminStats();
  }, []);

  useEffect(() => {
    const loadTables = async () => {
      const [bookingsData, usersData] = await Promise.all([
        getRecentBookings(),
        getAllUsers(),
      ]);
      setRecentBookings(bookingsData);
      setUsers(usersData);
    };

    loadTables();
  }, []);

  const pendingCars = cars.filter(c => c.status === 'pending').length;

  return (
    <DashboardLayout navItems={navItems} title="Admin Dashboard">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8 pb-20 md:pb-0">
        <motion.div variants={fadeInUp}>
          <h1 className="font-display text-2xl font-bold">Platform Overview</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage the RideNexus platform.</p>
        </motion.div>

        {/* Analytics cards */}
        <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Users', value: stats.users, icon: <Users size={16} className="text-primary" /> },
            { label: 'Total Cars', value: stats.cars, icon: <Car size={16} className="text-primary" /> },
            { label: 'Total Bookings', value: stats.bookings, icon: <Calendar size={16} className="text-primary" /> },
            { label: 'Pending', value: stats.pendingBookings + pendingCars, icon: <BarChart3 size={16} className="text-yellow-400" />, accent: true },
            { label: 'Revenue', value: formatCurrency(stats.revenue), icon: <span className="text-primary font-bold">₹</span> },
          ].map((stat, i) => (
            <div key={i} className={`bg-card rounded-xl p-4 shadow-md ${stat.accent ? 'border border-yellow-500/20' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="label-caps text-muted-foreground">{stat.label}</span>
                {stat.icon}
              </div>
              <p className="font-display font-bold text-2xl tabular-nums">{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Pending Cars */}
        <motion.div variants={fadeInUp}>
          <h2 className="font-display font-semibold text-lg mb-4">Cars Pending Approval</h2>
          <div className="bg-card rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Vehicle</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Owner</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">City</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Price/hr</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.filter((car) => car.status === 'pending').map((car) => (
                    <tr key={car.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img src={car.image} alt={car.brand} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-sm font-medium">{car.brand} {car.model}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{car.ownerId}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{car.city}</td>
                      <td className="px-4 py-3 text-sm font-bold tabular-nums text-primary">
                        {formatCurrency(car.pricePerHour)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`label-caps text-[10px] ${
                          car.status === 'approved' ? 'bg-primary/20 text-primary border-primary/30' :
                          car.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                          'bg-destructive/20 text-destructive border-destructive/30'
                        }`}>
                          {car.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="h-7 px-2 bg-primary/20 text-primary hover:bg-primary/30 border-0 gap-1"
                            onClick={() => updateCarStatus(car.id, 'approved')}
                          >
                            <Check size={12} /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-destructive hover:bg-destructive/10 gap-1"
                            onClick={() => updateCarStatus(car.id, 'rejected')}
                          >
                            <X size={12} /> Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Recent Bookings */}
        <motion.div variants={fadeInUp}>
          <h2 className="font-display font-semibold text-lg mb-4">Recent Bookings</h2>
          <div className="bg-card rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Renter</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Vehicle</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Period</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Total</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">{b.userName}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{b.carName}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{b.startDate} → {b.endDate}</td>
                      <td className="px-4 py-3 text-sm font-bold tabular-nums text-primary">
                        {formatCurrency(b.totalPrice)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`label-caps text-[10px] ${
                          b.status === 'approved' ? 'bg-primary/20 text-primary border-primary/30' :
                          b.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                          b.status === 'rejected' ? 'bg-destructive/20 text-destructive border-destructive/30' :
                          b.status === 'active' ? 'bg-sky-500/20 text-sky-400 border-sky-500/30' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {b.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {b.status === 'pending' ? (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="h-7 px-2 bg-primary/20 text-primary hover:bg-primary/30 border-0 gap-1"
                              onClick={() => updateBookingStatus(b.id, 'approved')}
                            >
                              <Check size={12} /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-destructive hover:bg-destructive/10 gap-1"
                              onClick={() => updateBookingStatus(b.id, 'rejected')}
                            >
                              <X size={12} /> Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No actions</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div variants={fadeInUp}>
          <h2 className="font-display font-semibold text-lg mb-4">All Users</h2>
          <div className="bg-card rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Name</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Email</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Role</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Trips</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-primary-foreground">{u.name ? u.name[0] : 'U'}</span>
                          </div>
                          <span className="text-sm font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3">
                        <Badge className={`label-caps text-[10px] ${
                          u.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                            : u.role === 'owner'
                            ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm tabular-nums">{u.tripsCount ?? 0}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
