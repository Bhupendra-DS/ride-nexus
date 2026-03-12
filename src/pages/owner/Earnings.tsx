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

interface Booking {
  id: string;
  carName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
}

export default function Earnings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      const q = query(
        collection(db, 'bookings'),
        where('ownerId', '==', user.id),
        where('status', '==', 'approved'),
      );
      const snap = await getDocs(q);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Booking[];
      setBookings(data);
      setTotal(data.reduce((sum, b) => sum + (b.totalPrice || 0), 0));
    };
    load();
  }, [user?.id]);

  return (
    <DashboardLayout navItems={navItems} title="Earnings">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8 pb-20 md:pb-0">
        <motion.div variants={fadeInUp}>
          <h1 className="font-display text-2xl font-bold">Earnings</h1>
          <p className="text-muted-foreground mt-1">Track your income from approved bookings.</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl p-6 shadow-md">
            <p className="label-caps text-muted-foreground mb-2">Total Earnings</p>
            <p className="font-display font-bold text-3xl text-primary">
              {formatCurrency(total)}
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <h2 className="font-display font-semibold text-lg mb-4">Paid Bookings</h2>
          <div className="bg-card rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Car</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Trip Period</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Amount</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">{b.carName}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {b.startDate} → {b.endDate}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold tabular-nums text-primary">
                        {formatCurrency(b.totalPrice)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className="label-caps text-[10px] bg-primary/20 text-primary border-primary/30">
                          {b.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No earnings yet.
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

