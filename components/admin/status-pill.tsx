import { cn } from '@/lib/utils/cn';

export function StatusPill({
  status,
  className,
}: {
  status: 'new' | 'verified' | 'pending' | 'rejected' | 'suspended' | 'contacted' | 'qualified' | 'trial_scheduled' | 'converted' | 'lost' | 'published' | 'draft';
  className?: string;
}) {
  const tone = (() => {
    switch (status) {
      case 'verified':
      case 'converted':
      case 'published':
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
      case 'pending':
      case 'contacted':
      case 'qualified':
      case 'trial_scheduled':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
      case 'rejected':
      case 'suspended':
      case 'lost':
        return 'border-destructive/40 bg-destructive/10 text-destructive';
      default:
        return 'border-border bg-muted text-muted-foreground';
    }
  })();
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-widest uppercase',
        tone,
        className,
      )}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}
