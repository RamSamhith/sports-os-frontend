import { Clock } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

export interface LastUpdatedProps {
  at: string;
  className?: string;
}

export function LastUpdated({ at, className }: LastUpdatedProps) {
  return (
    <span className={cn('text-muted-foreground inline-flex items-center gap-1 text-xs', className)}>
      <Clock className="h-3.5 w-3.5" />
      Updated {formatRelativeTime(at)}
    </span>
  );
}
