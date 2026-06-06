import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VerifiedBadge } from '@/components/trust/verified-badge';
import { MapPin } from 'lucide-react';
import type { Coach } from '@/types/domain/coach';

export function CoachCardPlaceholder({ coach }: { coach: Coach }) {
  const { slug, name, location, experienceYears, sportsCoached, verificationStatus, avatar } = coach;
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('');

  return (
    <Card className="flex items-center gap-3 p-4">
      <Avatar className="h-12 w-12 shrink-0">
        {avatar ? <AvatarImage src={avatar} alt={name} /> : null}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Link href={`/coaches/${slug}`} className="hover:underline">
            <h3 className="truncate text-sm font-semibold">{name}</h3>
          </Link>
          <VerifiedBadge status={verificationStatus} />
        </div>
        <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
          <MapPin className="h-3 w-3" />
          {location.city} · {experienceYears}+ yrs
        </p>
        {sportsCoached.length > 0 ? (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {sportsCoached.map((s) => (
              <Badge key={s} variant="secondary" className="capitalize">
                {s.replace(/-/g, ' ')}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
      <Button size="sm" variant="outline" asChild>
        <Link href={`/coaches/${slug}`}>View</Link>
      </Button>
    </Card>
  );
}
