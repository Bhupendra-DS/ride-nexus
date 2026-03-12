import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { label: 'Explore Cars', href: '/explore' },
  { label: 'How it Works', href: '/#how-it-works' },
  { label: 'For Owners', href: '/#for-owners' },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLoggedIn, user, logout, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || location.pathname !== '/' ? 'nav-blur' : 'bg-transparent'
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow transition-all duration-300 group-hover:shadow-glow">
              <span className="font-display font-bold text-sm text-primary-foreground">RN</span>
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              Ride<span className="text-gradient-primary">Nexus</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => navigate(getDashboardPath())}
                >
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="border-border hover:bg-muted"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow font-medium"
                    onClick={() => navigate('/signup')}
                  >
                    Sign Up
                  </Button>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-background/95 backdrop-blur-md" onClick={() => setMobileOpen(false)} />
            <motion.div
              className="absolute top-16 left-0 right-0 border-b border-border/50 bg-card/90 backdrop-blur-md"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                    <ChevronRight size={16} />
                  </Link>
                ))}
                <div className="h-px bg-border/50 my-2" />
                {isLoggedIn ? (
                  <>
                    <button
                      className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                      onClick={() => { navigate(getDashboardPath()); setMobileOpen(false); }}
                    >
                      Dashboard <ChevronRight size={16} />
                    </button>
                    <button
                      className="px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-muted/50 transition-colors text-left"
                      onClick={() => { logout(); setMobileOpen(false); }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                      onClick={() => { navigate('/login'); setMobileOpen(false); }}
                    >
                      Login <ChevronRight size={16} />
                    </button>
                    <button
                      className="mx-4 my-2 py-3 rounded-lg text-sm font-medium bg-primary text-primary-foreground text-center"
                      onClick={() => { navigate('/signup'); setMobileOpen(false); }}
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
