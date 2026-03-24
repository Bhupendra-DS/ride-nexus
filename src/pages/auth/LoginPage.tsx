import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { loginUser, getUserProfile } from '@/services/authService';
import { fadeInUp, staggerContainer, buttonHover } from '@/lib/motion';
import { isSafeRedirectPath } from '@/utils/routes';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const { login, getDashboardPath, isLoggedIn, user, initialized } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!initialized || !isLoggedIn || !user) return;
    const redirect = searchParams.get('redirect');
    const target = isSafeRedirectPath(redirect) ? redirect! : getDashboardPath();
    navigate(target, { replace: true });
  }, [initialized, isLoggedIn, user, searchParams, navigate, getDashboardPath]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const firebaseUser = await loginUser(email, password);
      const profile = await getUserProfile(firebaseUser.uid);

      if (!profile?.role) {
        setError('Unable to determine user role.');
        return;
      }

      const displayName =
        profile.name ||
        firebaseUser.displayName?.trim() ||
        firebaseUser.email?.split('@')[0] ||
        'User';

      login({
        id: firebaseUser.uid,
        name: displayName,
        email: profile.email || firebaseUser.email || email,
        role: profile.role,
      });

      const redirect = searchParams.get('redirect');
      if (isSafeRedirectPath(redirect)) {
        navigate(redirect!, { replace: true });
        return;
      }

      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'owner') {
        navigate('/owner/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      setError((error as Error).message || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel - visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 30% 50%, hsl(190 95% 50% / .08) 0%, transparent 60%)',
        }} />
        <img
          src="https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&q=80"
          alt="Premium car"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <span className="font-display font-bold text-primary-foreground">RN</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Ride<span className="text-gradient-primary">Nexus</span>
            </span>
          </Link>
          <div>
            <blockquote className="font-display text-3xl font-semibold leading-snug mb-4 max-w-sm">
              "Drive what you've always wanted."
            </blockquote>
            <p className="text-muted-foreground">Join thousands of drivers and owners on the premium car sharing platform.</p>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-md"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="font-display font-bold text-sm text-primary-foreground">RN</span>
            </div>
            <span className="font-display font-bold text-lg">Ride<span className="text-gradient-primary">Nexus</span></span>
          </Link>

          <motion.div variants={fadeInUp}>
            <h1 className="font-display text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground mb-8">Sign in to your RideNexus account</p>
          </motion.div>

          <motion.form variants={fadeInUp} onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label className="label-caps text-muted-foreground mb-2 block">Email</Label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 bg-input border-0 h-11 focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
            <div>
              <Label className="label-caps text-muted-foreground mb-2 block">Password</Label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10 bg-input border-0 h-11 focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            <motion.div {...buttonHover}>
              <Button type="submit" className="w-full h-11 bg-primary text-primary-foreground font-semibold shadow-glow">
                Sign In <ArrowRight size={15} className="ml-2" />
              </Button>
            </motion.div>
          </motion.form>

          <motion.p variants={fadeInUp} className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <Link to={`/signup${searchParams.get('redirect') ? `?redirect=${encodeURIComponent(searchParams.get('redirect')!)}` : ''}`} className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
