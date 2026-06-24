'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { EnquiryForm } from '@/components/enquiry/enquiry-form';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { ProfileSkeleton } from '@/components/feedback/skeletons';
import { getAcademy } from '@/lib/api/academies';
import { getCoach } from '@/lib/api/coaches';

export default function EnquiryPage() {
  const params = useParams<{ type: string; id: string }>();
  const type = params.type as 'academy' | 'coach';
  const slug = params.id;

  const [target, setTarget] = React.useState<{ name: string; id: string } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);

  React.useEffect(() => {
    if (type !== 'academy' && type !== 'coach') { setNotFound(true); return; }
    let cancelled = false;

    const fetchTarget = async () => {
      try {
        const res = type === 'academy' ? await getAcademy(slug) : await getCoach(slug);
        if (cancelled) return;
        if (res.ok && res.data) {
          setTarget({ name: (res.data as { name: string }).name, id: res.data.id });
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
          <p className="text-muted-foreground text-center py-12">Not found.</p>
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
            {
              label: type === 'academy' ? 'Academies' : 'Coaches',
              href: type === 'academy' ? '/academies' : '/coaches',
            },
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
          {target && <EnquiryForm targetType={type} targetId={target.id} />}
        </div>
      </Container>
    </Section>
  );
}
