import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { academies } from '@/data/academies';
import { coaches } from '@/data/coaches';
import { sports } from '@/data/sports';

const verifiedAcademies = academies.filter((a) => a.verificationStatus === 'verified').length;
const verifiedCoaches = coaches.filter((c) => c.verificationStatus === 'verified').length;
const cities = new Set(academies.map((a) => a.location.city)).size;

function formatCount(n: number) {
  return new Intl.NumberFormat('en-IN').format(n);
}

const stats = [
  { label: 'Academies', value: formatCount(academies.length) },
  { label: 'Verified coaches', value: formatCount(verifiedCoaches) },
  { label: 'Sports covered', value: formatCount(sports.length) },
  { label: 'Cities', value: formatCount(cities) },
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
