import type { AnalyticsEventInput } from '@/types/domain/analytics-event';

export function pageViewEvent(input: { route: string; referrer?: string }): AnalyticsEventInput {
  return { name: 'page.view', properties: { route: input.route, referrer: input.referrer } };
}

export function searchSubmitEvent(input: {
  query: string;
  resultsCount: number;
  filters?: Record<string, unknown>;
  location?: string;
}): AnalyticsEventInput {
  return {
    name: 'search.submit',
    properties: {
      query: input.query,
      resultsCount: input.resultsCount,
      filters: input.filters ?? {},
      location: input.location,
    },
  };
}

export function enquirySubmitEvent(input: {
  entity: 'academy' | 'coach';
  id: string;
  intent: string;
  sport: string;
  city: string;
  leadId: string;
}): AnalyticsEventInput {
  return { name: 'enquiry.submit', properties: input };
}
