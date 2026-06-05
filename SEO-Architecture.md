# SEO Architecture

## Purpose

Make every public surface of SportsOS discoverable, indexable, and rich in the SERPs. SEO is a product pillar, not an afterthought.

## Principles

- Server-rendered HTML for all indexable routes (no client-only rendering for SEO content)
- One canonical URL per entity; no duplicate content across filters
- Structured data on every public page
- Performance is SEO: Core Web Vitals are ranking signals
- Stable, human-readable URLs (slugs, not ids)
- Pagination uses `rel="next"` / `rel="prev"`; infinite scroll is enhanced, not the only path

## Indexability Rules

Public, indexable
- `/`
- `/discover`
- `/academies`, `/academies/[slug]`
- `/coaches`, `/coaches/[slug]`
- `/sports`, `/sports/[slug]`
- `/compare?ids=a,b,c` (canonicalized to entity-specific compare if needed)

Not indexable (noindex, follow where useful)
- `/login`, `/register`, `/forgot-password`
- `/shortlist`
- `/enquiry/**` (success is a state, not a page)
- `/profile/**`
- `/admin/**`
- Search result pages with non-canonical filter combinations
- Zero-result search pages (noindex, retained for analytics)

Filters and sort produce canonical-friendly URLs:
- Canonical: `/academies?city=bengaluru&sport=cricket`
- Non-canonical variants: `?sort=distance`, `?page=2` (paginated) — paginated pages use `rel="next/prev"` and the first page remains canonical

## Metadata

Per-route, typed metadata:
- `title` (50–60 chars)
- `description` (140–160 chars)
- `canonical`
- `openGraph` (title, description, image, type, url, site_name, locale)
- `twitter` (card, title, description, image)
- `robots` (index/follow, noindex/nofollow variants)
- `alternates` (hreflang placeholder for future i18n)

Defaults via root metadata; overrides per route. OG/Twitter images generated via `opengraph-image.tsx` per route.

## Structured Data (JSON-LD)

Organization (site-wide)
- `Organization` with logo, sameAs (social), contactPoint

Website (home)
- `WebSite` with `SearchAction` (target template, query input)

Breadcrumbs (all non-home pages)
- `BreadcrumbList` reflecting IA

ItemList (listings)
- `ItemList` with `ListItem` entries linking to entity URLs

Academy detail
- `SportsActivityFacility` (or `LocalBusiness` with `SportsActivityFacility` as additional type)
  - name, description, image, address (PostalAddress), geo (GeoCoordinates), telephone, url, priceRange, openingHours
  - `amenityFeature` for facilities
  - `aggregateRating` + `Review` (when present)

Coach detail
- `Person` with `jobTitle`, `knowsAbout` (sports), `alumniOf` (academy), `award` (certifications)
- `aggregateRating` + `Review`

Sport detail
- `Thing` / `SportsOrganization` / `SportsTeam` (pick most accurate; default `Thing` with `about`)
- `BreadcrumbList`

Enquiry success
- Not indexable; explicit `noindex`

## Sitemaps

- `sitemap.xml` (root index) referencing:
  - `/sitemap-static.xml` — home, discover, sports
  - `/sitemap-academies.xml` — all published academies
  - `/sitemap-coaches.xml` — all published coaches
  - `/sitemap-sports.xml` — all published sports
- `lastmod` derived from `indexed_at` / `last_updated_at`
- `changefreq` + `priority` per type (academy/coach detail: weekly 0.8; sport detail: monthly 0.6; home: daily 1.0)
- Generated in `app/sitemap.ts` with dynamic segments

## Robots

- `robots.txt`:
  - Allow all public routes
  - Disallow: `/admin`, `/api`, `/profile`, `/shortlist`, `/enquiry`, `/login`, `/register`, `/forgot-password`
  - Reference sitemap
- Generated in `app/robots.ts`

## URL Design

- Kebab-case slugs
- City + sport combinations as filter params, not path segments (avoids infinite URL space)
- Avoid keyword stuffing in slugs; use canonical entity name
- 301 redirect old/renamed slugs via a `redirects` map

## Performance & Core Web Vitals

Targets
- LCP < 2.5s on 4G mobile for hero of home, listings, detail
- CLS < 0.1
- INP < 200ms
- TTFB < 600ms (edge cache for hot pages)

Mechanics
- Static generation (SSG) + ISR for detail and listing pages
- On-demand revalidation (revalidateTag) on publish/update from admin
- `next/image` with explicit width/height, AVIF/WebP, responsive `sizes`
- `next/font` self-hosted with `display: swap`
- Preload hero image; prefetch likely next routes
- Route-level code splitting; defer non-critical JS

## Internal Linking

- Breadcrumbs on every non-home page
- Related academies/coaches on detail pages
- Cross-links: sport page → academies offering that sport; city landing → academies in that city
- Footer: discover-by-city, discover-by-sport, trust/about, contact
- Sitemap hub links to all top-level discover routes

## Content

- Each entity has unique title, description, and OG image
- City + sport landing pages are generated from taxonomy (e.g., "Cricket academies in Bengaluru") with curated intro copy, not thin auto-text
- `last_updated_at` surfaced in UI; reflects in sitemap `lastmod`

## Internationalization (Future-Ready)

- Hreflang scaffold via `alternates.languages` in metadata
- Locale routing reserved: `/[locale]/...` is not enabled in MVP, but metadata API is i18n-safe
- Avoid hardcoded English in shared metadata helpers

## Monitoring

- Index coverage: Search Console
- Core Web Vitals: CrUX + RUM
- Lighthouse CI on key routes in CI
- Structured data validation: schema.org validator + Rich Results Test
- Sitemap health: submitted count vs indexed count, errors

## Anti-Patterns to Avoid

- Client-only rendering of primary content
- Hash-based routing for public pages
- Duplicate content from filter combinations
- Auto-generated thin pages
- Hidden text or cloaking
- Blocking crawlers via accidental auth gates
- Slow LCP from heavy hero media

## MVP Boundaries

- No i18n routes in MVP (English only; helpers ready)
- No programmatic SEO at scale beyond city + sport + academy combinations
- No blog/CMS in MVP
- No FAQ schema in MVP (added when content exists)
