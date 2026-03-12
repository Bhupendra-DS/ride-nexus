import { useEffect, useState } from 'react';
import { LayoutDashboard, Car, Clock, User } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatCurrency } from '@/utils/formatCurrency';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Explore Cars', href: '/dashboard/explore', icon: <Car size={16} /> },
  { label: 'My Trips', href: '/dashboard/trips', icon: <Clock size={16} /> },
  { label: 'Profile', href: '/dashboard/profile', icon: <User size={16} /> },
];

type BookingStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'completed';

interface Trip {
  id: string;
  carName: string;
  city: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
  ownerName?: string;
}

const statusClasses = (status: BookingStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'approved':
      return 'bg-primary/20 text-primary border-primary/30';
    case 'active':
      return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
    case 'completed':
      return 'bg-muted text-muted-foreground';
    case 'rejected':
    default:
      return 'bg-destructive/20 text-destructive border-destructive/30';
  }
};

export default function MyTrips() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selected, setSelected] = useState<Trip | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      const q = query(collection(db, 'bookings'), where('userId', '==', user.id));
      const snap = await getDocs(q);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Trip[];
      setTrips(data);
    };
    load();
  }, [user?.id]);

  return (
    <DashboardLayout navItems={navItems} title="My Trips">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8 pb-20 md:pb-0">
        <motion.div variants={fadeInUp}>
          <h1 className="font-display text-2xl font-bold">My Trips</h1>
          <p className="text-muted-foreground mt-1">View all your RideNexus bookings.</p>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <div className="bg-card rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Vehicle</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">City</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Trip Period</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Total</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((t) => (
                    <tr key={t.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">{t.carName}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{t.city}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {t.startDate} → {t.endDate}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold tabular-nums text-primary">
                        {formatCurrency(t.totalPrice)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`label-caps text-[10px] ${statusClasses(t.status)}`}>{t.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-3 text-xs"
                          onClick={() => setSelected(t)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {trips.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No trips yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {selected && (
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Trip Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <div>
                <p className="label-caps text-muted-foreground mb-1">Car</p>
                <p className="font-medium">{selected.carName}</p>
              </div>
              <div>
                <p className="label-caps text-muted-foreground mb-1">City</p>
                <p className="font-medium">{selected.city}</p>
              </div>
              <div>
                <p className="label-caps text-muted-foreground mb-1">Trip Dates</p>
                <p className="font-medium">
                  {selected.startDate} → {selected.endDate}
                </p>
              </div>
              <div>
                <p className="label-caps text-muted-foreground mb-1">Price</p>
                <p className="font-bold tabular-nums text-primary">
                  {formatCurrency(selected.totalPrice)}
                </p>
              </div>
              <div>
                <p className="label-caps text-muted-foreground mb-1">Status</p>
                <Badge className={`label-caps text-[10px] ${statusClasses(selected.status)}`}>
                  {selected.status}
                </Badge>
              </div>
              {selected.ownerName && (
                <div>
                  <p className="label-caps text-muted-foreground mb-1">Owner</p>
                  <p className="font-medium">{selected.ownerName}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}

