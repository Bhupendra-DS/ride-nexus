/**
 * Time-range helpers for admin analytics (client-side aggregation on fetched bookings).
 */

export type AnalyticsRange = '7d' | '30d' | '90d';

export const ANALYTICS_RANGE_LABELS: Record<AnalyticsRange, string> = {
  '7d': '7 days',
  '30d': '30 days',
  '90d': '90 days',
};

/** UI labels matching “weekly / monthly / quarter” style */
export const ANALYTICS_RANGE_SHORT: Record<AnalyticsRange, string> = {
  '7d': 'Weekly',
  '30d': 'Monthly',
  '90d': 'Quarterly',
};

export function getRangeForPeriod(period: AnalyticsRange): { start: Date; end: Date } {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date();
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  start.setDate(start.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);
  return { start, end };
}

export function getPreviousPeriodRange(period: AnalyticsRange): { start: Date; end: Date } {
  const { start, end } = getRangeForPeriod(period);
  const lenMs = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 1);
  prevEnd.setHours(23, 59, 59, 999);
  const prevStart = new Date(prevEnd.getTime() - lenMs);
  prevStart.setHours(0, 0, 0, 0);
  return { start: prevStart, end: prevEnd };
}

export function getCreatedAt(booking: { createdAt?: { toDate?: () => Date } }): Date | null {
  const ts = booking.createdAt?.toDate?.();
  return ts instanceof Date && !Number.isNaN(ts.getTime()) ? ts : null;
}

export function filterBookingsByRange<T extends { createdAt?: { toDate?: () => Date } }>(
  bookings: T[],
  start: Date,
  end: Date,
): T[] {
  return bookings.filter((b) => {
    const d = getCreatedAt(b);
    if (!d) return false;
    return d >= start && d <= end;
  });
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function labelForDayKey(isoDay: string): string {
  const d = new Date(isoDay + 'T12:00:00');
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

/** One row per calendar day in [start, end], with booking count and approved revenue */
export function buildDailySeries(
  bookings: {
    createdAt?: { toDate?: () => Date };
    totalPrice?: number;
    status?: string;
  }[],
  start: Date,
  end: Date,
): { date: string; bookings: number; revenue: number }[] {
  const byDay: Record<string, { bookings: number; revenue: number }> = {};
  const walk = new Date(start);
  walk.setHours(0, 0, 0, 0);
  const endDay = new Date(end);
  endDay.setHours(0, 0, 0, 0);
  while (walk <= endDay) {
    const k = dayKey(walk);
    byDay[k] = { bookings: 0, revenue: 0 };
    walk.setDate(walk.getDate() + 1);
  }

  bookings.forEach((b) => {
    const created = getCreatedAt(b);
    if (!created || created < start || created > end) return;
    const k = dayKey(created);
    if (!byDay[k]) return;
    byDay[k].bookings += 1;
    if (b.status === 'approved') {
      byDay[k].revenue += Number(b.totalPrice) || 0;
    }
  });

  return Object.keys(byDay)
    .sort()
    .map((k) => ({
      date: labelForDayKey(k),
      bookings: byDay[k].bookings,
      revenue: byDay[k].revenue,
    }));
}

export function sumBookingsInRange(
  bookings: { createdAt?: { toDate?: () => Date } }[],
  start: Date,
  end: Date,
): number {
  return filterBookingsByRange(bookings, start, end).length;
}

export function sumApprovedRevenueInRange(
  bookings: {
    createdAt?: { toDate?: () => Date };
    status?: string;
    totalPrice?: number;
  }[],
  start: Date,
  end: Date,
): number {
  return filterBookingsByRange(bookings, start, end).reduce((acc, b) => {
    if (b.status !== 'approved') return acc;
    return acc + (Number(b.totalPrice) || 0);
  }, 0);
}

export function pctChange(current: number, previous: number): string {
  if (previous === 0) {
    return current === 0 ? '0%' : '+100%';
  }
  const raw = ((current - previous) / previous) * 100;
  const rounded = Math.round(raw * 10) / 10;
  const sign = rounded >= 0 ? '+' : '';
  return `${sign}${rounded}%`;
}

export function topCitiesFromBookings(
  bookings: { city?: string; createdAt?: { toDate?: () => Date } }[],
  start: Date,
  end: Date,
  limit = 5,
): { city: string; bookings: number }[] {
  const counts: Record<string, number> = {};
  filterBookingsByRange(bookings as any, start, end).forEach((b: any) => {
    const city = b.city != null ? String(b.city).trim() : '';
    if (!city) return;
    counts[city] = (counts[city] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([city, n]) => ({ city, bookings: n }))
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, limit);
}

/** Share of fleet that had ≥1 booking in range (approved cars only in denominator) */
export function fleetUtilizationPercent(
  approvedCarCount: number,
  bookingsInRange: { carId?: string }[],
): number {
  if (approvedCarCount <= 0) return 0;
  const ids = new Set(
    bookingsInRange.map((b) => b.carId).filter((id): id is string => Boolean(id)),
  );
  return Math.min(100, Math.round((ids.size / approvedCarCount) * 100));
}
