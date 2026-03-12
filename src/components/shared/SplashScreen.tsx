import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500);
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Scan line */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"
              initial={{ y: -10 }}
              animate={{ y: '100vh' }}
              transition={{ duration: 2, ease: 'linear', repeat: Infinity }}
            />
          </div>

          <div className="flex flex-col items-center gap-8">
            {/* Logo monogram */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative"
            >
              <div className="w-24 h-24 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <span className="font-display font-bold text-4xl text-primary-foreground tracking-tight">RN</span>
              </div>
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{ boxShadow: ['0 0 20px hsl(190 95% 50% / .2)', '0 0 50px hsl(190 95% 50% / .5)', '0 0 20px hsl(190 95% 50% / .2)'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-center"
            >
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
                Ride<span className="text-gradient-primary">Nexus</span>
              </h1>
              <p className="label-caps text-muted-foreground mt-2">Premium Car Sharing</p>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="w-48 h-px bg-muted overflow-hidden rounded-full"
            >
              <motion.div
                className="h-full bg-gradient-primary rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.8, duration: 1.2, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
