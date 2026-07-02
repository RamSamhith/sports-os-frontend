'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { signInWithGoogle } from '@/lib/api/auth';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (element: HTMLElement, config: Record<string, unknown>) => void;
          prompt: (callback?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
          disableAutoSelect: () => void;
        };
        oauth2: {
          initTokenClient: (config: Record<string, unknown>) => void;
        };
      };
    };
  }
}

let scriptLoadPromise: Promise<boolean> | null = null;

function loadGoogleScript(): Promise<boolean> {
  if (scriptLoadPromise) return scriptLoadPromise;
  scriptLoadPromise = new Promise((resolve) => {
    if (typeof window === 'undefined') { resolve(false); return; }
    if (window.google?.accounts?.id) { resolve(true); return; }

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      if ((existingScript as HTMLScriptElement).dataset.loaded === 'true') { resolve(true); return; }
      const check = () => {
        if (window.google?.accounts?.id) { resolve(true); }
        else { setTimeout(check, 100); }
      };
      check();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      const waitForGoogle = () => {
        if (window.google?.accounts?.id) { resolve(true); }
        else { setTimeout(waitForGoogle, 100); }
      };
      waitForGoogle();
    };
    script.onerror = () => {
      scriptLoadPromise = null;
      resolve(false);
    };
    document.head.appendChild(script);
  });
  return scriptLoadPromise;
}

export function useGoogleAuth() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    loadGoogleScript().then((ok) => {
      if (!cancelled) {
        if (ok) setLoaded(true);
        else setError('Google Sign-In failed to load. Please try again.');
      }
    });
    return () => { cancelled = true; };
  }, []);

  const initialize = useCallback((callback: (credential: string) => void) => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || !window.google) return;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential?: string }) => {
          if (response.credential) callback(response.credential);
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        using_fedcm: false,
      });
      initRef.current = true;
    } catch {
      setError('Failed to initialize Google Sign-In.');
    }
  }, []);

  const renderButton = useCallback((element: HTMLElement) => {
    if (!window.google || !initRef.current) return;
    try {
      window.google.accounts.id.renderButton(element, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: 400,
      });
    } catch {
      // Button render failed silently
    }
  }, []);

  const prompt = useCallback(() => {
    if (!window.google || !initRef.current) return;
    try {
      window.google.accounts.id.prompt((notification) => {
        if (notification?.isNotDisplayed?.() || notification?.isSkippedMoment?.()) {
          // FedCM/Third-party cookies may be blocked.
          // The user can still use email/password login.
          // Do not show error for this — it's expected in strict privacy browsers.
        }
      });
    } catch {
      // Prompt failed — user can fall back to email login
    }
  }, []);

  return { loaded, error, initialize, renderButton, prompt };
}

export async function handleSocialAuth(
  idToken: string,
  callbacks: {
    setAuth: (auth: boolean, onboarding: boolean) => void;
    setProfile: (profile: { name: string; email: string; phone: string; authProvider?: 'credentials' | 'google' | 'microsoft' | 'guest' }) => void;
    onSuccess: (onboardingCompleted?: boolean) => void;
    onError: (message: string) => void;
  }
) {
  const { setAuth, setProfile, onSuccess, onError } = callbacks;

  try {
    const result = await signInWithGoogle(idToken);

    if (!result.ok) {
      onError(result.error.message ?? 'Google sign-in failed');
      return;
    }

    const { token, user } = result.data;

    try {
      localStorage.setItem('sportsos:auth-token', token);
    } catch { /* ignore */ }

    const onboarded = user.onboardingCompleted ?? false;

    setProfile({
      name: user.name,
      email: user.email,
      phone: user.phone ?? '',
      authProvider: 'google',
    });
    setAuth(true, onboarded);
    onSuccess(onboarded);
  } catch {
    onError('Network error. Please try again.');
  }
}
