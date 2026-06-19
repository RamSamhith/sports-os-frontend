'use client';

import { useState, useCallback, type ReactNode, type MouseEvent } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { ConversionModal } from './conversion-modal';

interface GuestGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  /** Called when a guest tries to access protected content. Use for Link wrapping. */
  onGuard?: () => void;
  /** Contextual message shown in the conversion modal */
  actionLabel?: string;
}

/**
 * Wraps protected actions. For plain buttons, wraps in a div with onClick.
 * For Links, pass `onGuard` and call `e.preventDefault()` in the parent.
 */
export function GuestGuard({ children, fallback, onGuard, actionLabel }: GuestGuardProps) {
  const { isAuthenticated, isGuest, isLoading } = useAuth();
  const [showConversion, setShowConversion] = useState(false);

  const handleGuard = useCallback(() => {
    if (onGuard) {
      onGuard();
    }
    setShowConversion(true);
  }, [onGuard]);

  if (isLoading) return null;

  // Authenticated non-guest users get direct access
  if (isAuthenticated && !isGuest) {
    return <>{children}</>;
  }

  // Guest or unauthenticated users: intercept click
  if (isGuest || !isAuthenticated) {
    return (
      <>
        {fallback ?? (
          <div onClick={handleGuard} className="cursor-pointer">
            {children}
          </div>
        )}
        <ConversionModal open={showConversion} onOpenChange={setShowConversion} actionLabel={actionLabel} />
      </>
    );
  }

  return <>{children}</>;
}
