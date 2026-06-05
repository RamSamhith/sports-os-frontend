import { sportTaxonomy } from '@/lib/constants/sport-taxonomy';
import { SportCard } from './sport-card';

export function SportGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {sportTaxonomy.map((s) => (
        <SportCard key={s.slug} slug={s.slug} name={s.name} category={s.category} />
      ))}
    </div>
  );
}
