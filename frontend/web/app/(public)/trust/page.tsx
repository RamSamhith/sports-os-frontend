import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trust & Safety',
  description: 'Trust and safety policies for the SportsOS platform.',
};

export default function TrustPage() {
  return (
    <Section>
      <Container size="md">
        <Breadcrumbs
          items={[{ label: 'Home', href: '/' }, { label: 'Trust & Safety' }]}
          className="mb-4"
        />
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Trust &amp; Safety</h1>
        <p className="text-muted-foreground mt-1 text-sm">Last updated: June 2026</p>

        <div className="prose prose-neutral mt-8 flex flex-col gap-6 text-sm text-pretty">
          <section>
            <h2 className="text-lg font-semibold">Our Commitment</h2>
            <p>
              Trust is at the core of SportsOS. We are committed to creating a safe and
              reliable platform where athletes, parents, academies, and coaches can connect
              with confidence.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Verified Listings</h2>
            <p>
              Academies and coaches on SportsOS go through a verification process. Verified
              listings display a trust badge indicating their verification status. We encourage
              users to prefer verified providers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Review Guidelines</h2>
            <p>
              Reviews and ratings on SportsOS come from real users who have interacted with
              listed academies or coaches. We do not permit fake reviews or paid positive
              ratings. Reviews that violate our guidelines are removed.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Data Protection</h2>
            <p>
              Your personal information is protected with industry-standard security measures.
              We never sell your data to third parties. Please review our{' '}
              <Link href="/privacy" className="text-foreground underline">Privacy Policy</Link> for
              full details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Reporting Issues</h2>
            <p>
              If you encounter a listing that appears inaccurate, unsafe, or in violation of
              our policies, please report it through the platform. Our team reviews all reports
              promptly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Safe Enquiries</h2>
            <p>
              When you send an enquiry through SportsOS, your contact details are shared only
              with the relevant academy or coach for the purpose of responding to your enquiry.
              We recommend meeting in person and verifying credentials before committing to any
              programme.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Children&apos;s Safety</h2>
            <p>
              For users under 18, a parent or guardian must manage the account. We collect
              only the minimum information needed to provide the service and do not share
              children&apos;s data with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Contact</h2>
            <p>
              For trust and safety concerns, please reach out through our{' '}
              <Link href="/contact" className="text-foreground underline">contact page</Link>.
            </p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
