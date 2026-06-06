'use client';

import * as React from 'react';
import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils/cn';
import { Skeleton } from '@/components/ui/skeleton';

export interface ImageWithFallbackProps extends Omit<ImageProps, 'src' | 'alt'> {
  src?: string | null;
  alt: string;
  /**
   * Custom fallback rendered when `src` is missing or fails to load.
   * Defaults to a gradient surface with the alt text as a label.
   */
  fallback?: React.ReactNode;
  /**
   * If true, shows a skeleton behind the image while it loads.
   * Recommended to prevent CLS on first paint.
   */
  showSkeleton?: boolean;
}

/**
 * Robust image with graceful degradation.
 *
 * Hierarchy (priority high → low):
 *  1. `next/image` with the given `src`
 *  2. `fallback` (e.g. sport-specific placeholder)
 *  3. Inline gradient + alt label
 *
 * Prevents broken-image icons and runtime errors from `next/image`,
 * keeps a stable aspect ratio (parent controls dimensions), and shows
 * a skeleton during load to avoid CLS.
 */
export function ImageWithFallback({
  src,
  alt,
  fallback,
  className,
  showSkeleton = true,
  ...props
}: ImageWithFallbackProps) {
  const [errored, setErrored] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const hasImage = Boolean(src) && !errored;

  React.useEffect(() => {
    setErrored(false);
    setLoaded(false);
  }, [src]);

  if (!hasImage) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          'from-primary/15 via-accent/10 to-primary/5 text-foreground/70 grid place-items-center bg-gradient-to-br',
          className,
        )}
      >
        {fallback ?? <span className="text-xs font-medium tracking-wider uppercase">{alt}</span>}
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {showSkeleton && !loaded ? (
        <Skeleton className="absolute inset-0 h-full w-full" />
      ) : null}
      <Image
        {...props}
        src={src as string}
        alt={alt}
        onError={() => setErrored(true)}
        onLoad={() => setLoaded(true)}
        className={cn(
          className,
          'transition-opacity duration-300 ease-out motion-reduce:transition-none',
          loaded ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  );
}
