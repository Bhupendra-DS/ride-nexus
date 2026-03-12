import { useEffect, useState } from 'react';
import { LayoutDashboard, Car, Clock, User as UserIcon } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Explore Cars', href: '/dashboard/explore', icon: <Car size={16} /> },
  { label: 'My Trips', href: '/dashboard/trips', icon: <Clock size={16} /> },
  { label: 'Profile', href: '/dashboard/profile', icon: <UserIcon size={16} /> },
];

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [tripsCount, setTripsCount] = useState(0);
  const [carsCount, setCarsCount] = useState(0);
  const [joined, setJoined] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      const ref = doc(db, 'users', user.id);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const data = snap.data() as any;
      setName(data.name || '');
      setEmail(data.email || '');
      setRole(data.role || '');
      setTripsCount(data.tripsCount ?? 0);
      setCarsCount(data.carsCount ?? 0);
      setJoined(data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString() : '');
    };
    load();
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.id), {
        name,
      });
    } finally {
      setSaving(false);
    }
  };

  const roleBadge =
    role === 'admin'
      ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      : role === 'owner'
      ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
      : 'bg-muted text-muted-foreground';

  return (
    <DashboardLayout navItems={navItems} title="Profile">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8 pb-20 md:pb-0">
        <motion.div variants={fadeInUp}>
          <h1 className="font-display text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your RideNexus account details.</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile form */}
          <div className="lg:col-span-2 bg-card rounded-xl shadow-md p-6 space-y-4">
            <h2 className="font-display font-semibold text-lg mb-2">Account Info</h2>
            <div className="space-y-3">
              <div>
                <p className="label-caps text-muted-foreground mb-1">Full Name</p>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-input border-0 h-10"
                  placeholder="Your name"
                />
              </div>
              <div>
                <p className="label-caps text-muted-foreground mb-1">Email</p>
                <Input value={email} disabled className="bg-input border-0 h-10 opacity-80" />
              </div>
              <div>
                <p className="label-caps text-muted-foreground mb-1">Role</p>
                <Badge className={`label-caps text-[10px] ${roleBadge}`}>{role}</Badge>
              </div>
            </div>
            <Button className="mt-4" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

          {/* Stats card */}
          <div className="bg-card rounded-xl shadow-md p-6 space-y-3">
            <h2 className="font-display font-semibold text-lg mb-2">Activity</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Trips</span>
                <span className="font-display font-bold tabular-nums">{tripsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cars Listed</span>
                <span className="font-display font-bold tabular-nums">{carsCount}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-2">
                <span className="text-sm text-muted-foreground">Joined</span>
                <span className="text-sm font-medium">{joined}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}

