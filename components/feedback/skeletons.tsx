import { Skeleton } from '@/components/ui/skeleton';

export function AcademyCardSkeleton() {
  return (
    <div className="border-border/60 bg-card/50 flex flex-col gap-3 rounded-xl border p-4">
      <Skeleton className="aspect-[16/10] w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
      <div className="mt-2 flex gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
}

export function CoachCardSkeleton() {
  return (
    <div className="border-border/60 bg-card/50 flex items-center gap-3 rounded-xl border p-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function SportCardSkeleton() {
  return (
    <div className="border-border/60 bg-card/50 flex flex-col gap-2 rounded-xl border p-4">
      <Skeleton className="h-8 w-8 rounded-md" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-10 w-full rounded-md" />
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  );
}

export function FullPageSkeleton() {
  return (
    <div className="flex flex-col gap-6 py-10">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <AcademyCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
