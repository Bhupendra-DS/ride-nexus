import { useState } from 'react';
import { LayoutDashboard, Car, Calendar, DollarSign, User, Plus, X, Upload } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockCars, mockBookings } from '@/lib/mockData';
import { CarCard } from '@/components/shared/CarCard';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeInUp, modalVariants, overlayVariants, buttonHover } from '@/lib/motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { label: 'Dashboard', href: '/owner/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'My Cars', href: '/owner/cars', icon: <Car size={16} /> },
  { label: 'Bookings', href: '/owner/bookings', icon: <Calendar size={16} /> },
  { label: 'Earnings', href: '/owner/earnings', icon: <DollarSign size={16} /> },
  { label: 'Profile', href: '/owner/profile', icon: <User size={16} /> },
];

const AddCarModal = ({ onClose }: { onClose: () => void }) => {
  const [form, setForm] = useState({
    brand: '', model: '', city: '', seats: '5',
    fuelType: 'Electric', transmission: 'Automatic', pricePerHour: '',
  });

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative w-full max-w-xl glass rounded-2xl p-6 shadow-lg max-h-[90vh] overflow-y-auto"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-xl">Add New Car</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground">
              <X size={18} />
            </button>
          </div>

          {/* Upload area */}
          <div className="mb-6 border-2 border-dashed border-border/50 rounded-xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
            <Upload size={24} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium">Click to upload car photos</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB · 16:9 ratio preferred</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'brand', label: 'Brand', placeholder: 'e.g. Tesla' },
              { key: 'model', label: 'Model', placeholder: 'e.g. Model S' },
              { key: 'city', label: 'City', placeholder: 'e.g. San Francisco' },
              { key: 'seats', label: 'Seats', placeholder: '5' },
              { key: 'pricePerHour', label: 'Price / Hour ($)', placeholder: '85' },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className={key === 'city' ? 'col-span-2' : ''}>
                <Label className="label-caps text-muted-foreground mb-2 block">{label}</Label>
                <Input
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="bg-input border-0 h-11"
                />
              </div>
            ))}

            <div>
              <Label className="label-caps text-muted-foreground mb-2 block">Fuel Type</Label>
              <select
                value={form.fuelType}
                onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
                className="w-full h-11 px-4 bg-input rounded-lg text-sm text-foreground border-0 focus:ring-2 focus:ring-ring outline-none"
              >
                {['Electric', 'Petrol', 'Diesel', 'Hybrid'].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>

            <div>
              <Label className="label-caps text-muted-foreground mb-2 block">Transmission</Label>
              <select
                value={form.transmission}
                onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                className="w-full h-11 px-4 bg-input rounded-lg text-sm text-foreground border-0 focus:ring-2 focus:ring-ring outline-none"
              >
                {['Automatic', 'Manual'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <motion.div {...buttonHover} className="mt-6">
            <Button className="w-full h-11 bg-primary text-primary-foreground font-semibold shadow-glow" onClick={onClose}>
              Submit for Approval
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [showAddCar, setShowAddCar] = useState(false);

  const ownerCars = mockCars.slice(0, 3);
  const ownerBookings = mockBookings.slice(0, 3);
  const totalEarnings = ownerBookings.reduce((sum, b) => sum + b.total, 0);

  return (
    <DashboardLayout navItems={navItems} title="Owner Dashboard">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8 pb-20 md:pb-0">
        {/* Welcome */}
        <motion.div variants={fadeInUp} className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Welcome, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-muted-foreground mt-1">Manage your fleet and track earnings.</p>
          </div>
          <motion.div {...buttonHover}>
            <Button
              className="bg-primary text-primary-foreground font-medium shadow-glow gap-2"
              onClick={() => setShowAddCar(true)}
            >
              <Plus size={15} /> Add Car
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Earnings', value: `$${totalEarnings.toLocaleString()}`, sub: 'All time' },
            { label: 'Active Cars', value: '3', sub: 'In fleet' },
            { label: 'Total Bookings', value: '28', sub: 'This month' },
            { label: 'Avg. Rating', value: '4.9', sub: 'From renters' },
          ].map((stat, i) => (
            <div key={i} className="bg-card rounded-xl p-4 shadow-md">
              <p className="label-caps text-muted-foreground mb-2">{stat.label}</p>
              <p className="font-display font-bold text-3xl tabular-nums text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </div>
          ))}
        </motion.div>

        {/* My Cars */}
        <motion.div variants={fadeInUp}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg">My Fleet</h2>
            <button onClick={() => setShowAddCar(true)} className="text-sm text-primary hover:underline flex items-center gap-1">
              <Plus size={14} /> Add New
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ownerCars.map((car) => (
              <CarCard key={car.id} car={car} showStatus />
            ))}
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
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Car</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Period</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Total</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ownerBookings.map((b) => (
                    <tr key={b.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">{b.userName}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{b.car.brand} {b.car.model}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{b.startDate} → {b.endDate}</td>
                      <td className="px-4 py-3 text-sm font-bold tabular-nums text-primary">${b.total.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <Badge
                          className={`label-caps text-[10px] ${
                            b.status === 'active' ? 'bg-primary/20 text-primary border-primary/30' :
                            b.status === 'completed' ? 'bg-muted text-muted-foreground' :
                            'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          }`}
                        >
                          {b.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {showAddCar && <AddCarModal onClose={() => setShowAddCar(false)} />}
    </DashboardLayout>
  );
}
