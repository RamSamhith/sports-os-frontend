/**
 * Static sport taxonomy placeholder. The real taxonomy will be data-driven in MVP.
 */
export interface SportTaxonomyEntry {
  slug: string;
  name: string;
  category: string;
}

export const sportTaxonomy: SportTaxonomyEntry[] = [
  { slug: 'cricket', name: 'Cricket', category: 'team' },
  { slug: 'football', name: 'Football', category: 'team' },
  { slug: 'basketball', name: 'Basketball', category: 'team' },
  { slug: 'badminton', name: 'Badminton', category: 'racquet' },
  { slug: 'tennis', name: 'Tennis', category: 'racquet' },
  { slug: 'table-tennis', name: 'Table Tennis', category: 'racquet' },
  { slug: 'swimming', name: 'Swimming', category: 'aquatic' },
  { slug: 'athletics', name: 'Athletics', category: 'athletics' },
  { slug: 'wrestling', name: 'Wrestling', category: 'combat' },
  { slug: 'boxing', name: 'Boxing', category: 'combat' },
  { slug: 'karate', name: 'Karate', category: 'combat' },
  { slug: 'judo', name: 'Judo', category: 'combat' },
  { slug: 'kabaddi', name: 'Kabaddi', category: 'team' },
  { slug: 'hockey', name: 'Hockey', category: 'team' },
  { slug: 'chess', name: 'Chess', category: 'individual' },
  { slug: 'skating', name: 'Skating', category: 'individual' },
  { slug: 'archery', name: 'Archery', category: 'individual' },
  { slug: 'shooting', name: 'Shooting', category: 'individual' },
  { slug: 'yoga', name: 'Yoga', category: 'individual' },
  { slug: 'gymnastics', name: 'Gymnastics', category: 'individual' },
];
