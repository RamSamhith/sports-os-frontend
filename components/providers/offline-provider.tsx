'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface OfflineContextValue {
  isOffline: boolean;
}

const OfflineContext = React.createContext<OfflineContextValue | null>(null);

export function useOffline() {
  const ctx = React.useContext(OfflineContext);
  if (!ctx) {
    throw new Error('useOffline must be used within OfflineProvider');
  }
  return ctx;
}

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  // Start assuming online (good default). The useEffect below will reconcile
  // with the real network state on the client.
  const [isOffline, setIsOffline] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsOffline(!window.navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <OfflineContext.Provider value={{ isOffline }}>
      {children}
      <OfflineBanner isOffline={isOffline} />
    </OfflineContext.Provider>
  );
}

function OfflineBanner({ isOffline }: { isOffline: boolean }) {
  return (
    <AnimatePresence>
      {isOffline ? (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
          className={cn(
            'border-border/60 bg-card/90 text-muted-foreground fixed top-safe left-1/2 z-[var(--z-toast)] mt-2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border px-3 py-1.5 text-xs shadow-lg backdrop-blur',
          )}
        >
          <WifiOff aria-hidden className="h-3.5 w-3.5" />
          <span>You’re offline. Showing the latest cached information.</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
