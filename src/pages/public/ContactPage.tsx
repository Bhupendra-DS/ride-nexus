import { useState } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import { submitQuery } from '@/services/queryService';
import { useAuth } from '@/hooks/useAuth';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { MapContainerProps, TileLayerProps } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function ContactPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSending(true);
    try {
      await submitQuery({
        name,
        email,
        message,
        userId: user?.id || null,
      });
      setSent(true);
      setMessage('');
    } finally {
      setSending(false);
    }
  };

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
              <p className="label-caps text-primary">Contact Us</p>
              <h1 className="font-display text-4xl font-bold tracking-tight">
                Get in touch with the RideNexus admin.
              </h1>
              <p className="text-muted-foreground text-base max-w-2xl">
                Have a question about bookings, owners, or the platform itself? Reach out directly
                to the RideNexus admin using the details below.
              </p>
            </motion.header>

            <motion.section
              variants={fadeInUp}
              className="grid gap-6 md:grid-cols-[2fr,3fr] rounded-3xl bg-card border shadow-sm p-6"
            >
              <div className="space-y-4">
                <h2 className="font-display text-xl font-semibold">Admin contact details</h2>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">Name:</span> RideNexus Admin
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Email:</span>{' '}
                    <a
                      href="mailto:admin@ridenexus.com"
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      admin@ridenexus.com
                    </a>
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Support hours:</span> Mon–Fri,
                    9:00 AM – 6:00 PM (IST)
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Please allow up to one business day for a response. For urgent issues related to
                  ongoing trips or car damage, include your booking ID in the subject line.
                </p>
              </div>

              <div className="rounded-2xl border bg-background/60 p-5 space-y-4">
                <h3 className="font-display text-lg font-semibold">Quick message</h3>
                <p className="text-xs text-muted-foreground">
                  This form is for contacting the admin only. Owners and users will be contacted
                  by the admin using the details linked to their RideNexus account.
                </p>
                <form className="space-y-3" onSubmit={handleSubmit}>
                  <div className="space-y-1">
                    <label className="label-caps text-muted-foreground">Your Name</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="label-caps text-muted-foreground">Your Email</label>
                    <input
                      type="email"
                      className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="label-caps text-muted-foreground">Message</label>
                    <textarea
                      className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm min-h-[120px] resize-none"
                      placeholder="Briefly describe your question or issue..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending || !name || !email || !message}
                    className="mt-1 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                  {sent && (
                    <p className="text-xs text-emerald-500 mt-1">
                      Your message has been sent to the admin.
                    </p>
                  )}
                </form>
              </div>
            </motion.section>

            {/* Map section */}
            <motion.section
              variants={fadeInUp}
              className="rounded-3xl bg-card border shadow-sm p-6 space-y-4"
            >
              <div className="space-y-1 text-center">
                <p className="label-caps text-primary">Service Locations</p>
                <h2 className="font-display text-2xl font-semibold">Where RideNexus is active</h2>
                <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
                  Interactive map showing the main Maharashtra cities where RideNexus operates.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-[2fr,3fr] items-center">
                <div className="space-y-3 text-xs text-muted-foreground">
                  <div>
                    <p className="font-semibold text-foreground">Mumbai (financial capital)</p>
                    <p>Lat: 19.0760° N, Lon: 72.8777° E</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Pune (education hub)</p>
                    <p>Lat: 18.5204° N, Lon: 73.8567° E</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Nagpur (orange city)</p>
                    <p>Lat: 21.1458° N, Lon: 79.0882° E</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Nashik (wine capital)</p>
                    <p>Lat: 19.9975° N, Lon: 73.7898° E</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Aurangabad (tourism hub)</p>
                    <p>Lat: 19.8762° N, Lon: 75.3433° E</p>
                  </div>
                </div>

                <div className="h-64 md:h-72 rounded-2xl overflow-hidden border border-border/60">
                  <MapContainer
                    {...({ center: [19.5, 75], zoom: 6, scrollWheelZoom: true } as MapContainerProps)}
                    className="w-full h-full"
                  >
                    <TileLayer
                      {...({
                        attribution:
                          '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',
                        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                      } as TileLayerProps)}
                    />
                    <Marker position={[19.0760, 72.8777]}>
                      <Popup>Mumbai (financial capital)</Popup>
                    </Marker>
                    <Marker position={[18.5204, 73.8567]}>
                      <Popup>Pune (education hub)</Popup>
                    </Marker>
                    <Marker position={[21.1458, 79.0882]}>
                      <Popup>Nagpur (orange city)</Popup>
                    </Marker>
                    <Marker position={[19.9975, 73.7898]}>
                      <Popup>Nashik (wine capital)</Popup>
                    </Marker>
                    <Marker position={[19.8762, 75.3433]}>
                      <Popup>Aurangabad (tourism hub)</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            </motion.section>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

