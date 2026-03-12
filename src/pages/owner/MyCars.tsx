import { useEffect, useState } from 'react';
import { LayoutDashboard, Car, Calendar, DollarSign, User, Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp, modalVariants, overlayVariants, buttonHover } from '@/lib/motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { db } from '@/services/firebase';
import { collection, query, where, doc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { AnimatePresence, motion as framerMotion } from 'framer-motion';
import { formatCurrency } from '@/utils/formatCurrency';
import { createCarListing } from '@/services/carService';

const navItems = [
  { label: 'Dashboard', href: '/owner/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'My Cars', href: '/owner/cars', icon: <Car size={16} /> },
  { label: 'Bookings', href: '/owner/bookings', icon: <Calendar size={16} /> },
  { label: 'Earnings', href: '/owner/earnings', icon: <DollarSign size={16} /> },
  { label: 'Profile', href: '/owner/profile', icon: <User size={16} /> },
];

interface CarDoc {
  id: string;
  brand: string;
  model: string;
  city: string;
  seats: number;
  fuelType: string;
  transmission: string;
  pricePerHour: number;
  image?: string;
  status: 'pending' | 'approved' | 'rejected';
}

const statusClasses = (status: CarDoc['status']) => {
  switch (status) {
    case 'approved':
      return 'bg-primary/20 text-primary border-primary/30';
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'rejected':
    default:
      return 'bg-destructive/20 text-destructive border-destructive/30';
  }
};

const CarFormModal = ({
  open,
  onClose,
  ownerId,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  ownerId: string;
  initial?: Partial<CarDoc>;
}) => {
  const [form, setForm] = useState({
    brand: initial?.brand || '',
    model: initial?.model || '',
    city: initial?.city || '',
    seats: String(initial?.seats ?? 5),
    fuelType: initial?.fuelType || 'Electric',
    transmission: initial?.transmission || 'Automatic',
    pricePerHour: String(initial?.pricePerHour ?? ''),
    image: initial?.image || '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      brand: initial?.brand || '',
      model: initial?.model || '',
      city: initial?.city || '',
      seats: String(initial?.seats ?? 5),
      fuelType: initial?.fuelType || 'Electric',
      transmission: initial?.transmission || 'Automatic',
      pricePerHour: String(initial?.pricePerHour ?? ''),
      image: initial?.image || '',
    });
  }, [initial]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (initial?.id) {
        await updateDoc(doc(db, 'cars', initial.id), {
          brand: form.brand,
          model: form.model,
          city: form.city,
          seats: Number(form.seats) || 5,
          fuelType: form.fuelType,
          transmission: form.transmission,
          pricePerHour: Number(form.pricePerHour) || 0,
          image: form.image,
        });
      } else {
        await createCarListing(ownerId, form);
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <framerMotion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <framerMotion.div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
        <framerMotion.div
          className="relative w-full max-w-xl glass rounded-2xl p-6 shadow-lg max-h-[90vh] overflow-y-auto"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-xl">
              {initial?.id ? 'Edit Car' : 'Add New Car'}
            </h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground">
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'brand', label: 'Brand', placeholder: 'e.g. Tata' },
              { key: 'model', label: 'Model', placeholder: 'e.g. Nexon' },
              { key: 'seats', label: 'Seats', placeholder: '5' },
              { key: 'pricePerHour', label: 'Price / Hour (₹)', placeholder: '350' },
              { key: 'image', label: 'Image URL', placeholder: 'https://...' },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className={key === 'image' ? 'col-span-2' : ''}>
                <Label className="label-caps text-muted-foreground mb-2 block">{label}</Label>
                <Input
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="bg-input border-0 h-11"
                />
              </div>
            ))}

            <div className="col-span-2">
              <Label className="label-caps text-muted-foreground mb-2 block">City</Label>
              <select
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full h-11 px-4 bg-input rounded-lg text-sm text-foreground border-0 focus:ring-2 focus:ring-ring outline-none"
              >
                <option value="">Select city</option>
                <option value="Mumbai">Mumbai (financial capital)</option>
                <option value="Pune">Pune (education hub)</option>
                <option value="Nagpur">Nagpur (orange city)</option>
                <option value="Nashik">Nashik (wine capital)</option>
                <option value="Aurangabad">Aurangabad (tourism hub)</option>
              </select>
            </div>

            <div>
              <Label className="label-caps text-muted-foreground mb-2 block">Fuel Type</Label>
              <select
                value={form.fuelType}
                onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
                className="w-full h-11 px-4 bg-input rounded-lg text-sm text-foreground border-0 focus:ring-2 focus:ring-ring outline-none"
              >
                {['Electric', 'Petrol', 'Diesel', 'Hybrid'].map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <Label className="label-caps text-muted-foreground mb-2 block">Transmission</Label>
              <select
                value={form.transmission}
                onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                className="w-full h-11 px-4 bg-input rounded-lg text-sm text-foreground border-0 focus:ring-2 focus:ring-ring outline-none"
              >
                {['Automatic', 'Manual'].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <motion.div {...buttonHover} className="mt-6">
            <Button className="w-full h-11 bg-primary text-primary-foreground font-semibold shadow-glow" onClick={handleSubmit} disabled={saving}>
              {saving ? 'Saving...' : 'Submit'}
            </Button>
          </motion.div>
        </framerMotion.div>
      </framerMotion.div>
    </AnimatePresence>
  );
};

export default function MyCars() {
  const { user } = useAuth();
  const [cars, setCars] = useState<CarDoc[]>([]);
  const [open, setOpen] = useState(false);
  const [editCar, setEditCar] = useState<CarDoc | undefined>(undefined);

  useEffect(() => {
    if (!user?.id) return;
    const q = query(collection(db, 'cars'), where('ownerId', '==', user.id));
    const unsub = onSnapshot(q, (snap) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as CarDoc[];
      setCars(data);
    });
    return () => unsub();
  }, [user?.id]);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'cars', id));
    setCars((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <DashboardLayout navItems={navItems} title="My Cars">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8 pb-20 md:pb-0">
        <motion.div variants={fadeInUp} className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">My Cars</h1>
            <p className="text-muted-foreground mt-1">Manage your listed vehicles.</p>
          </div>
          <motion.div {...buttonHover}>
            <Button
              className="bg-primary text-primary-foreground font-medium shadow-glow gap-2"
              onClick={() => {
                setEditCar(undefined);
                setOpen(true);
              }}
            >
              <Plus size={15} /> Add New Car
            </Button>
          </motion.div>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <div className="bg-card rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Car</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">City</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Price/hr</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car) => (
                    <tr key={car.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">
                        {car.brand} {car.model}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{car.city}</td>
                      <td className="px-4 py-3 text-sm font-bold tabular-nums text-primary">
                        {formatCurrency(car.pricePerHour)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`label-caps text-[10px] ${statusClasses(car.status)}`}>
                          {car.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                            <Eye size={12} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs"
                            onClick={() => {
                              setEditCar(car);
                              setOpen(true);
                            }}
                          >
                            <Pencil size={12} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(car.id)}
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {cars.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No cars listed yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {user?.id && (
        <CarFormModal
          open={open}
          onClose={() => setOpen(false)}
          ownerId={user.id}
          initial={editCar}
        />
      )}
    </DashboardLayout>
  );
}

