'use client';

import { useState, useEffect } from 'react';
import { AuthModal } from '@/components/auth/auth-modal';
import { useAuth } from '@/lib/hooks/use-auth';

/**
 * Automatically shows the auth modal on the homepage for first-time visitors.
 * - Skips if already authenticated
 * - Skips if user has previously dismissed (sessionStorage flag)
 * - Shows after a short delay so the page renders first
 */
export function HomepageAuthModal() {
  const { isAuthenticated, isLoading } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) return;

    // Check if user already dismissed this session
    const dismissed = sessionStorage.getItem('sportsos:auth-modal-dismissed');
    if (dismissed) return;

    const timer = setTimeout(() => {
      setOpen(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated]);

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      sessionStorage.setItem('sportsos:auth-modal-dismissed', '1');
    }
    setOpen(nextOpen);
  }

  return (
    <AuthModal
      open={open}
      onOpenChange={handleClose}
      defaultView="choose"
    />
  );
}
