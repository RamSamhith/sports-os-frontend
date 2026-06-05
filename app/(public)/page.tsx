import { Hero } from '@/components/home/hero';
import { SearchSection } from '@/components/home/search-section';
import { StatsSection } from '@/components/home/stats-section';
import { FeaturedSports } from '@/components/home/featured-sports';
import { FeaturedAcademies } from '@/components/home/featured-academies';
import { FeaturedCoaches } from '@/components/home/featured-coaches';
import { CtaSection } from '@/components/home/cta-section';
import { PageTransition } from '@/components/motion/page-transition';

export default function HomePage() {
  return (
    <PageTransition>
      <Hero />
      <SearchSection />
      <StatsSection />
      <FeaturedSports />
      <FeaturedAcademies />
      <FeaturedCoaches />
      <CtaSection />
    </PageTransition>
  );
}
