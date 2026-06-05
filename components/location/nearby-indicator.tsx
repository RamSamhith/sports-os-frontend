import { Navigation } from 'lucide-react';
import { formatDistance } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

export function NearbyIndicator({ km, className }: { km: number; className?: string }) {
  return (
    <span className={cn('text-muted-foreground inline-flex items-center gap-1 text-xs', className)}>
      <Navigation className="h-3.5 w-3.5" />
      {formatDistance(km)} away
    </span>
  );
}
