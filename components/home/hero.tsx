'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/search/search-bar';
import { AuroraBackground } from '@/components/layout/aurora-background';
import { TrackedCTA } from '@/components/analytics/tracked-cta';
import { LocationPicker } from '@/components/location/location-picker';

export function Hero() {
  const router = useRouter();

  const handleSearch = (value: string) => {
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <section className="relative isolate overflow-hidden py-20 md:py-32">
      <AuroraBackground />
      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <span className="border-border/60 bg-card/40 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
          <span className="bg-primary h-1.5 w-1.5 rounded-full" />
          India's Sports Discovery Ecosystem
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance md:text-6xl">
          Discover, compare, and connect with the right sports ecosystem.
        </h1>
        <p className="text-muted-foreground mt-4 max-w-xl text-balance md:text-lg">
          Academies, coaches, and pathways across India — in one trusted place.
        </p>
        <div className="mt-8 w-full max-w-xl">
          <SearchBar onSearch={handleSearch} placeholder="Search by sport, city, or academy name…" />
        </div>
        <div className="mt-4">
          <LocationPicker />
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <TrackedCTA event="home.cta_click" properties={{ cta: 'explore-academies' }} asChild>
            <Link href="/academies">
              Explore academies <ArrowRight className="h-4 w-4" />
            </Link>
          </TrackedCTA>
          <Button asChild variant="outline">
            <Link href="/discover">Discover</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
