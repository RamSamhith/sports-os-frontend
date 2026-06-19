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

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border-border/60 bg-card/50 rounded-xl border p-4">
          <Skeleton className="mb-2 h-7 w-12" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

export function CityCardSkeleton() {
  return (
    <div className="border-border/60 bg-card/50 flex h-24 flex-col items-center justify-center gap-1.5 rounded-xl border p-4">
      <Skeleton className="h-5 w-5 rounded-full" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

export function CityCarouselSkeleton() {
  return (
    <div className="scrollbar-none flex gap-3 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <CityCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CompareTableSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-1/3" />
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="border-border/60 bg-card/50 rounded-xl border p-4">
            <Skeleton className="mb-3 h-32 w-full" />
            <Skeleton className="mb-2 h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 flex-1" />
            <Skeleton className="h-3 flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ShortlistSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border-border/60 bg-card/50 flex items-center gap-3 rounded-xl border p-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function AcademyDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="border-border/60 bg-card/50 rounded-xl border p-4">
            <Skeleton className="mb-2 h-4 w-1/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="mt-1 h-3 w-2/3" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-1/4" />
        {Array.from({ length: 3 }).map((_, i) => (
          <CoachCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function CoachDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="h-32 w-full rounded-xl" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        {Array.from({ length: 2 }).map((_, i) => (
          <AcademyCardSkeleton key={i} />
        ))}
      </div>
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
