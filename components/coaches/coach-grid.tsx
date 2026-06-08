import { CoachCardPlaceholder } from './coach-card-placeholder';
import { CoachCardSkeleton } from '@/components/feedback/skeletons';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { Button } from '@/components/ui/button';
import { Inbox, AlertTriangle } from 'lucide-react';
import type { Coach } from '@/types/domain/coach';

interface CoachGridProps {
  coaches: Coach[];
  loading?: boolean;
  error?: { message: string } | null;
  onRetry?: () => void;
  onClear?: () => void;
  clearLabel?: string;
}

export function CoachGrid({
  coaches,
  loading,
  error,
  onRetry,
  onClear,
  clearLabel = 'Clear filters',
}: CoachGridProps) {
  if (loading) {
    return (
      <div aria-busy="true" aria-label="Loading coaches" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CoachCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <ErrorState
        icon={<AlertTriangle className="h-5 w-5" />}
        title="Failed to load coaches"
        description={error.message || 'Please try again in a moment.'}
        onRetry={onRetry}
      />
    );
  }
  if (coaches.length === 0) {
    return (
      <EmptyState
        icon={<Inbox className="h-5 w-5" />}
        title="No coaches found"
        description="Try a different name, city, or sport."
        action={
          onClear ? (
            <Button size="sm" onClick={onClear}>
              {clearLabel}
            </Button>
          ) : null
        }
      />
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {coaches.map((coach) => (
        <CoachCardPlaceholder key={coach.id} coach={coach} />
      ))}
    </div>
  );
}
