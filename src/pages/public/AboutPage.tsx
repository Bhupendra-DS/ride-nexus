import { useState } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<'vision' | 'mission' | 'approach'>('vision');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            <motion.header variants={fadeInUp} className="space-y-3">
              <p className="label-caps text-primary">About RideNexus</p>
              <h1 className="font-display text-4xl font-bold tracking-tight">
                About RideNexus
              </h1>
              <p className="text-muted-foreground text-base max-w-2xl">
                RideNexus is a modern peer-to-peer car rental platform that connects car owners with
                people who need a ride. Our goal is to make transportation simple, flexible, and
                accessible while helping owners earn from their unused vehicles.
              </p>
            </motion.header>

            {/* About Us section */}
            <motion.section
              variants={fadeInUp}
              className="grid gap-6 md:grid-cols-2 rounded-3xl bg-card border shadow-sm p-6"
            >
              {/* Placeholder image/visual block */}
              <div className="rounded-2xl bg-muted/40 border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground h-40 md:h-full">
                Image / illustration about RideNexus
              </div>
              <div className="space-y-3">
                <h2 className="font-display text-2xl font-semibold">About Us</h2>
                <p className="text-sm text-muted-foreground">
                  RideNexus is designed to simplify the way people rent and share cars. Instead of
                  relying only on traditional rental companies, our platform allows individuals to
                  list their cars and make them available to others when they are not in use.
                </p>
                <p className="text-sm text-muted-foreground">
                  Through RideNexus, users can easily explore available cars, compare prices, and
                  book vehicles based on their travel needs. At the same time, car owners can
                  generate additional income by sharing their vehicles securely through our
                  platform.
                </p>
                <p className="text-sm text-muted-foreground">
                  We focus on creating a reliable and transparent rental experience by ensuring that
                  all listings are verified and bookings are managed safely through the system. Our
                  platform is built to provide convenience, trust, and flexibility for both renters
                  and car owners.
                </p>
                <p className="text-sm text-muted-foreground">
                  Whether someone needs a vehicle for a quick trip, a weekend getaway, or daily
                  transportation, RideNexus aims to provide a smooth and dependable mobility
                  solution.
                </p>
              </div>
            </motion.section>

            {/* Vision / Mission / Approach tabs with image */}
            <motion.section variants={fadeInUp} className="space-y-6">
              {/* Tab buttons */}
              <div className="inline-flex rounded-full bg-muted/60 p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('vision')}
                  className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-colors ${
                    activeTab === 'vision'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-transparent text-muted-foreground hover:bg-muted'
                  }`}
                >
                  Our Vision
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('mission')}
                  className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-colors ${
                    activeTab === 'mission'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-transparent text-muted-foreground hover:bg-muted'
                  }`}
                >
                  Our Mission
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('approach')}
                  className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-colors ${
                    activeTab === 'approach'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-transparent text-muted-foreground hover:bg-muted'
                  }`}
                >
                  Our Approach
                </button>
              </div>

              {/* Content + image (whole block fades on change) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="grid gap-6 md:grid-cols-2 items-stretch"
                >
                  <div className="rounded-3xl bg-card border shadow-sm p-6 space-y-3">
                    <p className="label-caps text-primary">
                      {activeTab === 'vision'
                        ? 'Our Vision'
                        : activeTab === 'mission'
                        ? 'Our Mission'
                        : 'Our Approach'}
                    </p>
                    <h2 className="font-display text-2xl font-bold">
                      {activeTab === 'vision' && 'Pioneering excellence in car rental services.'}
                      {activeTab === 'mission' &&
                        'Making car sharing simple, safe, and rewarding.'}
                      {activeTab === 'approach' &&
                        'Built with a clear, user‑first mindset.'}
                    </h2>
                    {activeTab === 'vision' && (
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>
                          To build a reliable and customer-focused car rental platform that makes
                          transportation convenient, affordable, and accessible for everyone while
                          promoting a smarter way to share vehicles.
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Our customers are our top priority.</li>
                          <li>Quality and safety guide every decision we make.</li>
                          <li>Every trip should feel simple and stress‑free.</li>
                        </ul>
                      </div>
                    )}
                    {activeTab === 'mission' && (
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>
                          Our mission is to provide a wide selection of safe and well‑maintained
                          vehicles through an easy and transparent booking system.
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Empower car owners to earn from their vehicles.</li>
                          <li>Give users clear pricing and flexible booking options.</li>
                          <li>Keep the entire flow—from search to return—easy to follow.</li>
                        </ul>
                      </div>
                    )}
                    {activeTab === 'approach' && (
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>
                          We follow a user‑first approach in everything we design. Our platform
                          focuses on simplicity, reliability, and security.
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Clean and clear screens for renters, owners, and admins.</li>
                          <li>Real‑time data so decisions are based on what is actually happening.</li>
                          <li>Strong checks to keep bookings and listings safe.</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="rounded-3xl overflow-hidden bg-muted flex items-center justify-center">
                    {/* Placeholder car image (replace with your own later) */}
                    <img
                      src="https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="Car representing RideNexus vision"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.section>

            {/* Why choose us */}
            <motion.section variants={fadeInUp} className="space-y-8 pt-6">
              <div className="text-center space-y-2">
                <p className="label-caps text-primary">Why Choose Us</p>
                <h2 className="font-display text-3xl font-bold">
                  Unmatched quality and service for your needs.
                </h2>
                <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                  RideNexus focuses on giving you a smooth, safe, and clear car rental experience
                  whether you are booking a car or sharing your own.
                </p>
              </div>

              {/* 2x2 layout around the image (top-left/right, bottom-left/right) */}
              <div className="grid gap-8 md:grid-cols-3 md:grid-rows-2 items-stretch">
                {/* Top-left */}
                <div className="space-y-1 md:self-start">
                  <h3 className="font-display text-sm sm:text-base font-semibold">Extensive Fleet Options</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Browse a variety of cars from different owners so you can pick the vehicle
                    that fits your trip and budget.
                  </p>
                </div>

                {/* Image spanning both rows in the middle */}
                <div className="md:row-span-2 rounded-[36px] overflow-hidden bg-muted shadow-md h-56 sm:h-64 md:h-72">
                  <img
                    src="https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=900"
                    alt="Modern car in city street"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Top-right */}
                <div className="space-y-1 md:self-start">
                  <h3 className="font-display text-sm sm:text-base font-semibold">Exceptional Customer Service</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Clear steps, helpful dashboards, and transparent pricing so you always know
                    what is happening with your booking.
                  </p>
                </div>

                {/* Bottom-left */}
                <div className="space-y-1 md:self-end">
                  <h3 className="font-display text-sm sm:text-base font-semibold">Convenient Locations</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Find cars in the areas you actually travel, making pickup and drop‑off simple
                    and fast.
                  </p>
                </div>

                {/* Bottom-right */}
                <div className="space-y-1 md:self-end">
                  <h3 className="font-display text-sm sm:text-base font-semibold">Reliability and Safety</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Verified listings, booking approvals, and an admin view that keeps an eye on
                    cars, users, and trips.
                  </p>
                </div>
              </div>
            </motion.section>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

