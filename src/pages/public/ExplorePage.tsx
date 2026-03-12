import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/shared/Navbar';
import { CarCard } from '@/components/shared/CarCard';
import { BookingModal } from '@/components/shared/BookingModal';
import { mockCars } from '@/lib/mockData';
import { Car } from '@/components/shared/CarCard';
import { staggerContainer, fadeInUp } from '@/lib/motion';

const cities = ['All Cities', 'San Francisco', 'Los Angeles', 'New York', 'Miami', 'Chicago', 'Las Vegas'];
const fuelTypes = ['All', 'Electric', 'Petrol', 'Hybrid'];

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const filtered = mockCars.filter((car) => {
    const matchSearch = `${car.brand} ${car.model}`.toLowerCase().includes(search.toLowerCase());
    const matchCity = selectedCity === 'All Cities' || car.city === selectedCity;
    const matchFuel = selectedFuel === 'All' || car.fuelType === selectedFuel;
    return matchSearch && matchCity && matchFuel;
  });

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

          {/* Filters */}
          <div className="bg-card rounded-xl shadow-md p-4 mb-8">
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
                  <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="pl-8 pr-8 h-11 bg-input rounded-lg text-sm text-foreground border-0 focus:ring-2 focus:ring-ring outline-none cursor-pointer appearance-none"
                  >
                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <select
                  value={selectedFuel}
                  onChange={(e) => setSelectedFuel(e.target.value)}
                  className="px-4 h-11 bg-input rounded-lg text-sm text-foreground border-0 focus:ring-2 focus:ring-ring outline-none cursor-pointer"
                >
                  {fuelTypes.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
                <Button variant="outline" size="sm" className="h-11 border-border hover:bg-muted gap-2">
                  <Filter size={14} /> Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
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
                  <CarCard car={car} onBook={setSelectedCar} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-muted-foreground text-lg">No vehicles match your filters.</p>
            </div>
          )}
        </div>
      </div>
      {selectedCar && <BookingModal car={selectedCar} onClose={() => setSelectedCar(null)} />}
    </div>
  );
}
