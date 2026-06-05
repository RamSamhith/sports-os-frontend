import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';

const stats = [
  { label: 'Academies', value: '1,200+' },
  { label: 'Verified coaches', value: '850+' },
  { label: 'Sports covered', value: '30+' },
  { label: 'Cities', value: '75+' },
];

export function StatsSection() {
  return (
    <Section spacing="sm">
      <Container size="lg">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="border-border/60 bg-card/40 rounded-xl border p-5 text-center"
            >
              <div className="text-2xl font-semibold tracking-tight md:text-3xl">{s.value}</div>
              <div className="text-muted-foreground mt-1 text-xs tracking-wide uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
