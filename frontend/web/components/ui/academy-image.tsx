'use client';

import * as React from 'react';
import { ImageWithFallback, type ImageWithFallbackProps } from './image-with-fallback';

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

const sportImageVariants: Record<string, string[]> = {
  cricket: [
    'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1589801256494-15c12fc19a98?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1589187150110-0647b96ed5d7?w=800&h=600&fit=crop',
  ],
  football: [
    'https://images.unsplash.com/photo-1551776235-dde6d4829800?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&h=600&fit=crop',
  ],
  basketball: [
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1574457542968-4dcb68bd1f4a?w=800&h=600&fit=crop',
  ],
  badminton: [
    'https://images.unsplash.com/photo-1613915642601-0a2e1b104723?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1611251135345-18d5621b1f9c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1623091399583-b357b21fd4d5?w=800&h=600&fit=crop',
  ],
  tennis: [
    'https://images.unsplash.com/photo-1595435934249-5df7ed86e1b0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1622279457486-28e24c52b63a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1575329880896-2bf458d0d53b?w=800&h=600&fit=crop',
  ],
  'table-tennis': [
    'https://images.unsplash.com/photo-1611251135345-18d5621b1f9c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=800&h=600&fit=crop',
  ],
  swimming: [
    'https://images.unsplash.com/photo-1560090995-01632a28895b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1562942469-c4b78b54a71d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1576610616659-d49d5f0d124a?w=800&h=600&fit=crop',
  ],
  athletics: [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=800&h=600&fit=crop',
  ],
  wrestling: [
    'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1574680178050-55c6a6a960e9?w=800&h=600&fit=crop',
  ],
  boxing: [
    'https://images.unsplash.com/photo-1522071901873-411886a10004?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1617180024917-6bf6c4fc16e4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1566127992631-137a642a90f4?w=800&h=600&fit=crop',
  ],
  karate: [
    'https://images.unsplash.com/photo-1555597673-b21d5c935925?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544197820-86f2c6144b10?w=800&h=600&fit=crop',
  ],
  judo: [
    'https://images.unsplash.com/photo-1555597673-b21d5c935925?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552074284-5e88ef1aef4a?w=800&h=600&fit=crop',
  ],
  kabaddi: [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1574680178050-55c6a6a960e9?w=800&h=600&fit=crop',
  ],
  hockey: [
    'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1562077772-afb1d3b45ec4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1580748840729-b1e8d0b65f3b?w=800&h=600&fit=crop',
  ],
  chess: [
    'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1546599117-8d9f0c5baa6f?w=800&h=600&fit=crop',
  ],
  skating: [
    'https://images.unsplash.com/photo-1560023907-5f3392ea3202?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1611892440504-42bd7926078a?w=800&h=600&fit=crop',
  ],
  archery: [
    'https://images.unsplash.com/photo-1554062679-9b19c67a4b1e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=600&fit=crop',
  ],
  shooting: [
    'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512743709919-4f0092c0cba7?w=800&h=600&fit=crop',
  ],
  yoga: [
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&h=600&fit=crop',
  ],
  gymnastics: [
    'https://images.unsplash.com/photo-1566241440091-ec9540c0d032?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1579126038374-6064e9370f0f?w=800&h=600&fit=crop',
  ],
  volleyball: [
    'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544979590-37e9b47eb7b1?w=800&h=600&fit=crop',
  ],
};

function hashStr(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickVariant(sport: string, slug: string): string {
  const variants = sportImageVariants[sport];
  if (!variants || variants.length === 0) return '';
  const idx = hashStr(slug) % variants.length;
  return variants[idx];
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

  const src = React.useMemo(() => {
    if (coverImage && isAllowedImageSrc(coverImage)) return coverImage;
    if (sport) {
      const variant = pickVariant(sport, slug);
      if (variant) return variant;
    }
    return `/images/sports/${sport || 'athletics'}.svg`;
  }, [coverImage, sport, slug]);

  const defaultFallback = (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-4 text-center">
      <span className="bg-background/30 text-foreground/80 grid h-10 w-10 place-items-center rounded-md text-sm font-semibold uppercase backdrop-blur-sm">
        {name.charAt(0)}
      </span>
      <span className="text-foreground/80 line-clamp-1 text-xs font-medium">{name}</span>
    </div>
  );

  return (
    <ImageWithFallback
      {...props}
      src={src}
      fallback={fallback ?? defaultFallback}
    />
  );
}
