import { Award } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface CertificationIndicatorProps {
  count: number;
  className?: string;
}

export function CertificationIndicator({ count, className }: CertificationIndicatorProps) {
  if (count <= 0) return null;
  return (
    <span
      className={cn(
        'text-muted-foreground inline-flex items-center gap-1 text-xs',
        className,
      )}
    >
      <Award className="h-3.5 w-3.5" />
      {count} certification{count === 1 ? '' : 's'}
    </span>
  );
}
