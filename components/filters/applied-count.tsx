import { cn } from '@/lib/utils/cn';

export function AppliedCount({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null;
  return (
    <span className={cn('text-muted-foreground text-xs', className)}>
      {count} filter{count === 1 ? '' : 's'} applied
    </span>
  );
}
