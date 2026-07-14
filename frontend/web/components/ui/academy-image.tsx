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

const SPORT_EMOJI: Record<string, string> = {
  football: '⚽',
  basketball: '🏀',
  swimming: '🏊',
  athletics: '🏃',
  badminton: '🏸',
  cricket: '🏏',
  tennis: '🎾',
  'table-tennis': '🏓',
  wrestling: '🤼',
  boxing: '🥊',
  karate: '🥋',
  judo: '🥋',
  kabaddi: '🏋️',
  hockey: '🏑',
  chess: '♟️',
  skating: '⛸️',
  archery: '🏹',
  shooting: '🎯',
  yoga: '🧘',
  gymnastics: '🤸',
  volleyball: '🏐',
};

const SPORT_FALLBACK_BG: Record<string, string> = {
  football: 'from-green-500/15 to-green-600/5 dark:from-green-400/10 dark:to-green-500/5',
  basketball: 'from-orange-500/15 to-orange-600/5 dark:from-orange-400/10 dark:to-orange-500/5',
  swimming: 'from-blue-500/15 to-blue-600/5 dark:from-blue-400/10 dark:to-blue-500/5',
  athletics: 'from-amber-500/15 to-amber-600/5 dark:from-amber-400/10 dark:to-amber-500/5',
  badminton: 'from-teal-500/15 to-teal-600/5 dark:from-teal-400/10 dark:to-teal-500/5',
  cricket: 'from-emerald-500/15 to-emerald-600/5 dark:from-emerald-400/10 dark:to-emerald-500/5',
  tennis: 'from-lime-500/15 to-lime-600/5 dark:from-lime-400/10 dark:to-lime-500/5',
  'table-tennis': 'from-cyan-500/15 to-cyan-600/5 dark:from-cyan-400/10 dark:to-cyan-500/5',
  wrestling: 'from-red-500/15 to-red-600/5 dark:from-red-400/10 dark:to-red-500/5',
  boxing: 'from-red-500/15 to-red-600/5 dark:from-red-400/10 dark:to-red-500/5',
  karate: 'from-red-500/15 to-red-600/5 dark:from-red-400/10 dark:to-red-500/5',
  judo: 'from-red-500/15 to-red-600/5 dark:from-red-400/10 dark:to-red-500/5',
  kabaddi: 'from-orange-500/15 to-orange-600/5 dark:from-orange-400/10 dark:to-orange-500/5',
  hockey: 'from-blue-500/15 to-blue-600/5 dark:from-blue-400/10 dark:to-blue-500/5',
  chess: 'from-violet-500/15 to-violet-600/5 dark:from-violet-400/10 dark:to-violet-500/5',
  skating: 'from-sky-500/15 to-sky-600/5 dark:from-sky-400/10 dark:to-sky-500/5',
  archery: 'from-amber-500/15 to-amber-600/5 dark:from-amber-400/10 dark:to-amber-500/5',
  shooting: 'from-slate-500/15 to-slate-600/5 dark:from-slate-400/10 dark:to-slate-500/5',
  yoga: 'from-purple-500/15 to-purple-600/5 dark:from-purple-400/10 dark:to-purple-500/5',
  gymnastics: 'from-pink-500/15 to-pink-600/5 dark:from-pink-400/10 dark:to-pink-500/5',
  volleyball: 'from-orange-500/15 to-orange-600/5 dark:from-orange-400/10 dark:to-orange-500/5',
};

function getSportFallbackBg(sportsOffered?: string[]): string {
  const primary = sportsOffered?.[0];
  if (primary && SPORT_FALLBACK_BG[primary]) return SPORT_FALLBACK_BG[primary];
  return 'from-muted/60 to-muted/20';
}

function getSportEmoji(sportsOffered?: string[]): string {
  const primary = sportsOffered?.[0];
  if (primary && SPORT_EMOJI[primary]) return SPORT_EMOJI[primary];
  return '🏅';
}

export function AcademyImage({
  coverImage,
  slug,
  sportsOffered,
  name,
  fallback,
  className,
  ...props
}: AcademyImageProps) {
  const hasValidCover = Boolean(coverImage && isAllowedImageSrc(coverImage));

  if (!hasValidCover) {
    const gradientBg = getSportFallbackBg(sportsOffered);
    const emoji = getSportEmoji(sportsOffered);

    return (
      <div
        className={cn(
          'relative flex h-full w-full items-center justify-center bg-gradient-to-br',
          gradientBg,
          className
        )}
        role="img"
        aria-label={`${name} cover`}
      >
        <span className="text-4xl opacity-60 select-none" aria-hidden>
          {emoji}
        </span>
      </div>
    );
  }

  return (
    <ImageWithFallback
      {...props}
      className={className}
      src={coverImage}
      fallback={fallback ?? (
        <div className="h-full w-full bg-muted" role="img" aria-label={`${name} cover`} />
      )}
    />
  );
}
