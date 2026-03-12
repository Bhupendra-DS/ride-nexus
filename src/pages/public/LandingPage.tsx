import { useRef, useEffect, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Shield, Zap, Star, Users, Car, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { CarCard } from '@/components/shared/CarCard';
import { BookingModal } from '@/components/shared/BookingModal';
import { HeroScene } from '@/components/three/HeroScene';
import { mockCars } from '@/lib/mockData';
import { Car as CarType } from '@/components/shared/CarCard';
import { fadeInUp, staggerContainer, buttonHover } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "RideNexus completely changed how I think about transportation. I drove a Porsche Taycan for my anniversary weekend — absolutely unforgettable.",
    author: "Marcus T.",
    role: "Renter",
    rating: 5,
  },
  {
    quote: "Listing my Tesla on RideNexus was the best financial decision I made. I earn more in a weekend than most platforms give in a month.",
    author: "Priya K.",
    role: "Owner",
    rating: 5,
  },
  {
    quote: "The platform feels as premium as the cars. Every interaction is smooth, fast, and trustworthy.",
    author: "David L.",
    role: "Renter",
    rating: 5,
  },
];

const features = [
  { icon: Shield, title: 'Fully Insured', desc: 'Every trip includes comprehensive coverage with up to $1M liability protection.' },
  { icon: Zap, title: 'Instant Booking', desc: 'Reserve your dream car in under 60 seconds with our frictionless booking flow.' },
  { icon: Star, title: 'Curated Fleet', desc: 'Every vehicle is inspected, verified, and rated by our community of discerning drivers.' },
  { icon: Users, title: 'Trusted Community', desc: 'Verified owners and renters with transparent reviews and identity checks.' },
];

const pricingTiers = [
  { name: 'Essential', price: 49, features: ['Up to 3 bookings/month', 'Basic support', 'Standard insurance', 'Standard vehicles'] },
  { name: 'Premium', price: 99, features: ['Unlimited bookings', 'Priority support', 'Enhanced insurance', 'Premium vehicles', 'Concierge delivery'], highlighted: true },
  { name: 'Elite', price: 249, features: ['Unlimited bookings', '24/7 Concierge', 'Full coverage', 'All vehicles incl. exotic', 'White glove service', 'Airport pickup'] },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);

  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Feature cards stagger
      gsap.fromTo('.feature-card',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.features-section',
            start: 'top 80%',
          }
        }
      );

      // Pricing cards
      gsap.fromTo('.pricing-card',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.15,
          scrollTrigger: {
            trigger: '.pricing-section',
            start: 'top 80%',
          }
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const carouselCars = mockCars.filter(c => c.status === 'approved');
  const visibleCount = 3;
  const maxIndex = Math.max(0, carouselCars.length - visibleCount);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-svh flex flex-col items-center justify-center overflow-hidden">
        {/* Background radial */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(ellipse at 50% 60%, hsl(190 95% 50% / .06) 0%, transparent 60%)',
          }} />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Three.js hero */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </motion.div>

        {/* Hero content */}
        <motion.div
          className="relative z-10 text-center px-4 mt-16"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeInUp}>
            <span className="label-caps text-primary inline-block mb-6 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              Premium Peer-to-Peer Car Sharing
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="hero-text font-display font-bold leading-none mb-6 max-w-4xl mx-auto"
          >
            Your Next Drive,{' '}
            <span className="text-gradient-primary">Redefined.</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Access a curated fleet of premium vehicles from verified owners. Book in seconds, drive in style.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <motion.div {...buttonHover}>
              <Button
                size="lg"
                className="h-12 px-8 bg-primary text-primary-foreground font-semibold shadow-glow text-base"
                onClick={() => navigate('/explore')}
              >
                Explore Cars <ArrowRight size={16} className="ml-2" />
              </Button>
            </motion.div>
            <motion.div {...buttonHover}>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 border-border hover:bg-muted text-base font-medium"
                onClick={() => navigate('/owner/dashboard')}
              >
                <Car size={16} className="mr-2" />
                List Your Car
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-center gap-12 mt-16"
          >
            {[
              { label: 'Verified Cars', value: '2,400+' },
              { label: 'Happy Renters', value: '18k+' },
              { label: 'Cities', value: '120+' },
              { label: 'Avg. Rating', value: '4.9★' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display font-bold text-2xl tabular-nums">{stat.value}</p>
                <p className="label-caps text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-border/50 flex items-start justify-center p-1.5">
            <motion.div
              className="w-1 h-2 rounded-full bg-primary"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Car Carousel */}
      <section className="py-24" id="explore">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="label-caps text-primary block mb-3">Available Now</span>
              <h2 className="font-display text-4xl font-bold">Featured Vehicles</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCarouselIndex(Math.max(0, carouselIndex - 1))}
                disabled={carouselIndex === 0}
                className="w-10 h-10 rounded-xl bg-muted border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setCarouselIndex(Math.min(maxIndex, carouselIndex + 1))}
                disabled={carouselIndex >= maxIndex}
                className="w-10 h-10 rounded-xl bg-muted border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="overflow-hidden" ref={carouselRef}>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              animate={{ x: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {carouselCars.slice(carouselIndex, carouselIndex + visibleCount).map((car) => (
                <CarCard key={car.id} car={car} onBook={setSelectedCar} />
              ))}
            </motion.div>
          </div>
          <div className="text-center mt-10">
            <Button
              variant="outline"
              className="border-border hover:bg-muted font-medium px-8"
              onClick={() => navigate('/explore')}
            >
              View All Cars <ArrowRight size={14} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section py-24 bg-card/30" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="label-caps text-primary block mb-3">Why RideNexus</span>
            <h2 className="font-display text-4xl font-bold">Engineered for trust.</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Every feature is designed to give you confidence — whether you're handing over keys or taking the wheel.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="feature-card p-6 bg-card rounded-xl shadow-md">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <f.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24" id="for-owners">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="label-caps text-primary block mb-4">For Owners</span>
              <h2 className="font-display text-4xl font-bold mb-6">Turn your car into income.</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Your premium vehicle sits unused most of the time. List it on RideNexus and earn while a curated community of trusted renters enjoy it.
              </p>
              <div className="space-y-4 mb-8">
                {['Set your own price and availability', 'Protected by $1M insurance coverage', 'Verified renters with full background checks', 'Avg. owner earns $1,200/month'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-primary" />
                    </div>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <motion.div {...buttonHover}>
                <Button
                  className="bg-primary text-primary-foreground font-semibold shadow-glow"
                  onClick={() => navigate('/signup')}
                >
                  Start Earning <ArrowRight size={14} className="ml-2" />
                </Button>
              </motion.div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80"
                  alt="Premium car owner"
                  className="w-full h-full object-cover car-image-frame"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-background/40 to-transparent" />
              </div>
              {/* Earnings card overlay */}
              <motion.div
                className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 shadow-lg"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <p className="label-caps text-muted-foreground mb-1">Monthly Earnings</p>
                <p className="font-display font-bold text-2xl tabular-nums text-primary">$1,847</p>
                <p className="text-xs text-muted-foreground mt-0.5">↑ 23% from last month</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-[20vh] bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="label-caps text-primary block mb-3">From Our Community</span>
            <h2 className="font-display text-4xl font-bold">Real drivers. Real stories.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="p-6 bg-card rounded-xl shadow-md"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground mb-4">"{t.quote}"</p>
                <div>
                  <p className="font-semibold text-sm">{t.author}</p>
                  <p className="label-caps text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing-section py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="label-caps text-primary block mb-3">Membership</span>
            <h2 className="font-display text-4xl font-bold">Access that fits your life.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <div
                key={i}
                className={`pricing-card p-6 rounded-2xl relative ${
                  tier.highlighted
                    ? 'bg-primary/10 border border-primary/30 shadow-glow'
                    : 'bg-card shadow-md border border-border/30'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="label-caps bg-primary text-primary-foreground px-3 py-1 rounded-full text-[10px]">Most Popular</span>
                  </div>
                )}
                <h3 className="font-display font-bold text-lg mb-2">{tier.name}</h3>
                <div className="mb-6">
                  <span className="font-display font-bold text-4xl tabular-nums">${tier.price}</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <Check size={14} className="text-primary flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${tier.highlighted ? 'bg-primary text-primary-foreground shadow-glow' : 'bg-muted text-foreground hover:bg-muted/80'}`}
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-card shadow-lg p-12 text-center">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(ellipse at 50% 0%, hsl(190 95% 50% / .12) 0%, transparent 60%)',
            }} />
            <div className="relative z-10">
              <h2 className="font-display text-4xl font-bold mb-4">Ready to redefine your drive?</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">Join 18,000+ drivers who've upgraded how they move. Your next adventure is one click away.</p>
              <motion.div {...buttonHover} className="inline-block">
                <Button
                  size="lg"
                  className="h-12 px-10 bg-primary text-primary-foreground font-semibold shadow-glow"
                  onClick={() => navigate('/signup')}
                >
                  Get Started Free <ArrowRight size={16} className="ml-2" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Booking Modal */}
      {selectedCar && (
        <BookingModal car={selectedCar} onClose={() => setSelectedCar(null)} />
      )}
    </div>
  );
}
