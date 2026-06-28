'use client';

import { useEffect, useCallback, useState } from 'react';
import { signInWithGoogle } from '@/lib/api/auth';

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

export async function handleSocialAuth(
  idToken: string,
  callbacks: {
    setAuth: (auth: boolean, onboarding: boolean) => void;
    setProfile: (profile: { name: string; email: string; phone: string; authProvider?: 'credentials' | 'google' | 'guest' }) => void;
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
