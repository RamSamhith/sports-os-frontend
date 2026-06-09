# SportsOS

India's Sports Discovery Ecosystem — a frontend platform connecting athletes, parents, sports academies, and coaches.

## Project Overview

SportsOS is a discovery platform that enables athletes and parents to find, compare, and connect with sports academies and coaches across India. The platform provides search, comparison, shortlisting, and enquiry tools to support informed decision-making in a user's sporting journey.

## Vision

To make sports discovery accessible, transparent, and empowering for every athlete and parent in India by providing a unified platform for exploring sports opportunities.

## Frontend Features

- **Search & Discovery** — Full-text search across academies, coaches, and sports with tabbed results and filters
- **Comparison Engine** — Side-by-side comparison of academies and coaches across ratings, facilities, training levels, and sports
- **Shortlisting** — Save and manage favourite academies, coaches, and sports in a persistent shortlist
- **Enquiry System** — Send structured enquiries to academies and coaches with form validation
- **Multi-Role Profiles** — Athlete and parent roles with profile management, child accounts, and preferences
- **Theme System** — Four premium themes (Midnight Ice, Ember Orange, Graphite Titanium, Alpine Light) with animated transitions
- **Atmospheric UI** — Six-layer animated background engine with per-theme gradients and motion
- **Responsive Design** — Mobile-first layout with adaptive navigation, cards, and forms
- **Accessibility** — ARIA attributes, keyboard navigation, focus management, reduced motion support
- **SEO Optimised** — Server-rendered pages, structured data, sitemap, robots.txt, and Open Graph images
- **PWA Support** — Web app manifest for installability

## Architecture

```
app/
├── (public)/          # Public-facing routes (home, search, academies, coaches, sports, etc.)
├── (auth)/            # Authentication routes (login, register, forgot-password, verify, onboarding)
├── (private)/         # Authenticated routes (profile, settings)
├── (admin)/           # Admin dashboard routes
├── api/               # API route handlers
├── layout.tsx         # Root layout with providers
├── globals.css        # Global styles and theme definitions
├── tokens.css         # Design tokens (spacing, typography, colours, motion)
└── not-found.tsx      # 404 page
```

## Folder Structure

```
components/
├── academies/         # Academy cards, listing, detail views
├── admin/             # Admin shell, data tables, status pills
├── analytics/         # Event tracking components
├── auth/              # Auth modal, motion variants
├── coaches/           # Coach cards, listing, detail views
├── command/           # Command palette
├── compare/           # Comparison tray and view
├── enquiry/           # Enquiry form and success states
├── feedback/          # Error boundaries, skeletons, empty states
├── filters/           # Filter chips, groups, drawers
├── home/              # Hero, stats, featured sections
├── layout/            # Navbar, footer, container, section, aurora background
├── location/          # Location picker, nearby indicator
├── motion/            # Animation primitives and constants
├── profile/           # Profile sidebar, child management
├── providers/         # Context providers (consent, offline, theme)
├── search/            # Search bar and results
├── seo/               # Breadcrumbs, metadata
├── shortlist/         # Shortlist view
├── sports/            # Sport cards, pathway sections
├── theme/             # Theme cards and toggle
├── trust/             # Verification badges
├── typography/        # Text components
└── ui/                # Reusable primitives (Button, Card, Input, etc.)

lib/
├── analytics/         # Analytics client and events
├── api/               # API client scaffold
├── cache/             # Cache key definitions
├── constants/         # Sport taxonomy, radii, filters
├── design-system/     # Design token utilities
├── hooks/             # Custom React hooks (auth, children, compare, etc.)
├── monitoring/        # Web vitals, error reporting
├── security/          # CSRF, sanitisation, rate limiting
├── seo/               # JSON-LD, metadata builders
└── utils/             # cn(), formatters, validators

types/
├── analytics/         # Analytics event types
├── api/               # API request/response types
└── domain/            # Domain model types (academy, coach, sport, etc.)

data/                  # Static fixture data (academies, coaches, sports, competitions)
config/                # Site config, navigation, theme definitions
```

## Design System

The design system is built on Tailwind CSS with Radix UI primitives. Key components:

- **Primitives** — Button, Card, Input, Label, Badge, Tabs, Select, Switch, Dialog, Sheet, Tooltip
- **Layout** — Container, Section, Navbar, Footer, Sidebar
- **Feedback** — Error Boundary, Skeleton loaders, Empty states, Toast notifications
- **Motion** — Fade-in, hover-lift, scroll-reveal, page transitions, stagger animations

All components follow consistent patterns for accessibility (ARIA attributes, keyboard navigation, focus management) and theming (CSS custom properties).

## Theme System

Four themes are defined as CSS class-based selectors on `<html>`, each providing a complete set of semantic design tokens:

| Theme | Class | Character |
|-------|-------|-----------|
| Midnight Ice | `.midnight-ice` | Premium dark — blue aurora, soft gradients |
| Ember Orange | `.ember-orange` | Energetic — warm stadium glow |
| Graphite Titanium | `.graphite-titanium` | Executive — metallic sweep |
| Alpine Light | `.alpine-light` | Accessible light — daylight drift |

Each theme defines tokens for background, foreground, card, primary, secondary, muted, accent, destructive, border, input, ring, and atmosphere layers. The theme system includes:

- Pre-hydration bootstrap script to prevent flash of incorrect theme
- Animated transitions between themes
- Six-layer atmospheric background engine
- `prefers-reduced-motion` support
- Mobile performance optimisation (GPU-heavy layers hidden on small screens)

## Authentication Flow

The frontend implements a complete authentication UX with the following flow:

1. **Registration** — Name, email, phone, password with client-side validation
2. **Login** — Email and password with validation
3. **OTP Verification** — Email and phone verification with 6-digit code input
4. **Onboarding** — Role selection (Athlete or Parent)
5. **Profile Setup** — Personal details, preferences, location

Authentication state is managed via React Context (`useAuth` hook) with localStorage persistence. The auth system includes:

- Form validation with on-blur and on-change feedback
- Loading states with spinner animations
- Error display with `role="alert"` for accessibility
- Auth guards on protected routes
- Redirect logic based on authentication and onboarding status

> **Note:** Authentication currently uses client-side mock implementations. Backend integration points are documented in the architecture files.

## Search System

The search system provides:

- Full-text search across academies, coaches, and sports
- Tabbed results (Academies, Coaches, Sports)
- Filter chips and filter drawer for refined search
- URL-based query parameters for shareable search states
- Recent searches stored in localStorage

## Compare System

The comparison engine allows:

- Adding academies and coaches to a comparison tray
- Side-by-side comparison across multiple dimensions (ratings, facilities, training levels, sports)
- Persistent comparison state across page navigation
- Minimum item threshold before comparison is enabled

## Shortlist System

Users can save items to a persistent shortlist:

- Save academies, coaches, and sports
- Manage shortlist from the profile or dedicated shortlist page
- Visual feedback on save/unsave actions
- Shortlist persisted in localStorage

## Profile System

The profile system supports:

- **Personal Details** — Name, email, phone with validation
- **Children** — Parent role can manage multiple child profiles (add, edit, remove)
- **Preferences** — Sport interests, location radius, goals
- **Saved Items** — Shortlisted academies, coaches, and sports
- **Enquiries** — History of sent enquiries

## Child Management

Parent accounts can manage child profiles:

- Add child with name, age, and sport
- Edit existing child details
- Remove children with confirmation dialog
- Role-based access (only parents can manage children)

## Settings

Comprehensive settings across six sections:

- **Theme** — Theme selection with preview cards and system theme option
- **Profile** — Name, email, phone editing
- **Location** — City selection (GPS or manual), search radius
- **Notifications** — Email, marketing, and WhatsApp notification preferences
- **Privacy** — Profile visibility, analytics consent, personalised recommendations
- **Session** — Account info and sign out
- **Motion** — Reduce animations toggle for accessibility

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Components | Radix UI primitives |
| Animations | Framer Motion |
| Validation | Zod |
| Notifications | Sonner |
| Fonts | Geist Sans, Geist Mono, Inter |
| Package Manager | pnpm |
| Linting | ESLint (next/core-web-vitals) |
| Formatting | Prettier |

## How To Run

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Formatting
pnpm format
```

## Future Backend Integration Points

The frontend is designed for backend integration at these points:

| Area | Integration Point | Current State |
|------|------------------|---------------|
| Authentication | Login, register, OTP, forgot-password | Client-side mock with localStorage |
| User Profiles | Personal details, preferences | Client-side state with localStorage |
| Search | Full-text search API | Client-side filtering on static data |
| Academies | Listing, detail, comparison | Static fixture data |
| Coaches | Listing, detail, comparison | Static fixture data |
| Sports | Listing, detail, pathways | Static fixture data |
| Enquiries | Form submission | Toast notification (no persistence) |
| Shortlist | Save/remove items | localStorage persistence |
| Analytics | Event tracking | Client-side queue |
| Admin | Dashboard, data tables | Static mock data |

Architecture documentation for each integration area:

- [Architecture.md](./Architecture.md)
- [Admin-Architecture.md](./Admin-Architecture.md)
- [Analytics-Architecture.md](./Analytics-Architecture.md)
- [SEO-Architecture.md](./SEO-Architecture.md)

## Known Limitations

- Authentication is client-side only — no server-side session management
- All data is static fixtures — no database or API integration yet
- Enquiry submissions are not persisted — toast notification only
- PWA icons are not yet generated (manifest references missing PNG files)
- Admin panel uses hardcoded mock data with no real data fetching
- Profile data is lost on browser cache clear (localStorage only)
