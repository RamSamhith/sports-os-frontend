import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { EnquiryForm } from '@/components/enquiry/enquiry-form';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { notFound } from 'next/navigation';
import { academyBySlug } from '@/data/academies';
import { coachBySlug } from '@/data/coaches';

export default function EnquiryPage({
  params,
}: {
  params: { type: 'academy' | 'coach'; id: string };
}) {
  if (params.type !== 'academy' && params.type !== 'coach') notFound();
  const slug = params.id;
  const target =
    params.type === 'academy' ? academyBySlug(slug) : coachBySlug(slug);
  if (!target) notFound();

  return (
    <Section>
      <Container size="md">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            {
              label: params.type === 'academy' ? 'Academies' : 'Coaches',
              href: params.type === 'academy' ? '/academies' : '/coaches',
            },
            { label: 'Enquiry' },
          ]}
          className="mb-4"
        />
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Enquiry</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Share a few details and we'll pass them along to{' '}
          <span className="text-foreground font-medium">{target.name}</span>. You'll receive a WhatsApp confirmation.
        </p>
        <div className="mt-6">
          <EnquiryForm targetType={params.type} targetId={target.id} />
        </div>
      </Container>
    </Section>
  );
}
