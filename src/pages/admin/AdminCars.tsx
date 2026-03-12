import { useEffect, useState } from 'react';
import { LayoutDashboard, Car, Calendar, Users, BarChart3, Check, X, HelpCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getPendingCars, updateCarStatus } from '@/services/adminService';
import { formatCurrency } from '@/utils/formatCurrency';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Bookings', href: '/admin/bookings', icon: <Calendar size={16} /> },
  { label: 'Cars', href: '/admin/cars', icon: <Car size={16} /> },
  { label: 'Users', href: '/admin/users', icon: <Users size={16} /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 size={16} /> },
  { label: 'Queries', href: '/admin/queries', icon: <HelpCircle size={16} /> },
];

export default function AdminCars() {
  const [cars, setCars] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getPendingCars();
      setCars(data);
    };
    load();
  }, []);

  const handleUpdate = async (id: string, status: 'approved' | 'rejected') => {
    await updateCarStatus(id, status);
    setCars((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <DashboardLayout navItems={navItems} title="Admin Cars">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8 pb-20 md:pb-0">
        <motion.div variants={fadeInUp}>
          <h1 className="font-display text-2xl font-bold">Cars Pending Approval</h1>
          <p className="text-muted-foreground mt-1">Review new car listings from owners.</p>
        </motion.div>

        <motion.div variants={fadeInUp}>
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
                  {cars.map((car) => (
                    <tr key={car.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img src={car.image} alt={car.brand} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-sm font-medium">
                            {car.brand} {car.model}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{car.ownerId}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{car.city}</td>
                      <td className="px-4 py-3 text-sm font-bold tabular-nums text-primary">
                        {formatCurrency(car.pricePerHour)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className="label-caps text-[10px] bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          {car.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="h-7 px-2 bg-primary/20 text-primary hover:bg-primary/30 border-0 gap-1"
                            onClick={() => handleUpdate(car.id, 'approved')}
                          >
                            <Check size={12} /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-destructive hover:bg-destructive/10 gap-1"
                            onClick={() => handleUpdate(car.id, 'rejected')}
                          >
                            <X size={12} /> Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {cars.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No pending cars.
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

