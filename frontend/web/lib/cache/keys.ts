/**
 * Tag-based cache key conventions. Use with revalidateTag in server actions.
 */
export const cacheTags = {
  academies: 'academies',
  academy: (id: string) => `academy:${id}`,
  coaches: 'coaches',
  coach: (id: string) => `coach:${id}`,
  sports: 'sports',
  sport: (slug: string) => `sport:${slug}`,
  leads: 'leads',
  lead: (id: string) => `lead:${id}`,
  enquiries: 'enquiries',
  city: (city: string) => `city:${city.toLowerCase()}`,
  verification: 'verification',
} as const;
