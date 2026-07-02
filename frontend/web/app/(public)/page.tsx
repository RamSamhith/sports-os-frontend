import dynamic from 'next/dynamic';
import { Hero } from '@/components/home/hero';
import { FeaturedAcademies } from '@/components/home/featured-academies';
import { FeaturedCoaches } from '@/components/home/featured-coaches';
import { TrustSection } from '@/components/home/trust-section';
import { StatsSection } from '@/components/home/stats-section';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { CtaSection } from '@/components/home/cta-section';
import { RecentlyViewed } from '@/components/home/recently-viewed';
import { HomepageAuthModal } from '@/components/auth/homepage-auth-modal';
import { siteConfig } from '@/config/site';

const FeaturedSports = dynamic(
  () => import('@/components/home/featured-sports').then((m) => m.FeaturedSports),
  { ssr: false, loading: () => <div className="py-8" /> }
);

const CitiesSection = dynamic(
  () => import('@/components/home/cities-section').then((m) => m.CitiesSection),
  { ssr: false, loading: () => <div className="py-8" /> }
);

const PersonalizedHome = dynamic(
  () => import('@/components/home/personalized-home').then((m) => m.PersonalizedHome),
  { ssr: false }
);

export default function HomePage() {
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
      <PersonalizedHome />
      <FeaturedAcademies />
      <RecentlyViewed />
      <CitiesSection />
      <FeaturedSports />
      <FeaturedCoaches />
      <TrustSection />
      <StatsSection />
      <TestimonialsSection />
      <CtaSection />
      <HomepageAuthModal />
    </>
  );
}
