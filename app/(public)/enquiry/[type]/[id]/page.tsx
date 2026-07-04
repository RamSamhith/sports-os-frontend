'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { EnquiryForm } from '@/components/enquiry/enquiry-form';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { ProfileSkeleton } from '@/components/feedback/skeletons';
import { getAcademy } from '@/lib/api/academies';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EnquiryPage() {
  const params = useParams<{ type: string; id: string }>();
  const type = params.type as 'academy';
  const slug = params.id;

  const [target, setTarget] = React.useState<{ name: string; id: string } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);

  React.useEffect(() => {
    if (type !== 'academy') { setNotFound(true); return; }
    let cancelled = false;

    const fetchTarget = async () => {
      try {
        const res = await getAcademy(slug);
        if (cancelled) return;
        if (res.ok && res.data) {
          setTarget({ name: res.data.name, id: res.data.id });
        } else {
          setNotFound(true);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchTarget();
    return () => { cancelled = true; };
  }, [type, slug]);

  if (notFound) {
    return (
      <Section>
        <Container size="md">
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-foreground text-lg font-semibold">Academy not found</p>
            <p className="text-muted-foreground text-sm">
              The academy you&apos;re looking for doesn&apos;t exist or may have been removed.
            </p>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/academies">Browse Academies</Link>
              </Button>
              <Button asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  if (loading) {
    return (
      <Section>
        <Container size="md">
          <ProfileSkeleton />
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container size="md">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Academies', href: '/academies' },
            { label: 'Enquiry' },
          ]}
          className="mb-4"
        />
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Enquiry</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Share a few details and we'll pass them along to{' '}
          <span className="text-foreground font-medium">{target?.name}</span>. You'll receive a WhatsApp confirmation.
        </p>
        <div className="mt-6">
          {target && <EnquiryForm targetType="academy" targetId={target.id} />}
        </div>
      </Container>
    </Section>
  );
}
