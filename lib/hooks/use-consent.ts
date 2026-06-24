'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ConsentCategory } from '@/types/domain/consent';

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  whatsapp: boolean;
}

const STORAGE_KEY = 'sportsos-consent';

const initial: ConsentState = {
  analytics: false,
  marketing: false,
  whatsapp: false,
};

function readStored(): ConsentState {
  if (typeof window === 'undefined') return initial;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return {
        analytics: typeof parsed.analytics === 'boolean' ? parsed.analytics : initial.analytics,
        marketing: typeof parsed.marketing === 'boolean' ? parsed.marketing : initial.marketing,
        whatsapp: typeof parsed.whatsapp === 'boolean' ? parsed.whatsapp : initial.whatsapp,
      };
    }
    return initial;
  } catch {
    return initial;
  }
}

export function useConsent() {
  const [state, setState] = useState<ConsentState>(initial);

  useEffect(() => {
    setState(readStored());
  }, []);

  const set = useCallback((category: ConsentCategory, granted: boolean) => {
    setState((prev) => {
      const next = { ...prev, [category]: granted };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setState(initial);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return { consent: state, set, reset };
}
