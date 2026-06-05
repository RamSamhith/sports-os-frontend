import { CoachCardPlaceholder } from './coach-card-placeholder';

export function CoachGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CoachCardPlaceholder key={i} />
      ))}
    </div>
  );
}
