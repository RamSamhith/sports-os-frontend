'use client';

import * as React from 'react';
import { ImageWithFallback, type ImageWithFallbackProps } from './image-with-fallback';

interface CoachImageProps extends Omit<ImageWithFallbackProps, 'src' | 'fallback'> {
  avatar?: string | null;
  sportsCoached?: string[];
  name: string;
}

const coachingImages: Record<string, string> = {
  cricket: 'https://images.unsplash.com/photo-1589801256494-15c12fc19a98?w=800&h=600&fit=crop',
  football: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
  basketball: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=800&h=600&fit=crop',
  badminton: 'https://images.unsplash.com/photo-1611251135345-18d5621b1f9c?w=800&h=600&fit=crop',
  tennis: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1b0?w=800&h=600&fit=crop',
  'table-tennis': 'https://images.unsplash.com/photo-1611251135345-18d5621b1f9c?w=800&h=600&fit=crop',
  swimming: 'https://images.unsplash.com/photo-1560090995-01632a28895b?w=800&h=600&fit=crop',
  athletics: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
  wrestling: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&h=600&fit=crop',
  boxing: 'https://images.unsplash.com/photo-1522071901873-411886a10004?w=800&h=600&fit=crop',
  karate: 'https://images.unsplash.com/photo-1555597673-b21d5c935925?w=800&h=600&fit=crop',
  judo: 'https://images.unsplash.com/photo-1555597673-b21d5c935925?w=800&h=600&fit=crop',
  kabaddi: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
  hockey: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=800&h=600&fit=crop',
  chess: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&h=600&fit=crop',
  skating: 'https://images.unsplash.com/photo-1560023907-5f3392ea3202?w=800&h=600&fit=crop',
  archery: 'https://images.unsplash.com/photo-1554062679-9b19c67a4b1e?w=800&h=600&fit=crop',
  shooting: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=800&h=600&fit=crop',
  yoga: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
  gymnastics: 'https://images.unsplash.com/photo-1566241440091-ec9540c0d032?w=800&h=600&fit=crop',
  volleyball: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=800&h=600&fit=crop',
};

const sportGradients: Record<string, string> = {
  cricket: 'from-blue-900/70 to-blue-800/30',
  football: 'from-emerald-900/70 to-emerald-800/30',
  basketball: 'from-orange-900/70 to-orange-800/30',
  badminton: 'from-violet-900/70 to-violet-800/30',
  tennis: 'from-yellow-900/70 to-yellow-800/30',
  swimming: 'from-sky-900/70 to-sky-800/30',
  athletics: 'from-red-900/70 to-red-800/30',
  default: 'from-primary/60 to-primary/20',
};

export function CoachImage({
  avatar,
  sportsCoached,
  name,
  ...props
}: CoachImageProps) {
  const primarySport = sportsCoached?.[0];
  const sportImage = primarySport ? coachingImages[primarySport] : null;
  const gradient = primarySport ? (sportGradients[primarySport] ?? sportGradients.default) : sportGradients.default;

  const src = avatar || sportImage || '';

  const gradientFallback = (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}>
      <div className="flex flex-col items-center gap-1 p-4 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-white/20 text-2xl font-bold text-white backdrop-blur-sm">
          {name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
        </span>
        <span className="text-white/90 text-sm font-medium line-clamp-1">{name}</span>
        {primarySport && (
          <span className="bg-white/20 text-white/80 rounded-full px-2 py-0.5 text-[10px] capitalize">
            {primarySport.replace(/-/g, ' ')} Coach
          </span>
        )}
      </div>
    </div>
  );

  return (
    <ImageWithFallback
      {...props}
      src={src}
      fallback={gradientFallback}
    />
  );
}
