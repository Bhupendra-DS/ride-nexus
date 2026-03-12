import { useEffect, useState } from 'react';
import { LayoutDashboard, Car, Calendar, Users, BarChart3, HelpCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import { Badge } from '@/components/ui/badge';
import { getAllUsers } from '@/services/adminService';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Bookings', href: '/admin/bookings', icon: <Calendar size={16} /> },
  { label: 'Cars', href: '/admin/cars', icon: <Car size={16} /> },
  { label: 'Users', href: '/admin/users', icon: <Users size={16} /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 size={16} /> },
  { label: 'Queries', href: '/admin/queries', icon: <HelpCircle size={16} /> },
];

type Role = 'admin' | 'owner' | 'user';

const roleBadgeClasses = (role: Role) => {
  if (role === 'admin') return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
  if (role === 'owner') return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
  return 'bg-muted text-muted-foreground';
};

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getAllUsers();
      setUsers(data);
    };
    load();
  }, []);

  return (
    <DashboardLayout navItems={navItems} title="Admin Users">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8 pb-20 md:pb-0">
        <motion.div variants={fadeInUp}>
          <h1 className="font-display text-2xl font-bold">All Users</h1>
          <p className="text-muted-foreground mt-1">View all users across the platform.</p>
        </motion.div>

        <motion.div variants={fadeInUp}>
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
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-primary-foreground">
                              {u.name ? u.name[0] : 'U'}
                            </span>
                          </div>
                          <span className="text-sm font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3">
                        <Badge className={`label-caps text-[10px] ${roleBadgeClasses(u.role as Role)}`}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm tabular-nums">{u.tripsCount ?? 0}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : ''}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}

