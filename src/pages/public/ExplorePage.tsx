import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/shared/Navbar';
import { CarCard } from '@/components/shared/CarCard';
import { BookingModal } from '@/components/shared/BookingModal';
import { Car } from '@/components/shared/CarCard';
import { ExploreCarFilters } from '@/components/shared/ExploreCarFilters';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import { subscribeApprovedCars } from '@/services/carService';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { buildLoginRedirect } from '@/utils/routes';
import {
  filterCars,
  buildCityOptions,
  buildFuelOptions,
  buildTransmissionOptions,
} from '@/utils/carExploreFilters';

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [selectedTransmission, setSelectedTransmission] = useState('All');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [cars, setCars] = useState<any[]>([]);
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeApprovedCars(setCars);
    return () => unsubscribe();
  }, []);

  const cityOptions = useMemo(() => buildCityOptions(cars), [cars]);
  const fuelOptions = useMemo(() => buildFuelOptions(cars), [cars]);
  const transmissionOptions = useMemo(() => buildTransmissionOptions(cars), [cars]);

  // Keep selections valid when live data adds/removes values
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mb-10"
          >
            <motion.div variants={fadeInUp}>
              <span className="label-caps text-primary block mb-3">Browse Fleet</span>
              <h1 className="font-display text-4xl font-bold mb-2">Explore Cars</h1>
              <p className="text-muted-foreground">Find the perfect vehicle for your journey</p>
            </motion.div>
          </motion.div>

          <ExploreCarFilters
            containerClassName="mb-8"
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
                      if (!isLoggedIn || user?.role !== 'user') {
                        navigate(buildLoginRedirect('/explore'));
                      } else {
                        setSelectedCar(car);
                      }
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
      </div>
      {selectedCar && <BookingModal car={selectedCar} onClose={() => setSelectedCar(null)} />}
    </div>
  );
}
