import { AcademyCardPlaceholder } from './academy-card-placeholder';
import { AcademyCardSkeleton } from '@/components/feedback/skeletons';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { Inbox, AlertTriangle } from 'lucide-react';
import type { Academy } from '@/types/domain/academy';

interface AcademyGridProps {
  academies: Academy[];
  loading?: boolean;
  error?: { message: string } | null;
  onRetry?: () => void;
}

export function AcademyGrid({ academies, loading, error, onRetry }: AcademyGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        description="Try expanding your search radius or removing some filters."
      />
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {academies.map((academy) => (
        <AcademyCardPlaceholder key={academy.id} academy={academy} />
      ))}
    </div>
  );
}
