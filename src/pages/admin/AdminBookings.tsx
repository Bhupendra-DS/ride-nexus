import { useEffect, useState } from 'react';
import { LayoutDashboard, Car, Calendar, Users, BarChart3, Check, X, HelpCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllBookings, updateBookingStatus } from '@/services/bookingService';
import { formatCurrency } from '@/utils/formatCurrency';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Bookings', href: '/admin/bookings', icon: <Calendar size={16} /> },
  { label: 'Cars', href: '/admin/cars', icon: <Car size={16} /> },
  { label: 'Users', href: '/admin/users', icon: <Users size={16} /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 size={16} /> },
  { label: 'Queries', href: '/admin/queries', icon: <HelpCircle size={16} /> },
];

type BookingStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'completed';

interface Booking {
  id: string;
  userName: string;
  carName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
}

const getStatusClasses = (status: BookingStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'approved':
      return 'bg-primary/20 text-primary border-primary/30';
    case 'rejected':
      return 'bg-destructive/20 text-destructive border-destructive/30';
    case 'active':
      return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
    case 'completed':
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getAllBookings();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setBookings(data as any);
    };
    load();
  }, []);

  const handleUpdateStatus = async (id: string, status: BookingStatus) => {
    await updateBookingStatus(id, status);
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b)),
    );
  };

  return (
    <DashboardLayout navItems={navItems} title="Admin Bookings">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8 pb-20 md:pb-0">
        <motion.div variants={fadeInUp}>
          <h1 className="font-display text-2xl font-bold">All Bookings</h1>
          <p className="text-muted-foreground mt-1">Review and manage all platform bookings.</p>
        </motion.div>

        <motion.div variants={fadeInUp}>
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
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">{b.userName}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{b.carName}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {b.startDate} → {b.endDate}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold tabular-nums text-primary">
                        {formatCurrency(b.totalPrice)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`label-caps text-[10px] ${getStatusClasses(b.status)}`}>
                          {b.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {b.status === 'pending' ? (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="h-7 px-2 bg-primary/20 text-primary hover:bg-primary/30 border-0 gap-1"
                              onClick={() => handleUpdateStatus(b.id, 'approved')}
                            >
                              <Check size={12} /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-destructive hover:bg-destructive/10 gap-1"
                              onClick={() => handleUpdateStatus(b.id, 'rejected')}
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
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}

