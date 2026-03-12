import { Link } from 'react-router-dom';
import { Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const footerLinks: Record<string, string[]> = {
  Product: ['Explore Cars', 'How it Works', 'Pricing', 'Safety'],
  Company: ['About Us', 'Careers', 'Press', 'Contact'],
  'For Owners': ['List Your Car', 'Owner Resources', 'Insurance', 'Earnings'],
  Support: ['Help Center', 'Community', 'Privacy Policy', 'Terms of Service'],
};

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="font-display font-bold text-sm text-primary-foreground">RN</span>
              </div>
              <span className="font-display font-bold text-lg tracking-tight">
                Ride<span className="text-gradient-primary">Nexus</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Premium peer-to-peer car sharing. Your next drive, redefined.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/80 transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="label-caps text-foreground mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px bg-border/50 mt-12 mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2024 RideNexus. All rights reserved.</p>
          <p className="text-sm text-muted-foreground">Engineered for the premium experience.</p>
        </div>
      </div>
    </footer>
  );
};
