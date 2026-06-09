import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookie policy for the SportsOS platform.',
};

export default function CookiesPage() {
  return (
    <Section>
      <Container size="md">
        <Breadcrumbs
          items={[{ label: 'Home', href: '/' }, { label: 'Cookie Policy' }]}
          className="mb-4"
        />
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Cookie Policy</h1>
        <p className="text-muted-foreground mt-1 text-sm">Last updated: June 2026</p>

        <div className="prose prose-neutral mt-8 flex flex-col gap-6 text-sm text-pretty">
          <section>
            <h2 className="text-lg font-semibold">What Are Cookies</h2>
            <p>
              Cookies are small text files that are stored on your device when you visit
              a website. They help the site remember your preferences and improve your
              browsing experience.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">How We Use Cookies</h2>
            <p>
              SportsOS uses cookies and local storage to maintain your session, remember
              your preferences (such as theme and language), and analyse usage patterns
              to improve the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Essential Cookies</h2>
            <p>
              These cookies are necessary for the platform to function. They enable core
              features such as authentication, session management, and security. You cannot
              opt out of essential cookies as the platform will not work without them.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Analytics Cookies</h2>
            <p>
              Analytics cookies help us understand how visitors interact with the platform.
              This data is aggregated and anonymised. You can opt out of analytics cookies
              through your{' '}
              <a href="/profile/settings" className="text-foreground underline">privacy settings</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Preference Cookies</h2>
            <p>
              Preference cookies remember your settings and choices, such as your selected
              theme, to provide a personalised experience on future visits.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Local Storage</h2>
            <p>
              In addition to cookies, SportsOS uses browser local storage to persist your
              authentication state, profile data, shortlist, compare items, and recent
              searches. This data stays on your device and is not sent to external servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Managing Cookies</h2>
            <p>
              You can control cookies through your browser settings. Most browsers allow
              you to block or delete cookies. Note that blocking essential cookies may
              prevent the platform from functioning correctly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Third-Party Cookies</h2>
            <p>
              SportsOS does not currently use third-party advertising or tracking cookies.
              If this changes in the future, we will update this policy and provide
              appropriate consent mechanisms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Changes to This Policy</h2>
            <p>
              We may update this cookie policy from time to time. Significant changes will
              be communicated through the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Contact</h2>
            <p>
              For questions about our cookie policy, please reach out through our{' '}
              <a href="/contact" className="text-foreground underline">contact page</a>.
            </p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
