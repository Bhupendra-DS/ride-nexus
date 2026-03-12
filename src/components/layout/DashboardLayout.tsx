import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: { label: string; href: string; icon: ReactNode }[];
  title: string;
}

export const DashboardLayout = ({ children, navItems, title }: DashboardLayoutProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 h-16 nav-blur flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 mr-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
              <span className="font-display font-bold text-sm text-primary-foreground">RN</span>
            </div>
            <span className="font-display font-bold text-base tracking-tight hidden sm:block">
              Ride<span className="text-gradient-primary">Nexus</span>
            </span>
          </Link>
          <div className="h-6 w-px bg-border/50" />
          <span className="label-caps text-muted-foreground">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-lg bg-muted border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors relative">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
          </button>
          <div className="flex items-center gap-2 pl-2 border-l border-border/50">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">{user?.name?.[0]}</span>
            </div>
            <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { logout(); navigate('/'); }}
            className="text-muted-foreground hover:text-foreground gap-1.5"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-60 border-r border-border/50 bg-card/30 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4 hidden md:block">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute inset-0 rounded-xl bg-primary/10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.icon}</span>
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 nav-blur py-2 px-4">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 5).map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
