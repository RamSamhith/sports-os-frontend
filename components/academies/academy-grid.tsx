import { AcademyCardPlaceholder } from './academy-card-placeholder';

export function AcademyGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <AcademyCardPlaceholder key={i} />
      ))}
    </div>
  );
}
