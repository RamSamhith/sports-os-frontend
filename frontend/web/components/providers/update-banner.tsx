'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function UpdateBanner() {
  const [showUpdate, setShowUpdate] = React.useState(false);

  React.useEffect(() => {
    function handleUpdate() {
      setShowUpdate(true);
    }
    window.addEventListener('sw-update-available', handleUpdate);
    return function () {
      window.removeEventListener('sw-update-available', handleUpdate);
    };
  }, []);

  function handleUpdate() {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
    setShowUpdate(false);
  }

  return (
    <AnimatePresence>
      {showUpdate && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
          className={cn(
            'fixed bottom-4 left-1/2 z-[var(--z-toast)] inline-flex -translate-x-1/2 items-center gap-3',
            'border-border/60 bg-card/90 rounded-full border px-3 py-1.5 text-xs shadow-lg backdrop-blur',
            'pb-safe',
          )}
        >
          <Download aria-hidden className="text-primary h-3.5 w-3.5" />
          <span className="text-muted-foreground">Update available</span>
          <button
            onClick={handleUpdate}
            className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-medium hover:opacity-90"
          >
            Reload
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
