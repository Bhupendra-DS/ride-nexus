/**
 * Explore / user car listing filters — aligned with owner listing forms and Firestore data.
 */

export const SERVICE_CITIES = ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'] as const;

export const DEFAULT_FUEL_TYPES = ['Electric', 'Petrol', 'Diesel', 'Hybrid'] as const;
export const DEFAULT_TRANSMISSIONS = ['Automatic', 'Manual'] as const;

export function normalizeStr(s: string | undefined | null): string {
  return (s ?? '').trim().toLowerCase();
}

export type CarFilterInput = {
  brand?: string;
  model?: string;
  city?: string;
  fuelType?: string;
  transmission?: string;
};

export type CarFilterState = {
  search: string;
  city: string;
  fuel: string;
  transmission: string;
};

/** Client-side filter for approved cars from Firestore */
export function filterCars<T extends CarFilterInput>(cars: T[], opts: CarFilterState): T[] {
  const q = normalizeStr(opts.search);
  return cars.filter((car) => {
    const haystack = `${car.brand ?? ''} ${car.model ?? ''} ${car.city ?? ''}`.toLowerCase();
    const matchSearch = !q || haystack.includes(q);

    const matchCity =
      opts.city === 'All Cities' || normalizeStr(car.city) === normalizeStr(opts.city);

    const matchFuel =
      opts.fuel === 'All' || normalizeStr(car.fuelType) === normalizeStr(opts.fuel);

    const matchTrans =
      opts.transmission === 'All' ||
      normalizeStr(car.transmission) === normalizeStr(opts.transmission);

    return matchSearch && matchCity && matchFuel && matchTrans;
  });
}

export function buildCityOptions(cars: { city?: string }[]): string[] {
  const set = new Set<string>();
  SERVICE_CITIES.forEach((c) => set.add(c));
  cars.forEach((c) => {
    const city = c.city != null ? String(c.city).trim() : '';
    if (city) set.add(city);
  });
  const sorted = Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  return ['All Cities', ...sorted];
}

export function buildFuelOptions(cars: { fuelType?: string }[]): string[] {
  const set = new Set<string>(DEFAULT_FUEL_TYPES);
  cars.forEach((c) => {
    const f = c.fuelType != null ? String(c.fuelType).trim() : '';
    if (f) set.add(f);
  });
  const sorted = Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  return ['All', ...sorted];
}

export function buildTransmissionOptions(cars: { transmission?: string }[]): string[] {
  const set = new Set<string>(DEFAULT_TRANSMISSIONS);
  cars.forEach((c) => {
    const t = c.transmission != null ? String(c.transmission).trim() : '';
    if (t) set.add(t);
  });
  const sorted = Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  return ['All', ...sorted];
}
