import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, Clock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car } from './CarCard';
import { modalVariants, overlayVariants } from '@/lib/motion';

interface BookingModalProps {
  car: Car | null;
  onClose: () => void;
}

export const BookingModal = ({ car, onClose }: BookingModalProps) => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hours, setHours] = useState(24);

  if (!car) return null;

  const totalPrice = car.pricePerHour * hours;
  const serviceFee = totalPrice * 0.1;
  const grandTotal = totalPrice + serviceFee;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          className="relative w-full max-w-lg glass rounded-2xl p-6 shadow-lg"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-xl">{car.brand} {car.model}</h2>
              <p className="text-muted-foreground text-sm">{car.year} • {car.transmission}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Car image */}
          <div className="aspect-video rounded-xl overflow-hidden bg-muted mb-6">
            <img src={car.image} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover car-image-frame" />
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <Label className="label-caps text-muted-foreground mb-2 block">Pickup Location</Label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Enter pickup address"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="pl-9 bg-input border-0 h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="label-caps text-muted-foreground mb-2 block">Start Date</Label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-9 bg-input border-0 h-11"
                  />
                </div>
              </div>
              <div>
                <Label className="label-caps text-muted-foreground mb-2 block">Return Date</Label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-9 bg-input border-0 h-11"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="label-caps text-muted-foreground mb-2 block">Duration (hours)</Label>
              <div className="relative">
                <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  min={1}
                  className="pl-9 bg-input border-0 h-11"
                />
              </div>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="mt-6 p-4 bg-muted/50 rounded-xl space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">${car.pricePerHour}/hr × {hours} hrs</span>
              <span className="tabular-nums">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service fee (10%)</span>
              <span className="tabular-nums">${serviceFee.toFixed(2)}</span>
            </div>
            <div className="h-px bg-border/50" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="tabular-nums text-primary">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* CTA */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4"
          >
            <Button className="w-full h-12 bg-primary text-primary-foreground font-semibold shadow-glow">
              <CreditCard size={16} className="mr-2" />
              Confirm Booking
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
