import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface VerifiedBadgeProps {
  status?: 'verified' | 'pending' | 'unverified' | 'rejected';
  className?: string;
  label?: string;
}

export function VerifiedBadge({ status = 'verified', className, label }: VerifiedBadgeProps) {
  if (status === 'unverified' || status === 'rejected') return null;
  const text = label ?? (status === 'pending' ? 'Verification pending' : 'Verified');
  const tone =
    status === 'pending'
      ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
      : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
        tone,
        className,
      )}
    >
      <ShieldCheck className="h-3.5 w-3.5" />
      {text}
    </span>
  );
}
