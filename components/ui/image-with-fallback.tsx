'use client';

import * as React from 'react';
import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils/cn';

export interface ImageWithFallbackProps extends Omit<ImageProps, 'src' | 'alt'> {
  src?: string | null;
  alt: string;
  fallback?: React.ReactNode;
}

/**
 * Image that swaps to a `fallback` if `src` is missing or fails to load.
 * Prevents broken-image icons and runtime errors from `next/image`.
 */
export function ImageWithFallback({ src, alt, fallback, className, ...props }: ImageWithFallbackProps) {
  const [errored, setErrored] = React.useState(false);
  const hasImage = Boolean(src) && !errored;

  React.useEffect(() => {
    setErrored(false);
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
        {fallback ?? <span className="text-xs font-medium uppercase tracking-wider">{alt}</span>}
      </div>
    );
  }

  return (
    <Image
      {...props}
      src={src as string}
      alt={alt}
      onError={() => setErrored(true)}
      className={className}
    />
  );
}
