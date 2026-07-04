'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Hero } from '@/components/home/hero';
import { PersonalizedHome } from '@/components/home/personalized-home';
import { TrustSection } from '@/components/home/trust-section';
import { siteConfig } from '@/config/site';
import { useAuth } from '@/lib/hooks/use-auth';

const FeaturedSports = dynamic(
  () => import('@/components/home/featured-sports').then((m) => m.FeaturedSports),
  { ssr: false, loading: () => <div className="h-8" /> }
);

const CitiesSection = dynamic(
  () => import('@/components/home/cities-section').then((m) => m.CitiesSection),
  { ssr: false, loading: () => <div className="h-8" /> }
);

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, onboardingCompleted } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated && !onboardingCompleted) {
      router.replace('/onboarding/role');
    }
  }, [isLoading, isAuthenticated, onboardingCompleted, router]);

  if (isAuthenticated && !onboardingCompleted) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />

      <div className="space-y-10 pb-12">
        <PersonalizedHome />
        <FeaturedSports />
        <CitiesSection />
        <TrustSection />
      </div>
    </>
  );
}
