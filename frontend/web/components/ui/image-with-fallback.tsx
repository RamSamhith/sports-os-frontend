'use client';

import * as React from 'react';
import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils/cn';
import { Skeleton } from '@/components/ui/skeleton';
import { cloudinarySrcSet, isCloudinaryConfigured } from '@/lib/images/cloudinary';

export interface ImageWithFallbackProps extends Omit<ImageProps, 'src' | 'alt'> {
  src?: string | null;
  alt: string;
  fallback?: React.ReactNode;
  showSkeleton?: boolean;
}

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

  // Build Cloudinary srcset if configured and src is a public ID (not full URL)
  const isCloudinary = isCloudinaryConfigured() && src && !src.startsWith('http');
  const cloudinary = isCloudinary
    ? cloudinarySrcSet(src, [400, 800, 1200, 1600], { quality: 'auto', format: 'auto' })
    : null;

  const imgSrc = cloudinary?.src || src;
  const blurData = cloudinary?.blurDataURL;

  return (
    <div className="absolute inset-0">
      {showSkeleton && !loaded ? (
        <Skeleton className="absolute inset-0 h-full w-full" />
      ) : null}
      <Image
        {...props}
        src={imgSrc as string}
        alt={alt}
        placeholder={blurData ? 'blur' : 'empty'}
        blurDataURL={blurData || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4="}
        sizes={props.sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
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
