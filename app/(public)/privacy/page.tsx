import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for SportsOS.',
};

export default function PrivacyPage() {
  return (
    <Section>
      <Container size="md">
        <Breadcrumbs
          items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]}
          className="mb-4"
        />
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Privacy Policy</h1>
        <p className="text-muted-foreground mt-1 text-sm">Last updated: June 2026</p>

        <div className="prose prose-neutral dark:prose-invert mt-8 flex flex-col gap-6 text-sm text-pretty">
          <section>
            <h2 className="text-lg font-semibold">1. Information We Collect</h2>
            <p>
              We collect information you provide directly, such as your name, email, phone number,
              and profile details. We also collect usage data including search queries, pages visited,
              and interactions with the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">2. How We Use Your Information</h2>
            <p>
              We use your information to provide and improve the Platform, send transactional
              communications (such as enquiry confirmations), personalise your experience, and
              analyse usage patterns.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">3. Sharing of Information</h2>
            <p>
              When you submit an enquiry, your contact details are shared with the relevant academy
              or coach so they can respond to you. We do not sell your personal information to third
              parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">4. Data Storage</h2>
            <p>
              Your data is stored securely on our servers. We use industry-standard encryption and
              access controls to protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">5. Your Rights</h2>
            <p>
              You can access, update, or delete your personal information through your profile
              settings. You may also request a copy of all data we hold about you by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">6. Cookies</h2>
            <p>
              The Platform uses local storage and cookies to maintain your session, remember your
              preferences, and analyse usage. You can control cookie settings through your browser.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">7. Children&apos;s Privacy</h2>
            <p>
              For users under 18, a parent or guardian must manage the account. We collect only the
              minimum information needed to provide the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">8. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. We will notify you of significant changes
              through the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">9. Contact</h2>
            <p>
              For privacy-related questions, please reach out through the Platform&apos;s enquiry
              system.
            </p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
