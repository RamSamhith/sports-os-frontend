import { cn } from '@/lib/utils/cn';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn('bg-muted/60 relative overflow-hidden rounded-md', 'after:absolute after:inset-0 after:translate-x-[-100%] after:bg-gradient-to-r after:from-transparent after:via-white/5 after:to-transparent after:animate-[shimmer_1.6s_infinite]', className)}
      {...props}
    />
  );
}

export { Skeleton };
