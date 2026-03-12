import { useEffect, useState } from 'react';
import { LayoutDashboard, Car, Calendar, DollarSign, User } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatCurrency';

const navItems = [
  { label: 'Dashboard', href: '/owner/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'My Cars', href: '/owner/cars', icon: <Car size={16} /> },
  { label: 'Bookings', href: '/owner/bookings', icon: <Calendar size={16} /> },
  { label: 'Earnings', href: '/owner/earnings', icon: <DollarSign size={16} /> },
  { label: 'Profile', href: '/owner/profile', icon: <User size={16} /> },
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

const statusClasses = (status: BookingStatus) => {
  switch (status) {
    case 'approved':
      return 'bg-primary/20 text-primary border-primary/30';
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'active':
      return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
    case 'completed':
      return 'bg-muted text-muted-foreground';
    case 'rejected':
    default:
      return 'bg-destructive/20 text-destructive border-destructive/30';
  }
};

export default function OwnerBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      const q = query(collection(db, 'bookings'), where('ownerId', '==', user.id));
      const snap = await getDocs(q);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Booking[];
      setBookings(data);
    };
    load();
  }, [user?.id]);

  return (
    <DashboardLayout navItems={navItems} title="Owner Bookings">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8 pb-20 md:pb-0">
        <motion.div variants={fadeInUp}>
          <h1 className="font-display text-2xl font-bold">Bookings</h1>
          <p className="text-muted-foreground mt-1">See all reservations for your cars.</p>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <div className="bg-card rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Renter</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Car</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Trip Period</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Total</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Status</th>
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
                        <Badge className={`label-caps text-[10px] ${statusClasses(b.status)}`}>
                          {b.status === 'pending' ? 'Pending Approval by Admin' : b.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No bookings yet.
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

