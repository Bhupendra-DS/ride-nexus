import { LayoutDashboard, Car, Calendar, Users, BarChart3, Check, X } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockCars, mockBookings } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Bookings', href: '/admin/bookings', icon: <Calendar size={16} /> },
  { label: 'Cars', href: '/admin/cars', icon: <Car size={16} /> },
  { label: 'Users', href: '/admin/users', icon: <Users size={16} /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 size={16} /> },
];

const mockUsers = [
  { id: 'u1', name: 'Sarah Chen', email: 'user@ridenexus.com', role: 'user', trips: 12, joined: '2024-01-15' },
  { id: 'u2', name: 'James Carter', email: 'owner@ridenexus.com', role: 'owner', trips: 0, joined: '2024-02-01' },
  { id: 'u3', name: 'Mike Johnson', email: 'mjohnson@example.com', role: 'user', trips: 7, joined: '2024-02-20' },
  { id: 'u4', name: 'Emma Davis', email: 'edavis@example.com', role: 'user', trips: 3, joined: '2024-03-01' },
];

export default function AdminDashboard() {
  const totalRevenue = mockBookings.reduce((sum, b) => sum + b.total, 0);
  const pendingBookings = mockBookings.filter(b => b.status === 'pending').length;
  const pendingCars = mockCars.filter(c => c.status === 'pending').length;

  return (
    <DashboardLayout navItems={navItems} title="Admin Dashboard">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8 pb-20 md:pb-0">
        <motion.div variants={fadeInUp}>
          <h1 className="font-display text-2xl font-bold">Platform Overview</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage the RideNexus platform.</p>
        </motion.div>

        {/* Analytics cards */}
        <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Users', value: mockUsers.length, icon: <Users size={16} className="text-primary" /> },
            { label: 'Total Cars', value: mockCars.length, icon: <Car size={16} className="text-primary" /> },
            { label: 'Total Bookings', value: mockBookings.length, icon: <Calendar size={16} className="text-primary" /> },
            { label: 'Pending', value: pendingBookings + pendingCars, icon: <BarChart3 size={16} className="text-yellow-400" />, accent: true },
            { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: <span className="text-primary font-bold">$</span> },
          ].map((stat, i) => (
            <div key={i} className={`bg-card rounded-xl p-4 shadow-md ${stat.accent ? 'border border-yellow-500/20' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="label-caps text-muted-foreground">{stat.label}</span>
                {stat.icon}
              </div>
              <p className="font-display font-bold text-2xl tabular-nums">{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Pending Cars */}
        <motion.div variants={fadeInUp}>
          <h2 className="font-display font-semibold text-lg mb-4">Cars Pending Approval</h2>
          <div className="bg-card rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Vehicle</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Owner</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">City</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Price/hr</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCars.map((car) => (
                    <tr key={car.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img src={car.image} alt={car.brand} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-sm font-medium">{car.brand} {car.model}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">James Carter</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{car.city}</td>
                      <td className="px-4 py-3 text-sm font-bold tabular-nums text-primary">${car.pricePerHour}</td>
                      <td className="px-4 py-3">
                        <Badge className={`label-caps text-[10px] ${
                          car.status === 'approved' ? 'bg-primary/20 text-primary border-primary/30' :
                          car.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                          'bg-destructive/20 text-destructive border-destructive/30'
                        }`}>
                          {car.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button size="sm" className="h-7 px-2 bg-primary/20 text-primary hover:bg-primary/30 border-0 gap-1">
                            <Check size={12} /> Approve
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-destructive hover:bg-destructive/10 gap-1">
                            <X size={12} /> Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* All Bookings */}
        <motion.div variants={fadeInUp}>
          <h2 className="font-display font-semibold text-lg mb-4">Recent Bookings</h2>
          <div className="bg-card rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Renter</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Vehicle</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Period</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Total</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockBookings.map((b) => (
                    <tr key={b.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">{b.userName}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{b.car.brand} {b.car.model}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{b.startDate} → {b.endDate}</td>
                      <td className="px-4 py-3 text-sm font-bold tabular-nums text-primary">${b.total.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <Badge className={`label-caps text-[10px] ${
                          b.status === 'active' ? 'bg-primary/20 text-primary border-primary/30' :
                          b.status === 'completed' ? 'bg-muted text-muted-foreground' :
                          'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        }`}>
                          {b.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button size="sm" className="h-7 px-2 bg-primary/20 text-primary hover:bg-primary/30 border-0 gap-1">
                            <Check size={12} /> Approve
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-destructive hover:bg-destructive/10 gap-1">
                            <X size={12} /> Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div variants={fadeInUp}>
          <h2 className="font-display font-semibold text-lg mb-4">All Users</h2>
          <div className="bg-card rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Name</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Email</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Role</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Trips</th>
                    <th className="text-left px-4 py-3 label-caps text-muted-foreground">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((u) => (
                    <tr key={u.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-primary-foreground">{u.name[0]}</span>
                          </div>
                          <span className="text-sm font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3">
                        <Badge className={`label-caps text-[10px] ${u.role === 'owner' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-muted text-muted-foreground'}`}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm tabular-nums">{u.trips}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{u.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
