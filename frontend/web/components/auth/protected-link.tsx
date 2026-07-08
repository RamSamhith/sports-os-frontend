'use client';

import { useState, type MouseEvent, type ReactNode } from 'react';
import Link, { type LinkProps } from 'next/link';
import { useAuth } from '@/lib/hooks/use-auth';
import { ConversionModal } from './conversion-modal';

/**
 * Drop-in replacement for Link that shows a ConversionModal for guests.
 * When a guest clicks, navigation is prevented and the auth modal opens.
 */
export function ProtectedLink({
  href,
  children,
  className,
  ...props
}: LinkProps & { children: ReactNode; className?: string }) {
  const { isAuthenticated, isGuest, isLoading } = useAuth();
  const [showConversion, setShowConversion] = useState(false);

  const needsGuard = !isLoading && (isGuest || !isAuthenticated);

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (needsGuard) {
      e.preventDefault();
      e.stopPropagation();
      setShowConversion(true);
    }
  }

  return (
    <>
      <Link
        href={href}
        onClick={handleClick}
        className={className}
        tabIndex={needsGuard ? -1 : undefined}
        aria-disabled={needsGuard || undefined}
        {...props}
      >
        {children}
      </Link>
      <ConversionModal open={showConversion} onOpenChange={setShowConversion} />
    </>
  );
}
