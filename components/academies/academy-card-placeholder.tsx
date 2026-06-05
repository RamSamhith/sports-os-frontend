import * as React from 'react';
import Link from 'next/link';
import { Bookmark, GitCompare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VerifiedBadge } from '@/components/trust/verified-badge';
import { LastUpdated } from '@/components/trust/last-updated';
import { CertificationIndicator } from '@/components/trust/certification-indicator';

export interface AcademyCardPlaceholderProps {
  slug?: string;
  name?: string;
  city?: string;
  rating?: number;
  certifications?: number;
  verified?: boolean;
  lastUpdatedAt?: string;
  sports?: string[];
}

export function AcademyCardPlaceholder({
  slug = '#',
  name = 'Academy name',
  city = 'City',
  rating = 4.6,
  certifications = 2,
  verified = true,
  lastUpdatedAt = new Date().toISOString(),
  sports = ['Cricket', 'Football'],
}: AcademyCardPlaceholderProps) {
  return (
    <Card className="overflow-hidden">
      <div className="bg-muted/40 relative aspect-[16/10] w-full">
        <div className="absolute inset-0 grid place-items-center text-xs tracking-widest text-white/40 uppercase">
          Cover image
        </div>
        <div className="absolute top-3 left-3 flex gap-2">
          <VerifiedBadge status={verified ? 'verified' : 'pending'} />
        </div>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link href={`/academies/${slug}`} className="hover:underline">
              <h3 className="text-base font-semibold tracking-tight">{name}</h3>
            </Link>
            <p className="text-muted-foreground text-xs">{city}</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold">{rating.toFixed(1)}</div>
            <div className="text-muted-foreground text-[10px] tracking-widest uppercase">Rating</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {sports.map((s) => (
            <Badge key={s} variant="secondary">
              {s}
            </Badge>
          ))}
        </div>
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <CertificationIndicator count={certifications} />
          <LastUpdated at={lastUpdatedAt} />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Button size="sm" className="flex-1" asChild>
            <Link href={`/academies/${slug}`}>View details</Link>
          </Button>
          <Button size="icon" variant="outline" aria-label="Save">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" aria-label="Compare">
            <GitCompare className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
