# Architecture

## 1. Route Structure

Public Routes (Guest-First, no login required):

- `/` — Home (Hero, Search, Stats, Featured Sports/Academies/Coaches, CTA, Footer)
- `/discover` — Discovery Hub (Academies / Coaches / Sports entry)
- `/academies` — Academy listing (search, filters, grid, infinite scroll)
- `/academies/[slug]` — Academy detail page
- `/coaches` — Coach listing (search, filters, grid, infinite scroll)
- `/coaches/[slug]` — Coach detail page
- `/sports` — Sports grid / exploration
- `/sports/[slug]` — Sport detail (future-ready, competition pathways)
- `/compare` — Side-by-side comparison view (max 3 academies)
- `/shortlist` — Saved academies / coaches / sports (auth required)
- `/enquiry/[type]/[id]` — Enquiry / contact / trial request flow
- `/enquiry/success` — Success state (WhatsApp confirmation)

Auth Routes:

- `/login`
- `/register`
- `/forgot-password`

Private Routes (Authenticated):

- `/profile` — Active user / child switcher root
- `/profile/personal` — Personal information
- `/profile/children` — Child profile management
- `/profile/preferences` — Sport interests, location, goals
- `/profile/saved` — Saved academies / coaches
- `/profile/enquiries` — Enquiry history
- `/profile/settings` — Account settings

System Routes (Internal, see Admin-Architecture.md):

- `/admin` — Admin root (gated, role-checked)
- `/admin/academies`, `/admin/coaches`, `/admin/sports`, `/admin/enquiries`, `/admin/users`, `/admin/verification`, `/admin/analytics`

Future Routes (Designed, Not Implemented):

- `/compare/coaches` — Coach comparison
- `/searches` — Saved searches
- `/notifications` — Notifications center
- `/support/physiotherapy`
- `/support/nutrition`
- `/support/fitness`
- `/command` — Command palette entry

Layout:

- Root layout: persistent Navbar (sticky), Footer, theme provider, location provider, auth provider, analytics provider
- Auth layout: minimal centered layout
- Profile layout: sidebar + active child switcher
- Admin layout: gated, role-protected, separate chrome

## 2. Folder Structure

```
app/
  (public)/
    page.tsx
    discover/
    academies/
    coaches/
    sports/
    compare/
    shortlist/
    enquiry/
  (auth)/
    login/
    register/
    forgot-password/
  (private)/
    profile/
  (admin)/
    admin/
  api/                   # Route handlers (enquiry, lead, search suggest, location)
  layout.tsx
  globals.css
  sitemap.ts
  robots.ts
  manifest.ts
  opengraph-image.tsx

components/
  ui/                    # Shadcn primitives
  layout/                # Navbar, Footer, Container, Section
  home/                  # Hero, SearchSection, Stats, FeaturedX, CTA
  academies/             # AcademyCard, AcademyGrid, AcademyFilters, AcademyDetail
  coaches/               # CoachCard, CoachGrid, CoachFilters, CoachDetail
  sports/                # SportCard, SportGrid, PathwayTimeline
  search/                # SearchBar, SearchSuggestions, RecentSearches
  filters/               # FilterDrawer, FilterChips, AppliedCount
  compare/               # CompareTray, CompareTable
  shortlist/             # ShortlistButton, ShortlistList
  enquiry/               # EnquiryForm, EnquirySuccess, EnquiryFailure
  profile/               # ChildSwitcher, ChildCard, ProfileSidebar
  motion/                # Reveal, Hover, PageTransition, SharedLayout
  feedback/              # Skeleton, EmptyState, ErrorState, OfflineState
  trust/                 # VerifiedBadge, CertificationIndicator, LastUpdated
  location/              # LocationPicker, RadiusControl, NearbyIndicator
  seo/                   # JsonLd, Meta, Breadcrumbs
  analytics/             # EventBoundary, TrackedLink, TrackedCTA
  admin/                 # Admin tables, drawers, detail editors

lib/
  api/                   # Data fetching clients
  hooks/                 # useShortlist, useLocation, useCompare, useDebounce, useAnalytics
  utils/                 # cn, formatters, validators
  constants/             # routes, filters, radii, sports taxonomy
  types/                 # Shared TS types / DTOs
  seo/                   # Structured data builders, metadata helpers
  analytics/             # Event names, page helpers, consent
  cache/                 # Cache keys, revalidation helpers
  monitoring/            # Logger, error reporter, perf reporter
  security/              # Rate limit, csrf, sanitizers

styles/
  tokens.css             # Design tokens (colors, type, spacing, radius, motion)
  globals.css

public/
  icons/
  images/
  fonts/                 # Geist, Inter
  robots.txt (delegated)
  sitemap.xml (generated)

config/
  site.ts
  nav.ts
  theme.ts
  env.ts                 # Typed env access

types/
  domain/                # Academy, Coach, Sport, Enquiry, User, Child, Shortlist, Lead
  api/                   # Request/response types
  analytics/             # Event payload types
```

## 3. Component Hierarchy

App Root
├── ThemeProvider
├── LocationProvider
├── AuthProvider
├── ShortlistProvider
├── CompareProvider
├── AnalyticsProvider (consent-gated)
├── ErrorBoundary / GlobalErrorBoundary
├── ConsentBanner (cookies / analytics)
└── RouteGroupLayout
    ├── Navbar (sticky)
    │   ├── Logo
    │   ├── PrimaryNav (Discover, Academies, Coaches, Sports)
    │   ├── SearchTrigger
    │   ├── LocationIndicator
    │   ├── ShortlistIndicator
    │   └── ProfileMenu
    ├── Main (page content)
    └── Footer

Home
├── Hero
│   ├── Headline
│   ├── Subheadline
│   ├── PrimarySearch
│   └── LocationChip
├── SearchSection
│   ├── SearchBar (debounced)
│   ├── SearchSuggestions
│   └── RecentSearches
├── StatsSection
│   └── StatCard (repeating)
├── FeaturedSports
│   └── SportCard
├── FeaturedAcademies
│   └── AcademyCard
├── FeaturedCoaches
│   └── CoachCard
└── CTA

Discover
├── CategoryNav (Academies / Coaches / Sports)
└── CategoryLanding

Academies Listing
├── AcademyFilters (sticky)
│   ├── FilterChips
│   ├── AppliedCount
│   └── ClearAll
├── AcademyGrid
│   └── AcademyCard (repeating)
│       ├── CoverImage
│       ├── VerifiedBadge
│       ├── DistanceIndicator
│       ├── ShortlistButton
│       └── CompareButton
├── InfiniteScrollSentinel
└── CompareTray (sticky, when active)

Academy Detail
├── Hero (cover, name, verified badge, last updated)
├── PrimaryActions (Contact, Save, Compare, Request Trial)
├── OverviewSection (description, location, contact)
├── SportsOffered
├── FacilitiesAndInfrastructure
├── TrainingLevels
├── Certifications
├── AchievementSignals (state/national athletes produced)
├── ReviewsAndRatings
└── RelatedAcademies

Coaches Listing → mirrors Academies with CoachCard / CoachFilters.

Coach Detail → mirrors Academy Detail with coach-specific sections (specialization, experience, sports coached).

Sports
├── SportsGrid
│   └── SportCard
└── SportsExplorationGuidance
    └── Disclaimer

Sport Detail (future-ready)
├── Overview
├── CompetitionPathway (visual timeline)
└── ExplorationGuidance

Compare
├── CompareTable
│   ├── CompareRow (distance, facilities, sports, certifications, experience, ratings)
│   └── CompareColumn (academy)
└── RemoveFromCompare

Shortlist
├── Tabs (Academies / Coaches / Sports)
├── ShortlistList
└── EmptyState

Enquiry
├── EnquiryForm (parent info, child info, sport interest, message)
├── SubmitState
└── SuccessState (WhatsApp confirmation) / FailureState

Profile
├── ProfileSidebar
│   ├── UserInfo
│   └── ChildSwitcher
├── ActiveChildContext
└── ProfileSection (Personal / Children / Preferences / Saved / Enquiries / Settings)

Admin (gated, see Admin-Architecture.md)
├── AdminShell
├── AdminSidebar
└── AdminSection (Academies / Coaches / Sports / Enquiries / Users / Verification / Analytics)

SEO / Cross-cutting
├── JsonLd (Organization, ItemList for listings, SportsActivityFacility for academy, Person for coach, BreadcrumbList)
├── Breadcrumbs
├── MetaTitle / MetaDescription
├── CanonicalLink
├── OpenGraphImage (route-generated)
└── Hreflang (future i18n)

Shared / Cross-cutting
├── Skeleton (Academy, Coach, Sport, Search, Profile, FullPage)
├── EmptyState
├── ErrorState (network, empty results, server)
├── OfflineState
├── MotionReveal
├── PageTransition
├── ConsentBanner
└── Toaster

## 4. Database Entities

User
- id, role (athlete | parent | coach | academy_rep | admin)
- name, email (unique, verified), phone (verified, E.164), avatar
- auth provider, password_hash (if credentials), last_login_at
- created_at, updated_at, deleted_at (soft)
- preferences (location, radius, default sport interests)
- theme preference
- consent flags (analytics, marketing, whatsapp)

Child
- id, parent_id (FK User)
- name, age, gender
- sport_interests[] (FK Sport)
- created_at, updated_at

Academy
- id, slug (unique)
- name, description (sanitized HTML)
- location (address, city, state, country, lat, lng, pincode, geohash)
- contact (phone E.164, email, website URL)
- sports_offered[] (FK Sport)
- facilities[] (ground, court, indoor, outdoor, equipment — typed enum + free notes)
- training_levels[] (beginner, intermediate, advanced, elite)
- batch_information (schedule summary)
- certifications[] (name, issuer, year, document_url?)
- verification_status (unverified | pending | verified | rejected)
- verification_evidence[] (documents, reviewer_id, reviewed_at, notes)
- achievement_signals (state_athletes_produced, national_athletes_produced, competition_participations[], milestones[])
- rating (avg, count) — denormalized cache, recomputed
- cover_image, gallery[]
- status (draft | published | suspended)
- last_updated_at, created_at, indexed_at

Coach
- id, slug (unique)
- name, avatar
- certifications[] (name, issuer, year, document_url?)
- experience_years
- sports_coached[] (FK Sport)
- specialization[]
- academy_id? (FK Academy, optional)
- location (city, state, lat, lng, geohash)
- contact (phone E.164, email)
- verification_status, verification_evidence[]
- rating (avg, count)
- status (draft | published | suspended)
- last_updated_at, created_at

Sport
- id, slug (unique)
- name, description, icon, cover_image
- category (team | individual | combat | racquet | aquatic | athletics | other)
- competition_pathway (district → state → national → international)
- exploration_guidance (age_suitability, physical_requirements, notes)
- status (published | draft)

Review
- id, target_type (academy | coach), target_id
- user_id, rating (1–5), text, created_at
- moderation_status (pending | approved | rejected), moderator_id
- abuse_reports[]

Shortlist
- id, user_id, context_child_id? (FK Child, optional for parents)
- item_type (academy | coach | sport), item_id
- created_at
- unique (user_id, context_child_id, item_type, item_id)

Enquiry
- id, user_id?, child_id?
- target_type (academy | coach), target_id
- intent (contact | callback | trial | enrollment_interest)
- parent_info (snapshot, JSON)
- child_info (snapshot, JSON)
- sport_interest (FK Sport)
- message
- status (submitted | delivered | failed | bounced)
- delivery_attempts, last_delivery_at, failure_reason
- whatsapp_confirmation_sent (bool), whatsapp_message_id
- lead_id (FK Lead) — created on submit
- ip_hash, user_agent_hash (for abuse)
- created_at

Lead (see Lead-Management below)
- id, enquiry_id (FK Enquiry)
- source (academy_detail | coach_detail | compare | shortlist | search)
- owner_type (academy | coach), owner_id
- user_id?, child_id?
- status (new | contacted | qualified | trial_scheduled | converted | lost)
- assigned_to? (admin user)
- last_activity_at
- created_at, updated_at

LeadActivity
- id, lead_id
- actor_type (system | admin | academy_rep), actor_id?
- type (note | status_change | contact_attempt | whatsapp_sent | callback_logged)
- payload
- created_at

LocationCache
- user_id, lat, lng, city, state, source (gps | manual | ip)
- updated_at

SearchHistory (auth-gated)
- id, user_id, query, filters_snapshot, result_count, created_at

SavedSearch (future)
- id, user_id, query, filters, alerts_enabled, created_at

Notification (future)
- id, user_id, type, payload, read_at, created_at

AuditLog
- id, actor_id, actor_role
- entity_type, entity_id
- action (create | update | delete | verify | suspend | restore)
- diff (before, after)
- ip, user_agent
- created_at

RateLimitBucket
- key (route + identifier), window, count, expires_at

ConsentRecord
- id, user_id?, session_id
- category (analytics | marketing | whatsapp)
- granted (bool), version
- created_at

MediaAsset
- id, owner_type, owner_id
- type (image | document), url, mime, size, width, height
- alt_text, checksum
- created_at

Session
- id, user_id, refresh_token_hash, device_info, ip_hash
- expires_at, revoked_at, created_at

## 5. Development Phases

Phase 0 — Foundation
- Repo setup, Next.js App Router, TypeScript, Tailwind, Shadcn UI, Framer Motion
- Design tokens (colors, type, spacing, radius, motion, breakpoints, z-index)
- Typography (Geist, Inter), dark theme, theme provider
- Root layout, Navbar, Footer, base motion primitives
- Reusable Skeleton / EmptyState / ErrorState / OfflineState components
- Error boundaries, global error state
- Consent banner + consent record plumbing
- Typed env, secrets handling, security headers, CSP baseline
- Logging, error reporting, perf baseline (see Monitoring section)
- Analytics provider scaffold (consent-gated, no-op when denied)
- SEO baseline: metadata defaults, robots, sitemap, canonical, OG/Twitter cards, JsonLd (Organization)
- Quality baseline: responsive (320 → ultra-wide), prefers-reduced-motion, focus states, Lighthouse budgets

Phase 1 — Discovery Surfaces (Guest-First)
- Home page: Hero, Search, Stats, Featured Sports/Academies/Coaches, CTA
- Discover hub
- Academies listing: search, filters, grid, infinite scroll, skeletons
- Coaches listing: search, filters, grid, infinite scroll, skeletons
- Sports grid + exploration guidance with disclaimer
- Search experience: debounced, suggestions, recent, keyboard nav
- SEO: ItemList JSON-LD for listings, breadcrumbs, canonical
- Analytics: page views, search events, filter events

Phase 2 — Detail & Trust
- Academy detail page (all PRD fields, achievement signals, certifications, verification badge, last updated)
- Coach detail page (trust info immediately visible)
- Sport detail (future-ready, competition pathway visual)
- Trust layer components: verified badges, certification indicators, infrastructure/experience indicators
- SEO: SportsActivityFacility (academy), Person (coach), BreadcrumbList
- Analytics: detail view, trust badge exposure

Phase 3 — Comparison & Shortlist
- Compare tray (sticky, max 3)
- Compare view (side-by-side table: distance, facilities, infrastructure, sports, certifications, experience, ratings)
- Shortlist: add/remove/list per user, separate lists for academies/coaches/sports
- Empty states for both
- Analytics: compare_add/remove, shortlist_add/remove

Phase 4 — Enquiry & Lead Flow
- Enquiry form (parent, child, sport interest, message)
- Server-side validation, rate limit, anti-spam (honeypot, IP/UA hash, optional captcha)
- Lead creation on submit
- Lead routing to academy/coach (delivery status)
- WhatsApp confirmation success state
- Failure and retry states
- Analytics: enquiry_submit, lead_status events

Phase 5 — Auth & Profile
- Auth flows (login, register, forgot password, email/phone verification)
- Sessions, refresh, device list, revoke
- Profile: personal info, children management, active child switcher
- Preferences (sports, location, radius)
- Saved items and enquiry history per child
- Settings (privacy, consent management)
- Analytics: auth events, profile updates, child switch

Phase 6 — Location Layer
- GPS detection, manual city selection
- Nearby discovery, distance filters
- Radius control (5 → 10 → 15 → 25 km auto-expand when insufficient)
- Location indicator in Navbar
- IP-based fallback for first paint
- Geohash indexing for proximity queries
- Privacy: location consent + opt-out

Phase 7 — Admin & Lead Management (Internal)
- Admin shell, role-based access
- Academy / Coach / Sport management (CRUD, verify, suspend)
- Verification queue with evidence review
- Lead inbox, assignment, status, activity log
- Internal analytics dashboards (see Analytics-Architecture.md)

Phase 8 — Polish & Performance
- Lighthouse pass: Perf 95+, A11y 100, Best Practices 100, SEO 100
- Dynamic imports, route splitting, image optimization
- Cache layer tuning, revalidation policies
- Motion refinement, shared layout transitions
- Accessibility audit (WCAG AA)
- Security review: rate limit, CSP, headers, dependency scan
- Final review against Apple / Stripe / Linear / Vercel / Airbnb bar

Phase 9 — Future-Ready (Not Implemented)
- Compare coaches
- Saved searches, AI search, AI recommendations
- Notifications center
- PWA + offline support
- Command palette
- Physiotherapy / Nutrition / Fitness discovery

## 6. Cross-Cutting Architecture Notes (Principal Review)

### Security
- Role-based access control (RBAC): guest, athlete, parent, coach, academy_rep, admin
- Server-side authorization on every route handler and server component
- Input validation (Zod) at API boundary
- Output sanitization for user-supplied rich text (academy/coach descriptions)
- CSP with nonce-based inline script allow-list; HSTS, X-Frame-Options DENY, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy
- Rate limiting on auth, enquiry, search-suggest, OTP endpoints
- CSRF protection for state-changing requests
- Secrets via environment, no client exposure
- PII minimization: phone E.164, email hashed for lookup if needed
- Soft delete + audit log for all admin mutations

### Scalability
- Read-heavy: SSG/ISR for academy/coach/sport detail pages; on-demand revalidation on update
- Edge cache for listings, taxonomy, and JSON-LD
- Database: indexed (slug, geohash, verification_status, status, sport_ids GIN), read replicas for discovery queries
- Search: dedicated search index (e.g., Postgres FTS or external) with city/sport filters and geo radius
- Media: CDN-backed object storage, responsive variants, lazy loading
- Background jobs for: rating recompute, lead delivery, WhatsApp confirmation, email

### Caching
- Page-level: ISR (revalidate on publish/update) for public detail and listing pages
- Edge: short TTL for trending/featured, longer for taxonomy
- Client: React Query / SWR for shortlist, compare, profile; stale-while-revalidate
- Tag-based revalidation by entity (academy, coach, sport, lead)
- No cache for: auth pages, enquiry submission, admin

### Observability & Monitoring
- Structured logging (request id, user id, role, route, latency)
- Error reporting (client + server) with sourcemaps
- Real User Monitoring (web vitals: LCP, CLS, INP, TTFB)
- Synthetic uptime checks for key routes (/, /academies, /academies/[slug], /enquiry)
- Alerting on error rate, p95 latency, enquiry failure rate, cache hit ratio
- Audit log for admin actions

### Lead Management
- Every enquiry creates a Lead (1:1) and a LeadActivity (system: created)
- Lead ownership derives from target (academy/coach) but is administered centrally
- Lead statuses: new, contacted, qualified, trial_scheduled, converted, lost
- Assignment to admin users, optional notifications
- Activity log immutable, append-only
- Daily rollup for analytics (leads by city, sport, intent)

### Data Model Notes
- Geohash on Academy/Coach/LocationCache for fast radius queries
- Slug uniqueness for SEO-friendly URLs
- Soft delete + audit log for compliance and recovery
- Rating fields are denormalized caches; recompute on review change
- Verification is a first-class state machine with evidence and reviewer trail
