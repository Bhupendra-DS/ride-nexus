import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Car,
  Calendar,
  Users,
  BarChart3,
  MapPin,
  Search,
  Download,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import {
  getTotalUsers,
  getTotalCars,
  getTotalBookings,
  getPendingBookings,
  getRevenue,
} from '@/services/adminService';
import { formatCurrency } from '@/utils/formatCurrency';
import { db } from '@/services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Bookings', href: '/admin/bookings', icon: <Calendar size={18} /> },
  { label: 'Cars', href: '/admin/cars', icon: <Car size={18} /> },
  { label: 'Users', href: '/admin/users', icon: <Users size={18} /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 size={18} /> },
  { label: 'Queries', href: '/admin/queries', icon: <HelpCircle size={18} /> },
];

const COLORS = ['#3b82f6', '#f59e0b', '#ef4444'];

export default function AdminAnalytics() {
  const [stats, setStats] = useState({
    users: 0,
    cars: 0,
    bookings: 0,
    pendingBookings: 0,
    revenue: 0,
  });
  const [bookingsOverTime, setBookingsOverTime] = useState<{ date: string; bookings: number }[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<{ date: string; revenue: number }[]>([]);
  const [carStatusData, setCarStatusData] = useState<{ name: string; value: number }[]>([]);
  const [topCities, setTopCities] = useState<{ city: string; bookings: number }[]>([]);

  useEffect(() => {
    const load = async () => {
      const [users, cars, bookings, pending, revenue] = await Promise.all([
        getTotalUsers(),
        getTotalCars(),
        getTotalBookings(),
        getPendingBookings(),
        getRevenue(),
      ]);
      setStats({ users, cars, bookings, pendingBookings: pending, revenue });
    };
    load();
  }, []);

  useEffect(() => {
    const loadCharts = async () => {
      const [bookingsSnap, carsSnap] = await Promise.all([
        getDocs(collection(db, 'bookings')),
        getDocs(collection(db, 'cars')),
      ]);
      const bookingsRaw = bookingsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

      const bookingsByDate: Record<string, number> = {};
      const revenueByDate: Record<string, number> = {};

      bookingsRaw.forEach((b) => {
        const createdAt = b.createdAt?.toDate ? b.createdAt.toDate() : null;
        if (!createdAt) return;
        const key = createdAt.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        bookingsByDate[key] = (bookingsByDate[key] || 0) + 1;
        revenueByDate[key] = (revenueByDate[key] || 0) + (b.totalPrice || 0);
      });

      const sortedDates = Object.keys(bookingsByDate).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime(),
      );
      setBookingsOverTime(sortedDates.map((date) => ({ date, bookings: bookingsByDate[date] })));
      setRevenueTrend(sortedDates.map((date) => ({ date, revenue: revenueByDate[date] || 0 })));

      const carStatusCounts: Record<string, number> = { approved: 0, pending: 0, rejected: 0 };
      carsSnap.docs.forEach((d) => {
        const status = (d.data() as any).status || 'pending';
        carStatusCounts[status] = (carStatusCounts[status] || 0) + 1;
      });
      setCarStatusData([
        { name: 'Approved', value: carStatusCounts.approved },
        { name: 'Pending', value: carStatusCounts.pending },
        { name: 'Rejected', value: carStatusCounts.rejected },
      ]);

      const cityCounts: Record<string, number> = {};
      bookingsRaw.forEach((b) => {
        if (b.city) cityCounts[b.city] = (cityCounts[b.city] || 0) + 1;
      });
      setTopCities(
        Object.entries(cityCounts)
          .map(([city, bookings]) => ({ city, bookings }))
          .sort((a, b) => b.bookings - a.bookings)
          .slice(0, 5),
      );
    };
    loadCharts();
  }, []);

  return (
    <DashboardLayout navItems={navItems} title="Analytics">
      <div className="p-6 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
        {/* TOP NAVBAR REPLICA */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-sm font-medium text-slate-500">Good Morning, Admin 👋</h2>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search data..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none w-64 shadow-sm"
              />
            </div>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
              <Download size={16} /> Export Data
            </button>
          </div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* STAT CARDS (Revenue & Sales Style) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              label="Total Revenue"
              value={formatCurrency(stats.revenue)}
              growth="+12%"
              data={revenueTrend.slice(-5)}
              color="#3b82f6"
            />
            <StatCard
              label="Total Bookings"
              value={stats.bookings}
              growth="+24%"
              data={bookingsOverTime.slice(-5)}
              color="#10b981"
            />
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium text-sm">Fleet Utilization</span>
                <span className="text-xs bg-slate-100 px-2 py-1 rounded-lg">Real-time</span>
              </div>
              <div className="flex items-end justify-between mt-4">
                <h3 className="text-3xl font-bold">84.2%</h3>
                <div className="flex gap-1 h-12 items-end">
                  {[40, 70, 45, 90, 65].map((h, i) => (
                    <div
                      key={i}
                      className="w-2 bg-blue-100 rounded-full overflow-hidden relative"
                    >
                      <div
                        className="absolute bottom-0 w-full bg-blue-500 rounded-full"
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LARGE CIRCULAR CHART (Platform Value Style) */}
            <div className="lg:col-span-5 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-lg">Car Status Distribution</h3>
                <button className="text-xs font-semibold flex items-center gap-1 text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg">
                  Daily <ChevronDown size={14} />
                </button>
              </div>
              <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={carStatusData}
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={10}
                      dataKey="value"
                      stroke="none"
                    >
                      {carStatusData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-4xl font-bold">{stats.cars}</span>
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">
                    Total Fleet
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-8 border-t border-slate-50 pt-8">
                {carStatusData.map((item, i) => (
                  <div key={i} className="text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                      {item.name}
                    </p>
                    <p className="font-bold text-slate-800">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RECENT ACTIVITY TABLE (Recent Transaction Style) */}
            <div className="lg:col-span-7 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Top Destinations</h3>
                <button className="text-xs font-semibold flex items-center gap-1 text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg">
                  This Month <ChevronDown size={14} />
                </button>
              </div>
              <div className="space-y-6">
                {topCities.map((city, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-bold text-blue-600 text-sm">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{city.city}</p>
                        <p className="text-xs text-slate-500">Popular pickup zone</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="font-bold text-slate-800">{city.bookings} Bookings</p>
                      <div className="w-32 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        {topCities[0] && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(city.bookings / topCities[0].bookings) * 100}%`,
                            }}
                            className="h-full bg-blue-500 rounded-full"
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
      </div>
    </DashboardLayout>
  );
}

// Sub-component for those mini-chart stat cards
function StatCard({ label, value, growth, data, color }: any) {
  const seriesKey = data.length ? Object.keys(data[0]).find((k) => k !== 'date') : undefined;

  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:shadow-blue-500/5 group">
      <div className="flex justify-between items-start mb-2">
        <span className="text-slate-500 font-medium text-sm">{label}</span>
        <span className="text-xs font-semibold flex items-center gap-1 text-slate-500 border border-slate-100 px-2 py-1 rounded-lg group-hover:bg-slate-50 transition-colors">
          Monthly <ChevronDown size={12} />
        </span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight mb-2">{value}</h3>
          <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">
            {growth}
            <span className="text-slate-400 font-medium ml-1">vs prev. month</span>
          </span>
        </div>
        <div className="h-16 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`color${color}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              {seriesKey && (
                <Area
                  type="monotone"
                  dataKey={seriesKey}
                  stroke={color}
                  strokeWidth={2}
                  fill={`url(#color${color})`}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}