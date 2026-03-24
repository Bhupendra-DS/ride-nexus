import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, Clock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car } from './CarCard';
import { modalVariants, overlayVariants } from '@/lib/motion';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { buildLoginRedirect } from '@/utils/routes';
import { createBooking } from '@/services/bookingService';
import { formatCurrency } from '@/utils/formatCurrency';

interface BookingModalProps {
  car: Car | null;
  onClose: () => void;
}

export const BookingModal = ({ car, onClose }: BookingModalProps) => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hours, setHours] = useState(24);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!car) return null;

  const totalPrice = car.pricePerHour * hours;
  const serviceFee = totalPrice * 0.1;
  const grandTotal = totalPrice + serviceFee;

  const handleConfirm = async () => {
    if (!isLoggedIn || !user) {
      navigate(buildLoginRedirect(location.pathname + location.search));
      return;
    }

    if (!startDate || !endDate || !pickupLocation) return;

    setSubmitting(true);
    try {
      await createBooking({
        userId: user.id,
        userName: user.name,
        ownerId: (car as any).ownerId ?? '',
        carId: car.id,
        carName: `${car.brand} ${car.model}`,
        city: car.city,
        startDate,
        endDate,
        pricePerHour: car.pricePerHour,
        totalPrice: grandTotal,
        pickupLocation,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

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
          className="relative w-full max-w-lg max-h-[90vh] glass rounded-2xl p-6 shadow-lg flex flex-col"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4 flex-shrink-0">
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

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
            {/* Car image */}
            <div className="aspect-video rounded-xl overflow-hidden bg-muted mb-6">
            <img src={car.image} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover car-image-frame" />
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <Label className="label-caps text-muted-foreground mb-2 block">Pickup Location</Label>
                <div className="relative">
                  <MapPin
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="pl-9 pr-3 bg-input border-0 h-11 w-full rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                  >
                    <option value="">Select pickup city</option>
                    <option value="Mumbai">Mumbai (financial capital)</option>
                    <option value="Pune">Pune (education hub)</option>
                    <option value="Nagpur">Nagpur (orange city)</option>
                    <option value="Nashik">Nashik (wine capital)</option>
                    <option value="Aurangabad">Aurangabad (tourism hub)</option>
                  </select>
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

              {/* Price breakdown */}
              <div className="mt-6 p-4 bg-muted/50 rounded-xl space-y-2">
                <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {formatCurrency(car.pricePerHour)}/hr × {hours} hrs
              </span>
              <span className="tabular-nums">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service fee (10%)</span>
              <span className="tabular-nums">{formatCurrency(serviceFee)}</span>
                </div>
                <div className="h-px bg-border/50" />
                <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="tabular-nums text-primary">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Terms & conditions */}
              <div className="mt-4 flex items-start gap-2 mb-2">
                <input
              id="terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-muted-foreground"
                />
                <Label htmlFor="terms" className="text-xs text-muted-foreground">
              I agree to the{' '}
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="text-primary underline-offset-2 hover:underline font-medium"
              >
                Terms & Conditions
                  </button>
                  , including payment and damage policies.
                </Label>
              </div>
            </div>
          </div>

          {/* CTA */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 flex-shrink-0"
          >
            <Button
              className="w-full h-12 bg-primary text-primary-foreground font-semibold shadow-glow"
              onClick={handleConfirm}
              disabled={submitting || !startDate || !endDate || !pickupLocation || !termsAccepted}
            >
              <CreditCard size={16} className="mr-2" />
              {submitting ? 'Processing...' : 'Confirm Booking'}
            </Button>
          </motion.div>

          {/* Terms & Conditions overlay */}
          {showTerms && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="bg-card rounded-2xl shadow-lg max-w-xl w-full max-h-[80vh] overflow-hidden border border-border">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
                  <h3 className="font-display font-semibold text-lg">Terms & Conditions</h3>
                  <button
                    type="button"
                    onClick={() => setShowTerms(false)}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="px-5 py-4 space-y-3 text-sm text-muted-foreground overflow-y-auto">
                  <p className="font-medium text-foreground">Before you confirm your booking, please read:</p>

                  <div>
                    <p className="font-semibold text-foreground mb-1">1. Payment</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Total payable amount includes rental charges and applicable service fees.</li>
                      <li>Payments are non-refundable once the trip has started.</li>
                      <li>Late returns may incur additional hourly charges.</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground mb-1">2. Vehicle Use & Damage</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>You are responsible for any damage, fines, or penalties incurred during the trip.</li>
                      <li>Any interior or exterior damage must be reported immediately.</li>
                      <li>Repair or cleaning costs caused by misuse may be charged to you.</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground mb-1">3. Fuel & Cleanliness</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Return the car with the same fuel level as at pickup, unless otherwise agreed.</li>
                      <li>Excessive dirt, smoking, or odors may result in additional cleaning fees.</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground mb-1">4. Trip Modifications & Cancellations</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Changes to trip dates or times are subject to owner approval and availability.</li>
                      <li>Cancellation fees may apply depending on how close to the start time you cancel.</li>
                    </ul>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2">
                    By ticking the checkbox and confirming your booking, you agree to these terms and accept full
                    responsibility for the vehicle during your rental period.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
