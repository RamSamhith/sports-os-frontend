import { Clock } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

export interface LastUpdatedProps {
  at?: string | null;
  className?: string;
}

export function LastUpdated({ at, className }: LastUpdatedProps) {
  const text = at ? formatRelativeTime(at) : '';
  if (!text) return null;
  return (
    <span className={cn('text-muted-foreground inline-flex items-center gap-1 text-xs', className)}>
      <Clock className="h-3.5 w-3.5" />
      Updated {text}
    </span>
  );
}
