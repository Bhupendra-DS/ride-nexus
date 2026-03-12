import { useEffect, useState } from 'react';
import { LayoutDashboard, Car, Clock, User, Search, Filter, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CarCard, Car as CarType } from '@/components/shared/CarCard';
import { BookingModal } from '@/components/shared/BookingModal';
import { subscribeApprovedCars } from '@/services/carService';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Explore Cars', href: '/dashboard/explore', icon: <Car size={16} /> },
  { label: 'My Trips', href: '/dashboard/trips', icon: <Clock size={16} /> },
  { label: 'Profile', href: '/dashboard/profile', icon: <User size={16} /> },
];

const cities = ['All Cities', 'San Francisco', 'Los Angeles', 'New York', 'Miami', 'Chicago', 'Las Vegas'];
const fuelTypes = ['All', 'Electric', 'Petrol', 'Hybrid'];

export default function UserExplore() {
  const { isLoggedIn, user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const [cars, setCars] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeApprovedCars(setCars);
    return () => unsubscribe();
  }, []);

  const filtered = cars.filter((car) => {
    const matchSearch = `${car.brand} ${car.model}`.toLowerCase().includes(search.toLowerCase());
    const matchCity = selectedCity === 'All Cities' || car.city === selectedCity;
    const matchFuel = selectedFuel === 'All' || car.fuelType === selectedFuel;
    return matchSearch && matchCity && matchFuel;
  });

  return (
    <DashboardLayout navItems={navItems} title="Explore Cars">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-8 pb-20 md:pb-0"
      >
        {/* Header */}
        <motion.div variants={fadeInUp}>
          <h1 className="font-display text-2xl font-bold">Explore Cars</h1>
          <p className="text-muted-foreground mt-1">Browse approved cars and start your next trip.</p>
        </motion.div>

        {/* Filters */}
        <div className="bg-card rounded-xl shadow-md p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by brand or model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-input border-0 h-11"
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="relative">
                <MapPin
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="pl-8 pr-8 h-11 bg-input rounded-lg text-sm text-foreground border-0 focus:ring-2 focus:ring-ring outline-none cursor-pointer appearance-none"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="px-4 h-11 bg-input rounded-lg text-sm text-foreground border-0 focus:ring-2 focus:ring-ring outline-none cursor-pointer"
              >
                {fuelTypes.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm" className="h-11 border-border hover:bg-muted gap-2">
                <Filter size={14} /> Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground tabular-nums">{filtered.length}</span> vehicles available
            </p>
          </div>

          {filtered.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {filtered.map((car) => (
                <motion.div key={car.id} variants={fadeInUp}>
                  <CarCard
                    car={car}
                    onBook={() => {
                      if (!isLoggedIn || user?.role !== 'user') return;
                      setSelectedCar(car);
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-muted-foreground text-lg">No vehicles match your filters.</p>
            </div>
          )}
        </div>
      </motion.div>

      {selectedCar && <BookingModal car={selectedCar} onClose={() => setSelectedCar(null)} />}
    </DashboardLayout>
  );
}

