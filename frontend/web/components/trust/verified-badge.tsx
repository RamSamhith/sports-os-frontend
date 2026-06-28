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
      ? 'border-warning/30 bg-warning/10 text-warning'
      : 'border-success/30 bg-success/10 text-success';
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
