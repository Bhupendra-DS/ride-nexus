import { useEffect, useState } from 'react';
import { LayoutDashboard, Calendar, Car, Users, BarChart3, HelpCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import { getAllQueries } from '@/services/queryService';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Bookings', href: '/admin/bookings', icon: <Calendar size={18} /> },
  { label: 'Cars', href: '/admin/cars', icon: <Car size={18} /> },
  { label: 'Users', href: '/admin/users', icon: <Users size={18} /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 size={18} /> },
  { label: 'Queries', href: '/admin/queries', icon: <HelpCircle size={18} /> },
];

interface QueryItem {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt?: { toDate?: () => Date };
}

export default function AdminQueries() {
  const [queries, setQueries] = useState<QueryItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getAllQueries();
      setQueries(data as QueryItem[]);
    };
    load();
  }, []);

  return (
    <DashboardLayout navItems={navItems} title="Admin Queries">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-6 pb-10"
      >
        <motion.div variants={fadeInUp}>
          <h1 className="font-display text-2xl font-bold">User Queries</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Messages sent from the public Contact Us page.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/40">
                  <th className="text-left px-4 py-3 label-caps text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 label-caps text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 label-caps text-muted-foreground">Message</th>
                  <th className="text-left px-4 py-3 label-caps text-muted-foreground">Received</th>
                </tr>
              </thead>
              <tbody>
                {queries.map((q) => (
                  <tr key={q.id} className="border-b border-border/30 align-top">
                    <td className="px-4 py-3 font-medium">{q.name || '-'}</td>
                    <td className="px-4 py-3 text-muted-foreground break-all">{q.email || '-'}</td>
                    <td className="px-4 py-3 text-muted-foreground max-w-xl">
                      <div className="whitespace-pre-wrap break-words">{q.message}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {q.createdAt?.toDate
                        ? q.createdAt
                            .toDate()
                            .toLocaleString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                        : '-'}
                    </td>
                  </tr>
                ))}
                {queries.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-10 text-center text-sm text-muted-foreground"
                    >
                      No queries yet. Messages sent from the Contact Us page will appear here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}

