import { cn } from '@/lib/utils/cn';

export function Kbd({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        'border-border/60 bg-muted/60 text-muted-foreground inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] tracking-wide',
        className,
      )}
      {...props}
    />
  );
}
