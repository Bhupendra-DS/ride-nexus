import { useEffect, useMemo, useState } from 'react';
import { LayoutDashboard, Car, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CarCard, Car as CarType } from '@/components/shared/CarCard';
import { BookingModal } from '@/components/shared/BookingModal';
import { ExploreCarFilters } from '@/components/shared/ExploreCarFilters';
import { subscribeApprovedCars } from '@/services/carService';
import { useAuth } from '@/hooks/useAuth';
import {
  filterCars,
  buildCityOptions,
  buildFuelOptions,
  buildTransmissionOptions,
} from '@/utils/carExploreFilters';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Explore Cars', href: '/dashboard/explore', icon: <Car size={16} /> },
  { label: 'My Trips', href: '/dashboard/trips', icon: <Clock size={16} /> },
  { label: 'Profile', href: '/dashboard/profile', icon: <User size={16} /> },
];

export default function UserExplore() {
  const { isLoggedIn, user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [selectedTransmission, setSelectedTransmission] = useState('All');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const [cars, setCars] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeApprovedCars(setCars);
    return () => unsubscribe();
  }, []);

  const cityOptions = useMemo(() => buildCityOptions(cars), [cars]);
  const fuelOptions = useMemo(() => buildFuelOptions(cars), [cars]);
  const transmissionOptions = useMemo(() => buildTransmissionOptions(cars), [cars]);

  useEffect(() => {
    if (!cityOptions.includes(selectedCity)) setSelectedCity('All Cities');
  }, [cityOptions, selectedCity]);

  useEffect(() => {
    if (!fuelOptions.includes(selectedFuel)) setSelectedFuel('All');
  }, [fuelOptions, selectedFuel]);

  useEffect(() => {
    if (!transmissionOptions.includes(selectedTransmission)) setSelectedTransmission('All');
  }, [transmissionOptions, selectedTransmission]);

  const filtered = useMemo(
    () =>
      filterCars(cars, {
        search,
        city: selectedCity,
        fuel: selectedFuel,
        transmission: selectedTransmission,
      }),
    [cars, search, selectedCity, selectedFuel, selectedTransmission],
  );

  const clearFilters = () => {
    setSearch('');
    setSelectedCity('All Cities');
    setSelectedFuel('All');
    setSelectedTransmission('All');
  };

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

        <ExploreCarFilters
          search={search}
          onSearchChange={setSearch}
          cityOptions={cityOptions}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          fuelOptions={fuelOptions}
          selectedFuel={selectedFuel}
          onFuelChange={setSelectedFuel}
          transmissionOptions={transmissionOptions}
          selectedTransmission={selectedTransmission}
          onTransmissionChange={setSelectedTransmission}
          showAdvanced={showAdvancedFilters}
          onToggleAdvanced={() => setShowAdvancedFilters((v) => !v)}
          onClearFilters={clearFilters}
        />

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground tabular-nums">{filtered.length}</span>{' '}
              vehicles available
              {cars.length > 0 && filtered.length !== cars.length && (
                <span className="text-muted-foreground/80">
                  {' '}
                  (of {cars.length} listed)
                </span>
              )}
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
              {cars.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">No approved cars are listed yet.</p>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {selectedCar && <BookingModal car={selectedCar} onClose={() => setSelectedCar(null)} />}
    </DashboardLayout>
  );
}
