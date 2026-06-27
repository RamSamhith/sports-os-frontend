'use client';

import { useEffect, useCallback, useState } from 'react';
import { signInWithGoogle, signInWithMicrosoft } from '@/lib/api/auth';

interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (element: HTMLElement, config: {
            theme?: string;
            size?: string;
            text?: string;
            shape?: string;
            width?: number;
          }) => void;
          prompt: () => void;
        };
      };
    };
    msalConfig?: {
      clientId: string;
      authority: string;
      redirectUri: string;
    };
  }
}

export function useGoogleAuth() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, []);

  const initialize = useCallback((callback: (credential: string) => void) => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => callback(response.credential),
      auto_select: false,
      cancel_on_tap_outside: true,
    });
  }, []);

  const renderButton = useCallback((element: HTMLElement) => {
    if (!window.google) return;
    window.google.accounts.id.renderButton(element, {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      width: 400,
    });
  }, []);

  const prompt = useCallback(() => {
    if (!window.google) return;
    window.google.accounts.id.prompt();
  }, []);

  return { loaded, initialize, renderButton, prompt };
}

export function useMicrosoftAuth() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID;
    if (!clientId) return;

    const script = document.createElement('script');
    script.src = 'https://alcdn.msauth.net/browser/2.38.3/js/msal-browser.min.js';
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, []);

  const login = useCallback(async (): Promise<string | null> => {
    const clientId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID;
    if (!clientId || !(window as any).msal) return null;

    const msalInstance = new (window as any).msal.PublicClientApplication({
      auth: {
        clientId,
        authority: 'https://login.microsoftonline.com/common',
        redirectUri: window.location.origin,
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: false,
      },
    });

    try {
      const result = await msalInstance.loginPopup({
        scopes: ['user.read'],
        prompt: 'select_account',
      });
      return result.idToken;
    } catch {
      return null;
    }
  }, []);

  return { loaded, login };
}

export async function handleSocialAuth(
  provider: 'google' | 'microsoft',
  idToken: string,
  callbacks: {
    setAuth: (auth: boolean, onboarding: boolean) => void;
    setProfile: (profile: { name: string; email: string; phone: string }) => void;
    onSuccess: () => void;
    onError: (message: string) => void;
  }
) {
  const { setAuth, setProfile, onSuccess, onError } = callbacks;

  try {
    const result = provider === 'google'
      ? await signInWithGoogle(idToken)
      : await signInWithMicrosoft(idToken);

    if (!result.ok) {
      onError(result.error.message ?? `${provider} sign-in failed`);
      return;
    }

    const { token, user } = result.data;

    try {
      localStorage.setItem('sportsos:auth-token', token);
    } catch { /* ignore */ }

    setProfile({
      name: user.name,
      email: user.email,
      phone: user.phone ?? '',
    });
    setAuth(true, user.onboardingCompleted ?? false);
    onSuccess();
  } catch {
    onError('Network error. Please try again.');
  }
}
