import type { ConsentCategory } from './consent';

export type AnalyticsEventName =
  | 'page.view'
  | 'home.cta_click'
  | 'search.submit'
  | 'search.suggest_click'
  | 'search.empty'
  | 'filter.apply'
  | 'filter.clear'
  | 'list.scroll_depth'
  | 'list.infinite_load'
  | 'detail.view'
  | 'detail.trust_badge_view'
  | 'detail.contact_click'
  | 'detail.share'
  | 'compare.add'
  | 'compare.remove'
  | 'compare.view'
  | 'shortlist.add'
  | 'shortlist.remove'
  | 'shortlist.view'
  | 'enquiry.submit'
  | 'enquiry.delivered'
  | 'enquiry.failed'
  | 'enquiry.whatsapp_confirmed'
  | 'lead.status_change'
  | 'lead.assigned'
  | 'location.detect'
  | 'location.change'
  | 'location.radius_change'
  | 'auth.login'
  | 'auth.register'
  | 'guest.started'
  | 'guest.search'
  | 'guest.shortlist'
  | 'guest.compare'
  | 'guest.conversion'
  | 'auth.forgot_password_started'
  | 'auth.password_reset_success'
  | 'auth.otp_login'
  | 'profile.child_add'
  | 'profile.child_switch'
  | 'error.client'
  | 'perf.web_vital';

export interface AnalyticsEventBase {
  schemaVersion: string;
  name: AnalyticsEventName;
  occurredAt: string;
  route?: string;
  referrer?: string;
  consentFlags?: Partial<Record<ConsentCategory, boolean>>;
}

export type AnalyticsEvent =
  | (AnalyticsEventBase & { name: 'page.view'; properties: { viewport?: string } })
  | (AnalyticsEventBase & { name: 'search.submit'; properties: { query: string; resultsCount: number; filters: Record<string, unknown>; location?: string } })
  | (AnalyticsEventBase & { name: 'enquiry.submit'; properties: { entity: 'academy' | 'coach'; id: string; intent: string; sport: string; city: string; leadId: string } })
  | (AnalyticsEventBase & { name: 'compare.add' | 'compare.remove'; properties: { entity: 'academy' | 'coach'; id: string; source: string } })
  | (AnalyticsEventBase & { name: 'shortlist.add' | 'shortlist.remove'; properties: { entity: 'academy' | 'coach' | 'sport'; id: string; source: string; childId?: string } })
  | (AnalyticsEventBase & { name: 'detail.view'; properties: { entity: 'academy' | 'coach' | 'sport'; id: string; source: string; location?: string } })
  | (AnalyticsEventBase & { name: AnalyticsEventName; properties: Record<string, unknown> });

export interface AnalyticsEventInput {
  name: AnalyticsEventName;
  properties?: Record<string, unknown>;
}
