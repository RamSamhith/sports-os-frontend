import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VerifiedBadge } from '@/components/trust/verified-badge';

export interface CoachCardPlaceholderProps {
  slug?: string;
  name?: string;
  experience?: number;
  sports?: string[];
  verified?: boolean;
  city?: string;
}

export function CoachCardPlaceholder({
  slug = '#',
  name = 'Coach name',
  experience = 8,
  sports = ['Tennis'],
  verified = true,
  city = 'City',
}: CoachCardPlaceholderProps) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <Avatar className="h-12 w-12">
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Link href={`/coaches/${slug}`} className="hover:underline">
            <h3 className="text-sm font-semibold">{name}</h3>
          </Link>
          <VerifiedBadge status={verified ? 'verified' : 'pending'} />
        </div>
        <p className="text-muted-foreground text-xs">{city} · {experience}+ yrs</p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {sports.map((s) => (
            <Badge key={s} variant="secondary">
              {s}
            </Badge>
          ))}
        </div>
      </div>
      <Button size="sm" variant="outline" asChild>
        <Link href={`/coaches/${slug}`}>View</Link>
      </Button>
    </Card>
  );
}
