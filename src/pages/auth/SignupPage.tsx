import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/store/authStore';
import { signupUser } from '@/services/authService';
import { fadeInUp, staggerContainer, buttonHover } from '@/lib/motion';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const createdUser = await signupUser(name, email, password, role);

      login({
        id: createdUser.uid,
        name,
        email,
        role,
      });

      navigate(role === 'owner' ? '/owner/dashboard' : '/dashboard');
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 70% 50%, hsl(190 95% 50% / .08) 0%, transparent 60%)',
        }} />
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80"
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
            <h2 className="font-display text-3xl font-semibold mb-4 max-w-sm">Your next drive,<br />starts here.</h2>
            <p className="text-muted-foreground">Access a curated fleet of premium vehicles or earn by sharing yours.</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-md"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="font-display font-bold text-sm text-primary-foreground">RN</span>
            </div>
            <span className="font-display font-bold text-lg">Ride<span className="text-gradient-primary">Nexus</span></span>
          </Link>

          <motion.div variants={fadeInUp}>
            <h1 className="font-display text-3xl font-bold mb-2">Create account</h1>
            <p className="text-muted-foreground mb-8">Join RideNexus today</p>
          </motion.div>

          {/* Role selector */}
          <motion.div variants={fadeInUp} className="mb-6">
            <Label className="label-caps text-muted-foreground mb-3 block">I want to</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                  role === 'user'
                    ? 'border-primary bg-primary/10 shadow-glow'
                    : 'border-border/50 bg-muted hover:border-border hover:bg-muted/80'
                }`}
              >
                <User size={20} className={role === 'user' ? 'text-primary mb-2' : 'text-muted-foreground mb-2'} />
                <p className="font-semibold text-sm">Rent Cars</p>
                <p className="text-xs text-muted-foreground mt-0.5">Browse & book vehicles</p>
              </button>
              <button
                type="button"
                onClick={() => setRole('owner')}
                className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                  role === 'owner'
                    ? 'border-primary bg-primary/10 shadow-glow'
                    : 'border-border/50 bg-muted hover:border-border hover:bg-muted/80'
                }`}
              >
                <Car size={20} className={role === 'owner' ? 'text-primary mb-2' : 'text-muted-foreground mb-2'} />
                <p className="font-semibold text-sm">List My Car</p>
                <p className="text-xs text-muted-foreground mt-0.5">Earn from your vehicle</p>
              </button>
            </div>
          </motion.div>

          <motion.form variants={fadeInUp} onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label className="label-caps text-muted-foreground mb-2 block">Full Name</Label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 bg-input border-0 h-11"
                />
              </div>
            </div>
            <div>
              <Label className="label-caps text-muted-foreground mb-2 block">Email</Label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 bg-input border-0 h-11"
                />
              </div>
            </div>
            <div>
              <Label className="label-caps text-muted-foreground mb-2 block">Password</Label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10 bg-input border-0 h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <motion.div {...buttonHover}>
              <Button type="submit" className="w-full h-11 bg-primary text-primary-foreground font-semibold shadow-glow">
                Create Account <ArrowRight size={15} className="ml-2" />
              </Button>
            </motion.div>
          </motion.form>

          <motion.p variants={fadeInUp} className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
