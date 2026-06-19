'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConsent } from '@/lib/hooks/use-consent';
import { Button } from '@/components/ui/button';

export function ConsentBanner() {
  const { consent, set } = useConsent();
  const [dismissed, setDismissed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    previousFocus.current?.focus();
  }, []);

  const handleAcceptAll = useCallback(() => {
    set('analytics', true);
    set('marketing', true);
    handleDismiss();
  }, [set, handleDismiss]);

  const handleEssentialOnly = useCallback(() => {
    set('analytics', false);
    set('marketing', false);
    set('whatsapp', true);
    handleDismiss();
  }, [set, handleDismiss]);

  // Focus trap + keyboard dismiss
  useEffect(() => {
    if (dismissed || consent.analytics || consent.marketing || consent.whatsapp) return;

    previousFocus.current = document.activeElement as HTMLElement;
    containerRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        handleDismiss();
        return;
      }
      if (e.key === 'Tab' && containerRef.current) {
        const focusable = containerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dismissed, consent, handleDismiss]);

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
        aria-modal="true"
        aria-label="Cookie consent"
        className="bg-card border-border/60 fixed inset-x-3 bottom-3 z-[var(--z-toast)] mx-auto max-w-2xl rounded-2xl border p-4 shadow-xl md:inset-x-auto md:right-6 md:left-auto md:max-w-md"
      >
        <div ref={containerRef} tabIndex={-1} className="outline-none flex flex-col gap-3">
          <div>
            <p className="text-sm font-medium">We use cookies for a better experience</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Essential cookies keep the site working. Analytics and marketing cookies help us improve
              discovery. You can change this anytime in settings.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={handleAcceptAll}>
              Accept all
            </Button>
            <Button size="sm" variant="outline" onClick={handleEssentialOnly}>
              Essential only
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDismiss}>
              Dismiss
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
