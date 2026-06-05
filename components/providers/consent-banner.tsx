'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConsent } from '@/lib/hooks/use-consent';
import { Button } from '@/components/ui/button';

export function ConsentBanner() {
  const { consent, set } = useConsent();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;
  if (consent.analytics || consent.marketing || consent.whatsapp) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
        role="dialog"
        aria-label="Cookie consent"
        className="bg-card/95 border-border/60 fixed inset-x-3 bottom-3 z-[var(--z-toast)] mx-auto max-w-2xl rounded-2xl border p-4 shadow-xl backdrop-blur md:inset-x-auto md:right-6 md:left-auto md:max-w-md"
      >
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-medium">We use cookies for a better experience</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Essential cookies keep the site working. Analytics and marketing cookies help us improve
              discovery. You can change this anytime in settings.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={() => set('analytics', true)}>
              Accept all
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                set('analytics', false);
                set('marketing', false);
                set('whatsapp', true);
                setDismissed(true);
              }}
            >
              Essential only
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setDismissed(true)}>
              Dismiss
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
