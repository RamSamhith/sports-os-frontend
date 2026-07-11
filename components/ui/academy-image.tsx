'use client';

import * as React from 'react';
import { ImageWithFallback, type ImageWithFallbackProps } from './image-with-fallback';
import { cn } from '@/lib/utils/cn';

interface AcademyImageProps extends Omit<ImageWithFallbackProps, 'src' | 'fallback'> {
  coverImage?: string | null;
  slug: string;
  sportsOffered?: string[];
  name: string;
  fallback?: React.ReactNode;
}

const ALLOWED_IMAGE_HOSTNAMES = new Set([
  'images.unsplash.com',
  'res.cloudinary.com',
]);

function isAllowedImageSrc(url: string): boolean {
  if (url.startsWith('/')) return true;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;
    if (ALLOWED_IMAGE_HOSTNAMES.has(parsed.hostname)) return true;
    for (const allowed of ALLOWED_IMAGE_HOSTNAMES) {
      if (allowed.startsWith('*.')) {
        const suffix = allowed.slice(1);
        if (parsed.hostname.endsWith(suffix)) return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

export function AcademyImage({
  coverImage,
  slug,
  sportsOffered,
  name,
  fallback,
  ...props
}: AcademyImageProps) {
  const hasValidCover = Boolean(coverImage && isAllowedImageSrc(coverImage));

  if (!hasValidCover) return null;

  return (
    <ImageWithFallback
      {...props}
      src={coverImage}
      fallback={fallback ?? (
        <div className="h-full w-full bg-muted" role="img" aria-label={`${name} cover`} />
      )}
    />
  );
}
