import { motion } from 'framer-motion';
import { Star, MapPin, Fuel, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { buttonHover, cardHover } from '@/lib/motion';
import { formatCurrency } from '@/utils/formatCurrency';

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  pricePerHour: number;
  rating: number;
  trips: number;
  city: string;
  seats: number;
  fuelType: string;
  transmission: string;
  status?: 'approved' | 'pending' | 'rejected';
  image: string;
}

interface CarCardProps {
  car: Car;
  onBook?: (car: Car) => void;
  showStatus?: boolean;
}

export const CarCard = ({ car, onBook, showStatus = false }: CarCardProps) => {
  return (
    <motion.div
      className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-[box-shadow,transform] duration-300 group cursor-pointer"
      {...cardHover}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 car-image-frame"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

        {/* Price badge */}
        <div className="absolute top-3 right-3">
          <div className="glass rounded-lg px-3 py-1">
            <span className="tabular-nums font-display font-bold text-primary text-sm">
              {formatCurrency(car.pricePerHour)}
            </span>
            <span className="text-xs text-muted-foreground">/hr</span>
          </div>
        </div>

        {showStatus && car.status && (
          <div className="absolute top-3 left-3">
            <Badge
              variant={car.status === 'approved' ? 'default' : car.status === 'pending' ? 'secondary' : 'destructive'}
              className={`label-caps ${car.status === 'approved' ? 'bg-primary/20 text-primary border-primary/30' : ''}`}
            >
              {car.status}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-display font-semibold text-foreground">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-muted-foreground">{car.year}</p>
          </div>
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-primary text-primary" />
            <span className="text-sm font-medium tabular-nums">{car.rating}</span>
            <span className="text-xs text-muted-foreground">({car.trips})</span>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin size={11} />
            <span>{car.city}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users size={11} />
            <span>{car.seats} seats</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Fuel size={11} />
            <span>{car.fuelType}</span>
          </div>
        </div>

        {onBook && (
          <motion.div {...buttonHover}>
            <Button
              size="sm"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              onClick={() => onBook(car)}
            >
              Book Now
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
