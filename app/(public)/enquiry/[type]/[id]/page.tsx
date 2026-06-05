import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { EnquiryForm } from '@/components/enquiry/enquiry-form';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';

export default function EnquiryPage({ params }: { params: { type: 'academy' | 'coach'; id: string } }) {
  return (
    <Section>
      <Container size="md">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: params.type === 'academy' ? 'Academies' : 'Coaches', href: params.type === 'academy' ? '/academies' : '/coaches' },
            { label: 'Enquiry' },
          ]}
          className="mb-4"
        />
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Enquiry</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Share a few details and we'll pass them along. You'll receive a WhatsApp confirmation.
        </p>
        <div className="mt-6">
          <EnquiryForm targetType={params.type} targetId={params.id} />
        </div>
      </Container>
    </Section>
  );
}
