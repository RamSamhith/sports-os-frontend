# SportsOS — Architecture Document

## 1. System Overview

SportsOS is a **frontend-only** Next.js 14 application serving as India's sports discovery ecosystem. It connects athletes and parents with sports academies and coaches through search, comparison, shortlisting, and enquiry features.

**Current state:** Client-side mock with localStorage persistence. No backend, no database, no API integration.

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 14.2.18 |
| Language | TypeScript (strict mode) | 5.6.2 |
| Styling | Tailwind CSS | 3.4.13 |
| Components | Radix UI primitives | Various |
| Animations | Framer Motion | 11.11.0 |
| Validation | Zod | 3.23.8 |
| Notifications | Sonner | 1.5.0 |
| Fonts | Geist Sans, Geist Mono, Inter | — |
| Package Manager | pnpm | — |
| Linting | ESLint (next/core-web-vitals) | 8.57.1 |
| Formatting | Prettier + Tailwind plugin | 3.3.3 |
| Git Hooks | Husky | 9.1.6 |

---

## 3. Route Architecture

```
app/
├── (public)/                  # Guest-first — no login required
│   ├── page.tsx               # Homepage (hero, search, stats, featured)
│   ├── academies/
│   │   ├── page.tsx           # Academy listing (search, filters, grid)
│   │   └── [slug]/page.tsx    # Academy detail (info, coaches, map)
│   ├── coaches/
│   │   ├── page.tsx           # Coach listing (search, filters, grid)
│   │   └── [slug]/page.tsx    # Coach detail (profile, academy link)
│   ├── sports/
│   │   ├── page.tsx           # Sports grid / exploration
│   │   └── [slug]/page.tsx    # Sport detail (pathways)
│   ├── compare/page.tsx       # Side-by-side comparison
│   ├── shortlist/page.tsx     # Saved items
│   ├── search/page.tsx        # Full-text search with tabs
│   └── discover/page.tsx      # Discovery hub
│
├── (auth)/                    # Authentication flow
│   ├── login/page.tsx         # Email + password login
│   ├── register/page.tsx      # Registration with draft preservation
│   ├── forgot-password/page.tsx
│   ├── verify/
│   │   ├── method/page.tsx    # OTP method selection (email/phone)
│   │   ├── signup/page.tsx    # OTP entry for signup
│   │   └── login/page.tsx     # OTP entry for login
│   └── onboarding/
│       ├── role/page.tsx      # Athlete or Parent selection
│       └── wizard/page.tsx    # Multi-step onboarding wizard
│
├── (private)/                 # Authenticated routes
│   └── profile/
│       ├── page.tsx           # Profile overview with child switcher
│       ├── personal/page.tsx  # Personal details
│       ├── children/page.tsx  # Child management (parent only)
│       ├── preferences/page.tsx # Sport interests, skill level, goals
│       ├── saved/page.tsx     # Saved items
│       ├── enquiries/page.tsx # Enquiry history
│       └── settings/page.tsx  # Account settings
│
├── (admin)/                   # Admin dashboard (gated)
│   └── admin/
│       ├── page.tsx           # Dashboard overview
│       ├── academies/page.tsx
│       ├── coaches/page.tsx
│       ├── sports/page.tsx
│       ├── enquiries/page.tsx
│       ├── users/page.tsx
│       ├── verification/page.tsx
│       └── analytics/page.tsx
│
├── layout.tsx                 # Root layout (providers, fonts, metadata)
├── globals.css                # Global styles, theme definitions
├── tokens.css                 # Design tokens (spacing, typography, colour)
└── not-found.tsx              # 404 page
```

**Total routes:** ~57 (public, auth, private, admin)

---

## 4. Component Architecture

### 4.1 Component Categories

```
components/
├── ui/              # Reusable primitives (Button, Card, Input, Badge, etc.)
├── layout/          # Container, Section, Navbar, Footer, Sidebar
├── home/            # Homepage sections (PersonalizedHome, YourAcademy, etc.)
├── academies/       # Academy cards, grids, placeholders
├── coaches/         # Coach cards, grids, placeholders
├── academy/         # Academy detail page sections
├── sports/          # Sport cards, pathway sections
├── compare/         # Comparison tray and view
├── search/          # Search bar, results
├── filters/         # Filter chips, groups, drawers
├── shortlist/       # Shortlist view
├── profile/         # Profile sidebar, child management
├── enquiry/         # Enquiry form, success states
├── feedback/        # Error boundaries, skeletons, empty states
├── auth/            # Auth modal, motion variants
├── providers/       # Context providers (consent, offline, theme)
├── motion/          # Animation primitives and constants
├── typography/      # Text components
├── theme/           # Theme cards and toggle
├── trust/           # Verification badges
├── location/        # Location picker, nearby indicator
├── command/         # Command palette
├── analytics/       # Event tracking
└── admin/           # Admin shell, data tables, status pills
```

### 4.2 Component Patterns

- **All components are client components** (`'use client'`) except page-level server components
- **Card-based layouts** using `Card`, `CardContent`, `CardHeader`, `CardTitle`
- **Badge system** for tags, status indicators, sport labels
- **Button variants**: default, secondary, outline, ghost, destructive, glass, link
- **Button sizes**: sm (h-8), md (h-10), lg (h-11), xl (h-12), icon, icon-sm, icon-touch
- **Container** with responsive padding: `px-4 sm:px-6 lg:px-8`
- **Section** wrapper with responsive vertical spacing: `py-16 md:py-24`

---

## 5. State Management

### 5.1 Client-Side Storage

| Storage Key | Type | Purpose |
|-------------|------|---------|
| `sportsos:onboarding` | localStorage | Onboarding data (role, sport interests, skill level, goals) |
| `sportsos:auth-state` | localStorage | Authentication state |
| `sportsos:profile` | localStorage | User profile data |
| `sportsos:selected-academy` | localStorage | Currently selected academy ID |
| `sportsos:recently-viewed` | localStorage | Last 10 viewed academies/coaches |
| `sportsos:academy-status` | localStorage | Interested/Shortlisted/Selected statuses |
| `sportsos:signup-draft` | sessionStorage | Preserves signup form for "Edit" flow |
| `sportsos:otp-method` | sessionStorage | Selected OTP delivery method |

### 5.2 React Contexts

- **AuthProvider** — authentication state, login/logout, user data
- **ThemeProvider** — theme switching (next-themes)
- **ConsentProvider** — analytics/cookie consent
- **OfflineProvider** — online/offline status detection

### 5.3 Custom Hooks

```
lib/hooks/
├── use-auth.ts           # Auth state and actions
├── use-onboarding.ts     # Onboarding data with cross-tab sync
├── use-academy-selection.ts  # Selected academy management
├── use-academy-status.ts     # Academy status tracking (Interested/Shortlisted/Selected)
├── use-recently-viewed.ts    # Recently viewed items (last 10)
├── use-compare.ts        # Compare tray management
├── use-shortlist.ts      # Shortlist management
├── use-children.ts       # Child profile management
├── use-location.ts       # Geolocation + reverse geocoding
├── use-debounce.ts       # Debounced values
├── use-media-query.ts    # Responsive breakpoint detection
├── use-reduced-motion.ts # prefers-reduced-motion detection
├── use-storage-sync.ts   # Cross-tab localStorage synchronization
├── use-theme-safe.ts     # Safe theme access
└── use-search-query.ts   # URL-based search state
```

---

## 6. Matching Algorithm

The scoring engine ranks academies and coaches against user onboarding data:

```
Total Score = SportMatch + LocationMatch + SkillMatch + ProximityBonus + RatingBonus
```

| Component | Weight | Logic |
|-----------|--------|-------|
| Sport Match | 10 pts per sport | +10 for each matching sport (fuzzy substring match) |
| Location Match | 8 pts | +8 for exact city, +6 for partial match |
| Skill Match | 5 pts | +5 if academy supports user's skill level |
| Proximity | 6/4/2 pts | ≤5km: +6, ≤15km: +4, ≤30km: +2 |
| Rating | 1× avg | +1 point per 1.0 rating average |

**Haversine formula** calculates distance between user coordinates and academy/coach coordinates.

---

## 7. Theme System

Four premium themes via CSS class-based selectors on `<html>`:

| Theme | Class | Character |
|-------|-------|-----------|
| Midnight Ice | `.midnight-ice` | Premium dark — blue aurora, soft gradients |
| Ember Orange | `.ember-orange` | Energetic — warm stadium glow |
| Graphite Titanium | `.graphite-titanium` | Executive — metallic sweep |
| Alpine Light | `.alpine-light` | Accessible light — daylight drift |

**Features:**
- Pre-hydration bootstrap script (prevents theme flash)
- Animated transitions between themes
- Six-layer atmospheric background engine
- `prefers-reduced-motion` support
- Mobile performance optimisation (GPU-heavy layers hidden on small screens)

---

## 8. Design System

### 8.1 Design Tokens (`tokens.css`)

- Spacing scale (4px base)
- Typography scale (heading sizes, body text, captions)
- Colour palette (semantic tokens per theme)
- Border radius tokens
- Shadow tokens
- Motion tokens (duration, easing)

### 8.2 Key UI Primitives

| Component | File | Notes |
|-----------|------|-------|
| Button | `components/ui/button.tsx` | cva-based, 7 variants, 8 sizes |
| Card | `components/ui/card.tsx` | Card, CardContent, CardHeader, CardTitle |
| Badge | `components/ui/badge.tsx` | Status indicators, sport labels |
| Input | `components/ui/input.tsx` | Form inputs with validation |
| Select | `components/ui/select.tsx` | Dropdown selection |
| Dialog | `components/ui/dialog.tsx` | Modal dialogs |
| Sheet | `components/ui/sheet.tsx` | Slide-out panels |
| Tabs | `components/ui/tabs.tsx` | Tabbed navigation |
| Tooltip | `components/ui/tooltip.tsx` | Hover tooltips |
| OTP Input | `components/ui/otp-input.tsx` | 6-digit OTP with autocomplete |

---

## 9. Authentication Flow

```
Register → OTP Method Selection → OTP Verification → Role Selection → Onboarding Wizard → Homepage
     ↑                                        ↓
     └──── "Edit" preserves form in sessionStorage ────┘
```

- Registration stores draft in `sessionStorage` for "Edit phone/email" flow
- OTP method selection (email/phone) stored in `sessionStorage`
- Onboarding wizard collects: role → sport interests → skill level → location → goals
- Auth state persisted in localStorage via React Context
- Protected routes redirect to `/login` or `/onboarding/role`

---

## 10. Data Layer

### 10.1 Mock Data

| File | Records | Fields |
|------|---------|--------|
| `data/academies.ts` | 12 | id, slug, name, description, location, contact, sportsOffered, facilities, trainingLevels, certifications, verificationStatus, rating, coverImage, gallery, status |
| `data/coaches.ts` | 8 | id, slug, name, avatar, certifications, experienceYears, sportsCoached, specialization, academyId, location, contact, rating, status |
| `data/sports.ts` | 20 | id, slug, name, category, description, popularity |

All academies and coaches are Bengaluru-based (lat ~12.97, lng ~77.59).

### 10.2 Type System

Domain types in `types/domain/`:
- `academy.ts` — Academy, Facility, TrainingLevel, VerificationStatus, Certification
- `coach.ts` — Coach, CoachStatus
- `onboarding.ts` — OnboardingData, SkillLevel
- `location.ts` — LocationSummary (lat/lng required)
- `common.ts` — Rating
- Plus: competition, consent, enquiry, lead, media, review, session, shortlist, sport, user, verification

---

## 11. File Structure Summary

```
SportsOS/
├── app/                    # Next.js App Router (57 routes)
├── components/             # React components (100+ components)
├── config/                 # Site, nav, theme, env configuration
├── data/                   # Static mock data (academies, coaches, sports)
├── docs/                   # Documentation (this file, development, viva)
├── lib/
│   ├── analytics/          # Analytics client and events
│   ├── api/                # API client scaffold
│   ├── cache/              # Cache key definitions
│   ├── constants/          # Sport taxonomy, radii, filters
│   ├── design-system/      # Design token utilities
│   ├── hooks/              # Custom React hooks (15 hooks)
│   ├── monitoring/         # Web vitals, error reporting
│   ├── security/           # CSRF, sanitisation, rate limiting
│   ├── seo/                # JSON-LD, metadata builders
│   └── utils/              # cn(), matching, validators, formatters
├── public/                 # Static assets
├── scripts/                # Build/utility scripts
└── types/                  # TypeScript type definitions (19 files)
```

---

## 12. Future Backend Integration Points

| Area | Integration Point | Current State |
|------|------------------|---------------|
| Authentication | Login, register, OTP | Client-side mock with localStorage |
| User Profiles | Personal details, preferences | Client-side state |
| Search | Full-text search API | Client-side filtering |
| Academies | Listing, detail, comparison | Static fixture data |
| Coaches | Listing, detail, comparison | Static fixture data |
| Sports | Listing, detail, pathways | Static fixture data |
| Enquiries | Form submission | Toast only (no persistence) |
| Shortlist | Save/remove items | localStorage |
| Analytics | Event tracking | Client-side queue |
| Admin | Dashboard, data tables | Static mock data |

---

## 13. Known Limitations

- Authentication is client-side only — no server-side session management
- All data is static fixtures — no database or API integration
- Enquiry submissions not persisted — toast notification only
- PWA icons not yet generated (manifest references missing PNG files)
- Admin panel uses hardcoded mock data
- Profile data lost on browser cache clear (localStorage only)
- No real-time notifications or WebSocket support
- No server-side rendering for data-dependent pages
