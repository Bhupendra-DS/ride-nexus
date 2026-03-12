import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const categories = [
  { id: 'general', label: 'General Information' },
  { id: 'booking', label: 'Booking & Reservations' },
  { id: 'pricing', label: 'Pricing & Payments' },
  { id: 'vehicle', label: 'Vehicle Information' },
] as const;

export const FAQSection = () => {
  const generalRef = useRef<HTMLDivElement | null>(null);
  const bookingRef = useRef<HTMLDivElement | null>(null);
  const pricingRef = useRef<HTMLDivElement | null>(null);
  const vehicleRef = useRef<HTMLDivElement | null>(null);

  const refs: Record<string, React.RefObject<HTMLDivElement>> = {
    general: generalRef,
    booking: bookingRef,
    pricing: pricingRef,
    vehicle: vehicleRef,
  };

  const handleCategoryClick = (id: string) => {
    const targetRef = refs[id];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="faq" className="py-20 bg-card/20">
      <div className="container mx-auto px-4 max-w-5xl space-y-10">
        {/* Section header */}
        <div className="space-y-3 text-center">
          <p className="label-caps text-primary">Frequently Asked Questions</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Frequently Asked Questions
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about booking cars, listing vehicles, payments, and how
            RideNexus works.
          </p>
        </div>

        {/* Hero banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden shadow-lg bg-gradient-to-r from-primary/15 via-primary/5 to-primary/15 border border-primary/20"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(190_95%_60%/.18),_transparent_55%)]" />
          <div className="relative px-6 py-10 md:px-10 md:py-12 text-center">
            <h3 className="font-display text-2xl md:text-3xl font-semibold mb-2">
              New to RideNexus?
            </h3>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
              This quick guide helps you understand how bookings, listings, and payments work on the
              platform.
            </p>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="grid gap-8 md:grid-cols-[260px,minmax(0,1fr)] items-start">
          {/* Category nav */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-card border shadow-md p-4 space-y-2"
          >
            <p className="label-caps text-muted-foreground mb-2">Browse by topic</p>
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryClick(cat.id)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs md:text-sm font-medium text-muted-foreground bg-muted/40 hover:bg-muted hover:text-foreground transition-colors"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* FAQ accordion */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* General Information */}
            <div ref={generalRef} id="faq-general" className="space-y-3">
              <p className="label-caps text-primary">General Information</p>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="general-1">
                  <AccordionTrigger>What is RideNexus?</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    RideNexus is a peer-to-peer car rental platform that connects car owners with
                    users who need a vehicle for short trips, travel, or daily transportation.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="general-2">
                  <AccordionTrigger>Is customer support available during my trip?</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    Yes. RideNexus provides support throughout your booking period. If you face any
                    issue during your rental, you can contact support through the platform.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="general-3">
                  <AccordionTrigger>Do I need an account to book a car?</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    Yes. Users must create an account and log in before making a booking. This helps
                    us ensure secure transactions and better trip management.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Booking & Reservations */}
            <div ref={bookingRef} id="faq-booking" className="space-y-3">
              <p className="label-caps text-primary">Booking & Reservations</p>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="booking-1">
                  <AccordionTrigger>How do I book a car on RideNexus?</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    Browse available cars in the Explore Cars section, select a vehicle, choose your
                    pickup location and dates, and submit your booking request.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="booking-2">
                  <AccordionTrigger>Will I receive confirmation after booking?</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    Yes. Once your booking is approved by the admin, the trip will appear in your
                    dashboard under &quot;My Trips&quot;.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="booking-3">
                  <AccordionTrigger>Can I cancel a booking?</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    Yes. Booking cancellation policies may depend on the owner&apos;s terms and the
                    booking stage.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Pricing & Payments */}
            <div ref={pricingRef} id="faq-pricing" className="space-y-3">
              <p className="label-caps text-primary">Pricing & Payments</p>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="pricing-1">
                  <AccordionTrigger>How is the rental price calculated?</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    The total rental price is calculated based on the hourly rate of the vehicle and
                    the total duration of the booking.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="pricing-2">
                  <AccordionTrigger>What payment methods are supported?</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    RideNexus will support secure online payments such as cards, UPI, and other
                    digital payment methods.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="pricing-3">
                  <AccordionTrigger>Are there any additional fees?</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    Additional charges may apply for late returns, damages, or policy violations.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Vehicle Information */}
            <div ref={vehicleRef} id="faq-vehicle" className="space-y-3">
              <p className="label-caps text-primary">Vehicle Information</p>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="vehicle-1">
                  <AccordionTrigger>Are vehicles verified before listing?</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    Yes. All vehicles listed on RideNexus must go through an approval process before
                    becoming available for bookings.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="vehicle-2">
                  <AccordionTrigger>Are the vehicles insured?</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    Vehicle insurance depends on the owner&apos;s coverage. RideNexus encourages
                    owners to maintain valid insurance and proper documentation.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="vehicle-3">
                  <AccordionTrigger>What types of vehicles are available?</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    RideNexus offers a wide range of vehicles including hatchbacks, sedans, SUVs,
                    and premium cars depending on owner listings.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

