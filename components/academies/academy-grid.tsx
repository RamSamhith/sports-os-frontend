import { AcademyCardPlaceholder } from './academy-card-placeholder';
import { AcademyCardSkeleton } from '@/components/feedback/skeletons';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { Button } from '@/components/ui/button';
import { Inbox, AlertTriangle } from 'lucide-react';
import type { Academy } from '@/types/domain/academy';

interface AcademyGridProps {
  academies: Academy[];
  loading?: boolean;
  error?: { message: string } | null;
  onRetry?: () => void;
  onClear?: () => void;
  clearLabel?: string;
  columns?: 1 | 2 | 3;
}

const gridClass = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
} as const;

export function AcademyGrid({
  academies,
  loading,
  error,
  onRetry,
  onClear,
  clearLabel = 'Clear filters',
  columns = 3,
}: AcademyGridProps) {
  const grid = gridClass[columns];
  if (loading) {
    return (
      <div aria-busy="true" aria-label="Loading academies" className={`grid gap-4 ${grid}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <AcademyCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <ErrorState
        icon={<AlertTriangle className="h-5 w-5" />}
        title="Failed to load academies"
        description={error.message || 'Please try again in a moment.'}
        onRetry={onRetry}
      />
    );
  }
  if (academies.length === 0) {
    return (
      <EmptyState
        icon={<Inbox className="h-5 w-5" />}
        title="No academies found"
        description="Try expanding your search or removing some filters."
        action={
          onClear ? (
            <Button size="sm" variant="outline" onClick={onClear}>
              {clearLabel}
            </Button>
          ) : null
        }
      />
    );
  }
  return (
    <div className={`grid gap-4 ${grid}`}>
      {academies.map((academy, i) => (
        <AcademyCardPlaceholder key={academy.id} academy={academy} priority={i === 0} />
      ))}
    </div>
  );
}
