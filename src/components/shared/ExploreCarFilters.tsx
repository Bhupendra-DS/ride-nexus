import { Search, Filter, MapPin, Settings2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Props = {
  /** Extra classes on outer card (e.g. mb-8 on explore page) */
  containerClassName?: string;
  search: string;
  onSearchChange: (v: string) => void;
  cityOptions: string[];
  selectedCity: string;
  onCityChange: (v: string) => void;
  fuelOptions: string[];
  selectedFuel: string;
  onFuelChange: (v: string) => void;
  transmissionOptions: string[];
  selectedTransmission: string;
  onTransmissionChange: (v: string) => void;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
  onClearFilters: () => void;
};

/**
 * Shared filter bar for public Explore and dashboard User Explore — options are built from live car data.
 */
export function ExploreCarFilters({
  containerClassName = '',
  search,
  onSearchChange,
  cityOptions,
  selectedCity,
  onCityChange,
  fuelOptions,
  selectedFuel,
  onFuelChange,
  transmissionOptions,
  selectedTransmission,
  onTransmissionChange,
  showAdvanced,
  onToggleAdvanced,
  onClearFilters,
}: Props) {
  const selectClass =
    'pl-8 pr-8 h-11 bg-input rounded-lg text-sm text-foreground border-0 focus:ring-2 focus:ring-ring outline-none cursor-pointer appearance-none min-w-[140px]';
  const selectClassNoIcon = 'px-4 h-11 bg-input rounded-lg text-sm text-foreground border-0 focus:ring-2 focus:ring-ring outline-none cursor-pointer min-w-[120px]';

  return (
    <div className={`bg-card rounded-xl shadow-md p-4 ${containerClassName}`.trim()}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by brand, model, or city..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 bg-input border-0 h-11"
            />
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <div className="relative">
              <MapPin
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-[1]"
              />
              <select
                value={selectedCity}
                onChange={(e) => onCityChange(e.target.value)}
                className={selectClass}
                aria-label="Filter by city"
              >
                {cityOptions.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All Cities' ? 'All cities' : c}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={selectedFuel}
              onChange={(e) => onFuelChange(e.target.value)}
              className={selectClassNoIcon}
              aria-label="Filter by fuel type"
            >
              {fuelOptions.map((f) => (
                <option key={f} value={f}>
                  {f === 'All' ? 'All fuels' : f}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant={showAdvanced ? 'secondary' : 'outline'}
              size="sm"
              className="h-11 border-border gap-2"
              onClick={onToggleAdvanced}
              aria-expanded={showAdvanced}
              aria-controls="explore-advanced-filters"
            >
              <Filter size={14} />
              More filters
            </Button>
          </div>
        </div>

        {showAdvanced && (
          <div
            id="explore-advanced-filters"
            className="flex flex-col sm:flex-row gap-3 flex-wrap items-stretch sm:items-center pt-2 border-t border-border/50"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Settings2 size={14} />
              <span className="label-caps">Transmission</span>
            </div>
            <select
              value={selectedTransmission}
              onChange={(e) => onTransmissionChange(e.target.value)}
              className={`${selectClassNoIcon} flex-1 sm:flex-initial`}
              aria-label="Filter by transmission"
            >
              {transmissionOptions.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All transmissions' : t}
                </option>
              ))}
            </select>
            <Button type="button" variant="ghost" size="sm" className="h-11 text-muted-foreground" onClick={onClearFilters}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
