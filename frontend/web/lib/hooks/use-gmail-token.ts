'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Gmail access token hook — uses Google Identity Services (GIS)
 * google.accounts.oauth2 API to obtain a short-lived access token
 * with `gmail.readonly` scope.
 *
 * Reuses the GIS script already loaded by useGoogleAuth (use-social-auth.ts).
 * The access token lives in React state only (never localStorage).
 *
 * SECURITY: The token is short-lived (~1 hour) and never persisted.
 */

// ─── Types ─────────────────────────────────────────────────────

interface TokenClient {
  requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
}

// ─── Hook ──────────────────────────────────────────────────────

export interface UseGmailTokenReturn {
  /** The current access token (null if not connected). */
  accessToken: string | null;
  /** Whether a token request is in progress. */
  loading: boolean;
  /** Last error message, if any. */
  error: string | null;
  /** Whether the GIS script is loaded and ready. */
  ready: boolean;
  /** Request a new access token via GIS popup. */
  requestToken: () => void;
  /** Disconnect — clears the stored token. */
  disconnect: () => void;
}

const GMAIL_SCOPE = 'https://www.googleapis.com/auth/gmail.readonly';

export function useGmailToken(): UseGmailTokenReturn {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const clientRef = useRef<TokenClient | null>(null);

  // Wait for GIS script to be available (already loaded by useGoogleAuth)
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max

    const check = () => {
      if (window.google?.accounts?.oauth2) {
        setReady(true);
        return;
      }
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(check, 100);
      }
    };

    // If GIS is already loaded, check immediately
    if (window.google?.accounts?.oauth2) {
      setReady(true);
    } else {
      check();
    }
  }, []);

  const requestToken = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || !window.google?.accounts?.oauth2) {
      setError('Google Identity Services not loaded. Please refresh.');
      return;
    }

    setLoading(true);
    setError(null);

    // Create or reuse the token client
    if (!clientRef.current) {
      clientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: GMAIL_SCOPE,
        callback: (tokenResponse) => {
          setLoading(false);
          if (tokenResponse.error) {
            setError(tokenResponse.error);
            setAccessToken(null);
          } else if (tokenResponse.access_token) {
            setAccessToken(tokenResponse.access_token);
            setError(null);
          }
        },
      });
    }

    // prompt: 'consent' forces a fresh consent screen (required for first-time scope grant)
    clientRef.current.requestAccessToken({ prompt: 'consent' });
  }, []);

  const disconnect = useCallback(() => {
    setAccessToken(null);
    setError(null);
    setLoading(false);
    // Revoke the token if possible
    if (accessToken) {
      fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
        method: 'POST',
      }).catch(() => {
        // Best-effort revoke — non-critical
      });
    }
  }, [accessToken]);

  return { accessToken, loading, error, ready, requestToken, disconnect };
}
