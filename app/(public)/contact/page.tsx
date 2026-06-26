import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the SportsOS team.',
};

export default function ContactPage() {
  return (
    <Section>
      <Container size="md">
        <Breadcrumbs
          items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
          className="mb-4"
        />
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Contact Us</h1>
        <p className="text-muted-foreground mt-1 text-sm">Last updated: June 2026</p>

        <div className="prose prose-neutral mt-8 flex flex-col gap-6 text-sm text-pretty">
          <section>
            <h2 className="text-lg font-semibold">Get in Touch</h2>
            <p>
              We&apos;d love to hear from you. Whether you have a question about SportsOS,
              need help with your account, or want to explore partnership opportunities,
              our team is here to help.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">General Enquiries</h2>
            <p>
              For general questions about SportsOS, feature requests, or feedback, please
              send an enquiry through the platform. We aim to respond within 2 business
              days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Academy Partnerships</h2>
            <p>
              Want to list your academy on SportsOS? We welcome
              partnerships with verified sports providers across India. Reach out to
              discuss listing options and verification.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Support</h2>
            <p>
              Need help with your account, enquiries, or profile? Use the enquiry system
              on the platform for the fastest response. Our support team is available
              Monday to Saturday, 9 AM to 6 PM IST.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Trust &amp; Safety</h2>
            <p>
              For reporting issues with listings, reviews, or user conduct, please refer
              to our{' '}
              <Link href="/trust" className="text-foreground underline">Trust &amp; Safety</Link>{' '}
              page or contact us directly through the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Office</h2>
            <p>
              SportsOS is based in India. For postal correspondence, please reach out
              through the platform and we will provide the relevant address.
            </p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
