import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import {
  LayoutDashboard,
  Car,
  Calendar,
  Users,
  BarChart3,
  Search,
  Download,
  HelpCircle,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { staggerContainer } from '@/lib/motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/utils/formatCurrency';
import { db } from '@/services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  type AnalyticsRange,
  getRangeForPeriod,
  getPreviousPeriodRange,
  buildDailySeries,
  sumBookingsInRange,
  sumApprovedRevenueInRange,
  pctChange,
  topCitiesFromBookings,
  fleetUtilizationPercent,
  ANALYTICS_RANGE_SHORT,
} from '@/utils/analyticsRange';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Bookings', href: '/admin/bookings', icon: <Calendar size={18} /> },
  { label: 'Cars', href: '/admin/cars', icon: <Car size={18} /> },
  { label: 'Users', href: '/admin/users', icon: <Users size={18} /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 size={18} /> },
  { label: 'Queries', href: '/admin/queries', icon: <HelpCircle size={18} /> },
];

const COLORS = ['hsl(190 95% 50%)', 'hsl(43 96% 56%)', 'hsl(0 72% 51%)'];

const chartTooltipContentStyle: CSSProperties = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 'var(--radius)',
  color: 'hsl(var(--foreground))',
  fontSize: '12px',
};

const chartTooltipLabelStyle: CSSProperties = { color: 'hsl(var(--muted-foreground))' };

type BookingDoc = {
  id: string;
  createdAt?: { toDate?: () => Date };
  totalPrice?: number;
  status?: string;
  city?: string;
  carId?: string;
};

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [allBookings, setAllBookings] = useState<BookingDoc[]>([]);
  const [allCars, setAllCars] = useState<any[]>([]);
  const [statRange, setStatRange] = useState<AnalyticsRange>('30d');
  const [destinationsRange, setDestinationsRange] = useState<AnalyticsRange>('30d');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [bookingsSnap, carsSnap] = await Promise.all([
          getDocs(collection(db, 'bookings')),
          getDocs(collection(db, 'cars')),
        ]);
        if (cancelled) return;
        setAllBookings(bookingsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
        setAllCars(carsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const { start, end } = getRangeForPeriod(statRange);
    const prev = getPreviousPeriodRange(statRange);

    const bookingsCurrent = sumBookingsInRange(allBookings, start, end);
    const bookingsPrev = sumBookingsInRange(allBookings, prev.start, prev.end);
    const revenueCurrent = sumApprovedRevenueInRange(allBookings, start, end);
    const revenuePrev = sumApprovedRevenueInRange(allBookings, prev.start, prev.end);

    const series = buildDailySeries(allBookings, start, end);
    const revenueTrend = series.map(({ date, revenue }) => ({ date, revenue }));
    const bookingsOverTime = series.map(({ date, bookings }) => ({ date, bookings }));

    const approvedCarCount = allCars.filter((c) => (c.status || 'pending') === 'approved').length;
    const bookingsInRange = allBookings.filter((b) => {
      const d = b.createdAt?.toDate?.();
      if (!d) return false;
      return d >= start && d <= end;
    });
    const fleetUtil = fleetUtilizationPercent(approvedCarCount, bookingsInRange);

    return {
      bookingsCount: bookingsCurrent,
      revenueTotal: revenueCurrent,
      bookingsGrowth: pctChange(bookingsCurrent, bookingsPrev),
      revenueGrowth: pctChange(revenueCurrent, revenuePrev),
      revenueTrend,
      bookingsOverTime,
      fleetUtil,
      totalFleet: allCars.length,
      carStatusData: (() => {
        const carStatusCounts: Record<string, number> = { approved: 0, pending: 0, rejected: 0 };
        allCars.forEach((c) => {
          const status = c.status || 'pending';
          carStatusCounts[status] = (carStatusCounts[status] || 0) + 1;
        });
        return [
          { name: 'Approved', value: carStatusCounts.approved },
          { name: 'Pending', value: carStatusCounts.pending },
          { name: 'Rejected', value: carStatusCounts.rejected },
        ];
      })(),
    };
  }, [allBookings, allCars, statRange]);

  const topCities = useMemo(() => {
    const { start, end } = getRangeForPeriod(destinationsRange);
    return topCitiesFromBookings(allBookings, start, end, 5);
  }, [allBookings, destinationsRange]);

  const sparkRevenue = stats.revenueTrend.slice(-8);
  const sparkBookings = stats.bookingsOverTime.slice(-8);

  return (
    <DashboardLayout navItems={navItems} title="Analytics">
      <div className="p-4 md:p-6 pb-20 md:pb-8 text-foreground">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <p className="label-caps text-muted-foreground">Analytics</p>
            <h1 className="font-display text-2xl font-bold tracking-tight mt-1">Dashboard overview</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Revenue, fleet status, and top pickup zones. Adjust ranges below.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative hidden md:block w-full sm:w-auto">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                size={16}
              />
              <Input
                type="search"
                placeholder="Search data..."
                className="pl-10 w-full sm:w-64 bg-background border-border"
              />
            </div>
            <Button className="rounded-xl gap-2 shadow-md" type="button">
              <Download size={16} /> Export data
            </Button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground py-12">Loading analytics…</p>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                label="Total revenue"
                value={formatCurrency(stats.revenueTotal)}
                growth={stats.revenueGrowth}
                growthLabel="vs prev. period"
                data={sparkRevenue}
                color="hsl(190 95% 50%)"
                gradientId="revenue"
                range={statRange}
                onRangeChange={setStatRange}
              />
              <StatCard
                label="Total bookings"
                value={stats.bookingsCount}
                growth={stats.bookingsGrowth}
                growthLabel="vs prev. period"
                data={sparkBookings}
                color="hsl(142 76% 45%)"
                gradientId="bookings"
                range={statRange}
                onRangeChange={setStatRange}
              />
              <div className="bg-card p-6 rounded-2xl border border-border/60 shadow-md flex flex-col justify-between">
                <div className="flex justify-between items-start gap-2">
                  <span className="label-caps text-muted-foreground">Fleet utilization</span>
                  <Select
                    value={statRange}
                    onValueChange={(v) => setStatRange(v as AnalyticsRange)}
                  >
                    <SelectTrigger className="h-8 w-[120px] text-[10px] label-caps border-border/60">
                      <SelectValue placeholder="Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">{ANALYTICS_RANGE_SHORT['7d']}</SelectItem>
                      <SelectItem value="30d">{ANALYTICS_RANGE_SHORT['30d']}</SelectItem>
                      <SelectItem value="90d">{ANALYTICS_RANGE_SHORT['90d']}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <h3 className="font-display text-3xl font-bold tabular-nums">{stats.fleetUtil}%</h3>
                  <p className="text-[10px] text-muted-foreground max-w-[140px] text-right">
                    Cars with ≥1 booking in period / approved fleet
                  </p>
                </div>
                <div className="flex gap-1 h-12 items-end mt-2 justify-end">
                  {[40, 70, 45, 90, 65].map((h, i) => (
                    <div
                      key={i}
                      className="w-2 bg-primary/20 rounded-full overflow-hidden relative"
                    >
                      <div
                        className="absolute bottom-0 w-full bg-primary rounded-full"
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-card p-6 md:p-8 rounded-2xl border border-border/60 shadow-md">
                <div className="flex justify-between items-center mb-6 md:mb-8 gap-2">
                  <h3 className="font-display font-semibold text-lg">Car status distribution</h3>
                  <span className="text-[10px] label-caps px-2 py-1 rounded-md bg-muted/50 text-muted-foreground border border-border/50">
                    Current snapshot
                  </span>
                </div>
                <div className="h-64 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.carStatusData}
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={10}
                        dataKey="value"
                        stroke="none"
                      >
                        {stats.carStatusData.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={chartTooltipContentStyle}
                        labelStyle={chartTooltipLabelStyle}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="font-display text-4xl font-bold tabular-nums">{stats.totalFleet}</span>
                    <span className="text-[10px] label-caps text-muted-foreground mt-1">Total fleet</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-8 border-t border-border/50 pt-8">
                  {stats.carStatusData.map((item, i) => (
                    <div key={i} className="text-center">
                      <p className="text-[10px] label-caps text-muted-foreground mb-1">{item.name}</p>
                      <p className="font-display font-bold tabular-nums">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 bg-card p-6 md:p-8 rounded-2xl border border-border/60 shadow-md">
                <div className="flex justify-between items-center mb-6 gap-2 flex-wrap">
                  <h3 className="font-display font-semibold text-lg">Top destinations</h3>
                  <Select
                    value={destinationsRange}
                    onValueChange={(v) => setDestinationsRange(v as AnalyticsRange)}
                  >
                    <SelectTrigger className="h-8 w-[140px] text-xs border-border/60">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-6">
                  {topCities.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No booking city data in this period.
                    </p>
                  )}
                  {topCities.map((city, i) => (
                    <div key={city.city} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center font-display font-bold text-primary text-sm shrink-0">
                          {i + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{city.city}</p>
                          <p className="text-xs text-muted-foreground">Popular pickup zone</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <p className="font-medium tabular-nums">
                          {city.bookings}{' '}
                          <span className="text-muted-foreground font-normal text-sm">bookings</span>
                        </p>
                        <div className="w-32 h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                          {topCities[0] && (
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(city.bookings / topCities[0].bookings) * 100}%`,
                              }}
                              className="h-full bg-primary rounded-full"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}

function StatCard({
  label,
  value,
  growth,
  growthLabel,
  data,
  color,
  gradientId,
  range,
  onRangeChange,
}: {
  label: string;
  value: string | number;
  growth: string;
  growthLabel: string;
  data: { date: string; bookings?: number; revenue?: number }[];
  color: string;
  gradientId: string;
  range: AnalyticsRange;
  onRangeChange: (r: AnalyticsRange) => void;
}) {
  const seriesKey = data.length ? Object.keys(data[0]).find((k) => k !== 'date') : undefined;
  const fillUrl = `url(#area-${gradientId})`;

  return (
    <div className="bg-card p-6 rounded-2xl border border-border/60 shadow-md transition-all hover:border-primary/25 hover:shadow-lg group">
      <div className="flex justify-between items-start mb-2 gap-2">
        <span className="label-caps text-muted-foreground">{label}</span>
        <Select value={range} onValueChange={(v) => onRangeChange(v as AnalyticsRange)}>
          <SelectTrigger className="h-8 w-[118px] text-[10px] label-caps border-border/60 shrink-0">
            <SelectValue placeholder="Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">{ANALYTICS_RANGE_SHORT['7d']}</SelectItem>
            <SelectItem value="30d">{ANALYTICS_RANGE_SHORT['30d']}</SelectItem>
            <SelectItem value="90d">{ANALYTICS_RANGE_SHORT['90d']}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-2xl font-bold tracking-tight tabular-nums mb-2 truncate">
            {value}
          </h3>
          <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
            {growth}
            <span className="text-muted-foreground font-normal ml-1">{growthLabel}</span>
          </span>
        </div>
        <div className="h-16 w-24 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`area-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              {seriesKey && (
                <Area
                  type="monotone"
                  dataKey={seriesKey}
                  stroke={color}
                  strokeWidth={2}
                  fill={fillUrl}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
