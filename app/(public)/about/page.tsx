import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'About SportsOS – the discovery platform for sports academies, coaches, and programmes across India.',
};

export default function AboutPage() {
  return (
    <Section>
      <Container size="md">
        <Breadcrumbs
          items={[{ label: 'Home', href: '/' }, { label: 'About' }]}
          className="mb-4"
        />
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">About SportsOS</h1>
        <p className="text-muted-foreground mt-1 text-sm">Last updated: June 2026</p>

        <div className="prose prose-neutral mt-8 flex flex-col gap-6 text-sm text-pretty">
          <section>
            <h2 className="text-lg font-semibold">Our Mission</h2>
            <p>
              SportsOS is on a mission to make sports discovery accessible, transparent, and
              empowering for every athlete and parent in India. We believe every child deserves
              the chance to find the right academy, the right coach, and the right pathway to
              pursue their sporting dreams.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">What We Do</h2>
            <p>
              SportsOS is a discovery platform that connects athletes and parents with sports
              academies, coaches, and programmes across India. We provide search, comparison,
              and enquiry tools so you can make informed decisions about your sporting journey.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">How It Works</h2>
            <p>
              Browse and discover academies and coaches in your area. Compare options side by
              side across ratings, facilities, training levels, and sports offered. When you
              find the right fit, send an enquiry directly through the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">For Athletes</h2>
            <p>
              Explore sports, discover academies near you, compare options, and track your
              sporting journey. Whether you are just starting out or looking to take your
              game to the next level, SportsOS helps you find the right path.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">For Parents</h2>
            <p>
              Manage sports opportunities for your children. Compare academies, track progress,
              plan pathways, and make confident decisions about your child&apos;s sporting
              development — all in one place.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">For Academies &amp; Coaches</h2>
            <p>
              List your academy or coaching programme on SportsOS to reach athletes and parents
              actively searching for sports opportunities. Build trust through verified
              listings and responsive enquiries.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Contact</h2>
            <p>
              Have questions or want to partner with us? Reach out through our{' '}
              <a href="/contact" className="text-foreground underline">contact page</a> or
              send an enquiry through the platform.
            </p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
