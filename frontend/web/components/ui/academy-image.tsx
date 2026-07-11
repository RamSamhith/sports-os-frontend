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

function hashStr(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

const SPORT_GRADIENT_PALETTES: Record<string, { from: string; via: string; to: string; accent: string }[]> = {
  team: [
    { from: 'from-blue-600', via: 'via-blue-500', to: 'to-indigo-700', accent: 'bg-white/15' },
    { from: 'from-emerald-600', via: 'via-teal-500', to: 'to-cyan-700', accent: 'bg-white/15' },
    { from: 'from-violet-600', via: 'via-purple-500', to: 'to-indigo-700', accent: 'bg-white/12' },
  ],
  combat: [
    { from: 'from-red-600', via: 'via-rose-500', to: 'to-orange-700', accent: 'bg-white/15' },
    { from: 'from-orange-600', via: 'via-amber-500', to: 'to-red-700', accent: 'bg-white/15' },
    { from: 'from-rose-600', via: 'via-pink-500', to: 'to-fuchsia-700', accent: 'bg-white/12' },
  ],
  racquet: [
    { from: 'from-green-600', via: 'via-emerald-500', to: 'to-teal-700', accent: 'bg-white/15' },
    { from: 'from-lime-600', via: 'via-green-500', to: 'to-emerald-700', accent: 'bg-white/15' },
    { from: 'from-emerald-600', via: 'via-teal-500', to: 'to-cyan-700', accent: 'bg-white/12' },
  ],
  aquatic: [
    { from: 'from-cyan-600', via: 'via-sky-500', to: 'to-blue-700', accent: 'bg-white/15' },
    { from: 'from-blue-500', via: 'via-cyan-400', to: 'to-teal-600', accent: 'bg-white/15' },
    { from: 'from-sky-600', via: 'via-blue-500', to: 'to-indigo-700', accent: 'bg-white/12' },
  ],
  athletics: [
    { from: 'from-amber-600', via: 'via-orange-500', to: 'to-red-600', accent: 'bg-white/15' },
    { from: 'from-yellow-600', via: 'via-amber-500', to: 'to-orange-600', accent: 'bg-white/15' },
    { from: 'from-orange-500', via: 'via-red-400', to: 'to-rose-600', accent: 'bg-white/12' },
  ],
  individual: [
    { from: 'from-purple-600', via: 'via-violet-500', to: 'to-indigo-700', accent: 'bg-white/15' },
    { from: 'from-fuchsia-600', via: 'via-purple-500', to: 'to-violet-700', accent: 'bg-white/15' },
    { from: 'from-indigo-600', via: 'via-purple-500', to: 'to-fuchsia-700', accent: 'bg-white/12' },
  ],
};

const SPORT_CATEGORIES: Record<string, string> = {
  cricket: 'team',
  football: 'team',
  basketball: 'team',
  kabaddi: 'team',
  hockey: 'team',
  volleyball: 'team',
  badminton: 'racquet',
  tennis: 'racquet',
  'table-tennis': 'racquet',
  swimming: 'aquatic',
  athletics: 'athletics',
  wrestling: 'combat',
  boxing: 'combat',
  karate: 'combat',
  judo: 'combat',
  chess: 'individual',
  skating: 'individual',
  archery: 'individual',
  shooting: 'individual',
  yoga: 'individual',
  gymnastics: 'individual',
};

const SPORT_DISPLAY_NAMES: Record<string, string> = {
  cricket: 'Cricket',
  football: 'Football',
  basketball: 'Basketball',
  badminton: 'Badminton',
  tennis: 'Tennis',
  'table-tennis': 'Table Tennis',
  swimming: 'Swimming',
  athletics: 'Athletics',
  wrestling: 'Wrestling',
  boxing: 'Boxing',
  karate: 'Karate',
  judo: 'Judo',
  kabaddi: 'Kabaddi',
  hockey: 'Hockey',
  chess: 'Chess',
  skating: 'Skating',
  archery: 'Archery',
  shooting: 'Shooting',
  yoga: 'Yoga',
  gymnastics: 'Gymnastics',
  volleyball: 'Volleyball',
};

function getGradient(sport: string | undefined, slug: string) {
  const category = sport ? (SPORT_CATEGORIES[sport] ?? 'individual') : 'individual';
  const palettes = SPORT_GRADIENT_PALETTES[category] ?? SPORT_GRADIENT_PALETTES.individual;
  const idx = hashStr(slug) % palettes.length;
  return palettes[idx];
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

function PremiumFallback({
  name,
  sport,
  slug,
  className,
}: {
  name: string;
  sport?: string;
  slug: string;
  className?: string;
}) {
  const gradient = getGradient(sport, slug);
  const initials = getInitials(name);
  const displayName = sport ? (SPORT_DISPLAY_NAMES[sport] ?? sport.replace(/-/g, ' ')) : 'Sports Academy';

  return (
    <div
      className={cn(
        'relative flex h-full w-full flex-col items-center justify-center overflow-hidden',
        `bg-gradient-to-br ${gradient.from} ${gradient.via} ${gradient.to}`,
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`dots-${slug}`} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#dots-${slug})`} />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
        <div className="bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white tracking-wide">
          {initials}
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-white font-semibold text-sm leading-tight line-clamp-1 drop-shadow-sm max-w-[200px]">
            {name}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-sm border border-white/10">
            {displayName}
          </span>
        </div>
      </div>
    </div>
  );
}

export function AcademyImage({
  coverImage,
  slug,
  sportsOffered,
  name,
  fallback,
  ...props
}: AcademyImageProps) {
  const sport = sportsOffered?.[0];

  const hasValidCover = Boolean(coverImage && isAllowedImageSrc(coverImage));

  if (!hasValidCover) {
    return (
      <PremiumFallback
        name={name}
        sport={sport}
        slug={slug}
        className={props.className}
      />
    );
  }

  const defaultFallback = (
    <PremiumFallback name={name} sport={sport} slug={slug} />
  );

  return (
    <ImageWithFallback
      {...props}
      src={coverImage}
      fallback={fallback ?? defaultFallback}
    />
  );
}
