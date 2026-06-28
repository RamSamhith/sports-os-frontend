import type { AnalyticsEventName } from '@/types/domain/analytics-event';

export interface AnalyticsContextValue {
  consent: {
    analytics: boolean;
    marketing: boolean;
    whatsapp: boolean;
  };
  track: (input: { name: AnalyticsEventName; properties?: Record<string, unknown> }) => void;
  flush: () => Promise<void>;
  setConsent: (category: 'analytics' | 'marketing' | 'whatsapp', granted: boolean) => void;
}
