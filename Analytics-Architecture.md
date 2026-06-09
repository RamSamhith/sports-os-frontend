# Analytics Architecture

## Purpose

Measure the discovery → enquiry funnel, evaluate trust and comparison behavior, and provide operational insight to admins. MVP is privacy-respecting, consent-gated, and lean.

## Principles

- Consent first: no event fires until the user grants analytics consent
- Minimal, meaningful events — quality over volume
- Server-side is the source of truth for business events (enquiry, lead)
- Client-side captures product/interaction events
- PII never leaves the server unmasked
- Vendor-neutral schema: events are versioned and self-describing
- Reversible: a user can withdraw consent and have their events purged on request

## Consent Model

Categories:

- `essential` — always on (auth, security, enquiry delivery)
- `analytics` — product usage, page views, search behavior
- `marketing` — campaigns, attribution
- `whatsapp` — transactional WhatsApp messages for enquiry confirmations

Consent is stored as `ConsentRecord` per user/session. Client provider reads consent and gates event emission. Server events are emitted regardless for essential flows but strip identifiers when consent is absent.

## Event Taxonomy (MVP)

Naming: `domain.action` (snake_case), versioned via `schema_version`.

Page / Discovery

- `page.view` { route, referrer, viewport, consent }
- `home.cta_click` { cta_id, location }
- `search.submit` { query, results_count, filters, location }
- `search.suggest_click` { query, suggestion, position }
- `search.empty` { query, filters, location }
- `filter.apply` { entity, filters, results_count }
- `filter.clear` { entity, cleared_count }
- `list.scroll_depth` { entity, depth_pct, page }
- `list.infinite_load` { entity, page, results_count }

Detail / Trust

- `detail.view` { entity, id, source, location }
- `detail.trust_badge_view` { entity, id, badge_type }
- `detail.contact_click` { entity, id, channel }
- `detail.share` { entity, id, channel }

Compare / Shortlist

- `compare.add` { entity, id, source }
- `compare.remove` { entity, id }
- `compare.view` { ids[], source }
- `shortlist.add` { entity, id, source, child_id? }
- `shortlist.remove` { entity, id, child_id? }
- `shortlist.view` { child_id? }

Enquiry / Lead (server-emitted, source of truth)

- `enquiry.submit` { entity, id, intent, sport, city, lead_id, consent_flags }
- `enquiry.delivered` { lead_id, channel, latency_ms }
- `enquiry.failed` { lead_id, reason }
- `enquiry.whatsapp_confirmed` { lead_id }
- `lead.status_change` { lead_id, from, to, actor }
- `lead.assigned` { lead_id, to }

Location

- `location.detect` { source: gps | manual | ip, success, city }
- `location.change` { from_city, to_city, source }
- `location.radius_change` { from_km, to_km, reason: manual | auto_expand }

Auth / Profile

- `auth.login` { method, success }
- `auth.register` { method, role }
- `profile.child_add` { child_id }
- `profile.child_switch` { child_id }

Errors / Performance

- `error.client` { message, route, stack_hash }
- `perf.web_vital` { metric, value, route }

## Data Model

Event (server)

- id, schema_version
- name, properties (JSON)
- user_id? (hashed if no consent), session_id
- occurred_at, received_at
- route, referrer, ua_class
- consent_flags
- ip_hash, ua_hash

Event (client → batched)

- queue persisted in IndexedDB
- flushed on visibility hidden, on interval (15s), on page unload
- retried with backoff

## Collection Architecture

Client

- `AnalyticsProvider` initializes with consent
- `useTrack()` hook for component events
- `TrackedLink` / `TrackedCTA` wrappers for declarative events
- Bounded queue, dropped on quota exceeded (never block UI)

Server

- Route handlers / server actions emit business events directly
- Edge function for `page.view` capture (lightweight, no PII)
- Idempotency key for retry safety

Transport

- Primary: server `/api/events` (POST, JSON, batched)
- Fallback: navigator.sendBeacon on unload
- Backpressure: drop oldest non-essential, keep essential

## Pipelines

- Hot path: events → ingestion API → durable store (e.g., Postgres event table in MVP)
- Cold path: nightly rollup into analytics tables (see Dashboards)
- Export: admin CSV export for key funnels (audit-logged)

## Dashboards (Internal)

Funnel

- Sessions → Search → Detail → Compare/Shortlist → Enquiry → Delivered → WhatsApp confirmed

Discovery

- Top searches, zero-result searches, filter usage
- Top cities, top sports, radius expansion rate

Trust

- Verified vs unverified detail views
- Contact click rate by verification status
- Last-updated impact on engagement

Comparison

- Compare tray additions/removals
- Compare view conversion to enquiry
- Most compared attribute differences

Leads

- Leads by city, sport, intent
- Time-to-first-contact, time-to-trial
- Conversion to enrolled (manual mark)

Operational

- Enquiry failure rate
- p95 latency per route
- Cache hit ratio
- Error rate by route

## Privacy

- No raw PII in event properties
- Phone/email hashed at emission when not essential
- IP stored as hash with daily salt rotation
- Consent withdrawal → soft-delete user events within 30 days
- Data retention: 18 months for analytics, indefinite for lead records (business records)

## Performance

- Client bundle: < 8KB gzipped for analytics provider
- No render-blocking scripts
- Use `requestIdleCallback` for non-critical instrumentation
- Web vitals sampled (10% of sessions) to control volume

## Testing

- Unit: event name validation, schema_version
- Integration: provider gating by consent, batched flush
- E2E: enquiry funnel emits correct sequence
- Contract: server event schema fixtures

## MVP Boundaries

- No BI tool integration in MVP (Postgres-backed dashboards)
- No real-time streaming in MVP
- No predictive/ML scoring in MVP
- No marketing attribution in MVP beyond `utm_*` capture
