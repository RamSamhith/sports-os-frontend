import { SportCard } from './sport-card';
import { SportCardSkeleton } from '@/components/feedback/skeletons';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { Inbox, AlertTriangle } from 'lucide-react';
import type { Sport } from '@/types/domain/sport';

interface SportGridProps {
  sports: Sport[];
  loading?: boolean;
  error?: { message: string } | null;
  onRetry?: () => void;
  onClear?: () => void;
  clearLabel?: string;
}

export function SportGrid({
  sports,
  loading,
  error,
  onRetry,
  onClear,
  clearLabel = 'Clear search',
}: SportGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SportCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <ErrorState
        icon={<AlertTriangle className="h-5 w-5" />}
        title="Failed to load sports"
        description={error.message || 'Please try again in a moment.'}
        onRetry={onRetry}
      />
    );
  }
  if (sports.length === 0) {
    return (
      <EmptyState
        icon={<Inbox className="h-5 w-5" />}
        title="No sports found"
        description="Try a different name or category."
        action={
          onClear ? (
            <button
              type="button"
              onClick={onClear}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              {clearLabel}
            </button>
          ) : null
        }
      />
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {sports.map((sport) => (
        <SportCard key={sport.id} sport={sport} />
      ))}
    </div>
  );
}
