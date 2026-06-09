import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for SportsOS.',
};

export default function TermsPage() {
  return (
    <Section>
      <Container size="md">
        <Breadcrumbs
          items={[{ label: 'Home', href: '/' }, { label: 'Terms of Service' }]}
          className="mb-4"
        />
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Terms of Service</h1>
        <p className="text-muted-foreground mt-1 text-sm">Last updated: June 2026</p>

        <div className="prose prose-neutral mt-8 flex flex-col gap-6 text-sm text-pretty">
          <section>
            <h2 className="text-lg font-semibold">1. Acceptance of Terms</h2>
            <p>
              By accessing or using SportsOS (&ldquo;the Platform&rdquo;), you agree to be bound by
              these Terms of Service. If you do not agree, please do not use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">2. Description of Service</h2>
            <p>
              SportsOS is a discovery platform that helps athletes and parents find sports academies,
              coaches, and sports programmes across India. The Platform provides search, comparison,
              and enquiry tools.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials.
              You agree to provide accurate information during registration and to keep it up to date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">4. Acceptable Use</h2>
            <p>
              You agree not to misuse the Platform, interfere with its operation, or attempt to
              access it using unauthorised methods. You will not use the Platform for any unlawful
              purpose.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">5. Intellectual Property</h2>
            <p>
              All content on the Platform, including text, graphics, logos, and software, is the
              property of SportsOS or its licensors and is protected by applicable intellectual
              property laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">6. Limitation of Liability</h2>
            <p>
              SportsOS acts as an intermediary between users and sports service providers. We do not
              guarantee the quality, safety, or legality of any academy, coach, or programme listed
              on the Platform. Your use of listed services is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">7. Modifications</h2>
            <p>
              We reserve the right to update these terms at any time. Continued use of the Platform
              after changes constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">8. Contact</h2>
            <p>
              For questions about these Terms, please reach out through the Platform&apos;s enquiry
              system.
            </p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
