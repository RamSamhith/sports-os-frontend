/**
 * Analytics event definitions.
 * All events are tracked via PostHog (consent-gated).
 */
import { track } from '@/components/providers/posthog-provider';

// ─── Page Events ────────────────────────────────────────────

export function trackPageView(route: string, referrer?: string) {
  track('$pageview', { $current_url: route, referrer });
}

// ─── Search Events ──────────────────────────────────────────

export function trackSearch(query: string, resultsCount: number, tab?: string) {
  track('search', { query, results_count: resultsCount, tab });
}

export function trackSearchResultClick(query: string, resultType: string, resultId: string, position: number) {
  track('search_result_click', { query, result_type: resultType, result_id: resultId, position });
}

// ─── Academy Events ─────────────────────────────────────────

export function trackAcademyView(slug: string, name: string, city: string) {
  track('academy_view', { slug, name, city });
}

export function trackAcademyCardClick(slug: string, position: number, source: string) {
  track('academy_card_click', { slug, position, source });
}

export function trackEnquirySubmit(academyId: string, academyName: string, sport: string) {
  track('enquiry_submit', { academy_id: academyId, academy_name: academyName, sport });
}

// ─── Shortlist Events ───────────────────────────────────────

export function trackShortlistAdd(itemId: string, itemType: string, itemName: string) {
  track('shortlist_add', { item_id: itemId, item_type: itemType, item_name: itemName });
}

export function trackShortlistRemove(itemId: string, itemType: string) {
  track('shortlist_remove', { item_id: itemId, item_type: itemType });
}

export function trackShortlistView(itemCount: number) {
  track('shortlist_view', { item_count: itemCount });
}

// ─── Compare Events ─────────────────────────────────────────

export function trackCompareAdd(itemId: string, itemType: string, itemName: string) {
  track('compare_add', { item_id: itemId, item_type: itemType, item_name: itemName });
}

export function trackCompareRemove(itemId: string, itemType: string) {
  track('compare_remove', { item_id: itemId, item_type: itemType });
}

export function trackCompareView(itemCount: number) {
  track('compare_view', { item_count: itemCount });
}

// ─── Auth Events ────────────────────────────────────────────

export function trackSignup(method: string) {
  track('signup', { method });
}

export function trackLogin(method: string) {
  track('login', { method });
}

export function trackLogout() {
  track('logout');
}

export function trackOAuthAttempt(provider: string) {
  track('oauth_attempt', { provider });
}

export function trackOAuthSuccess(provider: string) {
  track('oauth_success', { provider });
}

export function trackOAuthError(provider: string, error: string) {
  track('oauth_error', { provider, error });
}

// ─── Navigation Events ──────────────────────────────────────

export function trackNavigation(source: string, destination: string) {
  track('navigation', { source, destination });
}

export function trackSportClick(sportSlug: string, position: number, source: string) {
  track('sport_click', { sport_slug: sportSlug, position, source });
}

export function trackCityClick(cityName: string, position: number) {
  track('city_click', { city_name: cityName, position });
}

// ─── Engagement Events ──────────────────────────────────────

export function trackCarouselSwipe(direction: string, section: string) {
  track('carousel_swipe', { direction, section });
}

export function trackFilterApply(filterType: string, filterValue: string) {
  track('filter_apply', { filter_type: filterType, filter_value: filterValue });
}

export function trackScrollDepth(percentage: number, page: string) {
  track('scroll_depth', { percentage, page });
}

// ─── Error Events ───────────────────────────────────────────

export function trackError(errorType: string, message: string, page?: string) {
  track('error', { error_type: errorType, message, page });
}

export function trackApiError(endpoint: string, statusCode: number, message: string) {
  track('api_error', { endpoint, status_code: statusCode, message });
}

// ─── Guest Events ───────────────────────────────────────────

export function trackGuestStarted() {
  track('guest_started');
}

export function trackGuestSearch(query: string, resultsCount: number) {
  track('guest_search', { query, results_count: resultsCount });
}

export function trackGuestShortlist(itemId: string, itemType: string, itemName: string) {
  track('guest_shortlist', { item_id: itemId, item_type: itemType, item_name: itemName });
}

export function trackGuestCompare(itemCount: number) {
  track('guest_compare', { item_count: itemCount });
}

export function trackGuestConversion(method: string) {
  track('guest_conversion', { method });
}

// ─── Feedback Events ────────────────────────────────────────

export function trackFeedback(type: string, message: string, page?: string) {
  track('feedback', { type, message, page });
}
